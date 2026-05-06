import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import { useCart } from "../context/CartContext";
import { LuShoppingCart, LuChevronLeft, LuCheck, LuArrowRight, LuMinus, LuPlus } from "react-icons/lu";
import toast from "react-hot-toast";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    API.get(`/products/${id}`)
      .then((res) => {
        setProduct(res.data);
      })
      .catch((err) => console.error("Error fetching product details:", err))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setIsAdded(true);
    toast.success("Added to cart!", { icon: '🛒' });
    setTimeout(() => setIsAdded(false), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-green-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-white p-6 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h2>
        <button onClick={() => navigate("/products")} className="text-green-600 font-bold flex items-center gap-2">
          <LuChevronLeft size={20} /> Back to Products
        </button>
      </div>
    );
  }

  const imageUrl = product.image || product.images?.[0] || "/box1.png";
  const price = product.price || product.variants?.[0]?.price || 0;

  return (
    <div className="min-h-screen bg-white py-12 md:py-20 px-6">
      <div className="max-w-6xl mx-auto">
        
        <button
          onClick={() => navigate(-1)}
          className="mb-12 flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-green-600 transition-colors"
        >
          <LuChevronLeft size={20} /> Back
        </button>

        <div className="grid lg:grid-cols-2 gap-16 items-start">
          
          {/* Image */}
          <div className="bg-gray-50 rounded-[40px] p-12 md:p-20 border border-gray-100 aspect-square flex items-center justify-center overflow-hidden">
             <img
               src={imageUrl}
               alt={product.name}
               className="w-full h-full object-contain hover:scale-105 transition-transform duration-500"
             />
          </div>

          {/* Content */}
          <div className="space-y-10">
            <div className="space-y-4">
              <span className="text-xs font-bold text-green-600 uppercase tracking-widest">{product.category || "Agriculture"}</span>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
                {product.name}
              </h1>
              <p className="text-3xl font-bold text-gray-900">₹{price.toLocaleString()}</p>
            </div>

            <div className="prose prose-gray">
              <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Description</h3>
              <p className="text-lg text-gray-600 leading-relaxed">
                {product.description || "No description available for this product."}
              </p>
            </div>

            <div className="pt-8 border-t border-gray-100 space-y-8">
              {/* Quantity */}
              <div className="flex items-center gap-6">
                 <div className="flex items-center bg-gray-50 border border-gray-200 rounded-xl p-1 shadow-sm">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-green-600 hover:bg-white rounded-lg transition-all"
                    >
                      <LuMinus size={18} />
                    </button>
                    <span className="w-12 text-center font-bold text-gray-900">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(quantity + 1)}
                      className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-green-600 hover:bg-white rounded-lg transition-all"
                    >
                      <LuPlus size={18} />
                    </button>
                 </div>
                 <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Subtotal</span>
                    <span className="text-xl font-bold text-gray-900">₹{(price * quantity).toLocaleString()}</span>
                 </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleAddToCart}
                  disabled={isAdded}
                  className={`flex-1 flex items-center justify-center gap-3 py-5 rounded-2xl text-lg font-bold transition-all shadow-xl ${
                    isAdded 
                    ? "bg-amber-500 text-white shadow-amber-100" 
                    : "bg-green-600 text-white shadow-green-100 hover:bg-green-700"
                  }`}
                >
                  {isAdded ? <LuCheck size={24} /> : <LuShoppingCart size={24} />}
                  {isAdded ? "Added to Cart" : "Add to Cart"}
                </button>
                
                <button
                  onClick={() => { handleAddToCart(); navigate("/cart"); }}
                  className="flex-1 flex items-center justify-center gap-3 py-5 bg-gray-900 text-white rounded-2xl text-lg font-bold hover:bg-gray-800 transition-all shadow-xl shadow-gray-100"
                >
                  Buy Now <LuArrowRight size={24} />
                </button>
              </div>
            </div>

            <div className="pt-10 flex items-center gap-8">
               <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs font-bold text-gray-500">In Stock</span>
               </div>
               <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-400">SKU:</span>
                  <span className="text-xs font-bold text-gray-900">ST-{id.slice(-6).toUpperCase()}</span>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
