const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true
    },
    // BUG FIX: order field was missing — duplicate-review check and populate("order") were broken
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order"
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      trim: true
    },
    status: {
      type: String,
      enum: ["pending", "approved", "spam"],
      default: "pending"
    }
  },
  { timestamps: true }
);

// Prevent a user from reviewing the same product for the same order twice
reviewSchema.index({ user: 1, product: 1, order: 1 }, { unique: true });

module.exports = mongoose.model("Review", reviewSchema);
