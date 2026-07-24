const cron = require("node-cron");
const Product = require("../models/Product.model");
const { sendLowStockEmail } = require("../services/email.service");
const { getIO } = require("../services/socket.service");

// Run every hour at minute 0
cron.schedule("0 * * * *", async () => {
  try {
    const products = await Product.find({ status: "active" });
    const lowStockProducts = products.filter(p => p.stock <= (p.lowStockThreshold || 5));

    if (lowStockProducts.length > 0) {
      // 1. Send Email (Replace with real admin email in production)
      await sendLowStockEmail(process.env.ADMIN_EMAIL || "admin@example.com", lowStockProducts);
      
      // 2. Emit Socket Event for real-time notification in Admin Dashboard
      const io = getIO();
      if (io) {
        io.emit("low_stock_alert", {
          count: lowStockProducts.length,
          products: lowStockProducts.slice(0, 5) // Send top 5 to frontend
        });
      }
      
      console.log(`[CRON] Processed low stock alerts for ${lowStockProducts.length} items`);
    }
  } catch (error) {
    console.error("[CRON Error] Failed to process inventory alerts:", error);
  }
});
