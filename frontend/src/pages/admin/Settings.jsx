import React, { useState } from "react";

import { 
  LuStore as Shop, 
  LuMapPin as MapPin, 
  LuPhone as Phone, 
  LuMail as Mail, 
  LuGlobe as Globe, 
  LuFileText as FileText, 
  LuSave as Save,
  LuPalette as Palette,
  LuBell as Bell
} from "react-icons/lu";
import toast from "react-hot-toast";

const AdminSettings = () => {
  const [shopDetails, setShopDetails] = useState({
    name: "Shree Sanatan Traders",
    address: "Kargoon District, Bamandi, Madhya Pradesh",
    phone: "+91 98765 43210",
    email: "contact@shreesanatan.com",
    website: "www.shreesanatan.com"
  });

  const [invoiceConfig, setInvoiceConfig] = useState({
    prefix: "SST-",
    startingNumber: "1001",
    footerText: "Thank you for your business!",
    taxRate: "0",
    showLogo: true
  });

  const handleSave = () => {
    toast.success("Settings saved successfully!");
  };

  return (
    <div className="max-w-4xl space-y-8 pb-20 animate-in fade-in duration-500">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Settings</h1>
          <p className="text-gray-500 font-medium">Configure your shop and system preferences</p>
        </div>

        {/* Shop Details */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
            <div className="p-2 bg-emerald-100 rounded-lg text-emerald-700">
               <MapPin size={20} />
            </div>
            Shop Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-xs font-black text-gray-400 uppercase ml-1">Shop Name</label>
              <input 
                type="text" 
                className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-600"
                value={shopDetails.name}
                onChange={(e) => setShopDetails({...shopDetails, name: e.target.value})}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-black text-gray-400 uppercase ml-1">Phone Number</label>
              <input 
                type="text" 
                className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-600"
                value={shopDetails.phone}
                onChange={(e) => setShopDetails({...shopDetails, phone: e.target.value})}
              />
            </div>
            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-black text-gray-400 uppercase ml-1">Full Address</label>
              <textarea 
                rows="3"
                className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-600 resize-none"
                value={shopDetails.address}
                onChange={(e) => setShopDetails({...shopDetails, address: e.target.value})}
              ></textarea>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-black text-gray-400 uppercase ml-1">Email</label>
              <input 
                type="email" 
                className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-600"
                value={shopDetails.email}
                onChange={(e) => setShopDetails({...shopDetails, email: e.target.value})}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-black text-gray-400 uppercase ml-1">Website</label>
              <input 
                type="text" 
                className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-600"
                value={shopDetails.website}
                onChange={(e) => setShopDetails({...shopDetails, website: e.target.value})}
              />
            </div>
          </div>
        </div>

        {/* Invoice Configuration */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
            <div className="p-2 bg-blue-100 rounded-lg text-blue-700">
               <FileText size={20} />
            </div>
            Invoice & Billing
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-xs font-black text-gray-400 uppercase ml-1">Invoice Prefix</label>
              <input 
                type="text" 
                className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-600"
                value={invoiceConfig.prefix}
                onChange={(e) => setInvoiceConfig({...invoiceConfig, prefix: e.target.value})}
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-black text-gray-400 uppercase ml-1">Next Invoice Number</label>
              <input 
                type="number" 
                className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-600"
                value={invoiceConfig.startingNumber}
                onChange={(e) => setInvoiceConfig({...invoiceConfig, startingNumber: e.target.value})}
              />
            </div>
            <div className="space-y-1 md:col-span-2">
              <label className="text-xs font-black text-gray-400 uppercase ml-1">Invoice Footer Text</label>
              <input 
                type="text" 
                className="w-full px-4 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-emerald-600"
                value={invoiceConfig.footerText}
                onChange={(e) => setInvoiceConfig({...invoiceConfig, footerText: e.target.value})}
              />
            </div>
          </div>
        </div>

        {/* Notifications & System */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
                <div className="p-2 bg-orange-100 rounded-lg text-orange-700">
                  <Bell size={20} />
                </div>
                Notifications
              </h3>
              <div className="space-y-4">
                 <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-gray-700">Low Stock Alerts</span>
                    <div className="w-10 h-5 bg-emerald-600 rounded-full relative"><div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div></div>
                 </div>
                 <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-gray-700">Daily Sales Summary</span>
                    <div className="w-10 h-5 bg-gray-200 rounded-full relative"><div className="absolute left-1 top-1 w-3 h-3 bg-white rounded-full"></div></div>
                 </div>
              </div>
           </div>

           <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-black text-gray-900 mb-6 flex items-center gap-2">
                <div className="p-2 bg-purple-100 rounded-lg text-purple-700">
                  <Palette size={20} />
                </div>
                Theme
              </h3>
              <div className="flex gap-4">
                 <div className="w-10 h-10 rounded-full bg-emerald-700 border-4 border-white shadow-md"></div>
                 <div className="w-10 h-10 rounded-full bg-orange-600"></div>
                 <div className="w-10 h-10 rounded-full bg-blue-700"></div>
                 <div className="w-10 h-10 rounded-full bg-gray-900"></div>
              </div>
           </div>
        </div>

        <div className="flex justify-end">
          <button 
            onClick={handleSave}
            className="flex items-center gap-2 px-10 py-4 bg-emerald-700 text-white rounded-2xl font-black shadow-xl shadow-emerald-100 hover:bg-green-800 transition-all"
          >
            <Save size={20} />
            Save Changes
          </button>
        </div>
      </div>

  );
};

export default AdminSettings;
