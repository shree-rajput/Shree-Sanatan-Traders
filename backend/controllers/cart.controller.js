const Cart = require("../models/Cart.model");

// ADD TO CART
exports.addToCart = async (req, res) => {
  try {
    const { productId, variant, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({ message: "productId is required" });
    }

    let cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      cart = await Cart.create({
        user: req.user.id,
        items: [{ product: productId, variant, quantity }]
      });
    } else {
      cart.items.push({ product: productId, variant, quantity });
      await cart.save();
    }

    await cart.populate("items.product");
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET CART
exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user.id })
      .populate("items.product");

    // BUG FIX: return empty cart structure if no cart document exists
    if (!cart) {
      return res.json({ user: req.user.id, items: [] });
    }

    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// REMOVE FROM CART
exports.removeFromCart = async (req, res) => {
  try {
    // BUG FIX: cart was not null-checked — throws if no cart document exists
    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.items = cart.items.filter(
      item => item._id.toString() !== req.params.id
    );

    await cart.save();
    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE CART ITEM
exports.updateCart = async (req, res) => {
  try {
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: "Quantity must be at least 1" });
    }

    const cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const item = cart.items.find(
      i => i._id.toString() === req.params.id
    );

    if (!item) {
      return res.status(404).json({ message: "Item not found" });
    }

    item.quantity = quantity;
    await cart.save();

    res.json(cart);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};