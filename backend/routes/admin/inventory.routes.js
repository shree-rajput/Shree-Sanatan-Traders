const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const isAdmin = require("../../middleware/isAdmin");
const controller = require("../../controllers/admin/inventory.controller");

router.get("/", auth, isAdmin, controller.listInventory);
router.patch("/:id/stock", auth, isAdmin, controller.updateStock);
router.patch("/bulk-stock", auth, isAdmin, controller.bulkUpdateStock);
router.get("/history", auth, isAdmin, controller.getStockHistory);
router.get("/history/:productId", auth, isAdmin, controller.getStockHistory);

module.exports = router;
