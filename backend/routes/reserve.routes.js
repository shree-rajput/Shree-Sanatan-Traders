const express = require("express");

const router = express.Router();

const {reserveProduct} = require( "../controllers/reserve.controller.js");

const protect = require("../middleware/auth.js");

router.post("/", protect, reserveProduct);

module.exports = router;
