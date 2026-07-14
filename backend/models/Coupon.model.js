const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      unique: true,
      required: true
    },
    type: {
      type: String,
      enum: ["percentage", "flat"],
      required: true
    },
    value: {
      type: Number,
      required: true
    },
    minAmount: {
      type: Number,
      default: 0
    },
    expiry: Date,
    usageLimit: {
      type: Number,
      default: 0
    },
    usedCount: {
      type: Number,
      default: 0
    },
    active: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Coupon", couponSchema);
