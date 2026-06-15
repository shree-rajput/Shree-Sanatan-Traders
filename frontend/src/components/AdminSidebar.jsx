import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LuLayoutDashboard,
  LuPackage,
  LuClipboardList,
  LuUsers,
  LuSettings,
  LuShoppingBag,
  LuChevronRight,
} from "react-icons/lu";

const AdminSidebar = ({ children }) => {
  const location = useLocation();

  const links = [
    { name: "Dashboard", path: "/admin/dashboard", icon: LuLayoutDashboard },
    { name: "Products", path: "/admin/products", icon: LuPackage },
    { name: "Orders", path: "/admin/orders", icon: LuClipboardList },
    { name: "Users", path: "/admin/users", icon: LuUsers },
    { name: "Settings", path: "/admin/settings", icon: LuSettings },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row font-sans">
      {/* Sidebar */}
      <aside className="w-full md:w-72 bg-gray-900 text-gray-400 shrink-0 border-r border-gray-800 z-10 flex flex-col">
        <div className="p-8 border-b border-gray-800">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-green-900/50 group-hover:scale-110 transition-transform">
              <LuShoppingBag size={24} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight leading-none">
                Admin <span className="text-green-500">Panel</span>
              </h2>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">
                Shree Sanatan Traders
              </p>
            </div>
          </Link>
        </div>

        <nav className="p-6 flex-1 space-y-1">
          {links.map((link) => {
            const isActive = location.pathname.startsWith(link.path);
            const Icon = link.icon;

            return (
              <Link
                key={link.name}
                to={link.path}
                className={`flex items-center justify-between px-4 py-3.5 rounded-xl font-bold text-sm transition-all group ${
                  isActive
                    ? "bg-green-600 text-white shadow-xl shadow-green-900/20"
                    : "hover:bg-gray-800 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    size={20}
                    className={
                      isActive
                        ? "text-white"
                        : "text-gray-500 group-hover:text-green-500"
                    }
                  />
                  <span>{link.name}</span>
                </div>
                {isActive && <LuChevronRight size={16} />}
              </Link>
            );
          })}
        </nav>

        <div className="p-8 border-t border-gray-800">
          <div className="bg-gray-800/50 rounded-2xl p-4 border border-gray-700/50">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">
              Status
            </p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-xs font-bold text-white">
                System Online
              </span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 w-full bg-gray-50 min-h-screen overflow-x-hidden">
        <div className="p-6 md:p-12 max-w-[1600px] mx-auto">{children}</div>
      </main>
    </div>
  );
};

export default AdminSidebar;
