import React from "react";
import { Link } from "react-router-dom";
import { LuFacebook, LuTwitter, LuInstagram, LuMail, LuPhone, LuMapPin, LuChevronRight } from "react-icons/lu";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-400 py-16 px-6 mt-20 border-t border-gray-800">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        
        {/* Brand */}
        <div>
          <Link to="/" className="text-2xl font-bold text-white mb-6 block">
            Sheshanathan <span className="text-green-500">Traders</span>
          </Link>
          <p className="text-sm leading-relaxed mb-8 max-w-xs">
            Professional agricultural supplies for modern farming. Quality seeds, tools, and fertilizers delivered to your doorstep.
          </p>
          <div className="flex gap-4">
            <a href="#" className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center hover:bg-green-600 hover:text-white transition-all"><LuFacebook size={18} /></a>
            <a href="#" className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center hover:bg-green-600 hover:text-white transition-all"><LuTwitter size={18} /></a>
            <a href="#" className="w-10 h-10 bg-gray-800 rounded-xl flex items-center justify-center hover:bg-green-600 hover:text-white transition-all"><LuInstagram size={18} /></a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-6">Quick Links</h4>
          <ul className="space-y-3">
            <li><Link to="/" className="hover:text-green-500 transition-colors flex items-center gap-2"><LuChevronRight size={14} /> Home</Link></li>
            <li><Link to="/products" className="hover:text-green-500 transition-colors flex items-center gap-2"><LuChevronRight size={14} /> Shop Products</Link></li>
            <li><Link to="/orders" className="hover:text-green-500 transition-colors flex items-center gap-2"><LuChevronRight size={14} /> Track Orders</Link></li>
            <li><Link to="/profile" className="hover:text-green-500 transition-colors flex items-center gap-2"><LuChevronRight size={14} /> My Profile</Link></li>
          </ul>
        </div>

        {/* Categories */}
        <div>
          <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-6">Support</h4>
          <ul className="space-y-3">
            <li><Link to="#" className="hover:text-green-500 transition-colors flex items-center gap-2"><LuChevronRight size={14} /> Shipping Policy</Link></li>
            <li><Link to="#" className="hover:text-green-500 transition-colors flex items-center gap-2"><LuChevronRight size={14} /> Returns & Refunds</Link></li>
            <li><Link to="#" className="hover:text-green-500 transition-colors flex items-center gap-2"><LuChevronRight size={14} /> Bulk Orders</Link></li>
            <li><Link to="#" className="hover:text-green-500 transition-colors flex items-center gap-2"><LuChevronRight size={14} /> Contact Us</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-6">Contact Info</h4>
          <ul className="space-y-4">
            <li className="flex gap-3 text-sm">
              <LuMapPin className="text-green-500 shrink-0" size={18} />
              <span>Bamandi, Kargoon District, Madhya Pradesh, India</span>
            </li>
            <li className="flex gap-3 text-sm">
              <LuPhone className="text-green-500 shrink-0" size={18} />
              <span>+91 00000 00000</span>
            </li>
            <li className="flex gap-3 text-sm">
              <LuMail className="text-green-500 shrink-0" size={18} />
              <span>support@sheshanathan.com</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-gray-800 text-center md:text-left flex flex-col md:flex-row justify-between gap-4">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em]">&copy; {new Date().getFullYear()} Sheshanathan Traders. All rights reserved.</p>
        <div className="flex gap-6 justify-center">
           <Link to="#" className="text-[10px] font-bold uppercase tracking-[0.2em] hover:text-white transition">Privacy Policy</Link>
           <Link to="#" className="text-[10px] font-bold uppercase tracking-[0.2em] hover:text-white transition">Terms of Service</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
