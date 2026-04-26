import React, { useEffect, useState } from "react";
import API from "../../services/api";

import { 
  LuSearch as Search, 
  LuPlus as Plus, 
  LuMinus as Minus, 
  LuRefreshCcw as RefreshCcw, 
  LuTriangleAlert as AlertTriangle,
  LuArrowUpDown as ArrowUpDown
} from "react-icons/lu";
import toast from "react-hot-toast";

const AdminInventory = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [updating, setUpdating] = useState(null);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const res = await API.get("/products");
      setProducts(res.data);
      setLoading(false);
    } catch (err) {
      toast.error("Failed to fetch inventory");
      setLoading(false);
    }
  };

  const handleUpdateStock = async (id, currentStock, change) => {
    const newStock = Math.max(0, currentStock + change);
    setUpdating(id);
    try {
      await API.put(`/admin/products/${id}`, { stock: newStock });
      setProducts(products.map(p => p._id === id ? { ...p, stock: newStock } : p));
      toast.success("Stock updated");
    } catch (err) {
      toast.error("Update failed");
    } finally {
      setUpdating(null);
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="p-10 text-center font-bold text-emerald-700">Loading Inventory...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900">Inventory Management</h1>
            <p className="text-gray-500 font-medium">Track and manage your stock levels</p>
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="Search products..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-white border border-gray-100 rounded-2xl w-full focus:outline-none focus:ring-2 focus:ring-emerald-600 transition-all"
              />
            </div>
            <button 
              onClick={fetchInventory}
              className="p-2 bg-white border border-gray-100 rounded-2xl hover:bg-gray-50 transition-colors"
            >
              <RefreshCcw size={18} className="text-gray-600" />
            </button>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs font-black uppercase tracking-wider">
                  <th className="px-8 py-4">Product Name</th>
                  <th className="px-8 py-4">Category</th>
                  <th className="px-8 py-4">Price</th>
                  <th className="px-8 py-4">Stock Status</th>
                  <th className="px-8 py-4 text-center">Update Stock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 font-medium">
                {filteredProducts.map((p) => (
                  <tr key={p._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-8 py-5">
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-900">{p.name}</span>
                        <span className="text-[10px] text-gray-400 font-bold uppercase">{p._id.slice(-6)}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="text-sm text-gray-600">{p.category?.name || "Uncategorized"}</span>
                    </td>
                    <td className="px-8 py-5 text-sm font-bold text-gray-900">
                      ₹{p.variants?.[0]?.price || 0}
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          p.stock < 10 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-emerald-700'
                        }`}>
                          {p.stock} in stock
                        </span>
                        {p.stock < 10 && <AlertTriangle size={14} className="text-red-500 animate-pulse" />}
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center justify-center gap-4">
                        <button 
                          onClick={() => handleUpdateStock(p._id, p.stock, -1)}
                          disabled={updating === p._id}
                          className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-red-100 hover:text-red-600 transition-colors"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="w-8 text-center font-black text-gray-900">{p.stock}</span>
                        <button 
                          onClick={() => handleUpdateStock(p._id, p.stock, 1)}
                          disabled={updating === p._id}
                          className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center hover:bg-green-100 hover:text-emerald-600 transition-colors"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredProducts.length === 0 && (
            <div className="p-20 text-center text-gray-500 font-medium">No products found matching your search.</div>
          )}
        </div>
      </div>

  );
};

export default AdminInventory;
