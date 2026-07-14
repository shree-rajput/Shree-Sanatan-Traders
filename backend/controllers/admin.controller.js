const User = require("../models/User.model");
const Order = require("../models/Order.model");
const Product = require("../models/Product.model");

exports.dashboard = async (req, res) => {
  try {
    const usersCount = await User.countDocuments();
    const productsCount = await Product.countDocuments();
    const orders = await Order.find();
    
    // Total Sales & Profit
    let totalSales = 0;
    let totalProfit = 0;
    
    orders.forEach(order => {
      totalSales += (order.totalPrice || 0);
      order.items.forEach(item => {
        const price = item.price || 0;
        const cost = item.variant?.costPrice || 0;
        totalProfit += (price - cost) * (item.quantity || 0);
      });
    });
    
    // Low Stock Alert (Less than 10)
    const lowStockProducts = await Product.find({ stock: { $lt: 10 } });
    
    // Recent Sales
    const recentSales = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate("user", "name email");

    // Chart Data (Last 6 months)
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);
    sixMonthsAgo.setDate(1);
    sixMonthsAgo.setHours(0, 0, 0, 0);
    
    const salesDataRaw = await Order.aggregate([
      { $match: { createdAt: { $gte: sixMonthsAgo } } },
      {
        $group: {
          _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
          total: { $sum: "$totalPrice" },
          count: { $sum: 1 }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    // Format salesData to include month names and ensure all months are present
    const salesData = [];
    let current = new Date(sixMonthsAgo);
    for (let i = 0; i < 6; i++) {
      const month = current.getMonth() + 1;
      const year = current.getFullYear();
      const match = salesDataRaw.find(d => d._id.month === month && d._id.year === year);
      
      salesData.push({
        name: monthNames[month - 1],
        total: match ? match.total : 0,
        count: match ? match.count : 0
      });
      current.setMonth(current.getMonth() + 1);
    }

    // Top Selling Products
    const topProducts = await Order.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.product",
          name: { $first: "$items.name" },
          totalQty: { $sum: "$items.quantity" },
          revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } }
        }
      },
      { $sort: { totalQty: -1 } },
      { $limit: 5 }
    ]);

    res.json({ 
      usersCount, 
      productsCount, 
      ordersCount: orders.length,
      totalSales,
      totalProfit,
      lowStockCount: lowStockProducts.length,
      lowStockProducts,
      recentSales,
      salesData,
      topProducts
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().populate("user");
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus } = req.body;

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { orderStatus },
      { new: true }
    );

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createOrder = async (req, res) => {
  try {
    const { items, totalPrice, customerName, customerPhone } = req.body;

    // 1. Verify stock and deduct
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product || product.stock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for ${product?.name || 'item'}` });
      }
      product.stock -= item.quantity;
      await product.save();
    }

    // 2. Create Order
    const order = await Order.create({
      user: req.user.id, // Admin who created it
      items: items.map(i => ({
        product: i.product,
        name: i.name,
        price: i.price, // Required field
        variant: { type: "Standard", price: i.price },
        quantity: i.quantity
      })),
      totalPrice,
      paymentStatus: "paid",
      orderStatus: "delivered",
      shippingAddress: {
        fullName: customerName || "In-Store Customer",
        mobileNumber: customerPhone || "N/A",
        houseNo: "Offline",
        area: "In-Store",
        city: "Bamandi",
        state: "MP",
        pincode: "000000"
      }
    });

    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};