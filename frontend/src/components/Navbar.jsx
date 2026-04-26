import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import LanguageToggle from "./LanguageToggle";
import { 
  LuSearch, 
  LuUser, 
  LuShoppingCart, 
  LuChevronDown, 
  LuMapPin, 
  LuPhone, 
  LuTruck,
  LuMenu,
  LuX,
  LuLayoutGrid
} from "react-icons/lu";

const CATEGORIES = ["Trailers", "Irrigation", "Pumps", "Tools", "Seeds", "Fertilizers"];

const Navbar = ({ lang, setLang }) => {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState("");
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const categoryRef = useRef(null);
  const userRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (categoryRef.current && !categoryRef.current.contains(event.target)) setIsCategoryOpen(false);
      if (userRef.current && !userRef.current.contains(event.target)) setIsUserMenuOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setIsMobileMenuOpen(false);
    }
  };

  const handleCategoryClick = (cat) => {
    navigate(`/products?category=${encodeURIComponent(cat)}`);
    setIsCategoryOpen(false);
    setIsMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className={`w-full sticky top-0 z-[100] transition-all duration-300 ${isScrolled ? "bg-white shadow-lg" : "bg-white"}`}>
      
      {/* 🔝 TOP UTILITY BAR */}
      <div className="hidden md:flex bg-[#0a2e1f] text-emerald-50/80 text-[11px] py-2 px-10 justify-between items-center font-bold tracking-widest uppercase">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 hover:text-white transition-colors cursor-default">
            <LuMapPin size={12} className="text-emerald-400" />
            <span>Kargoon, Madhya Pradesh</span>
          </div>
          <div className="flex items-center gap-2 hover:text-white transition-colors cursor-default">
            <LuPhone size={12} className="text-emerald-400" />
            <span>+91 98765 43210</span>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <LuTruck size={12} className="text-emerald-400" />
            <span>Express Agriculture Delivery</span>
          </div>
          <div className="h-3 w-[1px] bg-emerald-800"></div>
          <LanguageToggle lang={lang} setLang={setLang} />
        </div>
      </div>

      {/* 🧭 MAIN NAVIGATION */}
      <div className="max-w-[1440px] mx-auto px-4 md:px-10 py-4 flex items-center justify-between gap-8">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 shrink-0 group">
          <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-200 group-hover:rotate-12 transition-transform duration-500">
             <span className="text-white font-black text-xl leading-none">S</span>
          </div>
          <div className="hidden sm:flex flex-col">
            <span className="text-lg font-black text-gray-900 leading-none tracking-tight group-hover:text-emerald-700 transition-colors">SRI SANATAN</span>
            <span className="text-[10px] font-black text-emerald-600 tracking-[0.2em] mt-1">DHARMA TRADERS</span>
          </div>
        </Link>

        {/* Categories Dropdown & Search Combined */}
        <div className="flex-1 hidden md:flex items-center gap-4 max-w-2xl">
          <div className="relative" ref={categoryRef}>
            <button 
              onClick={() => setIsCategoryOpen(!isCategoryOpen)}
              className="flex items-center gap-2 px-5 py-2.5 bg-gray-50 hover:bg-gray-100 rounded-2xl text-sm font-bold text-gray-700 transition-all border border-transparent hover:border-gray-200"
            >
              <LuLayoutGrid size={18} className="text-emerald-600" />
              <span>Categories</span>
              <LuChevronDown size={14} className={`transition-transform duration-300 ${isCategoryOpen ? "rotate-180" : ""}`} />
            </button>

            {isCategoryOpen && (
              <div className="absolute top-full left-0 mt-3 w-64 bg-white rounded-3xl shadow-2xl border border-gray-100 p-3 animate-in fade-in slide-in-from-top-2 duration-300 z-50">
                <div className="grid grid-cols-1 gap-1">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => handleCategoryClick(cat)}
                      className="flex items-center justify-between px-4 py-3 hover:bg-emerald-50 rounded-2xl text-sm font-semibold text-gray-600 hover:text-emerald-700 transition-all text-left"
                    >
                      {cat}
                      <LuChevronDown size={14} className="-rotate-90 opacity-0 group-hover:opacity-100" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <form onSubmit={handleSearch} className="flex-1 relative group">
            <input 
              type="text" 
              placeholder="Search equipment, parts or tools..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-5 pr-12 py-2.5 bg-gray-50 border-transparent border focus:bg-white focus:border-emerald-200 rounded-2xl text-sm font-medium transition-all focus:outline-none focus:ring-4 focus:ring-emerald-500/5"
            />
            <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-600 transition-colors">
              <LuSearch size={20} />
            </button>
          </form>
        </div>

        {/* Action Icons */}
        <div className="flex items-center gap-2 md:gap-5">
          <button className="md:hidden p-2 text-gray-500 hover:text-emerald-600">
            <LuSearch size={24} />
          </button>

          {/* User Menu */}
          <div className="relative" ref={userRef}>
            <button 
              onClick={() => user ? setIsUserMenuOpen(!isUserMenuOpen) : navigate("/login")}
              className="flex items-center gap-2 p-2 hover:bg-emerald-50 rounded-2xl transition-all group"
            >
              <div className="w-10 h-10 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-300">
                <LuUser size={20} />
              </div>
              <div className="hidden lg:flex flex-col items-start leading-none">
                 <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Account</span>
                 <span className="text-xs font-bold text-gray-900">{user ? user.name.split(' ')[0] : "Login"}</span>
              </div>
            </button>

            {user && isUserMenuOpen && (
              <div className="absolute top-full right-0 mt-3 w-56 bg-white rounded-3xl shadow-2xl border border-gray-100 p-3 animate-in fade-in slide-in-from-top-2 duration-300 z-50">
                <div className="px-4 py-3 border-b border-gray-50 mb-2">
                   <p className="text-xs font-black text-gray-400 uppercase tracking-widest mb-1">Logged in as</p>
                   <p className="text-sm font-bold text-gray-900 truncate">{user.email}</p>
                </div>
                <Link to="/profile" className="flex items-center gap-3 px-4 py-3 hover:bg-emerald-50 rounded-2xl text-sm font-semibold text-gray-600 hover:text-emerald-700 transition-all">
                  <LuUser size={18} /> My Profile
                </Link>
                <Link to="/orders" className="flex items-center gap-3 px-4 py-3 hover:bg-emerald-50 rounded-2xl text-sm font-semibold text-gray-600 hover:text-emerald-700 transition-all">
                  <LuTruck size={18} /> Order History
                </Link>
                {user.role === 'admin' && (
                   <Link to="/admin/dashboard" className="flex items-center gap-3 px-4 py-3 bg-emerald-50 rounded-2xl text-sm font-bold text-emerald-700">
                      <LuLayoutGrid size={18} /> Admin Panel
                   </Link>
                )}
                <button 
                  onClick={() => { logout(); navigate("/login"); }}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 rounded-2xl text-sm font-bold text-red-600 transition-all mt-2"
                >
                  <LuX size={18} /> Sign Out
                </button>
              </div>
            )}
          </div>

          {/* Cart Icon */}
          <Link to="/cart" className="relative p-2 hover:bg-emerald-50 rounded-2xl transition-all group">
            <div className="w-10 h-10 flex items-center justify-center text-gray-600 group-hover:text-emerald-600 transition-colors">
              <LuShoppingCart size={24} />
            </div>
            {totalItems > 0 && (
              <span className="absolute top-1 right-1 bg-emerald-600 text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-white shadow-sm group-hover:scale-110 transition-transform">
                {totalItems}
              </span>
            )}
          </Link>

          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-gray-500"
          >
            {isMobileMenuOpen ? <LuX size={28} /> : <LuMenu size={28} />}
          </button>
        </div>
      </div>

      {/* 📱 MOBILE SEARCH & MENU */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-50 p-6 animate-in slide-in-from-top-4 duration-300">
          <form onSubmit={handleSearch} className="relative mb-6">
            <input 
              type="text" 
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-5 pr-12 py-3 bg-gray-50 rounded-2xl text-sm font-medium focus:outline-none"
            />
            <button type="submit" className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-600">
              <LuSearch size={22} />
            </button>
          </form>

          <nav className="flex flex-col gap-2">
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-3 rounded-2xl text-lg font-bold text-gray-900 hover:bg-emerald-50">Home</Link>
            <Link to="/products" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-3 rounded-2xl text-lg font-bold text-gray-900 hover:bg-emerald-50">Shop</Link>
            <div className="h-px bg-gray-50 my-2"></div>
            <p className="px-4 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">Categories</p>
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => handleCategoryClick(cat)} className="px-4 py-2 text-left font-semibold text-gray-600">{cat}</button>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Navbar;
