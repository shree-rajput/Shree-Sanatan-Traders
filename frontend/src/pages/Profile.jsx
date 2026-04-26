import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  LuUser,
  LuMapPin,
  LuPackage,
  LuLogOut,
  LuChevronRight,
  LuLoaderCircle,
  LuTruck,
  LuCircleCheck,
  LuPencil,
  LuX,
  LuHistory,
  LuSettings,
  LuCreditCard,
  LuShieldCheck
} from "react-icons/lu";

import { useAuth } from "../context/AuthContext";
import API from "../services/api";

const Profile = () => {
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    village: "",
    district: "",
    state: "",
    pincode: "",
  });

  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        phone: user.phone || "",
        village: user.village || user.address || "",
        district: user.district || "",
        state: user.state || "",
        pincode: user.pincode || "",
      });
      fetchOrders();
      setLoading(false);
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      const res = await API.get("/orders");
      setOrders(res.data);
    } catch (err) {
      console.error("Failed to fetch orders");
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdating(true);
    try {
      const token = localStorage.getItem("token");
      const res = await API.put("/users/me", formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      login(res.data, token);
      showMsg("success", "Profile updated successfully!");
    } catch (err) {
      showMsg("error", "Failed to update profile.");
    } finally {
      setUpdating(false);
    }
  };

  const showMsg = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: "", text: "" }), 3000);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
       <LuLoaderCircle className="animate-spin text-emerald-600" size={40} />
    </div>
  );

  const tabs = [
    { id: "overview", name: "Account Overview", icon: LuUser },
    { id: "orders", name: "My Orders", icon: LuHistory },
    { id: "address", name: "Address Book", icon: LuMapPin },
    { id: "settings", name: "Settings", icon: LuSettings },
  ];

  return (
    <div className="min-h-screen bg-[#f8faf9] py-12 px-4 md:px-10">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-10">
           <h1 className="text-3xl font-black text-gray-900 tracking-tight">My <span className="text-emerald-600">Account</span></h1>
           <p className="text-gray-500 font-medium mt-1">Manage your profile, orders, and addresses</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar */}
          <aside className="w-full lg:w-80 shrink-0 space-y-6">
            
            {/* User Info Card */}
            <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm text-center">
               <div className="relative w-24 h-24 mx-auto mb-4">
                  <div className="w-full h-full bg-emerald-100 rounded-[32px] flex items-center justify-center text-emerald-700 font-black text-3xl">
                     {user?.name?.[0] || "U"}
                  </div>
                  <button className="absolute bottom-0 right-0 w-8 h-8 bg-white border border-gray-100 rounded-xl flex items-center justify-center text-gray-400 hover:text-emerald-600 shadow-lg transition-all">
                     <LuPencil size={14} />
                  </button>
               </div>
               <h2 className="text-xl font-black text-gray-900 leading-none">{user?.name}</h2>
               <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mt-2">{user?.role || "Customer"}</p>
               
               <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-gray-50">
                  <div className="text-center">
                     <p className="text-lg font-black text-gray-900 leading-none">{orders.length}</p>
                     <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Orders</p>
                  </div>
                  <div className="text-center border-l border-gray-50">
                     <p className="text-lg font-black text-emerald-600 leading-none">₹{orders.reduce((sum, o) => sum + o.totalPrice, 0).toLocaleString()}</p>
                     <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Spent</p>
                  </div>
               </div>
            </div>

            {/* Navigation Tabs */}
            <nav className="bg-white rounded-[32px] p-4 border border-gray-100 shadow-sm">
               {tabs.map(tab => (
                 <button
                   key={tab.id}
                   onClick={() => setActiveTab(tab.id)}
                   className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-sm font-bold transition-all ${
                     activeTab === tab.id ? "bg-emerald-600 text-white shadow-xl shadow-emerald-100" : "text-gray-500 hover:bg-gray-50"
                   }`}
                 >
                   <tab.icon size={18} />
                   {tab.name}
                   {activeTab === tab.id && <LuChevronRight className="ml-auto" size={16} />}
                 </button>
               ))}
               <button 
                onClick={() => { logout(); navigate("/login"); }}
                className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-sm font-bold text-red-500 hover:bg-red-50 transition-all mt-2"
               >
                 <LuLogOut size={18} />
                 Sign Out
               </button>
            </nav>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1">
             
             {/* Tab Content: OVERVIEW */}
             {activeTab === "overview" && (
                <div className="space-y-8 animate-in fade-in duration-500">
                   <div className="bg-white rounded-[40px] p-10 border border-gray-100 shadow-sm">
                      <div className="flex items-center justify-between mb-8">
                         <h3 className="text-xl font-black text-gray-900">Personal Information</h3>
                         <LuShieldCheck className="text-emerald-500" size={24} />
                      </div>
                      
                      <form onSubmit={handleUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                            <input 
                               type="text"
                               value={formData.name}
                               onChange={(e) => setFormData({...formData, name: e.target.value})}
                               className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-transparent border focus:bg-white focus:border-emerald-200 focus:ring-4 focus:ring-emerald-500/5 outline-none transition-all font-bold text-gray-800"
                            />
                         </div>
                         <div className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
                            <input 
                               type="text"
                               value={formData.phone}
                               readOnly
                               className="w-full px-6 py-4 bg-gray-100 rounded-2xl border-transparent border text-gray-400 cursor-not-allowed font-bold"
                            />
                         </div>
                         <div className="space-y-2 md:col-span-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                            <input 
                               type="email"
                               value={user?.email || ""}
                               readOnly
                               className="w-full px-6 py-4 bg-gray-100 rounded-2xl border-transparent border text-gray-400 cursor-not-allowed font-bold"
                            />
                         </div>
                         <div className="md:col-span-2 pt-4">
                            <button 
                               type="submit"
                               disabled={updating}
                               className="px-10 py-4 bg-emerald-600 text-white rounded-2xl font-black shadow-xl shadow-emerald-100 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:hover:scale-100"
                            >
                               {updating ? "Saving..." : "Save Changes"}
                            </button>
                         </div>
                      </form>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm flex flex-col items-center text-center">
                         <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 mb-4">
                            <LuTruck size={24} />
                         </div>
                         <h4 className="text-sm font-black text-gray-900 mb-1">Fast Delivery</h4>
                         <p className="text-xs text-gray-500 font-medium">To your village doorstep</p>
                      </div>
                      <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm flex flex-col items-center text-center">
                         <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 mb-4">
                            <LuCreditCard size={24} />
                         </div>
                         <h4 className="text-sm font-black text-gray-900 mb-1">Udhaar Facility</h4>
                         <p className="text-xs text-gray-500 font-medium">Available for local farmers</p>
                      </div>
                      <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm flex flex-col items-center text-center">
                         <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-600 mb-4">
                            <LuShieldCheck size={24} />
                         </div>
                         <h4 className="text-sm font-black text-gray-900 mb-1">Quality Assured</h4>
                         <p className="text-xs text-gray-500 font-medium">100% Genuine Equipment</p>
                      </div>
                   </div>
                </div>
             )}

             {/* Tab Content: ORDERS */}
             {activeTab === "orders" && (
                <div className="space-y-6 animate-in fade-in duration-500">
                   <div className="bg-white rounded-[40px] p-10 border border-gray-100 shadow-sm">
                      <h3 className="text-xl font-black text-gray-900 mb-8">Recent Orders</h3>
                      {orders.length === 0 ? (
                         <div className="text-center py-20">
                            <LuPackage className="mx-auto text-gray-200 mb-4" size={64} />
                            <p className="text-gray-500 font-bold">No orders found.</p>
                            <button onClick={() => navigate("/products")} className="mt-4 text-emerald-600 font-black hover:underline">Start Shopping</button>
                         </div>
                      ) : (
                         <div className="space-y-4">
                            {orders.map(order => (
                               <div key={order._id} className="group flex flex-col md:flex-row md:items-center justify-between p-6 bg-gray-50 rounded-3xl border border-transparent hover:border-emerald-100 hover:bg-white transition-all cursor-pointer">
                                  <div className="flex items-center gap-6">
                                     <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm">
                                        <LuPackage size={28} />
                                     </div>
                                     <div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Order #{order._id.slice(-6)}</p>
                                        <h4 className="text-lg font-black text-gray-900">₹{order.totalPrice.toLocaleString()}</h4>
                                        <p className="text-xs text-gray-500 font-medium">{new Date(order.createdAt).toLocaleDateString()}</p>
                                     </div>
                                  </div>
                                  <div className="mt-4 md:mt-0 flex items-center gap-6">
                                     <div className="text-right">
                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                           order.orderStatus === 'Delivered' ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'
                                        }`}>
                                           {order.orderStatus}
                                        </span>
                                     </div>
                                     <LuChevronRight size={20} className="text-gray-300 group-hover:text-emerald-600 transition-colors" />
                                  </div>
                               </div>
                            ))}
                         </div>
                      )}
                   </div>
                </div>
             )}

             {/* Tab Content: ADDRESS */}
             {activeTab === "address" && (
                <div className="animate-in fade-in duration-500">
                   <div className="bg-white rounded-[40px] p-10 border border-gray-100 shadow-sm">
                      <h3 className="text-xl font-black text-gray-900 mb-8">Delivery Address</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div className="bg-[#fcfdfd] p-8 rounded-[32px] border-2 border-emerald-100 relative">
                            <div className="absolute top-6 right-6 w-6 h-6 bg-emerald-600 rounded-full flex items-center justify-center text-white">
                               <LuCircleCheck size={14} />
                            </div>
                            <LuMapPin className="text-emerald-600 mb-4" size={32} />
                            <h4 className="text-lg font-black text-gray-900 mb-2">Default Address</h4>
                            <p className="text-sm text-gray-600 font-medium leading-relaxed">
                               {formData.village}, {formData.district}<br />
                               {formData.state} - {formData.pincode}
                            </p>
                            <button className="mt-6 flex items-center gap-2 text-emerald-600 font-black text-sm hover:underline">
                               <LuPencil size={14} /> Edit Address
                            </button>
                         </div>

                         <button className="bg-gray-50 border-2 border-dashed border-gray-200 p-8 rounded-[32px] flex flex-col items-center justify-center text-center group hover:bg-emerald-50 hover:border-emerald-200 transition-all">
                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-gray-400 group-hover:text-emerald-600 shadow-sm mb-4">
                               <LuX className="rotate-45" size={24} />
                            </div>
                            <span className="text-sm font-black text-gray-900">Add New Address</span>
                         </button>
                      </div>
                   </div>
                </div>
             )}

          </main>
        </div>
      </div>

      {/* Global Message Toast */}
      {message.text && (
         <div className="fixed bottom-10 right-10 z-[100] animate-in slide-in-from-right duration-500">
            <div className={`flex items-center gap-4 px-8 py-4 rounded-3xl shadow-2xl border ${
               message.type === 'success' ? 'bg-emerald-600 border-emerald-500 text-white' : 'bg-red-600 border-red-500 text-white'
            }`}>
               {message.type === 'success' ? <LuCircleCheck size={24} /> : <LuX size={24} />}
               <p className="font-black text-sm tracking-tight">{message.text}</p>
            </div>
         </div>
      )}
    </div>
  );
};

export default Profile;