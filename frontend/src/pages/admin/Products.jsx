import React, { useEffect, useState } from "react";
import API from "../../services/api";

import {
  LuPackage as Package,
  LuSearch as Search,
  LuPlus as Plus,
  LuTrash2 as Trash2,
  LuPencil as Edit3,
  LuX as X,
  LuUpload as Upload,
  LuLayers as Layers
} from "react-icons/lu";
import toast from "react-hot-toast";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    description: "",
    images: [""]
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await API.get("/products");
      setProducts(res.data);
      setLoading(false);
    } catch (err) {
      toast.error("Failed to fetch products");
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = {
        ...formData,
        variants: [{ type: "Standard", price: formData.price, unit: "1 Pc" }]
      };

      if (editingProduct) {
        await API.put(`/admin/products/${editingProduct._id}`, data);
        toast.success("Product updated");
      } else {
        await API.post("/admin/products", data);
        toast.success("Product added");
      }

      setShowModal(false);
      setEditingProduct(null);
      setFormData({ name: "", category: "", price: "", stock: "", description: "", images: [""] });
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed");
    }
  };

  const handleEdit = (p) => {
    setEditingProduct(p);
    setFormData({
      name: p.name,
      category: p.category?._id || "",
      price: p.variants?.[0]?.price || 0,
      stock: p.stock || 0,
      description: p.description || "",
      images: p.images || [""]
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await API.delete(`/admin/products/${id}`);
      setProducts(products.filter(p => p._id !== id));
      toast.success("Deleted");
    } catch (err) {
      toast.error("Failed to delete");
    }
  };

  const filtered = products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900">Product Management</h1>
            <p className="text-gray-500 font-medium">Add, update and manage your inventory items</p>
          </div>
          <div className="flex gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2 bg-white border border-gray-100 rounded-2xl focus:ring-2 focus:ring-green-600 font-medium"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              onClick={() => { setShowModal(true); setEditingProduct(null); }}
              className="bg-emerald-600 text-white px-6 py-3 rounded-2xl font-black flex items-center gap-2 shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all"
            >
              <Plus size={20} />
              Add Product
            </button>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 text-gray-500 text-xs font-black uppercase tracking-wider">
                <th className="px-8 py-4">Product Info</th>
                <th className="px-8 py-4">Category</th>
                <th className="px-8 py-4">Stock</th>
                <th className="px-8 py-4">Price</th>
                <th className="px-8 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((p) => (
                <tr key={p._id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-50 rounded-xl overflow-hidden border border-gray-100">
                        <img src={p.images?.[0] || '/box1.png'} alt={p.name} className="w-full h-full object-contain" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 text-sm line-clamp-1">{p.name}</h4>
                        <p className="text-[10px] font-black text-gray-400 uppercase">SKU: {p._id.slice(-6)}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-[10px] font-black uppercase tracking-wider">
                      {p.category?.name || "General"}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`font-bold text-sm ${p.stock < 10 ? 'text-red-600' : 'text-gray-900'}`}>
                      {p.stock} Units
                    </span>
                  </td>
                  <td className="px-8 py-5 font-black text-green-700 text-sm">
                    ₹{p.variants?.[0]?.price || 0}
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex justify-end gap-2">
                      <button onClick={() => handleEdit(p)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"><Edit3 size={18} /></button>
                      <button onClick={() => handleDelete(p._id)} className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors"><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <div className="p-20 text-center text-gray-400 font-medium">No products found.</div>}
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl w-full max-w-2xl p-8 shadow-2xl animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-black text-gray-900">{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-full"><X size={24} /></button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6 overflow-y-auto pr-2">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1 col-span-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Product Name</label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-green-600"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Price (₹)</label>
                    <input
                      type="number"
                      required
                      className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-green-600"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Stock Quantity</label>
                    <input
                      type="number"
                      required
                      className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-green-600"
                      value={formData.stock}
                      onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1 col-span-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Description</label>
                    <textarea
                      rows="3"
                      className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-green-600 resize-none"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    ></textarea>
                  </div>
                  <div className="space-y-1 col-span-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Image URL</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        className="flex-1 px-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-green-600"
                        placeholder="https://example.com/image.png"
                        value={formData.images[0]}
                        onChange={(e) => setFormData({ ...formData, images: [e.target.value] })}
                      />
                      <button type="button" className="p-3 bg-gray-100 rounded-2xl text-gray-500 hover:bg-gray-200 transition-colors">
                        <Upload size={20} />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-4 border-t border-gray-50">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 py-4 border-2 border-gray-100 rounded-2xl font-bold text-gray-600 hover:bg-gray-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-4 bg-emerald-600 rounded-2xl font-black text-white shadow-xl hover:bg-emerald-700 transition-all"
                  >
                    {editingProduct ? 'Update Product' : 'Save Product'}
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

