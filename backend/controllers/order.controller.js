const Order = require("../models/Order.model");
const Cart = require("../models/Cart.model");

exports.placeOrder = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id })
      .populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: "Cart empty" });
    }

    if (!req.body.shippingAddress) {
      return res.status(400).json({ message: "Shipping address required" });
    }

    const productTotal = cart.items.reduce((sum, item) => {
      if (!item.variant || !item.variant.price) {
        throw new Error("Invalid variant data");
      }
      return sum + item.variant.price * item.quantity;
    }, 0);

    // 🚚 Delivery logic
    const distance = req.body.distance || 0;

    let deliveryCharge = 0;
    if (distance <= 5) deliveryCharge = 50;
    else if (distance <= 20) deliveryCharge = 100;
    else deliveryCharge = 200;

    const totalPrice = productTotal + deliveryCharge;

    const items = cart.items.map(item => ({
      product: item.product._id,
      name: item.product.name,
      variant: item.variant,
      quantity: item.quantity
    }));

    const order = await Order.create({
      user: req.user.id,
      items,
      totalPrice,
      deliveryCharge,
      shippingAddress: req.body.shippingAddress,
      paymentStatus: "pending"
    });

    // Clear cart
    cart.items = [];
    await cart.save();

    res.json(order);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .sort({ createdAt: -1 });

    res.json(orders);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("items.product");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};