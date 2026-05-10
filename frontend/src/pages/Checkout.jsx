import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { useLanguage } from "../context/LanguageContext";
import toast from "react-hot-toast";
import API from "../services/api";
import {
  LuMapPin, LuCircleCheck, LuShoppingBag, LuChevronLeft,
  LuArrowRight, LuLoaderCircle, LuTruck, LuBanknote, LuCreditCard
} from "react-icons/lu";

const Checkout = () => {
  const { cartItems, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  // Support "Buy Now" — location state may carry a single product
  const buyNowItem = location.state?.buyNowItem || null;
  const checkoutItems = buyNowItem ? [buyNowItem] : cartItems;
  const checkoutTotal = buyNowItem
    ? (buyNowItem.price * buyNowItem.qty)
    : totalPrice;

  const [address, setAddress] = useState({
    address: "",
    city: "",
    state: "",
    pincode: "",
    phone: user?.phone || ""
  });
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1 = address, 2 = summary+pay

  const deliveryCharge = checkoutTotal >= 500 ? 0 : 40;
  const finalTotal = checkoutTotal + deliveryCharge;

  useEffect(() => {
    if (checkoutItems.length === 0) {
      toast.error("Your cart is empty");
      navigate("/products");
    }
  }, []);

  const handleNextStep = (e) => {
    e.preventDefault();
    const { address: addr, city, state, pincode, phone } = address;
    if (!addr.trim() || !city.trim() || !state.trim() || !pincode.trim() || !phone.trim()) {
      toast.error("Please fill all shipping details");
      return;
    }
    setStep(2);
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      const orderPayload = {
        items: checkoutItems.map(item => ({
          product: item._id,
          name: item.name,
          price: item.price || item.variants?.[0]?.price || 0,
          quantity: item.qty || 1,
          image: item.image || item.images?.[0] || null
        })),
        shippingAddress: address,
        paymentMethod,
        totalAmount: finalTotal
      };

      const res = await API.post("/orders", orderPayload);
      const order = res.data.order;

      // Only clear cart if this was a cart checkout (not Buy Now)
      if (!buyNowItem) clearCart();

      toast.success("🌾 Order placed successfully!", { duration: 4000 });
      navigate("/order-success", { state: { order }, replace: true });

    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to place order. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 md:px-6">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900">{t("checkout_title")}</h1>
          <p className="text-gray-400 mt-2 text-sm font-medium">
            {buyNowItem ? "Quick checkout for your selected item" : `${checkoutItems.length} items in your order`}
          </p>
          {/* Step indicator */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <div className={`flex items-center gap-2 px-5 py-2 rounded-full font-bold text-sm transition-all ${step >= 1 ? 'bg-green-600 text-white shadow-lg shadow-green-100' : 'bg-white text-gray-400 border border-gray-100'}`}>
              <LuTruck size={16} /> {t("shipping_details")}
            </div>
            <div className={`w-10 h-0.5 rounded-full ${step >= 2 ? 'bg-green-600' : 'bg-gray-200'}`} />
            <div className={`flex items-center gap-2 px-5 py-2 rounded-full font-bold text-sm transition-all ${step >= 2 ? 'bg-green-600 text-white shadow-lg shadow-green-100' : 'bg-white text-gray-400 border border-gray-100'}`}>
              <LuCreditCard size={16} /> {t("confirm_pay")}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">

          {/* ===== STEP 1: Address ===== */}
          {step === 1 && (
            <div className="p-8 md:p-12">
              <div className="flex items-center gap-4 mb-10">
                <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600">
                  <LuMapPin size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{t("shipping_details")}</h2>
                  <p className="text-sm text-gray-400">{t("delivery_address_prompt")}</p>
                </div>
              </div>

              <form onSubmit={handleNextStep} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">
                    {t("full_delivery_address")}
                  </label>
                  <textarea
                    required rows="3"
                    className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/10 outline-none transition-all font-medium resize-none text-sm"
                    placeholder={t("address_placeholder")}
                    value={address.address}
                    onChange={e => setAddress({ ...address, address: e.target.value })}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                  {[
                    { key: "city", label: t("city") || "City", ph: "Mumbai" },
                    { key: "state", label: t("state"), ph: "Maharashtra" },
                    { key: "pincode", label: t("pincode"), ph: "400001" },
                    { key: "phone", label: t("phone_number"), ph: "+91 98765 43210", type: "tel" }
                  ].map(({ key, label, ph, type = "text" }) => (
                    <div key={key} className="space-y-2">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">{label}</label>
                      <input
                        type={type} required placeholder={ph}
                        className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/10 outline-none transition-all font-medium text-sm"
                        value={address[key]}
                        onChange={e => setAddress({ ...address, [key]: e.target.value })}
                      />
                    </div>
                  ))}
                </div>

                <div className="pt-8 flex items-center justify-between border-t border-gray-50">
                  <button type="button" onClick={() => navigate(buyNowItem ? -1 : "/cart")}
                    className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-green-600 transition-colors">
                    <LuChevronLeft size={20} /> {buyNowItem ? "Back" : t("return_to_cart")}
                  </button>
                  <button type="submit"
                    className="px-10 py-4 bg-green-600 text-white rounded-2xl font-bold shadow-lg shadow-green-100 hover:bg-green-700 transition-all flex items-center gap-2">
                    {t("continue_summary")} <LuArrowRight size={20} />
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ===== STEP 2: Summary + Payment ===== */}
          {step === 2 && (
            <div className="p-8 md:p-12">
              <div className="flex items-center gap-4 mb-10">
                <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center text-green-600">
                  <LuShoppingBag size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{t("order_summary")}</h2>
                  <p className="text-sm text-gray-400">{t("review_summary")}</p>
                </div>
              </div>

              {/* Items */}
              <div className="space-y-3 mb-8">
                {checkoutItems.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-gray-50 p-4 rounded-2xl border border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-white rounded-xl border border-gray-100 flex items-center justify-center overflow-hidden">
                        <img src={item.image || item.images?.[0] || "/box1.png"} alt="" className="w-full h-full object-contain" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900">{item.name || "Product"}</p>
                        <p className="text-xs text-gray-400">Qty: {item.qty || 1}</p>
                      </div>
                    </div>
                    <span className="font-bold text-gray-900">₹{((item.price || 0) * (item.qty || 1)).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              {/* Shipping Address */}
              <div className="bg-gray-900 text-white p-6 rounded-2xl mb-8">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Shipping to</span>
                  <button onClick={() => setStep(1)} className="text-green-400 text-xs font-bold hover:underline">
                    {t("edit_shipping")}
                  </button>
                </div>
                <p className="text-sm font-medium leading-relaxed text-gray-100">
                  {address.address}, {address.city}, {address.state} — {address.pincode}
                </p>
                <p className="text-sm text-gray-400 mt-1">📞 {address.phone}</p>
                <div className="mt-4 pt-4 border-t border-white/10 flex justify-between">
                  <span className="text-sm text-gray-400 font-medium">Subtotal</span>
                  <span className="text-sm font-bold">₹{checkoutTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-sm text-gray-400 font-medium">Delivery</span>
                  <span className={`text-sm font-bold ${deliveryCharge === 0 ? 'text-green-400' : ''}`}>
                    {deliveryCharge === 0 ? "FREE" : `₹${deliveryCharge}`}
                  </span>
                </div>
                <div className="flex justify-between mt-3 pt-3 border-t border-white/10">
                  <span className="text-lg font-bold">Total</span>
                  <span className="text-2xl font-bold text-green-400">₹{finalTotal.toLocaleString()}</span>
                </div>
              </div>

              {/* Payment Method */}
              <div className="mb-8">
                <h3 className="text-sm font-bold text-gray-700 uppercase tracking-widest mb-4">Payment Method</h3>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setPaymentMethod("cod")}
                    className={`p-4 rounded-2xl border-2 transition-all flex items-center gap-3 ${
                      paymentMethod === "cod"
                        ? "border-green-500 bg-green-50"
                        : "border-gray-100 bg-white hover:border-gray-200"
                    }`}
                  >
                    <LuBanknote size={22} className={paymentMethod === "cod" ? "text-green-600" : "text-gray-400"} />
                    <div className="text-left">
                      <p className={`text-sm font-bold ${paymentMethod === "cod" ? "text-green-700" : "text-gray-700"}`}>
                        Cash on Delivery
                      </p>
                      <p className="text-xs text-gray-400">Pay when delivered</p>
                    </div>
                    {paymentMethod === "cod" && <LuCircleCheck className="ml-auto text-green-600" size={18} />}
                  </button>

                  <button
                    onClick={() => toast("Online payment coming soon! Use COD for now.", { icon: "💳" })}
                    className="p-4 rounded-2xl border-2 border-gray-100 bg-white hover:border-gray-200 transition-all flex items-center gap-3 opacity-60"
                  >
                    <LuCreditCard size={22} className="text-gray-400" />
                    <div className="text-left">
                      <p className="text-sm font-bold text-gray-700">Online Payment</p>
                      <p className="text-xs text-gray-400">Coming soon</p>
                    </div>
                  </button>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={loading}
                className="w-full py-5 bg-green-600 text-white rounded-2xl font-bold shadow-xl shadow-green-100 hover:bg-amber-500 hover:shadow-amber-100 transition-all text-lg flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {loading
                  ? <><LuLoaderCircle className="animate-spin" size={22} /> Placing Order...</>
                  : <>{t("place_order_btn")} <LuCircleCheck size={22} /></>
                }
              </button>
              <p className="text-center text-xs text-gray-400 mt-4 font-medium">
                🔒 Your order is protected by our secure payment system
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Checkout;
