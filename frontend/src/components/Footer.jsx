import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-green-900 border-t-8 border-emerald-500 pt-16 pb-8 text-green-100 font-sans mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

          {/* Brand & About */}
          <div className="flex flex-col">
            <Link to="/" className="flex items-center space-x-2 mb-6 cursor-pointer group">
              <span className="text-3xl filter group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.5)] transition duration-300">🌾</span>
              <span className="font-extrabold text-2xl tracking-tight text-white">Shree Sanatan</span>
            </Link>
            <p className="text-sm text-green-200/80 leading-relaxed mb-6 font-medium">
              Your trusted marketplace for premium agricultural supplies, traditional goods, and pure spiritual essentials directly sourced from authentic farms and artisans.
            </p>
            <div className="flex space-x-4">
              {/* Mock Social Icons */}
              <a href="#" className="w-10 h-10 rounded-full bg-green-800 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-colors text-white shadow-sm">
                <span className="sr-only">Facebook</span>
                f
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-green-800 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-colors text-white shadow-sm">
                <span className="sr-only">Twitter</span>
                t
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-green-800 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-colors text-white shadow-sm">
                <span className="sr-only">Instagram</span>
                in
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6 tracking-wide uppercase">Quick Links</h3>
            <ul className="space-y-4">
              <li><Link to="/" className="text-sm font-medium hover:text-emerald-400 transition-colors flex items-center"><span className="mr-2 text-green-600">▪</span> Home</Link></li>
              <li><Link to="/products" className="text-sm font-medium hover:text-emerald-400 transition-colors flex items-center"><span className="mr-2 text-green-600">▪</span> All Products</Link></li>
              <li><Link to="/login" className="text-sm font-medium hover:text-emerald-400 transition-colors flex items-center"><span className="mr-2 text-green-600">▪</span> My Account</Link></li>
              <li><Link to="/orders" className="text-sm font-medium hover:text-emerald-400 transition-colors flex items-center"><span className="mr-2 text-green-600">▪</span> Track Order</Link></li>
            </ul>
          </div>

          {/* Customer Support */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6 tracking-wide uppercase">Support</h3>
            <ul className="space-y-4">
              <li><Link to="/shipping" className="text-sm font-medium hover:text-emerald-400 transition-colors flex items-center"><span className="mr-2 text-green-600">▪</span> Shipping Policy</Link></li>
              <li><Link to="/returns" className="text-sm font-medium hover:text-emerald-400 transition-colors flex items-center"><span className="mr-2 text-green-600">▪</span> Returns & Refunds</Link></li>
              <li><Link to="/bulk" className="text-sm font-medium hover:text-emerald-400 transition-colors flex items-center"><span className="mr-2 text-green-600">▪</span> Bulk Orders</Link></li>
              <li><Link to="/contact" className="text-sm font-medium hover:text-emerald-400 transition-colors flex items-center"><span className="mr-2 text-green-600">▪</span> Contact Us</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6 tracking-wide uppercase">Contact Info</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <span className="text-emerald-400 mt-1 mr-3 flex-shrink-0">📍</span>
                <span className="text-sm font-medium">123 Agriculture Market Yard, District Centre, State 400001</span>
              </li>
              <li className="flex items-center">
                <span className="text-emerald-400 mr-3 flex-shrink-0">📞</span>
                <span className="text-sm font-medium font-mono">+91 98765 43210</span>
              </li>
              <li className="flex items-center">
                <span className="text-emerald-400 mr-3 flex-shrink-0">✉️</span>
                <span className="text-sm font-medium">support@shreesanatan.com</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Global Bottom Bar */}
        <div className="border-t border-green-800/50 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-xs text-green-400 font-medium">
            &copy; {new Date().getFullYear()} Shree Sanatan Traders. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <a href="#" className="text-xs text-green-400 hover:text-white transition">Privacy Policy</a>
            <a href="#" className="text-xs text-green-400 hover:text-white transition">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
