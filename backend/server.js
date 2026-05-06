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
const adminRoutes = require("./routes/admin.routes");


// 🔹 Connect DB
connectDB();

// 🔹 Create app
const app = express();

// 🔹 Middlewares
app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// 🔹 Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/categories", require("./routes/category.routes"));
app.use("/api/payment", paymentRoutes);
app.use("/api/admin", adminRoutes);

// 🔹 Root
app.get("/", (req, res) => {
  res.json({ message: "Shree Sanatan Traders API Running!" });
});

// 🔹 Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});