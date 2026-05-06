import React, { memo, useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { LuPlus, LuCheck } from "react-icons/lu";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  const imageUrl = product.image || product.images?.[0] || "/box1.png";
  const price = product.price || product.variants?.[0]?.price || 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 hover:border-green-200 hover:shadow-xl hover:shadow-green-500/5 transition-all p-4 flex flex-col group">
      {/* Image */}
      <Link to={`/product/${product._id}`} className="aspect-square rounded-xl overflow-hidden bg-gray-50 mb-4 block">
        <img
          src={imageUrl}
          alt={product.name}
          className="w-full h-full object-contain p-6 group-hover:scale-105 transition-transform duration-500"
        />
      </Link>

      {/* Info */}
      <div className="flex-grow">
        <Link to={`/product/${product._id}`}>
          <h3 className="text-gray-900 font-bold hover:text-green-600 transition-colors line-clamp-1 mb-1">
            {product.name}
          </h3>
        </Link>
        <p className="text-gray-400 text-xs font-medium mb-4">{product.category || "General"}</p>
      </div>

      {/* Price & Action */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-50">
        <div className="flex flex-col">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Price</span>
          <span className="text-xl font-bold text-gray-900">₹{price.toLocaleString()}</span>
        </div>

        <button
          onClick={handleAddToCart}
          disabled={isAdded}
          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
            isAdded 
            ? "bg-amber-500 text-white shadow-lg shadow-amber-100 rotate-[360deg]" 
            : "bg-green-600 text-white shadow-lg shadow-green-100 hover:bg-green-700"
          }`}
        >
          {isAdded ? <LuCheck size={20} /> : <LuPlus size={20} />}
        </button>
      </div>
    </div>
  );
};

export default memo(ProductCard);