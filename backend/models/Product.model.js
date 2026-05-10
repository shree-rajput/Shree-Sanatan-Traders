const mongoose = require("mongoose");

const variantSchema = new mongoose.Schema({
  type: {
    type: String, // e.g. "Class 1", "90mm", "1kg"
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  costPrice: {
    type: Number,
    default: 0
  },
  unit: {
    type: String, // "kg", "piece", "meter roll"
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

    // 🔢 Flat price (for products without variants)
    price: {
      type: Number,
      default: 0
    },

    // 📦 Inventory
    stock: {
      type: Number,
      default: 0,
      min: 0
    },

    // 🏷️ Stock status — auto-computed
    stockStatus: {
      type: String,
      enum: ["in_stock", "low_stock", "out_of_stock"],
      default: "in_stock"
    },

    images: [String],

    // 🌟 Featured product flag
    featured: {
      type: Boolean,
      default: false
    },

    // 📊 For sorting/analytics
    soldCount: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

// ✅ Auto-compute stockStatus before save
productSchema.pre("save", function (next) {
  if (this.stock === 0) {
    this.stockStatus = "out_of_stock";
  } else if (this.stock <= 5) {
    this.stockStatus = "low_stock";
  } else {
    this.stockStatus = "in_stock";
  }
  next();
});

module.exports = mongoose.model("Product", productSchema);