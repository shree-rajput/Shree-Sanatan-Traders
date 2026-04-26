const mongoose = require("mongoose");

const purchaseItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true
  },
  quantity: {
    type: Number,
    required: true
  },
  purchasePrice: {
    type: Number,
    required: true
  }
});

const purchaseSchema = new mongoose.Schema(
  {
    supplier: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Supplier",
      required: true
    },
    items: [purchaseItemSchema],
    totalAmount: {
      type: Number,
      required: true
    },
    amountPaid: {
      type: Number,
      default: 0
    },
    purchaseDate: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ["received", "pending", "cancelled"],
      default: "received"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Purchase", purchaseSchema);
