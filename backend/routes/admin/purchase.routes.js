const express = require("express");
const router = express.Router();
const purchaseController = require("../../controllers/admin/purchase.controller");
const { generatePurchaseOrderPDF } = require("../../services/pdf.service");
const Purchase = require("../../models/Purchase.model");
const auth = require("../../middleware/auth");
const isAdmin = require("../../middleware/isAdmin");
/**
 * @route   POST /api/isAdmin/purchases
 * @desc    Create a new Purchase Order
 */
router.post("/", auth, isAdmin, purchaseController.createPurchaseOrder);

/**
 * @route   GET /api/isAdmin/purchases
 * @desc    Get all Purchase Orders
 */
router.get("/", auth, isAdmin, purchaseController.getAllPurchaseOrders);

/**
 * @route   PUT /api/isAdmin/purchases/:id/status
 * @desc    Update Purchase Order status
 */
router.put("/:id/status", auth, isAdmin, purchaseController.updatePurchaseStatus);

/**
 * @route   GET /api/isAdmin/purchases/:id/pdf
 * @desc    Download PO as PDF
 */
router.get("/:id/pdf", auth, isAdmin, async (req, res) => {
  try {
    const po = await Purchase.findById(req.params.id)
      .populate("supplier")
      .populate("items.product");
      
    if (!po) return res.status(404).json({ success: false, message: "PO not found" });

    await generatePurchaseOrderPDF(po, res);
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
});

module.exports = router;
