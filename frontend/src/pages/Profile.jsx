import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  LuUser,
  LuMapPin,
  LuPackage,
  LuLogOut,
  LuChevronRight,
  LuLoaderCircle,
  LuShieldCheck,
  LuSettings,
  LuBox,
  LuSprout,
  LuStore,
  LuPencil,
} from "react-icons/lu";

import { useAuth } from "../context/AuthContext";
import API from "../services/api";
import toast from "react-hot-toast";
import AddressManager from "../components/AddressManager";
import ProfileSettings from "../components/profile/ProfileSettings";
import ProfileSecurity from "../components/profile/ProfileSecurity";
// import BusinessDetails from "../components/profile/BusinessDetails";

const Profile = () => {
  const { user, login, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    avatar: user?.avatar || "",

    userType: user?.userType || "farmer",

    landSize: user?.landSize || "",
    crops: user?.crops?.join(", ") || "",
    irrigation: user?.irrigation || "",

    shopName: user?.shopName || "",
    businessType: user?.businessType || "",

    website: user?.website || "",
    address: user?.address || "",
  });

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const res = await API.get("/orders");
        setOrders(Array.isArray(res.data) ? res.data : res.data.orders || []);
      } catch (err) {
        console.error("Failed to fetch data");
        setOrders([]);
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchProfileData();
  }, [user]);

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      const dataToSubmit = {
        ...formData,
        crops: formData.crops
          .split(",")
          .map((c) => c.trim())
          .filter((c) => c !== ""),
      };

      const res = await API.put("/users/me", dataToSubmit);

      login(res.data, localStorage.getItem("token"));

      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile.");
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
    { id: "overview", name: "Personal", icon: LuUser },
    { id: "addresses", name: "Addresses", icon: LuMapPin },
    { id: "orders", name: "Orders", icon: LuPackage },
    { id: "settings", name: "Settings", icon: LuSettings },
    { id: "security", name: "Security", icon: LuShieldCheck },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 md:px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            <span className="text-green-600">Account</span>
          </h1>

          <p className="text-gray-500 mt-2">
            Manage your profile, addresses and orders
          </p>
        </div>

        <div className="grid lg:grid-cols-[300px_1fr] gap-8">
          {/* Sidebar */}
          <aside className="space-y-6">
            {/* User Card */}
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm text-center">
              <div className="relative w-24 h-24 mx-auto mb-5">
                <div className="w-full h-full rounded-3xl bg-green-100 text-green-700 flex items-center justify-center text-4xl font-bold shadow-md">
                  {user?.name?.[0]}
                </div>

                <button className="absolute -bottom-1 -right-1 p-2 bg-white rounded-xl border border-gray-200 shadow-md hover:text-green-600 transition">
                  <LuPencil size={14} />
                </button>
              </div>

              <h2 className="text-xl font-bold text-gray-900">{user?.name}</h2>

              <p className="text-xs uppercase tracking-widest text-gray-500 mt-1 font-semibold">
                {user?.userType || "User"}
              </p>

              <div className="mt-8 pt-6 border-t border-gray-100 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {orders.length}
                  </p>

                  <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">
                    Orders
                  </p>
                </div>

                <div className="border-l border-gray-100">
                  <p className="text-2xl font-bold text-green-600">
                    ₹
                    {orders
                      .reduce((s, o) => s + (o.totalPrice || 0), 0)
                      .toLocaleString()}
                  </p>

                  <p className="text-xs text-gray-500 uppercase tracking-widest mt-1">
                    Spent
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <nav className="bg-white rounded-3xl p-3 border border-gray-100 shadow-sm">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-sm font-semibold transition-all mb-2 ${
                    activeTab === tab.id
                      ? "bg-green-600 text-white shadow-md"
                      : "text-gray-600 hover:bg-gray-100 hover:text-green-600"
                  }`}
                >
                  <tab.icon size={18} />
                  {tab.name}
                </button>
              ))}

              <button
                onClick={() => {
                  logout();
                  navigate("/login");
                }}
                className="w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-sm font-semibold text-red-500 hover:bg-red-50 transition-all"
              >
                <LuLogOut size={18} />
                Logout
              </button>
            </nav>
          </aside>

          {/* Main Content */}
          <main className="bg-white rounded-3xl p-6 md:p-10 border border-gray-100 shadow-sm min-h-[600px]">
            {/* PERSONAL TAB */}
            {activeTab === "overview" && (
              <div className="space-y-10">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-gray-900">
                    Personal Details
                  </h3>

                  <LuShieldCheck className="text-green-600" size={24} />
                </div>

                <form
                  onSubmit={handleUpdate}
                  className="grid md:grid-cols-2 gap-6"
                >
                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-2">
                      Full Name
                    </label>

                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full px-5 py-4 rounded-2xl border border-gray-200 bg-gray-50 focus:border-green-500 focus:bg-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-600 mb-2">
                      Phone Number
                    </label>

                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="w-full px-5 py-4 rounded-2xl border border-gray-200 bg-gray-50 focus:border-green-500 focus:bg-white outline-none"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-600 mb-2">
                      Email Address
                    </label>

                    <input
                      type="email"
                      value={formData.email}
                      readOnly
                      className="w-full px-5 py-4 rounded-2xl border border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed"
                    />
                  </div>

                  <div className="md:col-span-2 pt-2">
                    <button
                      type="submit"
                      className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white rounded-2xl font-semibold transition"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* ADDRESSES */}
            {activeTab === "addresses" && <AddressManager />}

            {/* ORDERS */}
            {activeTab === "orders" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold text-gray-900">
                    Order History
                  </h3>

                  <LuPackage className="text-green-600" size={24} />
                </div>

                {orders.length === 0 ? (
                  <div className="text-center py-20">
                    <LuBox size={50} className="mx-auto text-gray-300 mb-5" />

                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      No orders yet
                    </h2>

                    <p className="text-gray-500 mb-8">
                      When you buy something, it will appear here.
                    </p>

                    <button
                      onClick={() => navigate("/products")}
                      className="px-8 py-3 bg-green-600 text-white rounded-2xl font-semibold hover:bg-green-700 transition"
                    >
                      Start Shopping
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((order) => (
                      <div
                        key={order._id}
                        onClick={() => navigate(`/orders/${order._id}`)}
                        className="p-6 bg-gray-50 rounded-2xl border border-gray-200 hover:border-green-400 transition cursor-pointer flex items-center justify-between"
                      >
                        <div className="flex items-center gap-5">
                          <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-green-600 shadow-sm">
                            <LuPackage size={26} />
                          </div>

                          <div>
                            <p className="text-xs text-gray-500 mb-1">
                              ID: #{order._id.slice(-8)}
                            </p>

                            <h4 className="text-xl font-bold text-gray-900">
                              ₹{(order.totalPrice || 0).toLocaleString()}
                            </h4>

                            <p className="text-sm text-gray-500">
                              {new Date(order.createdAt).toLocaleDateString(
                                undefined,
                                {
                                  dateStyle: "long",
                                },
                              )}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-5">
                          <span
                            className={`px-4 py-2 rounded-full text-xs font-bold uppercase ${
                              order.status === "delivered"
                                ? "bg-green-100 text-green-700"
                                : order.status === "cancelled"
                                  ? "bg-red-100 text-red-700"
                                  : "bg-blue-100 text-blue-700"
                            }`}
                          >
                            {order.status || "Processing"}
                          </span>

                          <LuChevronRight size={22} className="text-gray-400" />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* SETTINGS */}
            {activeTab === "settings" && (
              <ProfileSettings
                user={user}
                refreshProfile={() => window.location.reload()}
              />
            )}

            {/* SECURITY */}
            {activeTab === "security" && <ProfileSecurity />}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Profile;
