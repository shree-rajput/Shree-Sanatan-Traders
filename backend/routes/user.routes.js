const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  getProfile,
  updateProfile
} = require("../controllers/user.controller");

router.get("/me", auth, getProfile);
router.get("/:id", auth, getProfile);
router.put("/me", auth, updateProfile);
router.put("/:id", auth, updateProfile);

module.exports = router;