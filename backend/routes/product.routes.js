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
const upload = require("../middleware/upload");

// admin
router.post("/", auth, isAdmin, upload.array("images", 5), createProduct);
router.put("/:id", auth, isAdmin, upload.array("images", 5), updateProduct);
router.delete("/:id", auth, isAdmin, deleteProduct);

// public
router.get("/", getProducts);
router.get("/:id", getProduct);


module.exports = router;