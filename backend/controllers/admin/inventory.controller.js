const Product = require("../../models/Product.model");
const InventoryLog = require("../../models/InventoryLog");
const Notification = require("../../models/Notification");

exports.listInventory = async (req, res) => {
  try {
    const { page = 1, limit = 20, search = "", status = "all" } = req.query;
    const filter = {};
    if (search) filter.$or = [{ name: { $regex: search, $options: "i" } }, { sku: { $regex: search, $options: "i" } }];
    if (status !== "all") filter.stockStatus = status;

    const skip = (Number(page) - 1) * Number(limit);
    const [products, total] = await Promise.all([
      Product.find(filter).populate("category", "name").sort({ updatedAt: -1 }).skip(skip).limit(Number(limit)).lean(),
      Product.countDocuments(filter),
    ]);

    res.json({ success: true, products, total, page: Number(page), pages: Math.ceil(total / Number(limit)) || 1 });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateStock = async (req, res) => {
  try {
    const { stock, reason = "Manual stock update" } = req.body;
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const oldStock = product.stock;
    product.stock = Number(stock);
    product.soldStock = product.soldStock || product.soldCount || 0;
    await product.save();

    await InventoryLog.create({ product: product._id, oldStock, newStock: product.stock, updatedBy: req.user.id, reason });

    if (product.stock <= product.lowStockThreshold) {
      await Notification.create({
        title: "Low stock alert",
        message: `${product.name} has ${product.stock} units remaining.`,
        type: "stock",
        admin: req.user.id,
      });
    }

    res.json({ success: true, product });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.bulkUpdateStock = async (req, res) => {
  try {
    const { updates = [], reason = "Bulk stock update" } = req.body;
    const results = [];
    for (const item of updates) {
      const product = await Product.findById(item.product);
      if (!product) continue;
      const oldStock = product.stock;
      product.stock = Number(item.stock);
      await product.save();
      await InventoryLog.create({ product: product._id, oldStock, newStock: product.stock, updatedBy: req.user.id, reason });
      results.push(product);
    }
    res.json({ success: true, updated: results.length, products: results });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getStockHistory = async (req, res) => {
  try {
    const filter = req.params.productId ? { product: req.params.productId } : {};
    const logs = await InventoryLog.find(filter).populate("product", "name sku").populate("updatedBy", "name email").sort({ createdAt: -1 }).limit(100);
    res.json({ success: true, logs });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
