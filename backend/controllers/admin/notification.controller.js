const Notification = require("../../models/Notification");
const User = require("../../models/User.model");

exports.listNotifications = async (req, res) => {
  try {
    const { page = 1, limit = 20, type } = req.query;
    const filter = {};
    if (type && type !== "all") filter.type = type;
    const skip = (Number(page) - 1) * Number(limit);
    const [notifications, total, unread] = await Promise.all([
      Notification.find(filter).populate("user", "name email").populate("admin", "name email").sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Notification.countDocuments(filter),
      Notification.countDocuments({ read: false }),
    ]);
    res.json({ success: true, notifications, total, unread, page: Number(page), pages: Math.ceil(total / Number(limit)) || 1 });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.sendNotification = async (req, res) => {
  try {
    const { title, message, type = "announcement", target = "all", userId } = req.body;
    if (!title || !message) return res.status(400).json({ message: "Title and message are required" });

    if (target === "user" && userId) {
      const notification = await Notification.create({ title, message, type, user: userId, admin: req.user.id });
      return res.status(201).json({ success: true, notification });
    }

    const users = await User.find({ role: "user" }).select("_id").lean();
    const payload = users.map((user) => ({ title, message, type, user: user._id, admin: req.user.id }));
    const notifications = await Notification.insertMany(payload);
    res.status(201).json({ success: true, sent: notifications.length });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { read: true });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
