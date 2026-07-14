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
  },
  sku: String,
  barcode: String,
  stock: { type: Number, default: 0, min: 0 },
  reservedStock: { type: Number, default: 0, min: 0 },
  lowStockThreshold: { type: Number, default: 5, min: 0 }
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
// category: {
//       type: String,
//       required: true
//     },
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
    reservedStock: {
      type: Number,
      default: 0,
      min: 0
    },
    soldStock: {
      type: Number,
      default: 0,
      min: 0
    },
    sku: {
      type: String,
      trim: true,
      index: true
    },
    barcode: {
      type: String,
      trim: true
    },
    lowStockThreshold: {
      type: Number,
      default: 5,
      min: 0
    },
    supplier: {
      name: String,
      phone: String,
      email: String
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
    trending: {
      type: Boolean,
      default: false
    },
    status: {
      type: String,
      enum: ["draft", "active", "archived"],
      default: "active"
    },
    brand: {
      type: String,
      default: ""
    },
    tags: [String],
    subcategory: {
      type: String,
      default: ""
    },
    seo: {
      title: String,
      description: String,
      keywords: [String]
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
// productSchema.pre("save", function (next) {
//   if (this.stock === 0) {
//     this.stockStatus = "out_of_stock";
//   } else if (this.stock <= (this.lowStockThreshold ?? 5)) {
//     this.stockStatus = "low_stock";
//   } else {
//     this.stockStatus = "in_stock";
//   }
//   next();
// });


// BUG FIX: pre-save hook was missing next() call — while Mongoose 8 allows implicit
// promise-based hooks, not calling next() can cause hangs in mixed environments. next
productSchema.pre("save", function () {
  if (this.stock === 0) {
    this.stockStatus = "out_of_stock";
  } else if (this.stock <= (this.lowStockThreshold ?? 5)) {
    this.stockStatus = "low_stock";
  } else {
    this.stockStatus = "in_stock";
  }
  // next();
});
module.exports = mongoose.model("Product", productSchema);
