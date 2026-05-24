const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const isAdmin = require("../../middleware/isAdmin");
const controller = require("../../controllers/admin/review.controller");

router.get("/", auth, isAdmin, controller.listReviews);
router.patch("/:id", auth, isAdmin, controller.updateReview);
router.delete("/:id", auth, isAdmin, controller.deleteReview);

module.exports = router;
