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
  image: String,
  price: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  variant: {
    type: { type: String },
    price: { type: Number },
    costPrice: { type: Number },
    unit: { type: String }
  }
});

const addressSchema = new mongoose.Schema({
  fullName:     { type: String, required: true },
  mobileNumber: { type: String, required: true },
  houseNo:      { type: String, required: true },
  area:         { type: String, required: true },
  landmark:     { type: String },
  city:         { type: String, required: true },
  state:        { type: String, required: true },
  pincode:      { type: String, required: true },
  country:      { type: String, default: "India" }
}, { _id: false });

// 📦 Full order lifecycle status
const ORDER_STATUSES = [
  "pending",
  "confirmed",
  "packed",
  "shipped",
  "out_for_delivery",
  "delivered",
  "cancelled",
  "returned"
];

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
      default: 40
    },
   deliveredAt: {
  type: Date
    },

    shippingAddress: {
      type: addressSchema,
      required: true
    },

    paymentMethod: {
      type: String,
      enum: ["cod", "razorpay", "upi"],
      default: "cod"
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending"
    },

    orderStatus: {
      type: String,
      enum: ORDER_STATUSES,
      default: "pending"
    },

    // 📍 Admin-assigned tracking
    trackingId: {
      type: String,
      default: null
    },

    // 🚚 Status history timeline
    statusHistory: [{
      status: { type: String, enum: ORDER_STATUSES },
      timestamp: { type: Date, default: Date.now },
      note: String
    }],
      deliveryCode: {
   type: String
},
deliveryDate: {
    type: Date
},
    // ❌ Cancellation / Return
    cancelReason: String,
    returnReason: String,

    // 💳 Razorpay payment info (for future)
    razorpayOrderId: String,
    razorpayPaymentId: String,

    // 📅 Expected delivery date
    estimatedDelivery: Date,
    invoiceSent: {
  type: Boolean,
  default: false,
},

invoiceSentAt: Date,
  },
  
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);