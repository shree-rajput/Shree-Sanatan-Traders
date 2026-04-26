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
  LuTruck as Truck
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

  if (loading) return <div className="p-10 text-center font-bold text-emerald-700">Loading Suppliers...</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-black text-gray-900">Supplier Management</h1>
            <p className="text-gray-500 font-medium">Manage your equipment and supply sources</p>
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="bg-emerald-700 text-white px-6 py-3 rounded-2xl font-black flex items-center gap-2 shadow-lg shadow-emerald-100 hover:bg-green-800 transition-all"
          >
            <Plus size={20} />
            Add Supplier
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {suppliers.map((s) => (
            <div key={s._id} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-all group">
              <div className="flex justify-between items-start mb-6">
                <div className="bg-emerald-100 p-4 rounded-2xl text-emerald-700">
                  <Truck size={28} />
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"><Edit3 size={18} /></button>
                  <button className="p-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors"><Trash2 size={18} /></button>
                </div>
              </div>
              
              <h3 className="text-xl font-black text-gray-900 mb-4">{s.name}</h3>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-gray-600 text-sm font-medium">
                  <Phone size={16} className="text-gray-400" />
                  {s.phone}
                </div>
                <div className="flex items-center gap-3 text-gray-600 text-sm font-medium">
                  <Mail size={16} className="text-gray-400" />
                  {s.email || "No email"}
                </div>
                <div className="flex items-center gap-3 text-gray-600 text-sm font-medium">
                  <MapPin size={16} className="text-gray-400" />
                  <span className="line-clamp-1">{s.address || "No address"}</span>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-50 flex justify-between items-center">
                <span className="px-3 py-1 bg-gray-100 rounded-full text-[10px] font-black uppercase tracking-wider text-gray-500">
                  {s.category || "General"}
                </span>
                <button className="text-emerald-700 font-bold text-xs hover:underline">View History</button>
              </div>
            </div>
          ))}
          {suppliers.length === 0 && <div className="col-span-full py-20 text-center text-gray-400 font-medium">No suppliers registered.</div>}
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl w-full max-w-lg p-8 shadow-2xl animate-in zoom-in-95 duration-200">
              <h2 className="text-2xl font-black text-gray-900 mb-6">Add New Supplier</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Supplier Name</label>
                  <input 
                    type="text" 
                    required
                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-600"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Phone</label>
                    <input 
                      type="text" 
                      required
                      className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-600"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Category</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Tools"
                      className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-600"
                      value={formData.category}
                      onChange={(e) => setFormData({...formData, category: e.target.value})}
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Email</label>
                  <input 
                    type="email" 
                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-600"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-gray-400 uppercase ml-1">Address</label>
                  <textarea 
                    rows="2"
                    className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-600"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                  ></textarea>
                </div>
                <div className="flex gap-4 pt-4">
                  <button 
                    type="button" 
                    onClick={() => setShowModal(false)}
                    className="flex-1 py-4 border-2 border-gray-100 rounded-2xl font-bold text-gray-600 hover:bg-gray-50 transition-all"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="flex-1 py-4 bg-emerald-700 rounded-2xl font-black text-white shadow-xl hover:bg-green-800 transition-all"
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
