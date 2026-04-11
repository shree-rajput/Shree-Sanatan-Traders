const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      unique: true,
      required: true
    },
    discountType: {
      type: String,
      enum: ["percentage", "flat"],
      required: true
    },
    discountValue: {
      type: Number,
      required: true
    },
    minAmount: Number,
    expiryDate: Date,
    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Coupon", couponSchema);