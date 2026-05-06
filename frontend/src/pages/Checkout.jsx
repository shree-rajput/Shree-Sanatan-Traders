import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import toast from "react-hot-toast";
import API from "../services/api";
import { LuMapPin, LuCircleCheck, LuShoppingBag, LuChevronLeft, LuArrowRight, LuLoaderCircle, LuTruck, LuCreditCard } from "react-icons/lu";

const loadScript = (src) => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const Checkout = () => {
  const { cartItems, totalPrice, clearCart } = useCart();
  const [address, setAddress] = useState({
    address: "",
    city: "",
    state: "",
    pincode: "",
    phone: ""
  });
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      navigate("/products");
    }
  }, [cartItems, navigate]);

  const handleNextStep = (e) => {
    e.preventDefault();
    if (!address.address.trim() || !address.city.trim() || !address.state.trim() || !address.pincode.trim() || !address.phone.trim()) {
      toast.error("Please fill all shipping details");
      return;
    }
    setStep(2);
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    
    const resScript = await loadScript("https://checkout.razorpay.com/v1/checkout.js");
    if (!resScript) {
      toast.error("Payment system failed to load. Please try again.");
      setLoading(false);
      return;
    }

    try {
      const orderRes = await API.post("/orders", { shippingAddress: `${address.address}, ${address.city}, ${address.state} - ${address.pincode}`, phone: address.phone });
      const orderData = orderRes.data;

      const paymentRes = await API.post("/payment/create", { amount: orderData.totalPrice });
      const paymentData = paymentRes.data;

      const options = {
        key: "rzp_test_placeholder",
        amount: paymentData.amount,
        currency: paymentData.currency,
        name: "Sheshanathan Traders",
        description: "Payment for order #" + orderData._id.slice(-6),
        order_id: paymentData.id,
        handler: async (response) => {
          try {
            const verifyRes = await API.post("/payment/verify", response);
            if (verifyRes.data.success) {
              clearCart();
              toast.success("Order placed successfully!", { icon: '📦' });
              navigate("/orders");
            }
          } catch (err) {
            toast.error("Payment verification failed");
          }
        },
        prefill: {
          name: "",
          email: "",
          contact: address.phone
        },
        theme: { color: "#16a34a" },
        modal: { ondismiss: () => setLoading(false) }
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();

    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 md:py-20 px-6">
      <div className="max-w-4xl mx-auto">
        
        <div className="text-center mb-16">
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          <div className="flex items-center justify-center gap-4 mt-8">
            <div className={`flex items-center gap-2 px-6 py-2 rounded-full font-bold text-sm transition-all ${step >= 1 ? 'bg-green-600 text-white shadow-lg shadow-green-100' : 'bg-white text-gray-400 border border-gray-100'}`}>
              <LuTruck size={18} /> Shipping
            </div>
            <div className={`w-12 h-0.5 rounded-full ${step >= 2 ? 'bg-green-600' : 'bg-gray-200'}`}></div>
            <div className={`flex items-center gap-2 px-6 py-2 rounded-full font-bold text-sm transition-all ${step >= 2 ? 'bg-green-600 text-white shadow-lg shadow-green-100' : 'bg-white text-gray-400 border border-gray-100'}`}>
              <LuCreditCard size={18} /> Payment
            </div>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
          {step === 1 ? (
            <div className="p-8 md:p-12">
              <div className="flex items-center gap-4 mb-10">
                <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-green-600">
                  <LuMapPin size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Shipping Details</h2>
                  <p className="text-sm text-gray-400">Where should we deliver your order?</p>
                </div>
              </div>

              <form onSubmit={handleNextStep} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Street Address</label>
                  <textarea
                    required
                    rows="3"
                    className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/10 outline-none transition-all font-medium resize-none"
                    placeholder="Enter your full address"
                    value={address.address}
                    onChange={(e) => setAddress({ ...address, address: e.target.value })}
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">City</label>
                    <input
                      type="text" required placeholder="City"
                      className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/10 outline-none transition-all font-medium"
                      value={address.city}
                      onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">State</label>
                    <input
                      type="text" required placeholder="State"
                      className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/10 outline-none transition-all font-medium"
                      value={address.state}
                      onChange={(e) => setAddress({ ...address, state: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Pincode</label>
                    <input
                      type="text" required placeholder="Pincode"
                      className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/10 outline-none transition-all font-medium"
                      value={address.pincode}
                      onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Phone Number</label>
                    <input
                      type="tel" required placeholder="Phone"
                      className="w-full px-6 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:border-green-500 focus:ring-4 focus:ring-green-500/10 outline-none transition-all font-medium"
                      value={address.phone}
                      onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="pt-10 flex items-center justify-between border-t border-gray-50">
                  <button type="button" onClick={() => navigate("/cart")} className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-green-600 transition-colors">
                    <LuChevronLeft size={20} /> Back to Cart
                  </button>
                  <button type="submit" className="px-10 py-4 bg-green-600 text-white rounded-2xl font-bold shadow-lg shadow-green-100 hover:bg-green-700 transition-all flex items-center gap-2">
                    Summary <LuArrowRight size={20} />
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="p-8 md:p-12">
              <div className="flex items-center gap-4 mb-10">
                <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-green-600">
                  <LuShoppingBag size={24} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">Order Summary</h2>
                  <p className="text-sm text-gray-400">Review your order before payment</p>
                </div>
              </div>

              <div className="space-y-4 mb-10">
                {cartItems.map(item => (
                  <div key={item._id} className="flex justify-between items-center bg-gray-50 p-5 rounded-2xl border border-gray-100">
                    <div className="flex items-center gap-4 truncate">
                       <span className="font-bold text-green-600 bg-white border border-green-100 px-3 py-1 rounded-lg text-xs">{item.qty}x</span>
                       <span className="text-gray-900 font-bold truncate">{item.name || "Product"}</span>
                    </div>
                    <span className="font-bold text-gray-900">₹{((item.price || 0) * item.qty).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="bg-gray-900 text-white p-8 rounded-3xl mb-10 space-y-4">
                 <div className="flex justify-between text-gray-400 text-sm font-bold uppercase tracking-widest">
                    <span>Shipping to</span>
                    <button onClick={() => setStep(1)} className="text-green-400 hover:underline">Change</button>
                 </div>
                 <p className="text-sm font-medium leading-relaxed">
                   {address.address}, {address.city}, {address.state} - {address.pincode}
                 </p>
                 <div className="pt-4 border-t border-white/10 flex justify-between items-end">
                    <span className="text-sm text-gray-400 font-bold uppercase tracking-widest">Total Amount</span>
                    <span className="text-3xl font-bold">₹{totalPrice.toLocaleString()}</span>
                 </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={loading}
                className="w-full py-5 bg-green-600 text-white rounded-2xl font-bold shadow-xl shadow-green-100 hover:bg-amber-500 hover:shadow-amber-100 transition-all text-lg flex items-center justify-center gap-3 disabled:opacity-50"
              >
                {loading ? <LuLoaderCircle className="animate-spin" size={24} /> : <>Pay Now <LuCircleCheck size={24} /></>}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Checkout;
