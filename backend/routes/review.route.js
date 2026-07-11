const express = require("express");

const router = express.Router();

const {
  createReview,
 updateReview,
  getReviews,
  deleteReview,
  getUserReviews,

} = require("../controllers/review.controller");

const protect  = require("../middleware/auth");

router.post("/", protect, createReview);
router.get("/:productId", getReviews);
router.delete("/:reviewId", protect, deleteReview); 
router.post("/user/:userId", protect, getUserReviews);
router.put("/:reviewId", protect, updateReview);

module.exports = router;
