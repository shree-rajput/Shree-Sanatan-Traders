const User = require("../models/User.model");
const Order = require("../models/Order.model");
const Product = require("../models/Product.model");

exports.dashboard = async (req, res) => {
  const users = await User.countDocuments();
  const orders = await Order.countDocuments();
  const products = await Product.countDocuments();

  res.json({ users, orders, products });
};

exports.getAllOrders = async (req, res) => {
  const orders = await Order.find().populate("user");
  res.json(orders);
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