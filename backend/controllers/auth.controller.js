const User = require("../models/User.model"); // ⚠️ check filename
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


// 🔐 REGISTER
exports.register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    // ✅ validation
    if (!name || !email || !password || !phone) {
      return res.status(400).json({ message: "All fields required" });
    }

    // ✅ check existing email
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // ✅ check existing phone
    const phoneExists = await User.findOne({ phone });
    if (phoneExists) {
      return res.status(400).json({ message: "Phone number already registered" });
    }

    // ✅ hash password
    const hashed = await bcrypt.hash(password, 10);

    // ✅ create user
    const user = await User.create({
      name,
      email,
      password: hashed,
      phone
    });

    // ✅ token generate
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // ✅ Exclude password from response
    const userResponse = user.toObject();
    delete userResponse.password;

    res.json({
      user: userResponse,
      token
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// 🔐 LOGIN (🔥 THIS WAS MISSING)
exports.login = async (req, res) => {
  console.log("📥 Login Request Body:", req.body);
  try {
    const { email, phone, password } = req.body;
    const identifier = email || phone;

    if (!identifier || !password) {
      console.log("⚠️ Validation Failed");
      return res.status(400).json({ message: "Email/Phone and password required" });
    }

    const user = await User.findOne({
      $or: [{ email: identifier }, { phone: identifier }]
    });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    // ✅ compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log(`❌ Invalid password for ${identifier}`);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    console.log(`✅ Login success for ${identifier}`);
    res.json({ user, token });

  } catch (err) {
    console.error("🔥 Server Error during login:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};