const jwt = require("jsonwebtoken");
const User = require("../models/User.model");

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // BUG FIX: was "Bearer" (missing space) — "BearerXYZ" would pass the old check
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Not authorized. No token provided." });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Token missing" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch full user from DB (also checks if user still exists)
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User no longer exists" });
    }

    // Check if user is banned
    if (user.isBanned) {
      return res.status(403).json({ message: "Your account has been suspended" });
    }

    req.user = user;
    next();

  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Session expired. Please login again." });
    }
    return res.status(401).json({ message: "Invalid token. Please login again." });
  }
};
