const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const isAdmin = require("../../middleware/isAdmin");
const controller = require("../../controllers/admin/adminDashboard.controller");

router.get("/", auth, isAdmin, controller.getDashboard);

module.exports = router;
