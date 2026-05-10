import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useLanguage } from "../context/LanguageContext";
import {
  LuTrash2, LuPlus, LuMinus, LuShoppingBag, LuChevronRight,
  LuArrowRight, LuTag, LuBookmark
} from "react-icons/lu";
import toast from "react-hot-toast";

const Cart = () => {
  const { cartItems, removeFromCart, updateQty, clearCart, totalItems, totalPrice } = useCart();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [coupon, setCoupon] = useState("");
  const [savedItems, setSavedItems] = useState([]);

  // Free delivery above ₹500
  const deliveryCharge = totalPrice >= 500 ? 0 : 40;
  const finalTotal = totalPrice + deliveryCharge;

  const handleSaveForLater = (item) => {
    removeFromCart(item._id);
    setSavedItems(prev => [...prev, item]);
    toast("Saved for later", { icon: "🔖" });
  };

  const handleMoveToCart = (item) => {
    setSavedItems(prev => prev.filter(i => i._id !== item._id));
    toast.success("Moved back to cart");
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }
    navigate("/checkout");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 md:px-6">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {t("your_cart")} <span className="text-green-600">🛒</span>
            </h1>
            <p className="text-sm text-gray-400 mt-1 font-medium">{totalItems} {t("items")}</p>
          </div>
          <Link to="/products" className="text-sm font-bold text-green-600 hover:text-green-700 flex items-center gap-1">
            {t("continue_shopping")} <LuArrowRight size={16} />
          </Link>
        </div>

        {cartItems.length === 0 ? (
          <div className="py-24 text-center bg-white rounded-3xl border border-gray-100 shadow-sm">
            <LuShoppingBag size={56} className="mx-auto text-gray-200 mb-6" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">{t("cart_empty")}</h2>
            <p className="text-gray-400 mb-8 max-w-xs mx-auto">{t("cart_empty_desc")}</p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-8 py-3 bg-green-600 text-white rounded-xl font-bold shadow-lg shadow-green-100 hover:bg-green-700 transition-all"
            >
              {t("browse_shop")} <LuArrowRight size={18} />
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">

            {/* Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div key={item._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex gap-4 group hover:shadow-md transition-shadow">
                  {/* Image */}
                  <div className="w-20 h-20 bg-gray-50 rounded-xl overflow-hidden flex items-center justify-center border border-gray-100 shrink-0">
                    <img
                      src={item.image || item.images?.[0] || "/box1.png"}
                      alt={item.name}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-bold text-gray-900 truncate">{item.name}</p>
                        <p className="text-xs text-gray-400 font-medium mt-0.5">₹{item.price?.toLocaleString()} each</p>
                      </div>
                      <p className="text-lg font-bold text-gray-900 shrink-0">
                        ₹{((item.price || 0) * (item.qty || 1)).toLocaleString()}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-4 flex-wrap gap-3">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl p-1">
                        <button
                          onClick={() => updateQty(item._id, (item.qty || 1) - 1)}
                          className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-green-600 hover:bg-white rounded-lg transition-all"
                        >
                          <LuMinus size={13} />
                        </button>
                        <span className="text-sm font-bold text-gray-900 w-6 text-center">{item.qty || 1}</span>
                        <button
                          onClick={() => updateQty(item._id, (item.qty || 1) + 1)}
                          className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-green-600 hover:bg-white rounded-lg transition-all"
                        >
                          <LuPlus size={13} />
                        </button>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleSaveForLater(item)}
                          className="flex items-center gap-1 text-xs font-bold text-gray-400 hover:text-blue-500 transition-colors"
                        >
                          <LuBookmark size={14} /> Save for Later
                        </button>
                        <button
                          onClick={() => removeFromCart(item._id)}
                          className="flex items-center gap-1 text-xs font-bold text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <LuTrash2 size={14} /> Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Saved for Later */}
              {savedItems.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">
                    Saved for Later ({savedItems.length})
                  </h3>
                  {savedItems.map(item => (
                    <div key={item._id} className="bg-white rounded-2xl border border-dashed border-gray-200 p-5 flex gap-4 items-center opacity-70 hover:opacity-100 transition-opacity">
                      <div className="w-14 h-14 bg-gray-50 rounded-xl flex items-center justify-center">
                        <img src={item.image || "/box1.png"} alt={item.name} className="w-full h-full object-contain" />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-gray-900 text-sm">{item.name}</p>
                        <p className="text-xs text-gray-400">₹{item.price?.toLocaleString()}</p>
                      </div>
                      <button
                        onClick={() => handleMoveToCart(item)}
                        className="text-xs font-bold text-green-600 hover:text-green-700 border border-green-200 px-3 py-1.5 rounded-lg hover:bg-green-50 transition-all"
                      >
                        Move to Cart
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="space-y-4">
              {/* Coupon */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2 mb-4">
                  <LuTag size={16} className="text-green-600" /> Apply Coupon
                </h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={coupon}
                    onChange={e => setCoupon(e.target.value.toUpperCase())}
                    placeholder="Enter code"
                    className="flex-1 px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-bold outline-none focus:border-green-500 transition-colors"
                  />
                  <button
                    onClick={() => toast("Coupon feature coming soon!", { icon: "🏷️" })}
                    className="px-4 py-3 bg-green-600 text-white rounded-xl text-sm font-bold hover:bg-green-700 transition-colors"
                  >
                    Apply
                  </button>
                </div>
              </div>

              {/* Price Summary */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
                <h3 className="text-sm font-bold text-gray-700 uppercase tracking-widest">{t("order_summary")}</h3>

                <div className="space-y-3 text-sm">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({totalItems} items)</span>
                    <span className="font-bold">₹{totalPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>{t("shipping")}</span>
                    <span className={`font-bold ${deliveryCharge === 0 ? 'text-green-600' : ''}`}>
                      {deliveryCharge === 0 ? "FREE" : `₹${deliveryCharge}`}
                    </span>
                  </div>
                  {deliveryCharge > 0 && (
                    <p className="text-xs text-amber-600 bg-amber-50 px-3 py-2 rounded-lg font-medium">
                      Add ₹{(500 - totalPrice).toLocaleString()} more for FREE delivery
                    </p>
                  )}
                </div>

                <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                  <span className="font-bold text-gray-700">Total</span>
                  <span className="text-2xl font-bold text-gray-900">₹{finalTotal.toLocaleString()}</span>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full py-4 bg-green-600 text-white rounded-xl font-bold shadow-lg shadow-green-100 hover:bg-green-700 transition-all flex items-center justify-center gap-2 text-lg"
                >
                  {t("proceed_to_checkout")} <LuChevronRight size={20} />
                </button>

                <p className="text-center text-xs text-gray-400 font-medium">🔒 {t("secure_payment")}</p>
              </div>

              {/* Clear cart */}
              <button
                onClick={clearCart}
                className="w-full text-sm font-bold text-gray-400 hover:text-red-500 transition-colors py-2"
              >
                {t("clear_cart")}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
