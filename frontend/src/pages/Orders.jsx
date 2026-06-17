import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../services/api";
import { useLanguage } from "../context/LanguageContext";
import toast from "react-hot-toast";
import {
  LuPackage,
  LuChevronRight,
  LuCalendar,
  LuBox,
  LuChevronLeft,
  LuRotateCcw,
  LuCircleX,
  LuTruck,
  LuMapPin,
} from "react-icons/lu";

const STATUS_CONFIG = {
  pending: {
    label: "Pending",
    color: "bg-amber-100 text-amber-700",
    dot: "bg-amber-500",
  },
  confirmed: {
    label: "Confirmed",
    color: "bg-blue-100 text-blue-700",
    dot: "bg-blue-500",
  },
  packed: {
    label: "Packed",
    color: "bg-indigo-100 text-indigo-700",
    dot: "bg-indigo-500",
  },
  shipped: {
    label: "Shipped",
    color: "bg-purple-100 text-purple-700",
    dot: "bg-purple-500",
  },
  out_for_delivery: {
    label: "Out for Delivery",
    color: "bg-orange-100 text-orange-700",
    dot: "bg-orange-500",
  },
  delivered: {
    label: "Delivered",
    color: "bg-green-100 text-green-700",
    dot: "bg-green-500",
  },
  cancelled: {
    label: "Cancelled",
    color: "bg-red-100 text-red-700",
    dot: "bg-red-500",
  },
  returned: {
    label: "Returned",
    color: "bg-gray-100 text-gray-700",
    dot: "bg-gray-500",
  },
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);
  const { t } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await API.get("/orders");
      setOrders(res.data.orders || res.data || []);
    } catch {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (!window.confirm("Cancel this order?")) return;
    setCancellingId(orderId);
    try {
      await API.put(`/orders/${orderId}/cancel`, {
        reason: "Cancelled by customer",
      });
      toast.success("Order cancelled");
      fetchOrders();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to cancel");
    } finally {
      setCancellingId(null);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-green-600" />
      </div>
    );

  return (
    <div className="min-h-screen bg-white py-12 px-4 md:px-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {t("my_orders")} <span className="text-green-600">📦</span>
            </h1>
            <p className="text-sm text-gray-400 mt-1 font-medium">
              {orders.length} orders
            </p>
          </div>
          <Link
            to="/products"
            className="text-sm font-bold text-gray-400 hover:text-green-600 flex items-center gap-1"
          >
            <LuChevronLeft size={16} /> {t("continue_shopping")}
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-3xl p-20 text-center border border-gray-100 shadow-sm">
            <LuBox size={56} className="mx-auto text-gray-200 mb-6" />
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              {t("no_orders")}
            </h2>
            <p className="text-gray-400 mb-8">{t("no_orders_desc")}</p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-8 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-all shadow-lg shadow-green-100"
            >
              Browse Shop <LuChevronRight size={18} />
            </Link>
          </div>
        ) : (
          <div className="space-y-5">
            {orders.map((order) => {
              const cfg =
                STATUS_CONFIG[order.orderStatus] || STATUS_CONFIG.pending;
              const canCancel = ["pending", "confirmed"].includes(
                order.orderStatus,
              );
              return (
                <div
                  key={order._id}
                  className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                >
                  <div className="bg-white px-6 py-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex gap-6 flex-wrap">
                      <div>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">
                          Date
                        </p>
                        <p className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
                          <LuCalendar size={13} className="text-green-600" />
                          {new Date(order.createdAt).toLocaleDateString(
                            "en-IN",
                            { day: "numeric", month: "short", year: "numeric" },
                          )}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">
                          Order ID
                        </p>
                        <p className="text-xs font-mono font-bold text-gray-600">
                          #{order._id?.slice(-8).toUpperCase()}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">
                          Payment
                        </p>
                        <p className="text-xs font-bold text-gray-600">
                          {order.paymentMethod === "cod"
                            ? "Cash On Delivery"
                            : order.paymentMethod || "COD"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${cfg.color}`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`}
                        />
                        {cfg.label}
                      </span>
                      <p className="text-xl font-bold text-gray-900">
                        ₹{order.totalPrice?.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="space-y-3 mb-4">
                      {order.items?.slice(0, 3).map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center border border-gray-100 overflow-hidden">
                              {item.image ? (
                                <img
                                  src={item.image}
                                  alt=""
                                  className="w-full h-full object-contain"
                                />
                              ) : (
                                <LuPackage
                                  size={18}
                                  className="text-gray-300"
                                />
                              )}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-gray-900">
                                {item.name}
                              </p>
                              <p className="text-xs text-gray-400">
                                Qty: {item.quantity} × ₹
                                {item.price?.toLocaleString()}
                              </p>
                            </div>
                          </div>
                          <p className="text-sm font-bold text-gray-700">
                            ₹
                            {(
                              (item.price || 0) * item.quantity
                            ).toLocaleString()}
                          </p>
                        </div>
                      ))}
                      {order.items?.length > 3 && (
                        <p className="text-xs text-gray-400 font-medium">
                          +{order.items.length - 3} more items
                        </p>
                      )}
                    </div>

                    {order.trackingId && (
                      <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 flex items-center gap-2 mb-4">
                        <LuTruck size={16} className="text-blue-600" />
                        <p className="text-sm text-blue-700 font-bold">
                          Tracking: {order.trackingId}
                        </p>
                      </div>
                    )}

                    {order.shippingAddress && (
                      <div className="flex items-start gap-2 text-xs text-gray-400 mb-4">
                        <LuMapPin
                          size={13}
                          className="text-gray-300 shrink-0 mt-0.5"
                        />
                        <span>
                          {order.shippingAddress.address},{" "}
                          {order.shippingAddress.city}
                        </span>
                      </div>
                    )}

                    <div className="flex items-center gap-3 pt-4 border-t border-gray-50 flex-wrap">
                      <Link
                        to={`/orders/${order._id}`}
                        className="flex items-center gap-1 text-xs font-bold text-green-600 border border-green-200 px-4 py-2 rounded-xl hover:bg-green-50 transition-all"
                      >
                        View Details <LuChevronRight size={14} />
                      </Link>
                      {canCancel && (
                        <button
                          onClick={() => handleCancelOrder(order._id)}
                          disabled={cancellingId === order._id}
                          className="flex items-center gap-1 text-xs font-bold text-red-500 border border-red-200 px-4 py-2 rounded-xl hover:bg-red-50 transition-all disabled:opacity-50"
                        >
                          <LuCircleX size={14} /> Cancel
                        </button>
                      )}
                      {order.orderStatus === "delivered" && (
                        <button
                          onClick={() => navigate("/products")}
                          className="flex items-center gap-1 text-xs font-bold text-gray-500 border border-gray-200 px-4 py-2 rounded-xl hover:bg-gray-50 transition-all"
                        >
                          <LuRotateCcw size={14} /> Reorder
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
