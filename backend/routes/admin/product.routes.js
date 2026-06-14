const express = require("express");
const router = express.Router();

//middlewares 
const auth = require("../../middleware/auth");
const isAdmin = require("../../middleware/isAdmin");
const upload = require("../../middleware/upload");

//controllers 
const controller = require("../../controllers/admin/product.controller");
const {
  createProduct,
  getProducts,
  getProduct,
  updateProduct,
  deleteProduct
} = require("../../controllers/product.controller.js");


// admin
router.post("/", auth, isAdmin, upload.array("images", 5), createProduct);
router.put("/:id", auth, isAdmin, upload.array("images", 5), updateProduct);
router.delete("/:id", auth, isAdmin, deleteProduct);


router.get("/", auth, isAdmin, controller.listProducts);
router.patch("/:id", auth, isAdmin, controller.updateProduct);

module.exports = router;
