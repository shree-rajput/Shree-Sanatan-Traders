import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import {
  LuLayoutDashboard,
  LuPackage,
  LuSettings,
  LuCreditCard,
  LuClipboardList,
  LuUsers,
  LuTruck,
  LuChartBarBig,
  LuSettings2
} from "react-icons/lu";

const AdminLayout = () => {
  const location = useLocation();

  const links = [
    { name: "Dashboard", path: "/admin/dashboard", icon: LuLayoutDashboard },
    { name: "Products", path: "/admin/products", icon: LuPackage },
    { name: "Inventory", path: "/admin/inventory", icon: LuSettings },
    { name: "Billing", path: "/admin/billing", icon: LuCreditCard },
    { name: "Orders", path: "/admin/orders", icon: LuClipboardList },
    { name: "Customers", path: "/admin/customers", icon: LuUsers },
    { name: "Suppliers", path: "/admin/suppliers", icon: LuTruck },
    { name: "Reports", path: "/admin/reports", icon: LuChartBarBig },
    { name: "Settings", path: "/admin/settings", icon: LuSettings2 },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row font-sans">
      {/* Sidebar */}
      <aside className="w-full md:w-72 bg-[#0a2e1f] text-white shrink-0 shadow-2xl z-10 sticky top-0 h-screen overflow-y-auto">
        <div className="p-8 border-b border-white/10">
          <h2 className="text-2xl font-black tracking-tight text-white flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
               <LuPackage size={20} className="text-[#0a2e1f]" />
            </div>
            SST Admin
          </h2>
          <p className="text-xs text-emerald-400/60 font-bold uppercase tracking-widest mt-2">
            Management Portal
          </p>
        </div>

        <nav className="p-6 space-y-2">
          {links.map((link) => {
            const isActive = location.pathname === link.path;
            const Icon = link.icon;

            return (
              <Link
                key={link.name}
                to={link.path}
                className={`flex items-center space-x-3 px-5 py-3.5 rounded-2xl font-semibold transition-all duration-300 ${isActive
                  ? "bg-emerald-500 text-[#0a2e1f] shadow-lg shadow-emerald-500/20 translate-x-1"
                  : "text-emerald-100/50 hover:bg-white/5 hover:text-white"
                  }`}
              >
                <Icon size={20} />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto p-6">
          <div className="bg-white/5 rounded-3xl p-5 border border-white/10">
            <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest mb-1">System Status</p>
            <div className="flex items-center gap-2">
               <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
               <span className="text-xs font-bold text-white">Live Production</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 w-full bg-[#f8faf9] min-h-screen">
        <div className="p-6 sm:p-8 md:p-10 lg:p-12 max-w-[1600px] mx-auto">
           <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
