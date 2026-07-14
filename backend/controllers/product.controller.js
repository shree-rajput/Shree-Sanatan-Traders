const Product = require("../models/Product.model");
const Category = require("../models/Category.model");

exports.getProducts = async (req, res) => {
try {


const { search, category } = req.query;

let query = {};

console.log("CATEGORY PARAM =>", category);

// 🔍 Search
if (search) {
  query.$or = [
    {
      name: {
        $regex: search,
        $options: "i"
      }
    },
    {
      description: {
        $regex: search,
        $options: "i"
      }
    }
  ];
}

// 🏷️ Category filter
if (category && category !== "All") {

  const categoryDoc = await Category.findOne({
    slug: category.trim()
  });

  console.log("CATEGORY DOC =>", categoryDoc);

  if (!categoryDoc) {
    return res.status(404).json({
      message: "Category not found"
    });
  }

  query.category = categoryDoc._id;

}

console.log("FINAL QUERY =>", query);

const products = await Product.find(query)
  .populate("category");

console.log("PRODUCT COUNT =>", products.length);

res.status(200).json(products);


} catch (error) {


console.log(error);

res.status(500).json({
  message: error.message
});


}
};

exports.createProduct = async (req, res) => {
  try {
    const images = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];
    
    const productData = { ...req.body };
    if (images.length > 0) productData.images = images;
    
    // Parse variants if sent as a JSON string from form-data
    if (typeof productData.variants === "string") {
      try {
        productData.variants = JSON.parse(productData.variants);
      } catch {
        return res.status(400).json({ message: "Invalid variants JSON format" });
      }
    }

    // BUG FIX: Product.create().populate() is invalid — create() returns a document, not a Query.
    // Calling .populate() on a document throws TypeError. Must call findById().populate() separately.
    const product = await Product.create(productData);
    const populated = await Product.findById(product._id).populate("category", "name slug");

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// exports.getProducts = async (req, res) => {
//   try {
//     const { search, category } = req.query;
//     let query = {};

//    if (search) { 
//     query.$or = [ { name: { $regex: search, $options: "i" } }, 
//                   { description: { $regex: search, $options: "i" } } 
//                 ];
//                }
// if (category && category !== "All") { // Find category using slug 
// const categoryDoc = await Category.findOne({ slug: category });
//  // If category not found 
//   if (!categoryDoc) { 
//     return res.status(404).json({ message: "Category not found" }

//     );
//    }
//   }
//     // Match ObjectId properly query.category = categoryDoc._id.toString(); }
//     const products = await Product.find(query).populate("category");
//     res.json(products);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("category");
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const images = req.files ? req.files.map(file => `/uploads/${file.filename}`) : [];
    const productData = { ...req.body };
    
    if (images.length > 0) productData.images = images;
    
    if (typeof productData.variants === "string") {
      productData.variants = JSON.parse(productData.variants);
    }

    const product = await Product.findByIdAndUpdate(
      req.params.id,
      productData,
      { new: true }
    );
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json({ message: "Deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};