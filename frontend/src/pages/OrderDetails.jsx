import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../services/api";
import { useLanguage } from "../context/LanguageContext";
import toast from "react-hot-toast";

import {
  LuPackage,
  LuChevronLeft,
  LuTruck,
  LuMapPin,
  LuCircleX,
  LuRefreshCcw,
  LuLoader,
} from "react-icons/lu";

const TIMELINE = [
  { key: "pending", label: "Order Placed", icon: "📋", hi: "ऑर्डर दिया" },
  { key: "confirmed", label: "Confirmed", icon: "✅", hi: "पुष्टि हुई" },
  { key: "packed", label: "Packed", icon: "📦", hi: "पैक हुआ" },
  { key: "shipped", label: "Shipped", icon: "🚚", hi: "भेजा गया" },
  {
    key: "out_for_delivery",
    label: "Out for Delivery",
    icon: "🏍️",
    hi: "डिलीवरी के लिए",
  },
  { key: "delivered", label: "Delivered", icon: "🏠", hi: "डिलीवर हुआ" },
];

const STATUS_ORDER = [
  "pending",
  "confirmed",
  "packed",
  "shipped",
  "out_for_delivery",
  "delivered",
];

const OrderDetails = () => {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);

  const { t, lang } = useLanguage();

  useEffect(() => {
    API.get(`/orders/${id}`)
      .then((res) => setOrder(res.data.order || res.data))
      .catch(() => toast.error(t("failed_load_order")))
      .finally(() => setLoading(false));
  }, [id]);

  const handleCancel = async () => {
    if (!window.confirm("Cancel this order?")) return;

    setCancelling(true);

    try {
      const res = await API.put(`/orders/${id}/cancel`, {
        reason: "Cancelled by customer",
      });

      setOrder(res.data.order);

      toast.success("Order cancelled successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to cancel");
    } finally {
      setCancelling(false);
    }
  };

  const handleReturn = async () => {
    const reason = window.prompt("Reason for return:");

    if (!reason) return;

    try {
      const res = await API.put(`/orders/${id}/return`, {
        reason,
      });

      setOrder(res.data.order);

      toast.success("Return request submitted");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit return");
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-green-600" />
      </div>
    );

  if (!order)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center p-6">
        <p className="text-gray-500 mb-4">{t("order_not_found")}</p>

        <Link to="/orders" className="text-green-600 font-bold">
          {t("return_to_orders_btn")}
        </Link>
      </div>
    );

  const currentIdx = STATUS_ORDER.indexOf(order.orderStatus);

  const isTerminal = ["cancelled", "returned"].includes(order.orderStatus);

  const canCancel = ["pending", "confirmed"].includes(order.orderStatus);

  const canReturn = order.orderStatus === "delivered";

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 md:px-6">
      <div className="max-w-3xl mx-auto">
        <Link
          to="/orders"
          className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-green-600 mb-8 transition-colors"
        >
          <LuChevronLeft size={18} />
          {t("back_to_orders")}
        </Link>

        <div className="bg-white rounded-3xl shadow-xl shadow-gray-100 border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-8 text-white">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <p className="text-green-100 text-xs font-bold uppercase tracking-widest mb-1">
                  {t("order_id")}
                </p>

                <p className="font-mono font-bold text-2xl">
                  #{order._id?.slice(-8).toUpperCase()}
                </p>
              </div>

              <div className="text-right">
                <p className="text-green-100 text-xs font-bold uppercase tracking-widest mb-1">
                  Total
                </p>

                <p className="text-3xl font-bold">
                  ₹{order.totalPrice?.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          <div className="p-8 space-y-8">
            {/* Timeline */}
            {!isTerminal && (
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">
                  Order Progress
                </h3>

                <div className="flex items-center justify-between">
                  {TIMELINE.map((step, idx) => {
                    const done = idx <= currentIdx;
                    const active = idx === currentIdx;

                    return (
                      <React.Fragment key={step.key}>
                        <div className="flex flex-col items-center gap-2">
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center text-base border-2 transition-all ${
                              done
                                ? "bg-green-600 border-green-600 shadow-lg shadow-green-100"
                                : "bg-white border-gray-200"
                            } ${active ? "ring-4 ring-green-100" : ""}`}
                          >
                            {done ? "✓" : step.icon}
                          </div>

                          <span
                            className={`text-[9px] font-bold text-center max-w-[60px] leading-tight ${
                              done ? "text-green-600" : "text-gray-400"
                            }`}
                          >
                            {lang === "hi" ? step.hi : step.label}
                          </span>
                        </div>

                        {idx < TIMELINE.length - 1 && (
                          <div
                            className={`flex-1 h-0.5 mx-1 transition-all ${
                              idx < currentIdx ? "bg-green-500" : "bg-gray-200"
                            }`}
                          />
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Cancelled/Returned */}
            {isTerminal && (
              <div
                className={`p-4 rounded-2xl border ${
                  order.orderStatus === "cancelled"
                    ? "bg-red-50 border-red-100 text-red-700"
                    : "bg-gray-50 border-gray-200 text-gray-600"
                }`}
              >
                <p className="font-bold capitalize">
                  Order {order.orderStatus}
                </p>

                {(order.cancelReason || order.returnReason) && (
                  <p className="text-sm mt-1 opacity-80">
                    Reason: {order.cancelReason || order.returnReason}
                  </p>
                )}
              </div>
            )}

            {/* Tracking */}
            {order.trackingId && (
              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-center gap-3">
                <LuTruck size={20} className="text-blue-600" />

                <div>
                  <p className="text-xs font-bold text-blue-500 uppercase tracking-widest">
                    Tracking ID
                  </p>

                  <p className="font-mono font-bold text-blue-800">
                    {order.trackingId}
                  </p>
                </div>
              </div>
            )}

            {/* Items */}
            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
                {t("items_purchased")}
              </h3>

              <div className="space-y-3">
                {order.items?.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between bg-gray-50 p-4 rounded-2xl border border-gray-100"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white rounded-xl border border-gray-100 flex items-center justify-center overflow-hidden">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt=""
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <LuPackage size={20} className="text-gray-300" />
                        )}
                      </div>

                      <div>
                        <p className="font-bold text-gray-900 text-sm">
                          {item.name}
                        </p>

                        <p className="text-xs text-gray-400">
                          Qty: {item.quantity} × ₹{item.price?.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <p className="font-bold text-gray-900">
                      ₹{((item.price || 0) * item.quantity).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 flex-wrap pt-2">
              {canCancel && (
                <button
                  onClick={handleCancel}
                  disabled={cancelling}
                  className="flex items-center gap-2 px-6 py-3 bg-red-50 text-red-600 border border-red-200 rounded-xl font-bold text-sm hover:bg-red-100 transition-all disabled:opacity-50"
                >
                  {cancelling ? (
                    <LuLoader className="animate-spin" size={16} />
                  ) : (
                    <LuCircleX size={16} />
                  )}
                  Cancel Order
                </button>
              )}

              {canReturn && (
                <button
                  onClick={handleReturn}
                  className="flex items-center gap-2 px-6 py-3 bg-amber-50 text-amber-700 border border-amber-200 rounded-xl font-bold text-sm hover:bg-amber-100 transition-all"
                >
                  <LuRefreshCcw size={16} />
                  Request Return
                </button>
              )}

              <Link
                to="/products"
                className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl font-bold text-sm hover:bg-green-700 transition-all shadow-lg shadow-green-100"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
