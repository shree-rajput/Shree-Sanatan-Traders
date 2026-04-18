import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";

const Cart = () => {
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [address, setAddress] = useState("");
  const [placingOrder, setPlacingOrder] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.get("/cart", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCart(res.data?.items || []);
    } catch (err) {
      console.error("Error fetching cart:", err);
      setCart([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = async () => {
    if (!address.trim()) {
      setError("Please provide a shipping address.");
      return;
    }
    
    setPlacingOrder(true);
    setError("");

    try {
      const token = localStorage.getItem("token");
      await API.post(
        "/orders",
        { shippingAddress: address },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      // Order placed successfully
      setCart([]);
      navigate("/orders");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to place order.");
      setPlacingOrder(false);
    }
  };

  // Calculate Subtotal safely
  const subtotal = cart.reduce((sum, item) => {
    const price = item?.variant?.price || item?.product?.price || 0;
    return sum + (price * (item?.quantity || 1));
  }, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-orange-500 border-opacity-75"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8 tracking-tight">Shopping Cart</h1>

        {cart.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-16 text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-orange-100 mb-6">
              <svg className="w-12 h-12 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">Looks like you haven't added any premium traditional products to your cart yet.</p>
            <Link 
              to="/products"
              className="inline-block bg-orange-600 text-white font-bold px-8 py-3.5 rounded-full hover:bg-orange-700 transition shadow-md hover:shadow-lg"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items List */}
            <div className="lg:w-2/3 space-y-4">
              {cart.map((item) => (
                <div key={item._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 flex flex-col sm:flex-row items-center gap-6">
                  <div className="w-24 h-24 shrink-0 bg-gray-50 rounded-xl overflow-hidden border border-gray-100">
                    <img 
                      src={item?.product?.image?.[0] || "/box1.png"} 
                      alt={item?.product?.name || "Product Image"}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 flex flex-col sm:flex-row justify-between w-full">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{item?.product?.name || "Premium Item"}</h3>
                      <p className="text-sm text-gray-500 mt-1">Quantity: <span className="font-semibold text-gray-700">{item?.quantity || 1}</span></p>
                    </div>
                    <div className="mt-4 sm:mt-0 text-right">
                      <p className="text-lg font-black text-orange-600">₹{(item?.variant?.price || item?.product?.price || 0) * (item?.quantity || 1)}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary Pane */}
            <div className="lg:w-1/3">
              <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 sm:p-8 sticky top-24">
                <h2 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">Order Summary</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({cart.length} items)</span>
                    <span className="font-semibold text-gray-900">₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="text-green-600 font-semibold">Calculated Next</span>
                  </div>
                </div>
                
                <div className="border-t border-gray-100 pt-4 mb-8">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">Total</span>
                    <span className="text-2xl font-black text-orange-600">₹{subtotal}</span>
                  </div>
                </div>

                {error && (
                  <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-3 text-red-700 text-sm rounded shadow-sm">
                    {error}
                  </div>
                )}

                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Shipping Address</label>
                  <textarea
                    rows="3"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition resize-none placeholder-gray-400"
                    placeholder="Enter your full delivery address..."
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  ></textarea>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={placingOrder}
                  className="w-full bg-gradient-to-r from-orange-600 to-orange-500 text-white font-bold py-4 rounded-full shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {placingOrder ? "Processing..." : "Place Order"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;