const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth.js");
const upload = require("../middleware/upload.middleware.js");
const profileController = require("../controllers/profile.controller.js");

router.use(auth);

router.get("/", profileController.getProfile);
router.put("/", profileController.updateProfile);
router.patch("/notifications", profileController.updateNotifications);
router.patch("/settings", profileController.updateSettings);
router.patch("/security/password", profileController.changePassword);
router.post("/avatar", upload.single("avatar"), profileController.uploadAvatar);
router.post("/banner", upload.single("banner"), profileController.uploadBanner);
router.post("/security/logout-all", profileController.logoutAllDevices);
router.delete("/delete-account", profileController.deleteAccount);

module.exports = router;
