import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import { useCart } from "../context/CartContext";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    API.get(`/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch((err) => {
        console.error("Error fetching product details:", err);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-orange-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-orange-500 border-opacity-75"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-orange-50 flex flex-col justify-center items-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
        <button onClick={() => navigate("/products")} className="text-orange-600 hover:text-orange-700 font-semibold underline">
          Back to Products
        </button>
      </div>
    );
  }

  const imageUrl = product.image?.[0] || "/box1.png";

  return (
    <div className="min-h-screen bg-gray-50 py-12 font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate(-1)}
          className="mb-8 flex items-center text-sm font-medium text-gray-500 hover:text-orange-600 transition-colors"
        >
          &larr; Back
        </button>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 flex flex-col md:flex-row">
          {/* Image Section */}
          <div className="md:w-1/2 p-8 md:p-12 bg-gray-50 flex justify-center items-center">
            <img
              src={imageUrl}
              alt={product.name}
              loading="lazy"
              className="w-full max-w-md object-contain rounded-xl shadow-sm hover:scale-105 transition-transform duration-500"
            />
          </div>

          {/* Details Section */}
          <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">
              {product.name}
            </h1>
            
            <p className="text-2xl sm:text-3xl font-black text-orange-600 mb-6 border-b border-gray-100 pb-6">
              ₹{product.price}
            </p>

            <div className="mb-8">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2">Description</h3>
              <p className="text-base text-gray-600 leading-relaxed">
                {product.description || "This exceptional quality product is handpicked and curated strictly adhering to our traditional standards. Perfect for all your spiritual and cultural needs."}
              </p>
            </div>

            <div className="mb-8">
              <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-3">Quantity</h3>
              <div className="flex items-center space-x-4">
                <div className="flex items-center border border-gray-300 rounded-full bg-white shadow-sm overflow-hidden">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-orange-600 transition font-black text-xl leading-none"
                  >
                    −
                  </button>
                  <span className="w-12 text-center font-bold text-gray-900">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-orange-600 transition font-black text-xl leading-none"
                  >
                    +
                  </button>
                </div>
                <span className="text-gray-500 text-sm">Amount to add</span>
              </div>
            </div>

            <button
              onClick={() => addToCart(product, quantity)}
              className="mt-6 w-full flex items-center justify-center bg-gradient-to-r from-orange-600 to-orange-500 text-white font-bold px-8 py-5 rounded-full hover:shadow-lg hover:-translate-y-1 hover:from-orange-500 hover:to-orange-400 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-orange-500/50 text-lg shadow-md"
            >
              Add {quantity > 1 ? `${quantity} Items` : 'to Cart'} - ₹{product.price * quantity}
            </button>
            
            {/* Trust Badges */}
            <div className="mt-8 grid grid-cols-2 gap-4 pt-6 border-t border-gray-100">
              <div className="flex items-center space-x-3">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <span className="text-sm font-semibold text-gray-700">100% Authentic</span>
              </div>
              <div className="flex items-center space-x-3">
                <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <span className="text-sm font-semibold text-gray-700">Fast Shipping</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
