const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const isAdmin = require("../../middleware/isAdmin");
const controller = require("../../controllers/admin/support.controller");

router.get("/", auth, isAdmin, controller.listTickets);
router.post("/", auth, isAdmin, controller.createTicket);
router.patch("/:id", auth, isAdmin, controller.updateTicket);

module.exports = router;
