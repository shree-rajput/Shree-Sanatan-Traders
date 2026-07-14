const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      unique: true,
      required: true
    },
    password: {
      type: String,
      required: true
    },

    // ✅ ADD THIS
    phone: {
      type: String,
      unique: true,
      sparse: true,
      required: true
    },

    avatar: {
      type: String,
      default: ""
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user"
    },
    isBanned: {
      type: Boolean,
      default: false
    },
    lastLogin: {
      type: Date
    },
    permissions: [String],

    // 🌾 Agricultural / Business Details
    userType: {
      type: String,
      enum: ["farmer", "retailer", "wholesaler", "other"],
      default: "farmer"
    },
    landSize: String,
    crops: [String],
    irrigation: String,
    shopName: String,
    businessType: String,
    website: {
      type: String,
      default: ""
    },
    address: {
      type: String,
      default: ""
    },
    notificationSettings: {
      lowStock: { type: Boolean, default: true },
      newOrders: { type: Boolean, default: true },
      weeklyReport: { type: Boolean, default: false },
      promotions: { type: Boolean, default: false },
      smsAlerts: { type: Boolean, default: false },
      emailAlerts: { type: Boolean, default: true }
    },
    isSetupComplete: {
      type: Boolean,
      default: false
    },

    // 📍 Addresses
    addresses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Address"
      }
    ],
    defaultAddress: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Address"
    },
    bio: {
  type: String,
  default: ""
},

gender: {
  type: String,
  enum: ["male", "female", "other"],
  default: "other"
},

dob: {
  type: Date
},

occupation: {
  type: String,
  default: ""
},

language: {
  type: String,
  default: "English"
},

businessDescription: {
  type: String,
  default: ""
},

gstNumber: {
  type: String,
  default: "",
  trim: true,
  uppercase: true
},
businessAddress: {
  type: String,
  default: ""
},
theme: {
  type: String,
  enum: ["light", "dark"],
  default: "light"
},

emailPreferences: {
  orderUpdates: { type: Boolean, default: true },
  offers: { type: Boolean, default: false },
  newsletter: { type: Boolean, default: false }
},


profileCompletion: {
  type: Number,
  min: 0,
  max: 100,
  default: 0
},

lastPasswordChanged: {
  type: Date
},

upiId: {
  type: String,
  default: ""
},


bankDetails: {
  accountHolder: String,
  accountNumber: String,
  ifsc: String,
  bankName: String,
},
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
