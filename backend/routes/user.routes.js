const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  getProfile,
  updateProfile,
  changePassword
} = require("../controllers/user.controller");

router.get("/me", auth, getProfile);
router.get("/:id", auth, getProfile);
router.put("/me", auth, updateProfile);
router.put("/change-password", auth, changePassword);
router.put("/:id", auth, updateProfile);

module.exports = router;