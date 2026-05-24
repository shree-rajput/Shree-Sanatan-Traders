const User = require("../models/User.model");
const bcrypt = require("bcryptjs");


exports.getProfile = async (req, res) => {
  console.log(`👤 Fetching profile for UserID: ${req.user.id}`);
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      console.log(`❌ User not found in DB: ${req.user.id}`);
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    console.error("🔥 GetProfile Error:", err);
    res.status(500).json({ message: "Error fetching profile" });
  }
};

exports.updateProfile = async (req, res) => {
  console.log(`📝 Updating profile for UserID: ${req.user.id}`);
  try {
    const { 
      name, email, phone, avatar,
      userType, landSize, crops, irrigation, 
      shopName, businessType, address, website, notificationSettings,
      language, isSetupComplete  , bio,
gender,
dob,
occupation,
language,
businessDescription,
gstNumber,
upiId,
businessLogo,
socialLinks,
bankDetails,
    } = req.body;

    // Basic validation
    if (email) {
      const existingUser = await User.findOne({ email, _id: { $ne: req.user.id } });
      if (existingUser) {
        return res.status(400).json({ message: "Email already in use" });
      }
    }

    const updatedData = {
      name, email, phone, avatar,
      userType, landSize, crops, irrigation, 
      shopName, businessType, address, website, notificationSettings,
      isSetupComplete ,
      bio,
gender,
dob,
occupation,
language,
businessDescription,
gstNumber,
upiId,
businessLogo,
socialLinks,
bankDetails,
    };

    // Remove undefined fields to avoid overwriting with null
    Object.keys(updatedData).forEach(key => updatedData[key] === undefined && delete updatedData[key]);

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { $set: updatedData },
      { new: true, runValidators: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log(`✅ Profile updated for: ${user.email}`);
    res.json(user);

  } catch (err) {
    console.error("🔥 UpdateProfile Error:", err);
    res.status(500).json({ message: err.message || "Error updating profile" });
  }
};

exports.changePassword = async (req, res) => {
  console.log(`🔐 Password change request for UserID: ${req.user.id}`);
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ message: "Old and new passwords are required" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Verify old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect old password" });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    console.log(`✅ Password updated successfully for: ${user.email}`);
    res.json({ message: "Password updated successfully" });

  } catch (err) {
    console.error("🔥 ChangePassword Error:", err);
    res.status(500).json({ message: "Error changing password" });
  }
};
