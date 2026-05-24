import React, { useState, useEffect } from "react";
import { 
  LuStore, 
  LuMapPin, 
  LuPhone, 
  LuMail, 
  LuBell, 
  LuSave,
  LuGlobe,
  LuShieldCheck,
  LuLoaderCircle,
  LuX,
  LuLock
} from "react-icons/lu";
import toast from "react-hot-toast";
import axios from "axios";

const AdminSettings = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwords, setPasswords] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  
  const [shopDetails, setShopDetails] = useState({
    shopName: "",
    address: "",
    phone: "",
    email: "",
    website: ""
  });

  const [notifications, setNotifications] = useState({
    lowStock: true,
    newOrders: true,
    weeklyReport: false
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data } = await axios.get("/api/users/profile");
      setShopDetails({
        shopName: data.shopName || "Shree Sanatan Traders",
        address: data.address || "",
        phone: data.phone || "",
        email: data.email || "",
        website: data.website || ""
      });
      if (data.notificationSettings) {
        setNotifications(data.notificationSettings);
      }
      setLoading(false);
    } catch (err) {
      toast.error("Failed to load settings");
      setLoading(false);
    }
  };

  const validateForm = () => {
    if (!shopDetails.shopName.trim()) {
      toast.error("Trade Name is required");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (shopDetails.email && !emailRegex.test(shopDetails.email)) {
      toast.error("Please enter a valid email address");
      return false;
    }
    if (shopDetails.phone && shopDetails.phone.length < 10) {
      toast.error("Please enter a valid phone number");
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    
    setSaving(true);
    try {
      await axios.put("/api/users/profile", {
        ...shopDetails,
        notificationSettings: notifications
      });
      toast.success("Settings updated successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update settings");
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      return toast.error("New passwords do not match");
    }
    if (passwords.newPassword.length < 6) {
      return toast.error("Password must be at least 6 characters");
    }

    try {
      setSaving(true);
      await axios.put("/api/users/change-password", {
        oldPassword: passwords.oldPassword,
        newPassword: passwords.newPassword
      });
      toast.success("Password updated successfully!");
      setShowPasswordModal(false);
      setPasswords({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update password");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <LuLoaderCircle className="animate-spin text-green-600" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50 dark:bg-gray-950">
      <div className="max-w-5xl space-y-10 pb-20">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">System Settings</h1>
        <p className="text-gray-500 dark:text-gray-400 font-medium mt-1">Configure your business details and preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          {/* Shop Details */}
          <div className="bg-white dark:bg-gray-900 p-8 md:p-10 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 transition-all">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-3">
              <div className="w-10 h-10 bg-green-50 dark:bg-green-900/30 rounded-xl flex items-center justify-center text-green-600 dark:text-green-400">
                 <LuStore size={20} />
              </div>
              Business Profile
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Trade Name</label>
                <input 
                  type="text" 
                  className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-800 border-transparent dark:border-gray-700 rounded-2xl focus:bg-white dark:focus:bg-gray-900 focus:ring-2 focus:ring-green-600 transition-all font-medium dark:text-white outline-none"
                  value={shopDetails.shopName}
                  onChange={(e) => setShopDetails({...shopDetails, shopName: e.target.value})}
                  placeholder="e.g. Shree Sanatan Traders"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Primary Contact</label>
                <input 
                  type="text" 
                  className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-800 border-transparent dark:border-gray-700 rounded-2xl focus:bg-white dark:focus:bg-gray-900 focus:ring-2 focus:ring-green-600 transition-all font-medium dark:text-white outline-none"
                  value={shopDetails.phone}
                  onChange={(e) => setShopDetails({...shopDetails, phone: e.target.value})}
                  placeholder="+91 00000 00000"
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Physical Address</label>
                <textarea 
                  rows="3"
                  className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-800 border-transparent dark:border-gray-700 rounded-2xl focus:bg-white dark:focus:bg-gray-900 focus:ring-2 focus:ring-green-600 transition-all font-medium resize-none dark:text-white outline-none"
                  value={shopDetails.address}
                  onChange={(e) => setShopDetails({...shopDetails, address: e.target.value})}
                  placeholder="Enter full business address"
                ></textarea>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Business Email</label>
                <div className="relative">
                  <LuMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input 
                    type="email" 
                    className="w-full pl-12 pr-5 py-4 bg-gray-50 dark:bg-gray-800 border-transparent dark:border-gray-700 rounded-2xl focus:bg-white dark:focus:bg-gray-900 focus:ring-2 focus:ring-green-600 transition-all font-medium dark:text-white outline-none"
                    value={shopDetails.email}
                    onChange={(e) => setShopDetails({...shopDetails, email: e.target.value})}
                    placeholder="contact@business.com"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Website URL</label>
                <div className="relative">
                  <LuGlobe className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input 
                    type="text" 
                    className="w-full pl-12 pr-5 py-4 bg-gray-50 dark:bg-gray-800 border-transparent dark:border-gray-700 rounded-2xl focus:bg-white dark:focus:bg-gray-900 focus:ring-2 focus:ring-green-600 transition-all font-medium dark:text-white outline-none"
                    value={shopDetails.website}
                    onChange={(e) => setShopDetails({...shopDetails, website: e.target.value})}
                    placeholder="www.business.com"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Security */}
          <div className="bg-white dark:bg-gray-900 p-8 md:p-10 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-50 dark:bg-amber-900/30 rounded-xl flex items-center justify-center text-amber-600 dark:text-amber-400">
                 <LuShieldCheck size={20} />
              </div>
              Security & Access
            </h3>
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 bg-gray-50 dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700">
               <div>
                  <p className="font-bold text-gray-900 dark:text-white">Administrator Password</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Manage your secure access credentials.</p>
               </div>
               <button 
                onClick={() => setShowPasswordModal(true)}
                className="px-6 py-3 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all active:scale-95"
               >
                  Change Password
               </button>
            </div>
          </div>
        </div>

        <div className="space-y-8">
           {/* Notifications */}
           <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <LuBell className="text-green-600 dark:text-green-400" size={20} />
                Alerts
              </h3>
              <div className="space-y-6">
                 {[
                   { id: 'lowStock', label: 'Low Stock Alerts', desc: 'Notify when items are below 10 units' },
                   { id: 'newOrders', label: 'New Order Alerts', desc: 'Get instant notification for new sales' },
                   { id: 'weeklyReport', label: 'Weekly Summary', desc: 'Receive sales reports every Monday' }
                 ].map((item) => (
                   <div key={item.id} className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                         <p className="text-sm font-bold text-gray-900 dark:text-white leading-none">{item.label}</p>
                         <p className="text-xs text-gray-400 dark:text-gray-500 mt-1.5">{item.desc}</p>
                      </div>
                      <button 
                        onClick={() => setNotifications({...notifications, [item.id]: !notifications[item.id]})}
                        className={`w-11 h-6 rounded-full transition-all relative ${notifications[item.id] ? 'bg-green-600' : 'bg-gray-200 dark:bg-gray-800'}`}
                      >
                         <div className={`absolute top-1 w-4 h-4 bg-white dark:bg-gray-300 rounded-full transition-all ${notifications[item.id] ? 'right-1' : 'left-1'}`}></div>
                      </button>
                   </div>
                 ))}
              </div>
           </div>

            {/* Save Button */}
            <div className="bg-green-600 p-8 rounded-3xl shadow-xl shadow-green-900/20 text-white relative overflow-hidden group">
               <div className="relative z-10">
                  <h3 className="text-lg font-bold mb-2">Finalize Settings</h3>
                  <p className="text-green-100 text-xs font-medium mb-6 leading-relaxed">Ensure all information is accurate before saving changes.</p>
                  <button 
                    onClick={handleSave}
                    disabled={saving}
                    className="w-full flex items-center justify-center gap-2 py-4 bg-white text-green-700 rounded-2xl font-bold text-sm shadow-lg hover:bg-green-50 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {saving ? <LuLoaderCircle className="animate-spin" size={18} /> : <LuSave size={18} />}
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
               </div>
               <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
            </div>
         </div>
       </div>
      </div>

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-900 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <LuLock className="text-amber-500" />
                  Change Password
                </h3>
                <button 
                  onClick={() => setShowPasswordModal(false)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
                >
                  <LuX size={20} className="text-gray-500" />
                </button>
              </div>

              <form onSubmit={handlePasswordChange} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Current Password</label>
                  <input 
                    type="password"
                    required
                    className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-800 border-transparent dark:border-gray-700 rounded-2xl focus:bg-white dark:focus:bg-gray-900 focus:ring-2 focus:ring-green-600 transition-all font-medium dark:text-white outline-none"
                    value={passwords.oldPassword}
                    onChange={(e) => setPasswords({...passwords, oldPassword: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">New Password</label>
                  <input 
                    type="password"
                    required
                    className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-800 border-transparent dark:border-gray-700 rounded-2xl focus:bg-white dark:focus:bg-gray-900 focus:ring-2 focus:ring-green-600 transition-all font-medium dark:text-white outline-none"
                    value={passwords.newPassword}
                    onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest ml-1">Confirm New Password</label>
                  <input 
                    type="password"
                    required
                    className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-800 border-transparent dark:border-gray-700 rounded-2xl focus:bg-white dark:focus:bg-gray-900 focus:ring-2 focus:ring-green-600 transition-all font-medium dark:text-white outline-none"
                    value={passwords.confirmPassword}
                    onChange={(e) => setPasswords({...passwords, confirmPassword: e.target.value})}
                  />
                </div>
                <button 
                  type="submit"
                  disabled={saving}
                  className="w-full py-4 bg-green-600 text-white rounded-2xl font-bold shadow-lg shadow-green-900/20 hover:bg-green-700 transition-all active:scale-[0.98] disabled:opacity-70 mt-4"
                >
                  {saving ? "Updating..." : "Update Password"}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminSettings;
