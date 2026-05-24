const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const isAdmin = require("../../middleware/isAdmin");
const controller = require("../../controllers/admin/order.controller");

router.get("/", auth, isAdmin, controller.listOrders);
router.patch("/:id", auth, isAdmin, controller.updateOrder);
router.put("/:id", auth, isAdmin, controller.updateOrder);

module.exports = router;
