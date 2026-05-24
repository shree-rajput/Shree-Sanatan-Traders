const User = require("../../models/User.model");
const Order = require("../../models/Order.model");

exports.listUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, search = "", role = "all" } = req.query;
    const filter = {};
    if (role !== "all") filter.role = role;
    if (search) filter.$or = [{ name: { $regex: search, $options: "i" } }, { email: { $regex: search, $options: "i" } }, { phone: { $regex: search, $options: "i" } }];
    const skip = (Number(page) - 1) * Number(limit);
    const [users, total] = await Promise.all([
      User.find(filter).select("-password").sort({ createdAt: -1 }).skip(skip).limit(Number(limit)).lean(),
      User.countDocuments(filter),
    ]);
    const userIds = users.map((user) => user._id);
    const purchases = await Order.aggregate([
      { $match: { user: { $in: userIds } } },
      { $group: { _id: "$user", totalPurchases: { $sum: "$totalPrice" }, orders: { $sum: 1 } } },
    ]);
    const purchaseMap = new Map(purchases.map((item) => [String(item._id), item]));
    res.json({
      success: true,
      users: users.map((user) => ({ ...user, analytics: purchaseMap.get(String(user._id)) || { totalPurchases: 0, orders: 0 } })),
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)) || 1,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const allowed = ["isBanned", "role", "permissions"];
    const data = {};
    allowed.forEach((key) => {
      if (req.body[key] !== undefined) data[key] = req.body[key];
    });
    const user = await User.findByIdAndUpdate(req.params.id, { $set: data }, { new: true }).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
