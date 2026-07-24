import React from "react";
import { NavLink } from "react-router-dom";
import {
  LuBadgePercent,
  LuBell,
  LuBoxes,
  LuChartBar,
  LuHeadphones,
  LuLayoutDashboard,
  LuPackage,
  LuSettings,
  LuShoppingBag,
  LuStar,
  LuUsers,
  LuTrendingUp,
  LuScanLine,
  LuFileText,
  LuBadgeAlert,
} from "react-icons/lu";

export const adminLinks = [
  { name: "Dashboard", path: "/admin/dashboard", icon: LuLayoutDashboard },
  { name: "Products", path: "/admin/products", icon: LuPackage },
  { name: "Orders", path: "/admin/orders", icon: LuShoppingBag },
  { name: "Users", path: "/admin/users", icon: LuUsers },
  { name: "Inventory", path: "/admin/inventory", icon: LuBoxes },
  { name: "Low Stock", path: "/admin/low-stock", icon: LuBadgeAlert },
  { name: "Barcode Scanner", path: "/admin/barcode-scanner", icon: LuScanLine },
  { name: "Purchase Orders", path: "/admin/purchases", icon: LuFileText },
  { name: "AI Inventory", path: "/admin/ai-inventory", icon: LuTrendingUp },
  { name: "Analytics", path: "/admin/analytics", icon: LuChartBar },
  { name: "Notifications", path: "/admin/notifications", icon: LuBell },
  { name: "Coupons", path: "/admin/coupons", icon: LuBadgePercent },
  { name: "Reviews", path: "/admin/reviews", icon: LuStar },
  { name: "Support", path: "/admin/support", icon: LuHeadphones },
  { name: "Settings", path: "/admin/settings", icon: LuSettings },
];

const AdminSidebar = ({ onNavigate }) => (
  <aside className="flex h-full flex-col border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
    <div className="border-b border-gray-200 p-6 dark:border-gray-800">
      <NavLink to="/" className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-green-600 text-white shadow-lg shadow-green-600/20">
          {/* <LuShoppingBag size={23} /> */}
          <img
            src="/images/sst_logo.jpeg"
            alt="Logo"
            className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-green-100 group-hover:bg-amber-500 transition-colors"
          />
        </div>
        <div>
          <p className="text-lg font-black text-gray-900 dark:text-white">
            SST Admin
          </p>
          <p className="text-xs font-bold text-gray-400">Marketplace OS</p>
        </div>
      </NavLink>
    </div>
    <nav className="flex-1 space-y-1 overflow-y-auto p-4">
      {adminLinks.map((link) => (
        <NavLink
          key={link.path}
          to={link.path}
          onClick={onNavigate}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-black transition ${
              isActive
                ? "bg-green-600 text-white shadow-lg shadow-green-600/20"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-900 dark:hover:text-white"
            }`
          }
        >
          <link.icon size={18} />
          {link.name}
        </NavLink>
      ))}
    </nav>
  </aside>
);

export default AdminSidebar;
