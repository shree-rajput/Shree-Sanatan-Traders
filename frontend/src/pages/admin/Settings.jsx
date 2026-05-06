import React, { useState } from "react";
import { 
  LuStore, 
  LuMapPin, 
  LuPhone, 
  LuMail, 
  LuBell, 
  LuSave,
  LuGlobe,
  LuShieldCheck
} from "react-icons/lu";
import toast from "react-hot-toast";

const AdminSettings = () => {
  const [shopDetails, setShopDetails] = useState({
    name: "Sheshanathan Traders",
    address: "Kargoon District, Bamandi, Madhya Pradesh",
    phone: "+91 98765 43210",
    email: "contact@sheshanathan.com",
    website: "www.sheshanathan.com"
  });

  const [notifications, setNotifications] = useState({
    lowStock: true,
    newOrders: true,
    weeklyReport: false
  });

  const handleSave = () => {
    toast.success("Settings updated successfully!");
  };

  return (
    <div className="max-w-5xl space-y-10 pb-20">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">System Settings</h1>
        <p className="text-gray-500 font-medium mt-1">Configure your business details and preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          {/* Shop Details */}
          <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-8 flex items-center gap-3">
              <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                 <LuStore size={20} />
              </div>
              Business Profile
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Trade Name</label>
                <input 
                  type="text" 
                  className="w-full px-5 py-4 bg-gray-50 border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-green-600 transition-all font-medium"
                  value={shopDetails.name}
                  onChange={(e) => setShopDetails({...shopDetails, name: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Primary Contact</label>
                <input 
                  type="text" 
                  className="w-full px-5 py-4 bg-gray-50 border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-green-600 transition-all font-medium"
                  value={shopDetails.phone}
                  onChange={(e) => setShopDetails({...shopDetails, phone: e.target.value})}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Physical Address</label>
                <textarea 
                  rows="3"
                  className="w-full px-5 py-4 bg-gray-50 border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-green-600 transition-all font-medium resize-none"
                  value={shopDetails.address}
                  onChange={(e) => setShopDetails({...shopDetails, address: e.target.value})}
                ></textarea>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Business Email</label>
                <div className="relative">
                  <LuMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input 
                    type="email" 
                    className="w-full pl-12 pr-5 py-4 bg-gray-50 border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-green-600 transition-all font-medium"
                    value={shopDetails.email}
                    onChange={(e) => setShopDetails({...shopDetails, email: e.target.value})}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Website URL</label>
                <div className="relative">
                  <LuGlobe className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                  <input 
                    type="text" 
                    className="w-full pl-12 pr-5 py-4 bg-gray-50 border-transparent rounded-2xl focus:bg-white focus:ring-2 focus:ring-green-600 transition-all font-medium"
                    value={shopDetails.website}
                    onChange={(e) => setShopDetails({...shopDetails, website: e.target.value})}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Security */}
          <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-8 flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
                 <LuShieldCheck size={20} />
              </div>
              Security & Access
            </h3>
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 bg-gray-50 rounded-2xl border border-gray-100">
               <div>
                  <p className="font-bold text-gray-900">Administrator Password</p>
                  <p className="text-sm text-gray-500 mt-1">Last changed 3 months ago</p>
               </div>
               <button className="px-6 py-3 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 transition-all">
                  Change Password
               </button>
            </div>
          </div>
        </div>

        <div className="space-y-8">
           {/* Notifications */}
           <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
                <LuBell className="text-green-600" size={20} />
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
                         <p className="text-sm font-bold text-gray-900 leading-none">{item.label}</p>
                         <p className="text-xs text-gray-400 mt-1.5">{item.desc}</p>
                      </div>
                      <button 
                        onClick={() => setNotifications({...notifications, [item.id]: !notifications[item.id]})}
                        className={`w-11 h-6 rounded-full transition-all relative ${notifications[item.id] ? 'bg-green-600' : 'bg-gray-200'}`}
                      >
                         <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${notifications[item.id] ? 'right-1' : 'left-1'}`}></div>
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
                   className="w-full flex items-center justify-center gap-2 py-4 bg-white text-green-700 rounded-2xl font-bold text-sm shadow-lg hover:bg-green-50 transition-all active:scale-95"
                 >
                   <LuSave size={18} />
                   Save Changes
                 </button>
              </div>
              <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;
