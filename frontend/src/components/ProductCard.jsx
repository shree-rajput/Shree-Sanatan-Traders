import React, { memo, useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { LuPlus, LuCheck, LuEye } from "react-icons/lu";

const ProductCard = ({ product, lang = "en" }) => {
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const variant = product.variants?.[0];
  const imageUrl = product.images?.[0] || "/box1.png";
  const price = variant?.price || 0;
  const description = product.description || "High-quality farming equipment for modern agriculture.";

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className="group bg-white rounded-3xl p-4 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-transparent hover:border-emerald-100 flex flex-col h-full relative">
      
      {/* Quick Actions (Hover Only) */}
      <div className="absolute top-6 right-6 z-20 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
        <Link 
          to={`/product/${product._id}`}
          className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-gray-400 hover:text-emerald-600 shadow-lg hover:shadow-emerald-100 transition-all"
        >
          <LuEye size={18} />
        </Link>
      </div>

      {/* Image Container */}
      <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-gray-50 mb-4 group-hover:bg-emerald-50/30 transition-colors duration-500">
        <Link to={`/product/${product._id}`} className="absolute inset-0 z-10"></Link>
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-contain p-6 mix-blend-multiply group-hover:scale-110 transition-transform duration-700 ease-out"
        />
        
        {/* Category Tag */}
        <div className="absolute bottom-4 left-4">
           <span className="px-3 py-1 bg-white/80 backdrop-blur-md rounded-full text-[10px] font-bold text-emerald-700 uppercase tracking-wider shadow-sm">
             {product.category || "General"}
           </span>
        </div>
      </div>

      {/* Product Content */}
      <div className="flex flex-col flex-grow px-1">
        <div className="flex justify-between items-start gap-2 mb-2">
           <Link to={`/product/${product._id}`}>
             <h3 className="text-lg font-bold text-gray-900 group-hover:text-emerald-700 transition-colors line-clamp-1 leading-snug">
               {product.name}
             </h3>
           </Link>
        </div>
        
        <p className="text-xs text-gray-500 line-clamp-2 mb-4 leading-relaxed font-medium opacity-80">
          {description}
        </p>

        <div className="mt-auto flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Price</span>
            <span className="text-xl font-black text-gray-900 leading-none">₹{price.toLocaleString()}</span>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isAdded}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-lg ${
              isAdded 
              ? "bg-emerald-500 text-white shadow-emerald-200 rotate-[360deg]" 
              : "bg-[#f1fcf8] text-emerald-600 hover:bg-emerald-600 hover:text-white hover:shadow-emerald-100"
            }`}
          >
            {isAdded ? <LuCheck size={22} /> : <LuPlus size={22} />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default memo(ProductCard);