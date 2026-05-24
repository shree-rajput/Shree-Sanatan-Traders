const Order = require("../../models/Order.model");

exports.listOrders = async (req, res) => {
  try {
    const { page = 1, limit = 20, status = "all", search = "" } = req.query;
    const filter = {};
    if (status !== "all") filter.orderStatus = status;
    if (search) filter._id = search.match(/^[0-9a-fA-F]{24}$/) ? search : undefined;
    Object.keys(filter).forEach((key) => filter[key] === undefined && delete filter[key]);

    const skip = (Number(page) - 1) * Number(limit);
    const [orders, total, analytics] = await Promise.all([
      Order.find(filter).populate("user", "name email phone").sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Order.countDocuments(filter),
      Order.aggregate([{ $group: { _id: "$orderStatus", count: { $sum: 1 }, revenue: { $sum: "$totalPrice" } } }]),
    ]);
    res.json({ success: true, orders, total, analytics, page: Number(page), pages: Math.ceil(total / Number(limit)) || 1 });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateOrder = async (req, res) => {
  try {
    const { status, orderStatus, paymentStatus, trackingId, note } = req.body;
    const nextStatus = status || orderStatus;
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (nextStatus) {
      order.orderStatus = nextStatus;
      order.statusHistory.push({ status: nextStatus, note: note || `Updated by admin to ${nextStatus}` });
    }
    if (paymentStatus) order.paymentStatus = paymentStatus;
    if (trackingId !== undefined) order.trackingId = trackingId;
    await order.save();
    res.json({ success: true, order });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
