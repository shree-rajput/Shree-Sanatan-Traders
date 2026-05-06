const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product"
  },
  name: {
    type: String,
    required: true
  },
  variant: {
    type: {
      type: String,
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
    unit: String
  },
  quantity: {
    type: Number,
    required: true
  }
});

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    items: [orderItemSchema],

    totalPrice: {
      type: Number,
      required: true
    },

    deliveryCharge: {
      type: Number,
      default: 0
    },

    shippingAddress: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
      phone: { type: String, required: true }
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending"
    },

    orderStatus: {
      type: String,
      enum: ["processing", "shipped", "delivered", "cancelled"],
      default: "processing"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);