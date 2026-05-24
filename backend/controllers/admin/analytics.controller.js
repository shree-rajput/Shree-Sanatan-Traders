const Order = require("../../models/Order.model");
const User = require("../../models/User.model");

exports.getAnalytics = async (req, res) => {
  try {
    const start = new Date();
    start.setDate(start.getDate() - 90);
    start.setHours(0, 0, 0, 0);

    const [sales, userGrowth, orderGrowth, productPerformance] = await Promise.all([
      Order.aggregate([
        { $match: { createdAt: { $gte: start } } },
        { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, revenue: { $sum: "$totalPrice" }, orders: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]),
      User.aggregate([
        { $match: { createdAt: { $gte: start } } },
        { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, users: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]),
      Order.aggregate([
        { $match: { createdAt: { $gte: start } } },
        { $group: { _id: "$orderStatus", count: { $sum: 1 }, revenue: { $sum: "$totalPrice" } } },
      ]),
      Order.aggregate([
        { $unwind: "$items" },
        { $group: { _id: "$items.product", name: { $first: "$items.name" }, sales: { $sum: "$items.quantity" }, revenue: { $sum: { $multiply: ["$items.quantity", "$items.price"] } } } },
        { $sort: { revenue: -1 } },
        { $limit: 20 },
      ]),
    ]);

    res.json({ success: true, sales, userGrowth, orderGrowth, productPerformance });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
