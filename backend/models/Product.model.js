const mongoose = require("mongoose");

const variantSchema = new mongoose.Schema({
  type: {
    type: String, // Class 1, 90mm, etc
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  costPrice: {
    type: Number,
    required: true,
    default: 0
  },
  unit: {
    type: String, // meter roll, piece
    required: true
  }
});

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true
    },
    description: String,
    variants: [variantSchema],
    stock: {
      type: Number,
      default: 0
    },
    images: [String]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);