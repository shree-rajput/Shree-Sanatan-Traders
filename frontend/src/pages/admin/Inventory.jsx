import React, { useEffect, useState } from "react";
import API from "../../services/api";
import {
  LuSearch,
  LuPlus,
  LuMinus,
  LuRefreshCcw,
  LuTriangleAlert,
  LuLoaderCircle,
  LuPackageCheck
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
    } catch (err) {
      toast.error("Failed to fetch inventory");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStock = async (id, currentStock, change) => {
    const newStock = Math.max(0, currentStock + change);
    setUpdating(id);
    try {
      await API.put(`/admin/products/${id}`, { stock: newStock });
      setProducts(products.map(p => p._id === id ? { ...p, stock: newStock } : p));
      toast.success("Stock updated successfully");
    } catch (err) {
      toast.error("Failed to update stock");
    } finally {
      setUpdating(null);
    }
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-10 min-h-screen p-6 bg-gray-50 dark:bg-gray-950">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Inventory Tracker</h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium mt-1">Monitor and adjust your warehouse stock.</p>
        </div>
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-72">
            <LuSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm focus:ring-2 focus:ring-green-600 font-medium dark:text-white outline-none"
            />
          </div>
          <button
            onClick={fetchInventory}
            className="p-3.5 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl shadow-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-all text-gray-500 dark:text-gray-400"
            title="Refresh Inventory"
          >
            <LuRefreshCcw size={20} />
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
            <LuLoaderCircle className="animate-spin text-green-600 mb-4" size={32} />
            <p className="text-sm font-bold uppercase tracking-widest">Loading Stock...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50 dark:bg-gray-800/30 text-gray-400 dark:text-gray-500 text-xs font-bold uppercase tracking-widest">
                  <th className="px-10 py-5">Product Info</th>
                  <th className="px-10 py-5">Price</th>
                  <th className="px-10 py-5">Status</th>
                  <th className="px-10 py-5 text-center">Adjust Stock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                {filteredProducts.map((p) => (
                  <tr key={p._id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors group">
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-50 dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800">
                          <img src={p.images?.[0] || '/placeholder.png'} className="w-full h-full object-cover" alt="" />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 dark:text-white leading-tight">{p.name}</p>
                          <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mt-1">ID: {p._id.slice(-8).toUpperCase()}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      <span className="font-bold text-gray-900 dark:text-white text-sm">₹{p.variants?.[0]?.price?.toLocaleString() || 0}</span>
                    </td>
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${p.stock < 10 ? 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 border border-red-100 dark:border-red-900/30' : 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-400 border border-green-100 dark:border-green-900/30'
                          }`}>
                          {p.stock} units
                        </span>
                        {p.stock < 10 && <LuTriangleAlert size={14} className="text-amber-500 animate-bounce" />}
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      <div className="flex items-center justify-center gap-6">
                        <button
                          onClick={() => handleUpdateStock(p._id, p.stock, -1)}
                          disabled={updating === p._id}
                          className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-400 flex items-center justify-center hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400 transition-all shadow-sm active:scale-90"
                        >
                          <LuMinus size={18} />
                        </button>
                        <span className="w-10 text-center font-bold text-gray-900 dark:text-white text-lg">{p.stock}</span>
                        <button
                          onClick={() => handleUpdateStock(p._id, p.stock, 1)}
                          disabled={updating === p._id}
                          className="w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-400 flex items-center justify-center hover:bg-green-50 dark:hover:bg-green-900/30 hover:text-green-600 dark:hover:text-green-400 transition-all shadow-sm active:scale-90"
                        >
                          <LuPlus size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredProducts.length === 0 && (
                  <tr>
                    <td colSpan="4" className="py-20 text-center text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest text-sm">
                      No matching products
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="bg-gray-900 dark:bg-green-600/10 rounded-[40px] p-10 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl dark:shadow-none border dark:border-green-600/20">
        <div className="space-y-2 text-center md:text-left">
          <h3 className="text-2xl font-bold flex items-center justify-center md:justify-start gap-3">
            <LuPackageCheck className="text-green-500" /> Warehouse Optimization
          </h3>
          <p className="text-gray-400 dark:text-gray-300 font-medium">Keep your inventory lean and respond faster to customer demand.</p>
        </div>
        <button className="px-8 py-4 bg-green-600 text-white rounded-2xl font-bold shadow-xl shadow-green-900/40 hover:bg-green-700 transition-all active:scale-95 whitespace-nowrap">
          Generate Audit Report
        </button>
      </div>
    </div>
  );
};

export default AdminInventory;
