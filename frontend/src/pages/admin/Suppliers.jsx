import React, { useEffect, useState } from "react";
import API from "../../services/api";

import { 
  LuPlus as Plus, 
  LuSearch as Search, 
  LuPhone as Phone, 
  LuMail as Mail, 
  LuMapPin as MapPin, 
  LuTrash2 as Trash2, 
  LuPencil as Edit3,
  LuTruck as Truck,
  LuX
} from "react-icons/lu";
import toast from "react-hot-toast";

const AdminSuppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "", email: "", address: "", category: "" });

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const res = await API.get("/admin/suppliers");
      setSuppliers(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/admin/suppliers", formData);
      toast.success("Supplier added");
      setShowModal(false);
      setFormData({ name: "", phone: "", email: "", address: "", category: "" });
      fetchSuppliers();
    } catch (err) {
      toast.error("Failed to add supplier");
    }
  };

  if (loading) return (
    <div className="flex justify-center items-center h-64 text-green-600 dark:text-green-500 font-bold">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 dark:border-green-500 mr-3"></div>
      Loading Suppliers...
    </div>
  );

  return (
    <div className="space-y-10 min-h-screen p-6 bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Supplier Management</h1>
            <p className="text-gray-500 dark:text-gray-400 font-medium mt-1">Manage your equipment and supply sources</p>
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="bg-green-600 dark:bg-green-600 text-white px-8 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-green-100/50 dark:shadow-none hover:bg-green-700 transition-all whitespace-nowrap"
          >
            <Plus size={20} />
            Add Supplier
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {suppliers.map((s) => (
            <div key={s._id} className="bg-white dark:bg-gray-900 p-8 rounded-[32px] shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md transition-all group">
              <div className="flex justify-between items-start mb-8">
                <div className="w-16 h-16 bg-green-50 dark:bg-green-900/20 rounded-2xl text-green-600 dark:text-green-400 flex items-center justify-center border border-green-100 dark:border-green-900/30">
                  <Truck size={32} />
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-2.5 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-xl transition-colors" title="Edit"><Edit3 size={18} /></button>
                  <button className="p-2.5 text-red-500 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors" title="Delete"><Trash2 size={18} /></button>
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">{s.name}</h3>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400 text-sm font-medium">
                  <Phone size={16} className="text-gray-400 dark:text-gray-500" />
                  {s.phone}
                </div>
                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400 text-sm font-medium">
                  <Mail size={16} className="text-gray-400 dark:text-gray-500" />
                  <span className="truncate">{s.email || "No email provided"}</span>
                </div>
                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400 text-sm font-medium">
                  <MapPin size={16} className="text-gray-400 dark:text-gray-500" />
                  <span className="line-clamp-1">{s.address || "No address provided"}</span>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-gray-50 dark:border-gray-800 flex justify-between items-center">
                <span className="px-4 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-full text-[10px] font-bold uppercase tracking-widest text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700">
                  {s.category || "General Supply"}
                </span>
                <button className="text-green-600 dark:text-green-500 font-bold text-xs hover:underline uppercase tracking-widest">View History</button>
              </div>
            </div>
          ))}
          {suppliers.length === 0 && (
            <div className="col-span-full py-20 text-center bg-white dark:bg-gray-900 rounded-[32px] border border-dashed border-gray-200 dark:border-gray-800">
              <Truck size={48} className="mx-auto text-gray-200 dark:text-gray-700 mb-4" />
              <p className="text-gray-400 dark:text-gray-500 font-bold uppercase tracking-widest text-sm">No suppliers registered</p>
            </div>
          )}
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-gray-900/60 dark:bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-6">
            <div className="bg-white dark:bg-gray-900 rounded-[40px] w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-transparent dark:border-gray-800">
              <div className="p-8 md:p-10 border-b border-gray-50 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-gray-800/30">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Add New Supplier</h2>
                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-white dark:hover:bg-gray-800 rounded-full transition-colors text-gray-500 dark:text-gray-400"><LuX size={24} /></button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 md:p-10 space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Supplier Name</label>
                  <input 
                    type="text" 
                    required
                    placeholder="Enter supplier or company name"
                    className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-800 border-transparent dark:border-gray-700 rounded-2xl focus:bg-white dark:focus:bg-gray-900 focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all dark:text-white outline-none"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Phone</label>
                    <input 
                      type="text" 
                      required
                      placeholder="+91 00000 00000"
                      className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-800 border-transparent dark:border-gray-700 rounded-2xl focus:bg-white dark:focus:bg-gray-900 focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all dark:text-white outline-none"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Category</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Tools"
                      className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-800 border-transparent dark:border-gray-700 rounded-2xl focus:bg-white dark:focus:bg-gray-900 focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all dark:text-white outline-none"
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                  <input 
                    type="email" 
                    placeholder="supplier@example.com"
                    className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-800 border-transparent dark:border-gray-700 rounded-2xl focus:bg-white dark:focus:bg-gray-900 focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all dark:text-white outline-none"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Physical Address</label>
                  <textarea 
                    rows="2"
                    placeholder="Enter full business address"
                    className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-800 border-transparent dark:border-gray-700 rounded-2xl focus:bg-white dark:focus:bg-gray-900 focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all resize-none dark:text-white outline-none"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                  ></textarea>
                </div>
                <div className="flex gap-4 pt-4">
                  <button 
                    type="button" 
                    onClick={() => setShowModal(false)}
                    className="flex-1 py-4 bg-gray-100 dark:bg-gray-800 rounded-2xl font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="flex-1 py-4 bg-green-600 rounded-2xl font-bold text-white shadow-xl shadow-green-900/20 hover:bg-green-700 transition-all"
                  >
                    Save Supplier
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

  );
};

export default AdminSuppliers;

