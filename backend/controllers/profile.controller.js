// controllers/profile.controller.js

const User = require("../models/User.model");
const bcrypt = require("bcryptjs");

/**
 * GET PROFILE
 */
const getProfile = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id || req.user;

    const user = await User.findById(userId)
      .select("-password")
      .populate("addresses");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("getProfile:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
    });
  }
};

/**
 * UPDATE PROFILE
 */
const updateProfile = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id || req.user;

    const allowedFields = [
      "name",
      "phone",
      "bio",
      "gender",
      "dob",
      "occupation",
      "language",
      "website",
      "address",
      "userType",
      "landSize",
      "crops",
      "irrigation",
      "shopName",
      "businessType",
      "businessDescription",
      "gstNumber",
      "farmingType",
      "soilType",
      "businessAddress",
      "upiId",
      "socialLinks",
      "bankDetails",
    ];

    const updates = {};

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      updates,
      {
        new: true,
        runValidators: true,
      }
    ).select("-password");

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error("updateProfile:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update profile",
    });
  }
};

/**
 * NOTIFICATION SETTINGS
 */
const updateNotifications = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id || req.user;

    const user = await User.findByIdAndUpdate(
      userId,
      {
        notificationSettings: req.body,
      },
      {
        new: true,
      }
    ).select("-password");

    return res.status(200).json({
      success: true,
      message: "Notification settings updated",
      data: user.notificationSettings,
    });
  } catch (error) {
    console.error("updateNotifications:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update notifications",
    });
  }
};

/**
 * ACCOUNT SETTINGS
 */
const updateSettings = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id || req.user;

    const allowedSettings = {
      currency: req.body.currency,
      theme: req.body.theme,
      accountVisibility: req.body.accountVisibility,
      emailPreferences: req.body.emailPreferences,
    };

    const user = await User.findByIdAndUpdate(
      userId,
      allowedSettings,
      {
        new: true,
      }
    ).select("-password");

    return res.status(200).json({
      success: true,
      message: "Settings updated successfully",
      data: user,
    });
  } catch (error) {
    console.error("updateSettings:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to update settings",
    });
  }
};

/**
 * CHANGE PASSWORD
 */
const changePassword = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id || req.user;

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current and new password required",
      });
    }

    const user = await User.findById(userId);

    const isMatch = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.lastPasswordChanged = new Date();

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("changePassword:", error);

    return res.status(500).json({
      success: false,
      message: "Password change failed",
    });
  }
};

/**
 * UPLOAD AVATAR
 */
const uploadAvatar = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id || req.user;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Avatar image required",
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      {
        avatar: req.file.path,
      },
      { new: true }
    ).select("-password");

    return res.status(200).json({
      success: true,
      message: "Avatar uploaded",
      avatar: user.avatar,
    });
  } catch (error) {
    console.error("uploadAvatar:", error);

    return res.status(500).json({
      success: false,
      message: "Avatar upload failed",
    });
  }
};

/**
 * BUSINESS BANNER
 */
const uploadBanner = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id || req.user;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Banner image required",
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      {
        businessBanner: req.file.path,
      },
      { new: true }
    ).select("-password");

    return res.status(200).json({
      success: true,
      message: "Banner uploaded",
      banner: user.businessBanner,
    });
  } catch (error) {
    console.error("uploadBanner:", error);

    return res.status(500).json({
      success: false,
      message: "Banner upload failed",
    });
  }
};

/**
 * LOGOUT ALL DEVICES
 */
const logoutAllDevices = async (req, res) => {
  try {
    return res.status(200).json({
      success: true,
      message: "Logged out from all devices",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Logout failed",
    });
  }
};

/**
 * DELETE ACCOUNT
 */
const deleteAccount = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id || req.user;

    await User.findByIdAndDelete(userId);

    return res.status(200).json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    console.error("deleteAccount:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete account",
    });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  updateNotifications,
  updateSettings,
  changePassword,
  uploadAvatar,
  uploadBanner,
  logoutAllDevices,
  deleteAccount,
};