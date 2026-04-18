import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";
import API from "../services/api";
import { translations } from "../utils/translations";

const Checkout = ({ lang = "en" }) => {
  const t = translations[lang] || translations["en"];
  const { cartItems, totalPrice, clearCart } = useCart();
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // Step 1: Address, Step 2: Summary/Pay
  const navigate = useNavigate();

  useEffect(() => {
    if (cartItems.length === 0) {
      toast.error(lang === 'en' ? "Your cart is empty. Please add items to checkout." : "आपका कार्ट खाली है। कृपया खरीदारी करें।");
      navigate("/products");
    }
  }, [cartItems, navigate, lang]);

  const handleNextStep = (e) => {
    e.preventDefault();
    if (!address.trim() || address.length < 10) {
      toast.error(lang === 'en' ? "Please provide a valid, detailed shipping address." : "कृपया एक सही और विस्तृत शिपिंग पता प्रदान करें।");
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
      toast.success(lang === 'en' ? "Order placed successfully! Thank you for trusting us." : "ऑर्डर सफलतापूर्वक दिया गया! हम पर भरोसा करने के लिए धन्यवाद।", { duration: 5000 });
      navigate("/orders");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || (lang === 'en' ? "Failed to securely place order. Please try again." : "ऑर्डर देने में विफल। कृपया पुन: प्रयास करें।"));
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-emerald-50/20 flex flex-col pt-12 items-center px-4 font-sans pb-24">
      {/* Checkout Progress Tracker */}
      <div className="w-full max-w-2xl mb-8 flex justify-center items-center space-x-4">
        <div className={`flex items-center space-x-2 ${step >= 1 ? 'text-emerald-700 font-bold' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step >= 1 ? 'border-emerald-600 bg-emerald-50' : 'border-gray-300'}`}>1</div>
          <span className="text-xs sm:text-sm">{lang === 'en' ? 'Shipping Details' : 'शिपिंग विवरण'}</span>
        </div>
        <div className={`w-16 h-1 border-t-2 ${step >= 2 ? 'border-emerald-600' : 'border-gray-300'}`}></div>
        <div className={`flex items-center space-x-2 ${step >= 2 ? 'text-emerald-700 font-bold' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step >= 2 ? 'border-emerald-600 bg-emerald-50' : 'border-gray-300'}`}>2</div>
          <span className="text-xs sm:text-sm">{lang === 'en' ? 'Confirm & Pay' : 'पुष्टि और भुगतान'}</span>
        </div>
      </div>

      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 p-8 sm:p-10">
        
        {step === 1 ? (
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">{t.address}</h2>
            <p className="text-gray-500 mb-8">{lang === 'en' ? "Where should we securely deliver your premium lifestyle products?" : "हमें आपके प्रीमियम लाइफस्टाइल उत्पादों को कहाँ पहुंचाना चाहिए?"}</p>
            
            <form onSubmit={handleNextStep} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">{t.fullName || 'Full Delivery Address'}</label>
                <textarea
                  required
                  rows="4"
                  className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition-all resize-none shadow-inner"
                  placeholder={lang === 'en' ? "e.g. 123 Heritage Lane, Apartment 4B, City, ZIP Code" : "उदा. 123 हेरिटेज लेन, अपार्टमेंट 4बी, शहर, ज़िप कोड"}
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                ></textarea>
                <p className="mt-2 text-xs text-gray-400">{lang === 'en' ? "Please be detailed. Our logistics partners require accurate addressing." : "कृपया विस्तार से बताएं। हमारे लॉजिस्टिक्स भागीदारों को सटीक पते की आवश्यकता होती है।"}</p>
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => navigate("/cart")}
                  className="px-6 py-3 rounded-xl text-gray-500 font-bold hover:text-gray-900 transition"
                >
                  &larr; {lang === 'en' ? 'Return to Cart' : 'कार्ट पर वापस जाएं'}
                </button>
                <button
                  type="submit"
                  className="bg-emerald-900 text-white font-bold px-8 py-3.5 rounded-xl shadow-md hover:bg-black hover:shadow-lg transition-all focus:ring-4 focus:ring-gray-300"
                >
                  {lang === 'en' ? 'Continue to Summary' : 'सारांश पर जारी रखें'}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div>
            <h2 className="text-3xl font-extrabold text-gray-900 mb-2">{lang === 'en' ? 'Order Summary' : 'ऑर्डर सारांश'}</h2>
            <p className="text-gray-500 mb-8">{lang === 'en' ? 'Please review your selections and destination before confirming payment.' : 'भुगतान की पुष्टि करने से पहले कृपया अपने चयन और गंतव्य की समीक्षा करें।'}</p>
            
            <div className="bg-emerald-50/50 p-6 rounded-2xl border border-emerald-100 mb-8 shadow-sm">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">{lang === 'en' ? 'Items Overview' : 'आइटम ओवरव्यू'}</h3>
              <div className="space-y-3 max-h-48 overflow-y-auto pr-2 mb-6 scrollbar-thin scrollbar-thumb-emerald-200">
                {cartItems.map(item => (
                  <div key={item._id} className="flex justify-between items-center bg-white p-3 rounded-xl border border-gray-100">
                    <div className="flex items-center space-x-3 truncate">
                       <span className="font-bold text-emerald-800 bg-emerald-50 w-6 h-6 flex items-center justify-center rounded text-xs">{item.qty}x</span>
                       <span className="text-gray-700 text-sm font-medium truncate">{item.name || item.product?.name || "Item"}</span>
                    </div>
                    <span className="font-bold text-gray-900">₹{(item.price || item.product?.price || 0) * item.qty}</span>
                  </div>
                ))}
              </div>
              
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 pt-4 border-t border-gray-200">{t.deliveredTo}</h3>
              <p className="text-gray-800 font-medium text-sm leading-relaxed bg-white p-4 rounded-xl border border-gray-100">{address}</p>
            </div>

            <div className="border-t-2 border-dashed border-gray-200 pt-6 mb-8 flex justify-between items-end">
               <div>
                  <p className="text-gray-500 font-medium mb-1">{lang === 'en' ? 'Standard Delivery' : 'स्टैंडर्ड डिलीवरी'}</p>
                  <p className="text-3xl font-black text-gray-900">{t.total}: <span className="text-emerald-700 drop-shadow-sm">₹{totalPrice}</span></p>
               </div>
            </div>

            <div className="flex items-center justify-between">
              <button
                onClick={() => setStep(1)}
                className="px-6 py-3 rounded-xl text-gray-500 font-bold hover:text-gray-900 transition"
              >
                &larr; {lang === 'en' ? 'Edit Address' : 'पता बदलें'}
              </button>
              <button
                onClick={handlePlaceOrder}
                disabled={loading}
                className="bg-gradient-to-r from-emerald-600 to-green-500 text-white font-black px-10 py-4 rounded-xl shadow-lg hover:-translate-y-0.5 hover:shadow-xl hover:from-emerald-500 hover:to-emerald-400 focus:ring-4 focus:ring-emerald-500/50 disabled:opacity-70 disabled:cursor-not-allowed transition-all text-lg"
              >
                {loading ? t.loading : t.confirmPay}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Checkout;
