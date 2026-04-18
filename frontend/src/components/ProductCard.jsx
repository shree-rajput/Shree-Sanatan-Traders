import React, { memo, useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { translations } from "../utils/translations";

const ProductCard = ({ product, lang = "en" }) => {
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);
  const t = translations[lang] || translations["en"];

  // ✅ FIXED DATA MAPPING
  const variant = product.variants?.[0];
  const imageUrl = product.images?.[0] || "/box1.png";
  const price = variant?.price || 0;
  const unit = variant?.unit || "1 Pc";

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full border border-gray-100 hover:border-emerald-200 hover:-translate-y-1 relative">

      {/* Status Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
        {variant?.stock < 10 && variant?.stock > 0 && (
          <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">
            {lang === 'en' ? 'Low Stock' : 'कम स्टॉक'}
          </span>
        )}
        {product.isFeatured && (
          <span className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">
            {t.featured}
          </span>
        )}
      </div>

      {/* Image */}
      <div className="relative block aspect-square overflow-hidden bg-gray-50 flex items-center justify-center p-6 group/img cursor-pointer">
        <Link to={`/product/${product._id}`} className="absolute inset-0 z-0"></Link>

        <img
          src={imageUrl}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-contain transition-transform duration-700 group-hover/img:scale-110 relative z-10 pointer-events-none"
        />

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 z-20 flex items-center justify-center pointer-events-none">
          <Link
            to={`/product/${product._id}`}
            className="pointer-events-auto translate-y-4 group-hover/img:translate-y-0 transition-transform duration-300 bg-white text-gray-900 font-bold px-6 py-2 rounded-full shadow-lg hover:bg-emerald-50 hover:text-emerald-600"
          >
            {t.viewDetails}
          </Link>
        </div>
      </div>

      {/* Info */}
      <div className="p-5 flex flex-col flex-1 bg-white relative">
        <Link to={`/product/${product._id}`} className="block mb-1">
          <h3 className="text-lg font-bold text-gray-900 line-clamp-1 group-hover:text-emerald-600 transition-colors">
            {product.name}
          </h3>
        </Link>

        <p className="text-xs text-gray-400 capitalize mb-3 font-medium">
          {product.category || "General"} • {unit}
        </p>

        {/* Footer */}
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
              {t.price}
            </span>
            <span className="text-xl font-black text-gray-900">
              ₹{price}
            </span>
          </div>

          <button
            onClick={handleAddToCart}
            disabled={isAdded}
            className={`flex items-center justify-center font-bold px-5 py-2.5 rounded-xl transition-all duration-300 shadow-sm ${isAdded
                ? "bg-green-500 text-white shadow-green-200"
                : "bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white hover:shadow-emerald-200"
              }`}
          >
            {isAdded ? (t.added || "Added ✓") : (t.addToCart || "+ Add")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default memo(ProductCard);