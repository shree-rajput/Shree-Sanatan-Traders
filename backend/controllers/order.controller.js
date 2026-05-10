const Order = require("../models/Order.model");
const Product = require("../models/Product.model");

// ============================================================
// 🛒 PLACE ORDER (User)
// ============================================================
exports.placeOrder = async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod = "cod" } = req.body;

    // ✅ Validate required fields
    if (!items || items.length === 0) {
      return res.status(400).json({ message: "No items in order" });
    }
    if (!shippingAddress || !shippingAddress.address || !shippingAddress.city ||
        !shippingAddress.state || !shippingAddress.pincode || !shippingAddress.phone) {
      return res.status(400).json({ message: "Complete shipping address is required" });
    }

    // ✅ Validate stock and compute total
    let productTotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.product}` });
      }

      // 🚫 Stock check
      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for "${product.name}". Available: ${product.stock}`
        });
      }

      const price = item.price || product.price || (product.variants?.[0]?.price ?? 0);
      productTotal += price * item.quantity;

      orderItems.push({
        product: product._id,
        name: product.name,
        image: product.images?.[0] || null,
        price,
        quantity: item.quantity
      });

      // 📦 Reduce stock
      product.stock -= item.quantity;
      product.soldCount = (product.soldCount || 0) + item.quantity;
      await product.save();
    }

    const deliveryCharge = productTotal >= 500 ? 0 : 40; // Free delivery above ₹500
    const totalPrice = productTotal + deliveryCharge;

    // ✅ Set estimated delivery (5 days from now)
    const estimatedDelivery = new Date();
    estimatedDelivery.setDate(estimatedDelivery.getDate() + 5);

    const order = await Order.create({
      user: req.user.id,
      items: orderItems,
      totalPrice,
      deliveryCharge,
      shippingAddress,
      paymentMethod,
      paymentStatus: paymentMethod === "cod" ? "pending" : "pending",
      orderStatus: "pending",
      estimatedDelivery,
      statusHistory: [{ status: "pending", note: "Order placed successfully" }]
    });

    res.status(201).json({ success: true, order });

  } catch (err) {
    console.error("🔥 placeOrder error:", err);
    res.status(500).json({ message: err.message });
  }
};

// ============================================================
// 📋 GET USER'S ORDERS
// ============================================================
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .populate("items.product", "name images price stock");

    res.json({ success: true, orders });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ============================================================
// 📄 GET SINGLE ORDER
// ============================================================
exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user.id })
      .populate("items.product", "name images price")
      .populate("user", "name email phone");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({ success: true, order });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ============================================================
// ❌ CANCEL ORDER (User)
// ============================================================
exports.cancelOrder = async (req, res) => {
  try {
    const { reason } = req.body;
    const order = await Order.findOne({ _id: req.params.id, user: req.user.id });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const cancellableStatuses = ["pending", "confirmed"];
    if (!cancellableStatuses.includes(order.orderStatus)) {
      return res.status(400).json({
        message: `Order cannot be cancelled. Current status: ${order.orderStatus}`
      });
    }

    // ✅ Restore stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: item.quantity, soldCount: -item.quantity }
      });
    }

    order.orderStatus = "cancelled";
    order.cancelReason = reason || "Cancelled by customer";
    order.statusHistory.push({ status: "cancelled", note: reason || "Cancelled by customer" });
    await order.save();

    res.json({ success: true, message: "Order cancelled successfully", order });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ============================================================
// 🔄 REQUEST RETURN (User)
// ============================================================
exports.requestReturn = async (req, res) => {
  try {
    const { reason } = req.body;
    const order = await Order.findOne({ _id: req.params.id, user: req.user.id });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.orderStatus !== "delivered") {
      return res.status(400).json({ message: "Only delivered orders can be returned" });
    }

    order.orderStatus = "returned";
    order.returnReason = reason || "Return requested by customer";
    order.statusHistory.push({ status: "returned", note: reason || "Return requested" });
    await order.save();

    res.json({ success: true, message: "Return request submitted", order });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ============================================================
// 🔧 UPDATE ORDER STATUS (Admin)
// ============================================================
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status, trackingId, note } = req.body;

    const validStatuses = ["pending","confirmed","packed","shipped","out_for_delivery","delivered","cancelled","returned"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.orderStatus = status;

    // Auto update payment status on delivery with COD
    if (status === "delivered" && order.paymentMethod === "cod") {
      order.paymentStatus = "paid";
    }

    if (trackingId) order.trackingId = trackingId;

    order.statusHistory.push({
      status,
      note: note || `Status updated to ${status}`
    });

    await order.save();

    res.json({ success: true, message: "Order status updated", order });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ============================================================
// 📊 GET ALL ORDERS (Admin)
// ============================================================
exports.getAllOrders = async (req, res) => {
  try {
    const { status, page = 1, limit = 20, search } = req.query;

    const filter = {};
    if (status && status !== "all") filter.orderStatus = status;

    let query = Order.find(filter)
      .populate("user", "name email phone")
      .populate("items.product", "name images")
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const [orders, total] = await Promise.all([
      query,
      Order.countDocuments(filter)
    ]);

    // Analytics
    const analytics = await Order.aggregate([
      { $group: {
          _id: "$orderStatus",
          count: { $sum: 1 },
          revenue: { $sum: "$totalPrice" }
      }}
    ]);

    res.json({ success: true, orders, total, analytics });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};