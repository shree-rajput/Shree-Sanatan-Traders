const mongoose = require("mongoose");

const supplierSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    contactPerson: String,
    phone: {
      type: String,
      required: true
    },
    email: String,
    address: String,
    category: String, // e.g., Seeds, Tools
    pendingPayment: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Supplier", supplierSchema);
