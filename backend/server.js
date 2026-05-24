const express = require("express");
const dotenv = require("dotenv");
// 🔹 Load env FIRST
dotenv.config();

const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const connectDB = require("./config/database");
const path = require("path");

// 🔹 Routes (IMPORTANT: .routes.js naming)
const authRoutes = require("./routes/auth.routes");
const productRoutes = require("./routes/product.routes");
const cartRoutes = require("./routes/cart.routes");
const orderRoutes = require("./routes/order.routes");
const paymentRoutes = require("./routes/payment.routes");
const userRoutes = require("./routes/user.routes");
const profileRoutes = require("./routes/profile.routes");
const adminRoutes = require("./routes/admin.routes");
const addressRoutes = require("./routes/address.routes");


// 🔹 Connect DB
connectDB();

// 🔹 Create app
const app = express();

// 🔹 Middlewares
app.use(helmet());
app.use(cors({
  origin: ["http://localhost:3000", "http://127.0.0.1:3000"],
  credentials: true
}));
app.use(morgan("dev"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// 🔹 Rate limiting — protect auth endpoints
const rateLimit = require("express-rate-limit");
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  message: { message: "Too many attempts. Please try again in 15 minutes." },
  standardHeaders: true,
  legacyHeaders: false,
});

// 🔹 Routes
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/categories", require("./routes/category.routes"));
app.use("/api/payment", paymentRoutes);
app.use("/api/addresses", addressRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin/dashboard-v2", require("./routes/admin/dashboard.routes"));
app.use("/api/admin/analytics", require("./routes/admin/analytics.routes"));
app.use("/api/admin/inventory", require("./routes/admin/inventory.routes"));
app.use("/api/admin/notifications", require("./routes/admin/notification.routes"));
app.use("/api/admin/orders-v2", require("./routes/admin/order.routes"));
app.use("/api/admin/users-v2", require("./routes/admin/user.routes"));
app.use("/api/admin/products-v2", require("./routes/admin/product.routes"));
app.use("/api/admin/coupons", require("./routes/admin/coupon.routes"));
app.use("/api/admin/reviews", require("./routes/admin/review.routes"));
app.use("/api/admin/support", require("./routes/admin/support.routes"));

// 🔹 Root
app.get("/", (req, res) => {
  res.json({ message: "Shree Sanatan Traders API Running! 🌾" });
});

// 🔹 Global error handler
app.use((err, req, res, next) => {
  console.error("🔥 Unhandled Error:", err.message);
  res.status(500).json({ message: "Internal server error" });
});

// 🔹 Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📧 Email configured: ${process.env.EMAIL_USER ? "✅" : "❌ (add EMAIL_USER to .env)"}`);
});
