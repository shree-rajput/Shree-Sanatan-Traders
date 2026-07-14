const Coupon = require("../../models/Coupon.model");

exports.listCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json({ success: true, coupons });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createCoupon = async (req, res) => {
  try {
    const data = {
      code: String(req.body.code || "").toUpperCase(),
      type: req.body.type,
      value: req.body.value,
      expiry: req.body.expiry,
      minAmount: req.body.minAmount || 0,
      usageLimit: req.body.usageLimit || 0,
      active: req.body.active ?? true,
    };
    const coupon = await Coupon.create(data);
    res.status(201).json({ success: true, coupon });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateCoupon = async (req, res) => {
  try {
    const data = { ...req.body };
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
    res.json({ success: true, coupon });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
