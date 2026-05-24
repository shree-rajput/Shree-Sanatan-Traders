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
      usageLimit: req.body.usageLimit,
      active: req.body.active ?? true,
      discountType: req.body.type,
      discountValue: req.body.value,
      expiryDate: req.body.expiry,
      isActive: req.body.active ?? true,
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
    if (data.type) data.discountType = data.type;
    if (data.value !== undefined) data.discountValue = data.value;
    if (data.expiry) data.expiryDate = data.expiry;
    if (data.active !== undefined) data.isActive = data.active;
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, data, { new: true, runValidators: true });
    res.json({ success: true, coupon });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
