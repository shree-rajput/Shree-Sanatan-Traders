import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LuUser, LuMapPin, LuPackage, LuLogOut, LuChevronRight, LuLoaderCircle, LuShieldCheck, LuSettings, LuBox } from "react-icons/lu";
import { useAuth } from "../context/AuthContext";
import API from "../services/api";
import toast from "react-hot-toast";

const Profile = () => {
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || ""
  });

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const res = await API.get("/orders");
        setOrders(res.data);
      } catch (err) {
        console.error("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };
    if (user) fetchProfileData();
  }, [user]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await API.put("/users/me", formData);
      login(res.data, localStorage.getItem("token"));
      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error("Failed to update profile.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <LuLoaderCircle className="animate-spin text-green-600" size={40} />
      </div>
    );
  }

  const tabs = [
    { id: "overview", name: "Overview", icon: LuUser },
    { id: "orders", name: "Orders", icon: LuPackage },
    { id: "settings", name: "Settings", icon: LuSettings },
  ];

  return (
    <div className="min-h-screen bg-gray-50/50 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900">My <span className="text-green-600">Account</span></h1>
          <p className="text-gray-400 font-medium mt-1">Manage your profile and orders</p>
        </div>

        <div className="grid lg:grid-cols-[280px_1fr] gap-10">
          {/* Sidebar */}
          <aside className="space-y-6">
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm text-center">
              <div className="w-20 h-20 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center text-3xl font-bold mx-auto mb-4">
                {user?.name?.[0]}
              </div>
              <h2 className="text-xl font-bold text-gray-900">{user?.name}</h2>
              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">{user?.role || "Customer"}</p>
              
              <div className="mt-8 pt-8 border-t border-gray-50 grid grid-cols-2 gap-4">
                <div className="text-center">
                  <p className="text-lg font-bold text-gray-900">{orders.length}</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Orders</p>
                </div>
                <div className="text-center border-l border-gray-50">
                  <p className="text-lg font-bold text-green-600">₹{orders.reduce((s, o) => s + (o.totalPrice || 0), 0).toLocaleString()}</p>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Spent</p>
                </div>
              </div>
            </div>

            <nav className="bg-white rounded-3xl p-2 border border-gray-100 shadow-sm">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl text-sm font-bold transition-all ${
                    activeTab === tab.id ? "bg-green-600 text-white shadow-lg shadow-green-100" : "text-gray-400 hover:text-green-600 hover:bg-gray-50"
                  }`}
                >
                  <tab.icon size={18} />
                  {tab.name}
                </button>
              ))}
              <button
                onClick={() => { logout(); navigate("/login"); }}
                className="w-full flex items-center gap-3 px-6 py-4 rounded-2xl text-sm font-bold text-red-400 hover:bg-red-50 hover:text-red-600 transition-all mt-2"
              >
                <LuLogOut size={18} /> Logout
              </button>
            </nav>
          </aside>

          {/* Content */}
          <main>
            {activeTab === "overview" && (
              <div className="bg-white rounded-3xl p-8 md:p-12 border border-gray-100 shadow-sm space-y-10">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-gray-900">Personal Details</h3>
                  <LuShieldCheck className="text-green-600" size={24} />
                </div>

                <form onSubmit={handleUpdate} className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/10 outline-none transition-all font-medium"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/10 outline-none transition-all font-medium"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Email Address</label>
                    <input
                      type="email"
                      value={formData.email}
                      readOnly
                      className="w-full px-6 py-4 bg-gray-100/50 border border-gray-100 rounded-2xl text-gray-400 font-medium cursor-not-allowed"
                    />
                  </div>
                  <div className="md:col-span-2 pt-4">
                    <button type="submit" className="px-8 py-4 bg-green-600 text-white rounded-2xl font-bold shadow-lg shadow-green-100 hover:bg-green-700 transition-all">
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            )}

            {activeTab === "orders" && (
              <div className="space-y-6">
                {orders.length === 0 ? (
                  <div className="bg-white rounded-3xl p-20 text-center border border-gray-100 shadow-sm">
                    <LuBox size={48} className="mx-auto text-gray-200 mb-6" />
                    <h2 className="text-xl font-bold text-gray-900 mb-2">No orders yet</h2>
                    <p className="text-gray-500 mb-8">When you buy something, it will appear here.</p>
                    <button onClick={() => navigate("/products")} className="px-8 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-all">
                      Start Shopping
                    </button>
                  </div>
                ) : (
                  orders.map(order => (
                    <div key={order._id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400">
                          <LuPackage size={24} />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Order #{order._id.slice(-6)}</p>
                          <p className="text-lg font-bold text-gray-900">₹{(order.totalPrice || 0).toLocaleString()}</p>
                          <p className="text-[10px] font-bold text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                          order.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {order.paymentStatus || 'Pending'}
                        </span>
                        <LuChevronRight size={20} className="text-gray-300" />
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
            
            {activeTab === "settings" && (
              <div className="bg-white rounded-3xl p-12 border border-gray-100 shadow-sm text-center">
                 <LuSettings size={48} className="mx-auto text-gray-200 mb-6" />
                 <h2 className="text-xl font-bold text-gray-900 mb-2">Account Settings</h2>
                 <p className="text-gray-500 mb-8">Security and preference settings are coming soon.</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Profile;