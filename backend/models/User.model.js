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
      weeklyReport: { type: Boolean, default: false }
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
  default: ""
},

upiId: {
  type: String,
  default: ""
},

businessLogo: {
  type: String,
  default: ""
},

socialLinks: {
  instagram: String,
  facebook: String,
  youtube: String,
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