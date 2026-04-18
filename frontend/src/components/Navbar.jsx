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
          ? "text-orange-100 border-orange-200"
          : "text-white border-transparent hover:text-orange-200 hover:border-orange-200/50"
      }`}
    >
      {children}
    </Link>
  );

  return (
    <nav className="bg-gradient-to-r from-green-800 to-green-700 text-white shadow-md sticky top-0 z-50">
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

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <div className="flex space-x-6">
              <NavLink to="/">{t.home || "Home"}</NavLink>
              <NavLink to="/products">{t.products || "Products"}</NavLink>
            </div>

            <div className="h-6 w-px bg-green-600"></div>

            <div className="flex items-center space-x-6">
              {user ? (
                <>
                  <NavLink to="/orders">{t.orders || "Orders"}</NavLink>
                  <NavLink to="/profile">Profile</NavLink>
                  {user.role === "admin" && (
                    <NavLink to="/admin/dashboard">Admin Panel</NavLink>
                  )}
                  <button
                    onClick={handleLogout}
                    className="text-sm font-semibold border border-white/40 rounded-full px-4 py-1.5 hover:bg-white hover:text-green-800 transition-all duration-300"
                  >
                    {t.logout || "Logout"}
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="text-sm font-semibold bg-white text-green-800 rounded-full px-5 py-2 hover:bg-orange-50 shadow-sm transition-all duration-300 hover:-translate-y-0.5"
                >
                  {t.login || "Login"}
                </Link>
              )}
              
              <LanguageToggle lang={lang} setLang={setLang} />

              <Link
                to="/cart"
                className="relative flex items-center p-2 text-white hover:text-orange-200 transition-colors"
                title={t.cart || "Cart"}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-orange-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full shadow-sm border border-green-800 shrink-0 min-w[18px] text-center">
                    {totalItems > 99 ? '99+' : totalItems}
                  </span>
                )}
              </Link>
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
          <div className="px-4 pt-2 pb-6 space-y-1 flex flex-col">
            <NavLink to="/">{t.home || "Home"}</NavLink>
            <NavLink to="/products">{t.products || "Products"}</NavLink>
            {user ? (
              <>
                <NavLink to="/orders">{t.orders || "Orders"}</NavLink>
                <NavLink to="/profile">Profile</NavLink>
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
  );
};

export default Navbar;