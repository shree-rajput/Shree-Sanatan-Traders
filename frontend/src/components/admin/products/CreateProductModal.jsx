import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { LuX, LuImage, LuPlus, LuTrash2, LuLoaderCircle } from "react-icons/lu";
import API from "../../../services/api";

const CreateProductModal = ({ isOpen, onClose, onProductCreated }) => {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    price: "",
    stock: "",
    sku: "",
    brand: "",
    status: "active",
    featured: false,
    trending: false,
  });

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
    }
  }, [isOpen]);

  const fetchCategories = async () => {
    try {
      const res = await API.get("/categories");
      setCategories(res.data);
    } catch (err) {
      toast.error("Failed to load categories");
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 5) {
      toast.error("Maximum 5 images allowed");
      return;
    }

    setImages((prev) => [...prev, ...files]);

    // Create previews
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formData.name ||
      !formData.category ||
      !formData.price ||
      !formData.stock
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    setLoading(true);
    try {
      const submitData = new FormData();
      Object.keys(formData).forEach((key) => {
        submitData.append(key, formData[key]);
      });

      images.forEach((img) => {
        submitData.append("images", img);
      });

      await API.post("/admin/products-v2", submitData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Product created successfully");
      resetForm();
      onProductCreated();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      category: "",
      description: "",
      price: "",
      stock: "",
      sku: "",
      brand: "",
      status: "active",
      featured: false,
      trending: false,
    });
    setImages([]);
    setImagePreviews([]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-3xl bg-white dark:bg-gray-900 rounded-3xl shadow-2xl flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-gray-800">
          <div>
            <h2 className="text-xl font-black text-gray-900 dark:text-white">
              Add New Product
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Create a new product in your catalog
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-colors"
          >
            <LuX size={24} />
          </button>
        </div>

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          <form
            id="create-product-form"
            onSubmit={handleSubmit}
            className="space-y-8"
          >
            {/* Basic Details */}
            <div className="space-y-5">
              <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">
                Basic Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 outline-none text-gray-900 dark:text-white"
                    placeholder="E.g. Premium Wheat Seeds"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 outline-none text-gray-900 dark:text-white"
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-500 uppercase">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 outline-none text-gray-900 dark:text-white resize-none"
                  placeholder="Product description and details..."
                />
              </div>
            </div>

            {/* Pricing & Inventory */}
            <div className="space-y-5">
              <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">
                Pricing & Inventory
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    min="0"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 outline-none text-gray-900 dark:text-white"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase">
                    Stock *
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    min="0"
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 outline-none text-gray-900 dark:text-white"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase">
                    SKU
                  </label>
                  <input
                    type="text"
                    name="sku"
                    value={formData.sku}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 outline-none text-gray-900 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* Images */}
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">
                  Product Images
                </h3>
                <span className="text-xs text-gray-500">
                  {images.length}/5 images
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-4">
                {imagePreviews.map((preview, idx) => (
                  <div
                    key={idx}
                    className="relative aspect-square rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden group"
                  >
                    <img
                      src={preview}
                      alt="preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="p-2 bg-red-500 text-white rounded-full hover:scale-110 transition-transform"
                      >
                        <LuTrash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}

                {images.length < 5 && (
                  <label className="aspect-square rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-700 hover:border-green-500 dark:hover:border-green-500 flex flex-col items-center justify-center cursor-pointer bg-gray-50 dark:bg-gray-800/50 hover:bg-green-50 dark:hover:bg-green-900/10 transition-colors">
                    <LuImage size={24} className="text-gray-400 mb-2" />
                    <span className="text-xs font-bold text-gray-500">
                      Upload
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Settings */}
            <div className="space-y-5">
              <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider">
                Settings
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 outline-none text-gray-900 dark:text-white"
                  >
                    <option value="active">Active</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase">
                    Brand
                  </label>
                  <input
                    type="text"
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-green-500 outline-none text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="flex gap-6 mt-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleChange}
                    className="w-5 h-5 accent-green-600 rounded"
                  />
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Featured Product
                  </span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    name="trending"
                    checked={formData.trending}
                    onChange={handleChange}
                    className="w-5 h-5 accent-green-600 rounded"
                  />
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Trending Product
                  </span>
                </label>
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-end gap-3 bg-gray-50 dark:bg-gray-900/50 rounded-b-3xl">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl font-bold text-white hover:text-black dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="create-product-form"
            disabled={loading}
            className="px-6 py-2.5 rounded-xl font-bold text-white bg-green-600 hover:bg-green-700 shadow-lg shadow-green-200 dark:shadow-none transition-all disabled:opacity-70 flex items-center gap-2"
          >
            {loading ? (
              <LuLoaderCircle className="animate-spin" size={20} />
            ) : (
              "Save Product"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateProductModal;
