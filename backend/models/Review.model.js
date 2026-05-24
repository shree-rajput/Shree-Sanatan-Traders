const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product"
    },
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: String,
    status: {
      type: String,
      enum: ["pending", "approved", "spam"],
      default: "pending"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Review", reviewSchema);
