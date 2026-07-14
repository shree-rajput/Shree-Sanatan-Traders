const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const isAdmin = require("../../middleware/isAdmin");
const controller = require("../../controllers/admin/order.controller");
const { updateOrderStatus } = require("../../controllers/order.controller");

router.get("/", auth, isAdmin, controller.listOrders);
router.patch("/:id", auth, isAdmin, updateOrderStatus);
router.put("/:id", auth, isAdmin, updateOrderStatus);

module.exports = router;
