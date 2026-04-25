import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import { useCart } from "../context/CartContext";
import { translations } from "../utils/translations";

const Cart = ({ lang = "en" }) => {
  const t = translations[lang] || translations["en"];
  const { cartItems, removeFromCart, updateQty, clearCart, totalItems, totalPrice } = useCart();
  const [address, setAddress] = useState("");
  const [placingOrder, setPlacingOrder] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleCheckout = async () => {
    if (!address.trim()) {
      setError(lang === 'en' ? "Please provide a shipping address." : "कृपया शिपिंग पता प्रदान करें।");
      return;
    }

    setPlacingOrder(true);
    setError("");

    try {
      const token = localStorage.getItem("token");

      const orderPayload = {
        shippingAddress: address,
        items: cartItems.map(item => ({
          product: item._id,
          quantity: item.qty || 1,
          price: item.price
        })),
        totalAmount: totalPrice
      };

      await API.post(
        "/orders",
        orderPayload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      clearCart();
      navigate("/orders");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || (lang === 'en' ? "Failed to place order." : "ऑर्डर देने में विफल।"));
      setPlacingOrder(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8 tracking-tight">{t.yourCart}</h1>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-16 text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-emerald-50 mb-6">
              <svg className="w-12 h-12 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{t.emptyCart}</h2>
            <p className="text-gray-500 mb-8 max-w-md mx-auto">Looks like you haven't added any premium traditional products to your cart yet.</p>
            <Link
              to="/products"
              className="inline-block bg-emerald-600 text-white font-bold px-8 py-3.5 rounded-full hover:bg-emerald-700 transition shadow-md hover:shadow-lg"
            >
              {t.startShopping}
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items List */}
            <div className="lg:w-2/3 space-y-4">
              {cartItems.map((item) => (
                <div key={item._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6 flex flex-col sm:flex-row items-center gap-6 relative group border-l-4 border-transparent hover:border-emerald-500 transition-colors">

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(item._id)}
                    className="absolute top-4 right-4 text-red-400 hover:text-red-600 bg-red-50 hover:bg-red-100 p-2 rounded-full transition-colors"
                    title="Remove item"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                  </button>

                  <div className="w-24 h-24 shrink-0 bg-gray-50 rounded-xl overflow-hidden border border-gray-100 flex items-center justify-center p-2">
                    <img
                      src={item.images?.[0] || item.product?.images?.[0] || "/box1.png"}
                      alt={item.name || item.product?.name || "Product Image"}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <div className="flex-1 flex flex-col sm:flex-row justify-between w-full">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 max-w-[200px] sm:max-w-xs">{item.name || item.product?.name || "Premium Item"}</h3>
                      <p className="text-sm text-gray-400 mt-1 uppercase font-semibold tracking-wider">{t.unit}: {item.unit || "N/A"}</p>
                    </div>

                    <div className="mt-4 sm:mt-0 flex flex-col items-end">
                      <p className="text-lg font-black text-emerald-700 mb-2">₹{(item.price || item.product?.price || 0) * (item.qty || 1)}</p>

                      {/* Quantity Controller */}
                      <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-gray-50 shadow-sm">
                        <button
                          onClick={() => updateQty(item._id, (item.qty || 1) - 1)}
                          className="px-3 py-1 text-gray-500 hover:bg-gray-200 hover:text-black font-bold transition"
                        >−</button>
                        <span className="px-3 text-sm font-bold text-gray-800">{item.qty || 1}</span>
                        <button
                          onClick={() => updateQty(item._id, (item.qty || 1) + 1)}
                          className="px-3 py-1 text-gray-500 hover:bg-gray-200 hover:text-black font-bold transition"
                        >+</button>
                      </div>

                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary Pane */}
            <div className="lg:w-1/3">
              <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 sm:p-8 sticky top-24">
                <h2 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-100 pb-4">{t.checkout}</h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>{t.subtotal} ({totalItems} items)</span>
                    <span className="font-semibold text-gray-900">₹{totalPrice}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>{t.shipping}</span>
                    <span className="text-green-600 font-semibold">{lang === 'en' ? 'Calculated Next' : 'अगले चरण में'}</span>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-4 mb-8">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-900">{t.total}</span>
                    <span className="text-2xl font-black text-emerald-700">₹{totalPrice}</span>
                  </div>
                </div>

                {error && (
                  <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-3 text-red-700 text-sm rounded shadow-sm">
                    {error}
                  </div>
                )}

                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">{t.address}</label>
                  <textarea
                    rows="3"
                    className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition resize-none placeholder-gray-400"
                    placeholder={lang === 'en' ? "Enter your full delivery address..." : "अपना पूरा डिलीवरी पता दर्ज करें..."}
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  ></textarea>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={placingOrder}
                  className="w-full bg-emerald-600 text-white font-bold py-4 rounded-full shadow-lg hover:shadow-xl hover:bg-emerald-700 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {placingOrder ? t.loading : t.confirmPay}
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

