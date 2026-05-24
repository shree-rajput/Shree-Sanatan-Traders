const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const isAdmin = require("../../middleware/isAdmin");
const controller = require("../../controllers/admin/notification.controller");

router.get("/", auth, isAdmin, controller.listNotifications);
router.post("/", auth, isAdmin, controller.sendNotification);
router.patch("/:id/read", auth, isAdmin, controller.markAsRead);

module.exports = router;
