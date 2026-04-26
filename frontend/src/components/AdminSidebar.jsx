import React from "react";
import { Link, useLocation } from "react-router-dom";
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

const AdminSidebar = ({ children }) => {
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
      <aside className="w-full md:w-64 bg-gray-900 text-white shrink-0 shadow-xl z-10">

        <div className="p-6 border-b border-gray-800">
          <h2 className="text-xl font-black tracking-widest text-orange-400 uppercase">
            Admin Panel
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Shree Sanatan Traders
          </p>
        </div>

        <nav className="p-4 space-y-2">
          {links.map((link) => {
            const isActive = location.pathname.startsWith(link.path);
            const Icon = link.icon;

            return (
              <Link
                key={link.name}
                to={link.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${isActive
                  ? "bg-orange-600 text-white shadow-md shadow-orange-900/20"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
                  }`}
              >
                <Icon size={18} />
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 w-full p-4 sm:p-8 md:p-10 lg:p-12 overflow-x-hidden">
        {children}
      </main>
    </div>
  );
};

export default AdminSidebar;