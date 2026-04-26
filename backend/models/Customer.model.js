const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    phone: {
      type: String,
      required: true,
      unique: true
    },
    address: String,
    totalPurchases: {
      type: Number,
      default: 0
    },
    creditBalance: {
      type: Number,
      default: 0 // Udhaar tracking
    },
    purchaseHistory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order"
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Customer", customerSchema);
