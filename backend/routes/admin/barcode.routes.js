const express = require("express");
const router = express.Router();
const QRCode = require("qrcode");
const Product = require("../../models/Product.model");
const InventoryLog = require("../../models/InventoryLog");
const auth = require("../../middleware/auth");
const isAdmin = require("../../middleware/isAdmin");
const { getIO } = require("../../services/socket.service");


// console.log("auth:", auth);
// console.log("isAdmin:", isAdmin);
// console.log("auth type:", typeof auth);
// console.log("isAdmin type:", typeof isAdmin);


/**
 * @route   GET /api/isAdmin/barcode/generate/:productId
 * @desc    Generate a base64 QR code image for a product
 */
router.get("/generate/:productId", auth, isAdmin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);
    if (!product) return res.status(404).json({ success: false, message: "Product not found" });

    // The data encoded in the QR code is a JSON string of product SKU and ID
    const qrData = JSON.stringify({
      productId: product._id,
      sku: product.sku || product._id.toString(),
      name: product.name
    });

    const qrCodeImage = await QRCode.toDataURL(qrData);
    
    res.json({ success: true, qrCode: qrCodeImage, product });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
});

/**
 * @route   POST /api/isAdmin/barcode/scan
 * @desc    Process a scanned barcode to update stock (Stock In/Out)
 * @body    { productId, sku, action (in/out), quantity }
 */
router.post("/scan", auth, isAdmin, async (req, res) => {
  try {
    const { productId, sku, action, quantity = 1 } = req.body;

    // Find product by ID or SKU
    let product;
    if (productId) {
      product = await Product.findById(productId);
    } else if (sku) {
      product = await Product.findOne({ sku });
    }

    if (!product) return res.status(404).json({ success: false, message: "Product not found" });

    const qty = parseInt(quantity);
    const oldStock = product.stock;
    
    if (action === "in") {
      product.stock += qty;
    } else if (action === "out") {
      if (product.stock < qty) {
        return res.status(400).json({ success: false, message: "Insufficient stock. Cannot process Stock Out." });
      }
      product.stock -= qty;
    } else {
      return res.status(400).json({ success: false, message: "Invalid action. Must be 'in' or 'out'." });
    }

    await product.save();

    // Log the movement
    await InventoryLog.create({
      product: product._id,
      oldStock,
      newStock: product.stock,
      updatedBy: req.user._id, // Assumes auth middleware populates req.user
      reason: `Scanned via Barcode - Stock ${action.toUpperCase()}`
    });

    // Emit socket event for real-time stock update
    const io = getIO();
    if (io) {
      io.emit("stock_updated", {
        productId: product._id,
        newStock: product.stock,
        action
      });
    }

    res.json({ success: true, message: `Successfully logged Stock ${action.toUpperCase()} for ${product.name}`, product });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
});

module.exports = router;
