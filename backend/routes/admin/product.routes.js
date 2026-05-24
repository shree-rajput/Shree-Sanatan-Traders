const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const isAdmin = require("../../middleware/isAdmin");
const controller = require("../../controllers/admin/product.controller");

router.get("/", auth, isAdmin, controller.listProducts);
router.patch("/:id", auth, isAdmin, controller.updateProduct);

module.exports = router;
