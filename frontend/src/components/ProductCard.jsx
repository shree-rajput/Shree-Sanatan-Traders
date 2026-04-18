import React, { memo } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { translations } from "../utils/translations";

const ProductCard = ({ product, lang = "en" }) => {
  const { addToCart } = useCart();
  const t = translations[lang] || translations["en"];

  // Default fallback image if product has no image
  const imageUrl = product.image?.[0] || "/box1.png";

  return (
    <div className="group bg-white rounded-2xl border border-orange-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col h-full hover:-translate-y-1">
      {/* Product Image Section */}
      <Link to={`/products/${product._id}`} className="relative block aspect-[4/3] overflow-hidden bg-gray-100">
        <img
          src={imageUrl}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Optional Overlay on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300"></div>
      </Link>

      {/* Product Info Section */}
      <div className="p-5 flex flex-col flex-1">
        <Link to={`/products/${product._id}`} className="block mb-2">
          <h3 className="text-xl font-bold text-gray-900 line-clamp-1 group-hover:text-orange-600 transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-1">
          {product.description || "Premium quality product from Shree Sanatan Traders."}
        </p>

        {/* Footer: Price and Action */}
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
          <div className="flex flex-col">
            <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Price</span>
            <span className="text-xl font-black text-orange-600">₹{product.price}</span>
          </div>
          
          <button
            onClick={() => addToCart(product)}
            className="flex items-center justify-center bg-orange-100 text-orange-700 font-bold px-4 py-2.5 rounded-xl hover:bg-orange-600 hover:text-white transition-colors duration-300 focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 shadow-sm"
          >
            {t.addToCart || "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default memo(ProductCard);