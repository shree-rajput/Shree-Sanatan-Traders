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


exports.getReviews = async (req, res) => {
  try {
    const { productId } = req.params; 
    
    const reviews = await Review.find({ product: productId })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      reviews,
    });
  
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }

};


exports.getUserReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ user: req.user._id })
      .populate("product", "name")
      .sort({ createdAt: -1 }); 
      
      if(order.status !== "delivered") {
        return res.status(403).json({
          message: "You can review only delivered products",
        });
      }

    res.status(200).json({
      success: true,
      reviews,
    });

  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
}

  exports.deleteReview = async (req, res) => {
    try {
      const { reviewId } = req.params;
      
      const review = await Review.findOneAndDelete({
        _id: reviewId,
        user: req.user._id,
      });

      if (!review) {
        return res.status(404).json({
          message: "Review not found",
        });
      }

      res.status(200).json({
        success: true,
        message: "Review deleted",
      });

    } catch (err) {

      res.status(500).json({
        message: err.message,
      });
    }

  };

  exports.updateReview = async (req, res) => {
    try {
      const { reviewId } = req.params;
      const { rating, comment } = req.body; 
            // Check if the review exists and belongs to the user and the order is delivered
      const review = await Review.findOne({
        _id: reviewId,
        user: req.user._id,
      }).populate("order"); 

      if (!review) {
        return res.status(404).json({
          message: "Review not found",
        });
      }

      if (review.order.orderStatus !== "delivered") {
        return res.status(403).json({
          message: "You can update review only for delivered products",
        });
      }

      review.rating = rating;
      review.comment = comment;
      await review.save();


      res.status(200).json({
        success: true,
        message: "Review updated",
        review,
      });


    } catch (err) {
      res.status(500).json({
        message: err.message,
      });
    }

  };