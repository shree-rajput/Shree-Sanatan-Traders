const mongoose = require("mongoose");
const dotenv = require("dotenv");

const Product = require("./models/Product.model");
const products = require("./data/products");

dotenv.config();

// 🔗 Connect DB
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("✅ MongoDB Connected");

    try {
      // 🧹 Optional: purane products delete
      await Product.deleteMany();
      console.log("🗑 Old products removed");

      // 🚀 Insert new products
      await Product.insertMany(products);
      console.log("🔥 Products inserted successfully");

      process.exit();

    } catch (err) {
      console.error("❌ Error inserting products:", err.message);
      process.exit(1);
    }
  })
  .catch((err) => {
    console.error("❌ DB Connection Error:", err.message);
  });