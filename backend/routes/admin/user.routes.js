const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const isAdmin = require("../../middleware/isAdmin");
const controller = require("../../controllers/admin/user.controller");

router.get("/", auth, isAdmin, controller.listUsers);
router.patch("/:id", auth, isAdmin, controller.updateUser);
router.delete("/:id", auth, isAdmin, controller.deleteUser);

module.exports = router;
