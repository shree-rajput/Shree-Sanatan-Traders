const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const isAdmin = require("../../middleware/isAdmin");
const controller = require("../../controllers/admin/analytics.controller");

router.get("/", auth, isAdmin, controller.getAnalytics);

module.exports = router;
