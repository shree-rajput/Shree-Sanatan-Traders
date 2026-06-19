const Review = require("../models/Review.model");
const Order = require("../models/Order.model");

exports.createReview = async (req, res) => {
  try {
    const { productId, orderId, rating, comment } = req.body;

    // Check purchased product
    const order = await Order.findOne({
      _id: orderId,
      user: req.user._id,
      orderStatus: "delivered",
      "items.product": productId,
    });

    if (!order) {
      return res.status(403).json({
        message: "You can review only delivered products",
      });
    }

    // Prevent duplicate review
    const existing = await Review.findOne({
      user: req.user._id,
      product: productId,
      order: orderId,
    });

    if (existing) {
      return res.status(400).json({
        message: "Review already submitted",
      });
    }

    const review = await Review.create({
      user: req.user._id,
      product: productId,
      order: orderId,
      rating,
      comment,
    });

    res.status(201).json({
      success: true,
      message: "Review added",
      review,
    });

  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};
