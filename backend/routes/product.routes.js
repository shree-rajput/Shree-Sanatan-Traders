const express = require("express");
const router = express.Router();

const {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct
} = require("../controllers/product.controller");

const auth = require("../middleware/auth");
const isAdmin = require("../middleware/isAdmin");

// public
router.get("/", getProducts);
router.get("/:id", getProduct);

// admin
router.post("/", auth, isAdmin, createProduct);
router.put("/:id", auth, isAdmin, updateProduct);
router.delete("/:id", auth, isAdmin, deleteProduct);

module.exports = router;