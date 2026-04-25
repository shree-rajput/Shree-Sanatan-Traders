const User = require("../models/User.model");

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
  try {
    const { 
      name, email, phone, 
      userType, landSize, crops, irrigation, 
      shopName, businessType, address, pincode, 
      district, state, language, isSetupComplete 
    } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { 
        name, email, phone, 
        userType, landSize, crops, irrigation, 
        shopName, businessType, address, pincode, 
        district, state, language, isSetupComplete 
      },
      { new: true }
    ).select("-password");

    res.json(user);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};