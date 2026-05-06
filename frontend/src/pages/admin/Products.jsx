import React, { useEffect, useState } from "react";
import API from "../../services/api";
import {
  LuPackage,
  LuSearch,
  LuPlus,
  LuTrash2,
  LuPencil,
  LuX,
  LuUpload,
  LuCircleAlert,   // ✅ correct
  LuCircleCheck    // ✅ correct
} from "react-icons/lu";
import toast from "react-hot-toast"; const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: "",
    description: "",
    images: []
  });

  const [imageFiles, setImageFiles] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await API.get("/products");
      setProducts(res.data);
    } catch (err) {
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const form = new FormData();
      form.append("name", formData.name);
      form.append("description", formData.description);
      form.append("stock", formData.stock);

      const variants = [{
        type: "Standard",
        price: parseFloat(formData.price),
        unit: "1 Pc"
      }];
      form.append("variants", JSON.stringify(variants));

      imageFiles.forEach(file => {
        form.append("images", file);
      });

      const config = { headers: { "Content-Type": "multipart/form-data" } };

      if (editingProduct) {
        await API.put(`/admin/products/${editingProduct._id}`, form, config);
        toast.success("Product updated successfully");
      } else {
        await API.post("/admin/products", form, config);
        toast.success("Product added successfully");
      }

      setShowModal(false);
      setEditingProduct(null);
      setFormData({ name: "", price: "", stock: "", description: "", images: [] });
      setImageFiles([]);
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed");
    }
  };

  const handleEdit = (p) => {
    setEditingProduct(p);
    setFormData({
      name: p.name,
      price: p.variants?.[0]?.price || 0,
      stock: p.stock || 0,
      description: p.description || "",
      images: p.images || []
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    try {
      await API.delete(`/admin/products/${id}`);
      setProducts(products.filter(p => p._id !== id));
      toast.success("Product deleted");
    } catch (err) {
      toast.error("Failed to delete product");
    }
  };

  const filtered = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Product Catalog</h1>
          <p className="text-gray-500 font-medium mt-1">Manage your inventory and stock levels.</p>
        </div>
        <div className="flex gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-72">
            <LuSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search products..."
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-100 rounded-2xl shadow-sm focus:ring-2 focus:ring-green-600 font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            onClick={() => { setShowModal(true); setEditingProduct(null); }}
            className="bg-green-600 text-white px-8 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-green-100 hover:bg-green-700 transition-all whitespace-nowrap"
          >
            <LuPlus size={20} />
            New Product
          </button>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 text-gray-400 text-xs font-bold uppercase tracking-widest">
                <th className="px-10 py-5">Product Details</th>
                <th className="px-10 py-5">Status</th>
                <th className="px-10 py-5">Stock</th>
                <th className="px-10 py-5">Price</th>
                <th className="px-10 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((p) => (
                <tr key={p._id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-gray-50 rounded-xl overflow-hidden border border-gray-100 flex-shrink-0">
                        <img src={p.images?.[0] || '/placeholder.png'} alt={p.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 leading-tight">{p.name}</h4>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">ID: {p._id.slice(-8).toUpperCase()}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-10 py-6">
                    {p.stock > 0 ? (
                      <span className="flex items-center gap-1.5 text-xs font-bold text-green-600 uppercase tracking-widest">
                        <LuCircleCheck size={14} /> In Stock
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5 text-xs font-bold text-red-500 uppercase tracking-widest">
                        <LuCircleAlert size={14} /> Out of Stock
                      </span>
                    )}
                  </td>
                  <td className="px-10 py-6">
                    <span className={`text-sm font-bold ${p.stock < 10 ? 'text-amber-600' : 'text-gray-900'}`}>
                      {p.stock} units
                    </span>
                  </td>
                  <td className="px-10 py-6 font-bold text-gray-900">
                    ₹{p.variants?.[0]?.price?.toLocaleString() || 0}
                  </td>
                  <td className="px-10 py-6 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleEdit(p)} className="p-2.5 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors" title="Edit"><LuPencil size={18} /></button>
                      <button onClick={() => handleDelete(p._id)} className="p-2.5 text-red-500 hover:bg-red-50 rounded-xl transition-colors" title="Delete"><LuTrash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && !loading && (
            <div className="py-20 text-center text-gray-400 font-bold uppercase tracking-widest text-sm">
              No products found
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-[40px] w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-8 md:p-10 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-white rounded-full transition-colors"><LuX size={24} /></button>
            </div>

            <form onSubmit={handleSubmit} className="p-8 md:p-10 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-2 gap-6">
                <div className="col-span-2 space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Product Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter product name"
                    className="w-full px-5 py-4 bg-gray-50 border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Selling Price (₹)</label>
                  <input
                    type="number"
                    required
                    placeholder="0.00"
                    className="w-full px-5 py-4 bg-gray-50 border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all font-bold"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Current Stock</label>
                  <input
                    type="number"
                    required
                    placeholder="0"
                    className="w-full px-5 py-4 bg-gray-50 border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all font-bold"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Product Description</label>
                  <textarea
                    rows="3"
                    placeholder="Describe the product features..."
                    className="w-full px-5 py-4 bg-gray-50 border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all resize-none"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  ></textarea>
                </div>
                <div className="col-span-2 space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Product Images</label>
                  <div className="flex flex-col gap-4">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      className="hidden"
                      id="image-upload"
                      onChange={(e) => setImageFiles(Array.from(e.target.files))}
                    />
                    <label
                      htmlFor="image-upload"
                      className="w-full flex items-center justify-center gap-4 px-6 py-8 bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl cursor-pointer hover:bg-green-50 hover:border-green-300 transition-all group"
                    >
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-gray-400 group-hover:text-green-600 shadow-sm transition-colors">
                        <LuUpload size={24} />
                      </div>
                      <div className="text-left">
                        <p className="text-sm font-bold text-gray-700">Select product images</p>
                        <p className="text-xs text-gray-400 font-medium">{imageFiles.length > 0 ? `${imageFiles.length} files selected` : "Drag and drop or click to browse"}</p>
                      </div>
                    </label>

                    {imageFiles.length > 0 && (
                      <div className="flex gap-3 overflow-x-auto py-2">
                        {imageFiles.map((file, idx) => (
                          <div key={idx} className="w-16 h-16 bg-white rounded-xl flex-shrink-0 border border-gray-100 overflow-hidden relative group shadow-sm">
                            <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" alt="" />
                            <button
                              type="button"
                              onClick={() => setImageFiles(imageFiles.filter((_, i) => i !== idx))}
                              className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity"
                            >
                              <LuX size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-6 border-t border-gray-50">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-4 bg-gray-100 rounded-2xl font-bold text-gray-600 hover:bg-gray-200 transition-all"
                >
                  Discard
                </button>
                <button
                  type="submit"
                  className="flex-1 py-4 bg-green-600 rounded-2xl font-bold text-white shadow-xl shadow-green-900/20 hover:bg-green-700 transition-all"
                >
                  {editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;

