const Category = require("../models/Category.model");

exports.createCategory = async (req, res) => {
  try {
    const { name, nameHindi, image } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    // 🔥 AUTO SLUG GENERATE
    const slug = name.toLowerCase().replace(/\s+/g, "-");

    const category = await Category.create({
      name,
      nameHindi,
      image,
      slug
    });

    res.json(category);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getCategories = async (req, res) => {
  const categories = await Category.find();
  res.json(categories);
};
// UPDATE CATEGORY
exports.updateCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE CATEGORY
exports.deleteCategory = async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ message: "Category deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};