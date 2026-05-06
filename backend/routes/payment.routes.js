const express = require("express");
const router = express.Router();

const {
  createPayment,
  verifyPayment
} = require("../controllers/payment.controller");

const auth = require("../middleware/auth");

router.post("/create", auth, createPayment);
router.post("/verify", auth, verifyPayment);

module.exports = router;