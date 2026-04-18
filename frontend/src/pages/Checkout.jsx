import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";
import API from "../services/api";

const Checkout = () => {
  const { cartItems, totalPrice, clearCart } = useCart();
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // Step 1: Address, Step 2: Summary/Pay
  const navigate = useNavigate();

  useEffect(() => {
    // Prevent checking out an empty cart securely
    if (cartItems.length === 0) {
      toast.error("Your cart is empty. Please add items to checkout.");
      navigate("/products");
    }
  }, [cartItems, navigate]);

  const handleNextStep = (e) => {
    e.preventDefault();
    if (!address.trim() || address.length < 10) {
      toast.error("Please provide a valid, detailed shipping address.");
      return;
    }
    setStep(2);
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      await API.post(
        "/orders",
        { shippingAddress: address },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      clearCart();
      toast.success("Order placed successfully! Thank you for trusting us.", { duration: 5000 });
      navigate("/orders");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to securely place order. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pt-12 items-center px-4 font-sans pb-24">
      {/* Checkout Progress Tracker */}
      <div className="w-full max-w-2xl mb-8 flex justify-center items-center space-x-4">
        <div className={`flex items-center space-x-2 ${step >= 1 ? 'text-orange-600 font-bold' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step >= 1 ? 'border-orange-600 bg-orange-50' : 'border-gray-300'}`}>1</div>
          <span>Shipping Details</span>
        </div>
        <div className={`w-16 h-1 border-t-2 ${step >= 2 ? 'border-orange-600' : 'border-gray-300'}`}></div>
        <div className={`flex items-center space-x-2 ${step >= 2 ? 'text-orange-600 font-bold' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step >= 2 ? 'border-orange-600 bg-orange-50' : 'border-gray-300'}`}>2</div>
          <span>Confirm & Pay</span>
        </div>
      </div>

      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 p-8 sm:p-10">
        
        {step === 1 ? (
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Delivery Address</h2>
            <p className="text-gray-500 mb-8">Where should we securely deliver your premium traditional goods?</p>
            
            <form onSubmit={handleNextStep} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Full Delivery Address</label>
                <textarea
                  required
                  rows="4"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition-all resize-none shadow-inner"
                  placeholder="e.g. 123 Heritage Lane, Apartment 4B, City, ZIP Code"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                ></textarea>
                <p className="mt-2 text-xs text-gray-400">Please be detailed. Our logistics partners require accurate addressing.</p>
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => navigate("/cart")}
                  className="px-6 py-3 rounded-xl text-gray-500 font-bold hover:text-gray-900 transition"
                >
                  &larr; Return to Cart
                </button>
                <button
                  type="submit"
                  className="bg-gray-900 text-white font-bold px-8 py-3.5 rounded-xl shadow-md hover:bg-black hover:shadow-lg transition-all focus:ring-4 focus:ring-gray-300"
                >
                  Continue to Summary
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">Order Summary</h2>
            <p className="text-gray-500 mb-8">Please review your selections and destination before confirming payment.</p>
            
            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 mb-8 shadow-sm">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Items Overview</h3>
              <div className="space-y-3 max-h-48 overflow-y-auto pr-2 mb-6 scrollbar-thin scrollbar-thumb-gray-300">
                {cartItems.map(item => (
                  <div key={item._id} className="flex justify-between items-center bg-white p-3 rounded-xl border border-gray-100">
                    <div className="flex items-center space-x-3 truncate">
                       <span className="font-bold text-gray-800 bg-gray-100 w-6 h-6 flex items-center justify-center rounded text-xs">{item.qty}x</span>
                       <span className="text-gray-700 text-sm font-medium truncate">{item.name || item.product?.name || "Item"}</span>
                    </div>
                    <span className="font-bold text-gray-900">₹{(item.price || item.product?.price || 0) * item.qty}</span>
                  </div>
                ))}
              </div>
              
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 pt-4 border-t border-gray-200">Delivering To</h3>
              <p className="text-gray-800 font-medium text-sm leading-relaxed bg-white p-4 rounded-xl border border-gray-100">{address}</p>
            </div>

            <div className="border-t-2 border-dashed border-gray-200 pt-6 mb-8 flex justify-between items-end">
               <div>
                  <p className="text-gray-500 font-medium mb-1">Standard Delivery</p>
                  <p className="text-3xl font-black text-gray-900">Total: <span className="text-orange-600 drop-shadow-sm">₹{totalPrice}</span></p>
               </div>
            </div>

            <div className="flex items-center justify-between">
              <button
                onClick={() => setStep(1)}
                className="px-6 py-3 rounded-xl text-gray-500 font-bold hover:text-gray-900 transition"
              >
                &larr; Edit Address
              </button>
              <button
                onClick={handlePlaceOrder}
                disabled={loading}
                className="bg-gradient-to-r from-green-600 to-green-500 text-white font-black px-10 py-4 rounded-xl shadow-lg hover:-translate-y-0.5 hover:shadow-xl hover:from-green-500 hover:to-green-400 focus:ring-4 focus:ring-green-500/50 disabled:opacity-70 disabled:cursor-not-allowed transition-all text-lg"
              >
                {loading ? "Processing Secure Payment..." : "Confirm & Pay"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkout;
