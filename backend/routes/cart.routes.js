const express = require("express");
const router = express.Router();

const {
  addToCart,
  getCart,
  removeFromCart,updateCart
} = require("../controllers/cart.controller");

const auth = require("../middleware/auth");
const isUser = require("../middleware/isUser");

router.post("/", auth,isUser, addToCart);
router.get("/", auth, isUser,getCart);
router.delete("/:id", auth,isUser, removeFromCart);
router.put("/:id", auth,isUser, updateCart);

module.exports = router;