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
const isUser = require("../middleware/isUser");
const isAdmin = require("../middleware/isAdmin");

// 👤 User Routes
router.post("/", auth, isUser, placeOrder);
router.get("/", auth, isUser, getOrders);
router.get("/:id", auth, isUser, getOrder);
router.put("/:id/cancel", auth, isUser, cancelOrder);
router.put("/:id/return", auth, isUser, requestReturn);

// 🔑 Admin Routes
router.get("/admin/all", auth, isAdmin, getAllOrders);
router.put("/:id/status", auth, isAdmin, updateOrderStatus);

module.exports = router;