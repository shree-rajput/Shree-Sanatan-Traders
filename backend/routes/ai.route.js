const express = require("express");

const router = express.Router();

const {
  agricultureChat,
} = require("../controllers/ai.controller");

router.post("/chat", agricultureChat);

module.exports = router;