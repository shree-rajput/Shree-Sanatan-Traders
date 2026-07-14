const express = require("express");
const router = express.Router();

const {
  placeOrder,
  getOrders,
  getOrder,
  cancelOrder,
  requestReturn,
  updateOrderStatus,
  getAllOrders
} = require("../controllers/order.controller");

const auth = require("../middleware/auth");
const isAdmin = require("../middleware/isAdmin");

// 🔑 Admin Routes — MUST come before /:id parametric routes
// BUG FIX: /admin/all was being captured by /:id (id = "admin") before this fix
router.get("/admin/all", auth, isAdmin, getAllOrders);
router.put("/:id/status", auth, isAdmin, updateOrderStatus);

// 👤 User Routes
// BUG FIX: removed isUser middleware — it blocked admins from placing orders.
// auth middleware already ensures the user is authenticated.
router.post("/", auth, placeOrder);
router.get("/", auth, getOrders);
router.get("/:id", auth, getOrder);
router.put("/:id/cancel", auth, cancelOrder);
router.put("/:id/return", auth, requestReturn);

module.exports = router;