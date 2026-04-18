import React from "react";
import { Link, useLocation } from "react-router-dom";

const AdminSidebar = ({ children }) => {
  const location = useLocation();

  const links = [
    { name: "Dashboard", path: "/admin/dashboard", icon: "📊" },
    { name: "Products", path: "/admin/products", icon: "📦" },
    { name: "Orders", path: "/admin/orders", icon: "📝" },
    { name: "Users", path: "/admin/users", icon: "👥" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row font-sans">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-gray-900 text-white shrink-0 shadow-xl z-10 md:min-h-[calc(100vh-64px)]">
        <div className="p-6 border-b border-gray-800">
          <h2 className="text-xl font-black tracking-widest text-orange-400 uppercase">Admin Panel</h2>
          <p className="text-xs text-gray-400 mt-1">Shree Sanatan Traders</p>
        </div>
        <nav className="p-4 space-y-2">
          {links.map((link) => {
            const isActive = location.pathname.includes(link.path);
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                  isActive 
                    ? "bg-orange-600 text-white shadow-md shadow-orange-900/20" 
                    : "text-gray-400 hover:bg-gray-800 hover:text-white"
                }`}
              >
                <span className="text-lg">{link.icon}</span>
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 w-full p-4 sm:p-8 md:p-10 lg:p-12 overflow-x-hidden">
        {children}
      </main>
    </div>
  );
};

export default AdminSidebar;
