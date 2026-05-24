import React, { useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { LuPackageCheck, LuTruck, LuShoppingBag, LuArrowRight, LuPhone } from "react-icons/lu";

const OrderSuccess = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const order = state?.order;

  useEffect(() => {
    if (!order) {
      navigate("/orders");
    }
  }, []);

  if (!order) return null;

  const steps = [
    { label: "Order Placed", done: true, icon: "✅" },
    { label: "Confirmed", done: false, icon: "📋" },
    { label: "Packed", done: false, icon: "📦" },
    { label: "Shipped", done: false, icon: "🚚" },
    { label: "Delivered", done: false, icon: "🏠" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50 flex items-center justify-center px-4 py-16">
      <div className="max-w-lg w-full space-y-6">

        {/* Success Card */}
        <div className="bg-white rounded-3xl shadow-2xl shadow-green-100 border border-green-100 p-10 text-center">
          {/* Animated Icon */}
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
            <LuPackageCheck size={48} className="text-green-600" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Placed! 🎉</h1>
          <p className="text-gray-500 text-sm mb-1">
            ऑर्डर सफलतापूर्वक दिया गया! Thank you for trusting us.
          </p>

          {/* Order ID */}
          <div className="mt-6 bg-gray-50 rounded-2xl p-4 border border-gray-100">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Order ID</p>
            <p className="font-mono font-bold text-gray-900 text-lg">#{order._id?.slice(-8).toUpperCase()}</p>
          </div>

          {/* Order Summary */}
          <div className="mt-6 text-left space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 font-medium">Payment Method</span>
              <span className="font-bold text-gray-900 capitalize">
                {order.paymentMethod === "cod" ? "💵 Cash on Delivery" : order.paymentMethod}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 font-medium">Total Amount</span>
              <span className="font-bold text-gray-900 text-lg">₹{order.totalPrice?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 font-medium">Estimated Delivery</span>
              <span className="font-bold text-green-600">
                {order.estimatedDelivery
                  ? new Date(order.estimatedDelivery).toLocaleDateString("en-IN", { day: "numeric", month: "long" })
                  : "5-7 business days"}
              </span>
            </div>
          </div>

          {/* Shipping Address */}
          {order.shippingAddress && (
            <div className="mt-4 p-4 bg-green-50 rounded-2xl border border-green-100 text-left">
              <p className="text-xs font-bold text-green-700 uppercase tracking-widest mb-1 flex items-center gap-1">
                <LuTruck size={14} /> Delivering to
              </p>
              <p className="text-sm text-gray-700 font-medium">
                {order.shippingAddress.houseNo}, {order.shippingAddress.area}, {order.shippingAddress.city}
              </p>
              <p className="text-sm text-gray-500">
                {order.shippingAddress.state} — {order.shippingAddress.pincode}
              </p>
            </div>
          )}
        </div>

        {/* Mini Timeline */}
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-5">Order Progress</h3>
          <div className="flex items-center justify-between">
            {steps.map((step, idx) => (
              <React.Fragment key={idx}>
                <div className="flex flex-col items-center gap-1.5">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm border-2 ${
                    step.done ? "bg-green-600 border-green-600" : "bg-white border-gray-200"
                  }`}>
                    {step.done ? "✓" : step.icon}
                  </div>
                  <span className={`text-[9px] font-bold text-center ${step.done ? "text-green-600" : "text-gray-400"}`}>
                    {step.label}
                  </span>
                </div>
                {idx < steps.length - 1 && (
                  <div className={`flex-1 h-0.5 mx-1 ${idx === 0 ? "bg-green-500" : "bg-gray-200"}`} />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="grid grid-cols-2 gap-4">
          <Link
            to="/orders"
            className="flex items-center justify-center gap-2 py-4 bg-gray-900 text-white rounded-2xl font-bold text-sm hover:bg-gray-800 transition-all"
          >
            <LuShoppingBag size={18} /> My Orders
          </Link>
          <Link
            to="/products"
            className="flex items-center justify-center gap-2 py-4 bg-green-600 text-white rounded-2xl font-bold text-sm hover:bg-green-700 transition-all shadow-lg shadow-green-100"
          >
            Shop More <LuArrowRight size={18} />
          </Link>
        </div>

        {/* WhatsApp Support */}
        <a
          href={`https://wa.me/917987805929?text=Hi! I placed order %23${order._id?.slice(-8).toUpperCase()}. Please help.`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 py-3 bg-green-500 text-white rounded-2xl font-bold text-sm hover:bg-green-600 transition-all"
        >
          <LuPhone size={18} /> WhatsApp Support
        </a>
      </div>
    </div>
  );
};

export default OrderSuccess;
