const bcrypt = require("bcryptjs");
const User = require("../models/User.model");
const calculateProfileCompletion = require("../utils/calculateProfileCompletion");

const safeSelect = "-password";

const allowedProfileFields = [
  "name",
  "phone",
  "avatar",
  "userType",
  "landSize",
  "crops",
  "irrigation",
  "farmingType",
  "soilType",
  "shopName",
  "businessType",
  "website",
  "address",
  "businessAddress",
  "businessDescription",
  "businessBanner",
  "gstNumber",
  "bio",
  "gender",
  "dob",
  "occupation",
  "language",
  "currency",
  "emailPreferences",
  "accountVisibility",
  "isSetupComplete",
];

const normalizeCrops = (value) => {
  if (Array.isArray(value)) return value.map((item) => String(item).trim()).filter(Boolean);
  if (typeof value === "string") {
    return value.split(",").map((item) => item.trim()).filter(Boolean);
  }
  return value;
};

const attachCompletion = async (userDoc) => {
  const completion = calculateProfileCompletion(userDoc);
  userDoc.profileCompletion = completion.percentage;
  await userDoc.save();
  return User.findById(userDoc._id).select(safeSelect).populate("defaultAddress");
};

const pickAllowed = (body, fields) => {
  const data = {};
  fields.forEach((field) => {
    if (body[field] !== undefined) data[field] = field === "crops" ? normalizeCrops(body[field]) : body[field];
  });
  return data;
};

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select(safeSelect).populate("defaultAddress");
    if (!user) return res.status(404).json({ message: "User not found" });

    const completion = calculateProfileCompletion(user);
    if (user.profileCompletion !== completion.percentage) {
      user.profileCompletion = completion.percentage;
      await user.save();
    }

    res.json({ success: true, user: { ...user.toObject(), missingSteps: completion.missingSteps } });
  } catch (err) {
    res.status(500).json({ message: err.message || "Error fetching profile" });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const updateData = pickAllowed(req.body, allowedProfileFields);

    if (updateData.phone) {
      const existingPhone = await User.findOne({ phone: updateData.phone, _id: { $ne: req.user.id } });
      if (existingPhone) return res.status(400).json({ message: "Phone already in use" });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updateData },
      { new: true, runValidators: true }
    );
    if (!user) return res.status(404).json({ message: "User not found" });

    const completedUser = await attachCompletion(user);
    const completion = calculateProfileCompletion(completedUser);
    res.json({ success: true, user: { ...completedUser.toObject(), missingSteps: completion.missingSteps } });
  } catch (err) {
    res.status(500).json({ message: err.message || "Error updating profile" });
  }
};

exports.updateNotifications = async (req, res) => {
  try {
    const allowed = ["lowStock", "newOrders", "weeklyReport", "promotions", "smsAlerts", "emailAlerts"];
    const notificationSettings = {};
    allowed.forEach((field) => {
      if (typeof req.body[field] === "boolean") notificationSettings[`notificationSettings.${field}`] = req.body[field];
    });

    const user = await User.findByIdAndUpdate(req.user.id, { $set: notificationSettings }, { new: true });
    if (!user) return res.status(404).json({ message: "User not found" });

    const completedUser = await attachCompletion(user);
    const completion = calculateProfileCompletion(completedUser);
    res.json({ success: true, user: { ...completedUser.toObject(), missingSteps: completion.missingSteps } });
  } catch (err) {
    res.status(500).json({ message: err.message || "Error updating notifications" });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    const updateData = pickAllowed(req.body, [
      "language",
      "currency",
      "theme",
      "accountVisibility",
      "emailPreferences",
    ]);
    updateData.theme = "light";

    const user = await User.findByIdAndUpdate(req.user.id, { $set: updateData }, { new: true, runValidators: true });
    if (!user) return res.status(404).json({ message: "User not found" });

    const completedUser = await attachCompletion(user);
    const completion = calculateProfileCompletion(completedUser);
    res.json({ success: true, user: { ...completedUser.toObject(), missingSteps: completion.missingSteps } });
  } catch (err) {
    res.status(500).json({ message: err.message || "Error updating settings" });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, oldPassword, newPassword, confirmPassword } = req.body;
    const passwordToCheck = currentPassword || oldPassword;

    if (!passwordToCheck || !newPassword) {
      return res.status(400).json({ message: "Current and new password are required" });
    }
    if (newPassword.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters" });
    }
    if (confirmPassword && newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(passwordToCheck, user.password);
    if (!isMatch) return res.status(400).json({ message: "Current password is incorrect" });

    user.password = await bcrypt.hash(newPassword, 10);
    user.lastPasswordChanged = new Date();
    await attachCompletion(user);

    res.json({ success: true, message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message || "Error changing password" });
  }
};

exports.uploadAvatar = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "Avatar image is required" });
    const avatar = `/uploads/profile/${req.file.filename}`;
    const user = await User.findByIdAndUpdate(req.user.id, { $set: { avatar } }, { new: true });
    const completedUser = await attachCompletion(user);
    const completion = calculateProfileCompletion(completedUser);
    res.json({ success: true, user: { ...completedUser.toObject(), missingSteps: completion.missingSteps }, avatar });
  } catch (err) {
    res.status(500).json({ message: err.message || "Error uploading avatar" });
  }
};

exports.uploadBanner = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "Business banner image is required" });
    const businessBanner = `/uploads/profile/${req.file.filename}`;
    const user = await User.findByIdAndUpdate(req.user.id, { $set: { businessBanner } }, { new: true });
    const completedUser = await attachCompletion(user);
    const completion = calculateProfileCompletion(completedUser);
    res.json({ success: true, user: { ...completedUser.toObject(), missingSteps: completion.missingSteps }, businessBanner });
  } catch (err) {
    res.status(500).json({ message: err.message || "Error uploading banner" });
  }
};

exports.logoutAllDevices = async (req, res) => {
  res.json({ success: true, message: "All other sessions will be invalidated after token rotation is enabled" });
};

exports.deleteAccount = async (req, res) => {
  try {
    const { password } = req.body;
    if (!password) return res.status(400).json({ message: "Password is required" });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Password is incorrect" });

    await User.findByIdAndDelete(req.user.id);
    res.json({ success: true, message: "Account deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message || "Error deleting account" });
  }
};
