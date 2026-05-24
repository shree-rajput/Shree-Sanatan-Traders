const Address = require("../models/Address.model");
const User = require("../models/User.model");

// @desc    Get all addresses for a user
// @route   GET /api/addresses
// @access  Private
exports.getAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({ user: req.user.id }).sort({ isDefault: -1, createdAt: -1 });
    res.json(addresses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add a new address
// @route   POST /api/addresses
// @access  Private
exports.addAddress = async (req, res) => {
  try {
    const { isDefault, ...addressData } = req.body;

    // If this is the first address, make it default
    const count = await Address.countDocuments({ user: req.user.id });
    const shouldBeDefault = count === 0 || isDefault;

    if (shouldBeDefault) {
      await Address.updateMany({ user: req.user.id }, { isDefault: false });
    }

    const address = await Address.create({
      ...addressData,
      user: req.user.id,
      isDefault: shouldBeDefault
    });

    // Add to User's address array
    const user = await User.findById(req.user.id);
    user.addresses.push(address._id);
    if (shouldBeDefault) user.defaultAddress = address._id;
    await user.save();

    res.status(201).json(address);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update an address
// @route   PUT /api/addresses/:id
// @access  Private
exports.updateAddress = async (req, res) => {
  try {
    const { isDefault, ...addressData } = req.body;

    const address = await Address.findOne({ _id: req.params.id, user: req.user.id });
    if (!address) return res.status(404).json({ message: "Address not found" });

    if (isDefault && !address.isDefault) {
      await Address.updateMany({ user: req.user.id }, { isDefault: false });
      const user = await User.findById(req.user.id);
      user.defaultAddress = address._id;
      await user.save();
    }

    const updatedAddress = await Address.findByIdAndUpdate(
      req.params.id,
      { ...addressData, isDefault },
      { new: true }
    );

    res.json(updatedAddress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete an address
// @route   DELETE /api/addresses/:id
// @access  Private
exports.deleteAddress = async (req, res) => {
  try {
    const address = await Address.findOne({ _id: req.params.id, user: req.user.id });
    if (!address) return res.status(404).json({ message: "Address not found" });

    const wasDefault = address.isDefault;

    await Address.findByIdAndDelete(req.params.id);

    // Remove from User's address array
    const user = await User.findById(req.user.id);
    user.addresses = user.addresses.filter(id => id.toString() !== req.params.id);
    
    // If deleted address was default, set another one as default if exists
    if (wasDefault && user.addresses.length > 0) {
      const newDefault = await Address.findOneAndUpdate(
        { user: req.user.id },
        { isDefault: true },
        { new: true }
      );
      user.defaultAddress = newDefault._id;
    } else if (wasDefault) {
      user.defaultAddress = null;
    }
    
    await user.save();

    res.json({ message: "Address removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Set default address
// @route   PATCH /api/addresses/:id/default
// @access  Private
exports.setDefaultAddress = async (req, res) => {
  try {
    const address = await Address.findOne({ _id: req.params.id, user: req.user.id });
    if (!address) return res.status(404).json({ message: "Address not found" });

    await Address.updateMany({ user: req.user.id }, { isDefault: false });
    address.isDefault = true;
    await address.save();

    const user = await User.findById(req.user.id);
    user.defaultAddress = address._id;
    await user.save();

    res.json(address);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
