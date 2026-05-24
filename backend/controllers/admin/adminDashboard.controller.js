const Order = require("../../models/Order.model");
const Product = require("../../models/Product.model");
const User = require("../../models/User.model");
const Notification = require("../../models/Notification");

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const getRangeStart = (months = 6) => {
  const start = new Date();
  start.setMonth(start.getMonth() - (months - 1));
  start.setDate(1);
  start.setHours(0, 0, 0, 0);
  return start;
};

exports.getDashboard = async (req, res) => {
  try {
    const start = getRangeStart(6);
    const [
      usersCount,
      productsCount,
      ordersCount,
      pendingOrders,
      lowStockProducts,
      revenueAgg,
      monthly,
      recentOrders,
      topProducts,
      unreadNotifications,
    ] = await Promise.all([
      User.countDocuments(),
      Product.countDocuments(),
      Order.countDocuments(),
      Order.countDocuments({ orderStatus: "pending" }),
      Product.find({ $expr: { $lte: ["$stock", "$lowStockThreshold"] } }).limit(8).lean(),
      Order.aggregate([{ $group: { _id: null, revenue: { $sum: "$totalPrice" } } }]),
      Order.aggregate([
        { $match: { createdAt: { $gte: start } } },
        {
          $group: {
            _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
            revenue: { $sum: "$totalPrice" },
            orders: { $sum: 1 },
          },
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
      ]),
      Order.find().sort({ createdAt: -1 }).limit(8).populate("user", "name email phone").lean(),
      Order.aggregate([
        { $unwind: "$items" },
        {
          $group: {
            _id: "$items.product",
            name: { $first: "$items.name" },
            sales: { $sum: "$items.quantity" },
            revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
          },
        },
        { $sort: { sales: -1 } },
        { $limit: 8 },
      ]),
      Notification.countDocuments({ admin: req.user.id, read: false }),
    ]);

    const chartData = [];
    const cursor = new Date(start);
    for (let i = 0; i < 6; i += 1) {
      const month = cursor.getMonth() + 1;
      const year = cursor.getFullYear();
      const match = monthly.find((item) => item._id.month === month && item._id.year === year);
      chartData.push({
        name: monthNames[month - 1],
        revenue: match?.revenue || 0,
        orders: match?.orders || 0,
      });
      cursor.setMonth(cursor.getMonth() + 1);
    }

    const totalRevenue = revenueAgg[0]?.revenue || 0;
    const monthlyRevenue = chartData[chartData.length - 1]?.revenue || 0;

    res.json({
      success: true,
      stats: {
        totalRevenue,
        totalOrders: ordersCount,
        totalUsers: usersCount,
        totalProducts: productsCount,
        pendingOrders,
        lowStockProducts: lowStockProducts.length,
        monthlyRevenue,
        conversionRate: usersCount ? Number(((ordersCount / usersCount) * 100).toFixed(1)) : 0,
        unreadNotifications,
      },
      revenueChart: chartData,
      ordersChart: chartData,
      lowStockProducts,
      recentOrders,
      topProducts,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
