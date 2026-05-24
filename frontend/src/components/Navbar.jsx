import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { useLanguage } from "../context/LanguageContext";
import { useTheme } from "../context/ThemeContext";
import { LuShoppingCart, LuMenu, LuX, LuUser, LuShoppingBag, LuSun, LuMoon } from "react-icons/lu";
import LanguageToggle from "./LanguageToggle";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const { t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: t("home"), path: "/" },
    { name: t("shop") || "Products", path: "/products" },
    { name: t("my_orders"), path: "/orders" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm transition-all">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-green-100 group-hover:bg-amber-500 transition-colors">
              <LuShoppingBag size={24} />
            </div>
            <span className="text-xl font-bold tracking-tight text-gray-900">
              Sheshanathan <span className="text-green-600">Traders</span>
            </span>
          </Link>
          <div className="hidden lg:block h-6 w-px bg-gray-100 mx-2"></div>
          <div className="hidden lg:block">
            <LanguageToggle />
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className="text-sm font-semibold text-gray-600 hover:text-green-600 transition-colors"
            >
              {link.name}
            </Link>
          ))}

          <div className="flex items-center gap-6 ml-4 border-l pl-8 border-gray-100">
            {/* User */}
            {user ? (
              <div className="flex items-center gap-4">
                <Link to="/profile" className="flex items-center gap-2 text-sm font-bold text-gray-900 bg-gray-50 px-4 py-2 rounded-full hover:bg-green-50 transition-all">
                  <LuUser size={18} className="text-green-600" />
                  {user.name}
                </Link>
                <button
                  onClick={logout}
                  className="text-xs font-bold text-gray-400 hover:text-red-500 uppercase tracking-widest"
                >
                  {t("sign_out")}
                </button>
              </div>
            ) : (
              <Link to="/login" className="text-sm font-bold text-green-600 hover:text-amber-600 transition-colors">
                {t("login")}
              </Link>
            )}

            {/* Cart */}
            <Link to="/cart" className="relative p-2 bg-green-50 text-green-700 rounded-xl hover:bg-amber-100 hover:text-amber-800 transition-all group">
              <LuShoppingCart size={22} className="group-hover:scale-110 transition-transform" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-amber-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full border-2 border-white shadow-sm">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        </nav>

        {/* Mobile Toggle */}
        <div className="flex items-center gap-3 md:hidden">
          <LanguageToggle />
          <Link to="/cart" className="relative p-2 bg-green-50 text-green-700 rounded-xl">
            <LuShoppingCart size={22} />
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-amber-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full">
                {totalItems}
              </span>
            )}
          </Link>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-gray-600 hover:bg-gray-50 rounded-xl"
          >
            {isMobileMenuOpen ? <LuX size={24} /> : <LuMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-50 p-6 space-y-4 animate-in slide-in-from-top duration-300">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-lg font-bold text-gray-900 hover:text-green-600 transition-colors"
            >
              {link.name}
            </Link>
          ))}
          <div className="pt-4 border-t border-gray-50">
            {user ? (
              <div className="space-y-4">
                <Link to="/profile" className="block text-lg font-bold text-gray-900">{user.name}</Link>
                <button onClick={logout} className="text-red-500 font-bold">Logout</button>
              </div>
            ) : (
              <Link to="/login" className="block text-lg font-bold text-green-600">Login</Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;