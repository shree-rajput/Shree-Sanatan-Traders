const Purchase = require("../../models/Purchase.model");
const Product = require("../../models/Product.model");
const InventoryLog = require("../../models/InventoryLog");
const { getIO } = require("../../services/socket.service");

// Create a new Purchase Order
exports.createPurchaseOrder = async (req, res) => {
  try {
    const { supplier, items, totalAmount } = req.body;
    
    const po = await Purchase.create({
      supplier,
      items,
      totalAmount,
      status: "pending"
    });

    res.status(201).json({ success: true, data: po });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

// Get all Purchase Orders
exports.getAllPurchaseOrders = async (req, res) => {
  try {
    const pos = await Purchase.find().populate("supplier").populate("items.product");
    res.json({ success: true, data: pos });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

// Update Purchase Order Status
exports.updatePurchaseStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    const po = await Purchase.findById(id);
    if (!po) return res.status(404).json({ success: false, message: "PO not found" });

    // If status is changed to received, increment inventory
    if (po.status !== "received" && status === "received") {
      const io = getIO();
      for (const item of po.items) {
        const product = await Product.findById(item.product);
        if (product) {
          const oldStock = product.stock;
          product.stock += item.quantity;
          await product.save();

          // Log it
          await InventoryLog.create({
            product: product._id,
            oldStock,
            newStock: product.stock,
            updatedBy: req.user._id,
            reason: `Purchase Order Received (PO: ${po._id})`
          });

          if (io) {
            io.emit("stock_updated", {
              productId: product._id,
              newStock: product.stock,
              action: "in"
            });
          }
        }
      }
    }

    po.status = status;
    await po.save();

    res.json({ success: true, data: po });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};
