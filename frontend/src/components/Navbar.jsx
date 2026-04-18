import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import LanguageToggle from "./LanguageToggle";
import { translations } from "../utils/translations";

const Navbar = ({ lang, setLang }) => {
  const t = translations[lang] || translations["en"];
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setMobileMenuOpen(false);
    }
  };

  const handleLogout = () => { 
    logout(); 
    navigate("/login"); 
    setMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  const NavLink = ({ to, children }) => (
    <Link
      to={to}
      onClick={() => setMobileMenuOpen(false)}
      className={`font-medium text-sm transition-colors duration-200 py-2 border-b-2 ${
        isActive(to)
          ? "text-emerald-100 border-emerald-200"
          : "text-white border-transparent hover:text-emerald-200 hover:border-emerald-200/50"
      }`}
    >
      {children}
    </Link>
  );

  return (
    <header className="sticky top-0 z-50">
      {/* 🚀 Top Announcement Header */}
      <div className="bg-emerald-600 text-white text-xs sm:text-sm py-1.5 px-4 font-semibold shadow-inner">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
             <span className="hidden sm:inline-block">📞 +91 98765 43210</span>
             <span className="hidden sm:inline-block">✉️ support@shreesanatan.com</span>
          </div>
          <p className="flex-1 text-center truncate">
            🎉 Special Festive Offer: <span className="text-emerald-100">Free Shipping</span> on orders over ₹500!
          </p>
          <div className="hidden md:flex items-center">
            <Link to="/products" className="hover:text-emerald-100 underline underline-offset-2 transition">
              {t.exploreShop}
            </Link>
          </div>
        </div>
      </div>

      {/* Primary Navigation */}
      <nav className="bg-gradient-to-r from-green-800 to-green-700 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center space-x-2 group shrink-0">
            <span className="text-3xl filter group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] transition duration-300">
              🌾
            </span>
            <span className="font-extrabold text-xl sm:text-2xl tracking-tight hidden sm:block">
              {t.appName || "Shree Sanatan"}
            </span>
          </Link>

          {/* Desktop Navigation & Search */}
          <div className="hidden md:flex flex-1 items-center space-x-6 px-8">
            <div className="flex space-x-6 shrink-0">
              <NavLink to="/">{t.home || "Home"}</NavLink>
              <NavLink to="/products">{t.products || "Products"}</NavLink>
            </div>

            {/* Global Search Bar */}
            <form onSubmit={handleSearch} className="flex-1 max-w-md relative">
              <input
                type="text"
                placeholder={t.search}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-green-900/40 text-white placeholder-green-200/70 border border-green-600/50 rounded-full py-1.5 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:border-transparent transition-all shadow-inner text-sm"
              />
              <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-green-200 hover:text-white p-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </button>
            </form>

            <div className="h-6 w-px bg-green-500/50 shrink-0"></div>

            <div className="flex items-center space-x-6 relative">
              
              {/* Language Selector */}
              <LanguageToggle lang={lang} setLang={setLang} />

              {/* Cart Icon with Live Count */}
              <Link
                to="/cart"
                className="relative flex items-center p-2 text-white hover:text-emerald-200 transition-colors"
                title={t.cart || "Cart"}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-emerald-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm border border-green-800 shrink-0 min-w[18px] text-center">
                    {totalItems > 99 ? '99+' : totalItems}
                  </span>
                )}
              </Link>

              {/* User Avatar Dropdown (Premium UX) */}
              {user ? (
                <div className="relative">
                  <button 
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                    onBlur={() => setTimeout(() => setDropdownOpen(false), 200)}
                    className="flex items-center space-x-2 focus:outline-none"
                  >
                    <div className="w-9 h-9 rounded-full bg-emerald-50 flex items-center justify-center border-2 border-green-500 hover:border-emerald-400 transition-colors shadow-sm">
                      <span className="text-emerald-600 font-bold text-sm uppercase">
                        {user.name ? user.name.charAt(0) : "U"}
                      </span>
                    </div>
                  </button>
                  
                  {/* Dropdown Menu */}
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-3 w-48 bg-white rounded-xl shadow-xl py-2 z-50 border border-gray-100 origin-top-right animate-in fade-in zoom-in-95 duration-200">
                      <div className="px-4 py-3 border-b border-gray-50 flex flex-col">
                        <span className="text-sm text-gray-900 font-bold max-w-full truncate">{user.name}</span>
                        <span className="text-xs text-gray-500 truncate">{user.email}</span>
                      </div>
                      
                      <div className="py-2">
                        <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors">{t.profile}</Link>
                        <Link to="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors">{t.orders}</Link>
                        {user.role === "admin" && (
                          <Link to="/admin/dashboard" className="block px-4 py-2 text-sm text-emerald-600 font-bold hover:bg-emerald-50 transition-colors">Admin Dashboard</Link>
                        )}
                      </div>
                      
                      <div className="border-t border-gray-50 py-1">
                        <button
                          onClick={handleLogout}
                          className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors font-medium"
                        >
                          Sign out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="text-sm font-semibold bg-white text-green-800 rounded-full px-5 py-2 hover:bg-emerald-50 shadow-sm transition-all duration-300 hover:-translate-y-0.5 whitespace-nowrap"
                >
                  {t.login || "Sign In"}
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-4">
            <Link
              to="/cart"
              className="relative flex items-center p-2 text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-green-800 shrink-0">
                  {totalItems}
                </span>
              )}
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-white hover:text-orange-200 focus:outline-none"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-green-800 border-t border-green-700 shadow-inner">
          <div className="px-4 pt-4 pb-6 space-y-1 flex flex-col">
            
            <form onSubmit={handleSearch} className="mb-4 relative">
              <input
                type="text"
                placeholder={t.search}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-green-900/60 text-white placeholder-green-300 border border-green-600 rounded-lg py-2 pl-3 pr-10 focus:outline-none focus:ring-2 focus:ring-emerald-300 text-sm"
              />
              <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-green-300 p-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                </svg>
              </button>
            </form>

            <NavLink to="/">{t.home || "Home"}</NavLink>
            <NavLink to="/products">{t.products || "Products"}</NavLink>
            {user ? (
              <>
                <NavLink to="/orders">{t.orders}</NavLink>
                <NavLink to="/profile">{t.profile}</NavLink>
                {user.role === "admin" && (
                  <NavLink to="/admin/dashboard">Admin Panel</NavLink>
                )}
                <button
                  onClick={handleLogout}
                  className="mt-4 text-left font-medium text-sm text-red-200 hover:text-red-100 py-2 border-b-2 border-transparent"
                >
                  {t.logout || "Logout"}
                </button>
              </>
            ) : (
              <NavLink to="/login">{t.login || "Login"}</NavLink>
            )}
            <div className="pt-4 border-t border-green-700 mt-2">
              <LanguageToggle lang={lang} setLang={setLang} />
            </div>
          </div>
        </div>
      )}
    </nav>
    </header>
  );
};

export default Navbar;