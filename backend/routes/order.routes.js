const express = require("express");
const router = express.Router();

const {
  placeOrder,
  getOrders,getOrder,
} = require("../controllers/order.controller");

const auth = require("../middleware/auth");
const isUser = require("../middleware/isUser");


router.post("/", auth,isUser, placeOrder);
router.get("/", auth,isUser, getOrders);
router.get("/:id", auth,isUser, getOrder);

module.exports = router;