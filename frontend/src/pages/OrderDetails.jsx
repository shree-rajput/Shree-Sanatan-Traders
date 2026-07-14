import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../services/api";
import toast from "react-hot-toast";
import { useLanguage } from "../context/LanguageContext";
import {
  ClockFading,
  PackageCheck,
  Package,
  Truck,
  Bike,
  House,
  Check,
} from "lucide-react";

import {
  LuPackage,
  LuChevronLeft,
  LuTruck,
  LuCircleX,
  LuRefreshCcw,
  LuLoader,
  LuX,
} from "react-icons/lu";

// for rating
import { Rating } from "@smastrom/react-rating";
import "@smastrom/react-rating/style.css";

const TIMELINE = [
  {
    key: "pending",
    label: "Order Placed",
    icon: <ClockFading size={18} />,
  },
  {
    key: "confirmed",
    label: "Confirmed",
    icon: <Package size={18} />,
  },
  {
    key: "packed",
    label: "Packed",
    icon: <PackageCheck size={18} />,
  },
  {
    key: "out_for_delivery",
    label: "Out for Delivery",
    icon: <Truck size={18} />,
  },
  {
    key: "delivered",
    label: "Delivered",
    icon: <House size={18} />,
  },
];

const STATUS_ORDER = [
  "pending",
  "confirmed",
  "packed",
  "out_for_delivery",
  "delivered",
];

const OrderDetails = () => {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // Dialog States
  const [showReasonModal, setShowReasonModal] = useState(false);
  const [actionType, setActionType] = useState("");
  const [reason, setReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  const [rating, setRating] = useState("");
  const [comment, setComment] = useState("");

  const { t, lang } = useLanguage();
  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    try {
      const res = await API.get(`/orders/${id}`);
      setOrder(res.data.order || res.data);
    } catch (err) {
      toast.error("Failed to load order");
    } finally {
      setLoading(false);
    }
  };

  // OPEN MODAL
  const openModal = (type) => {
    setActionType(type);
    setShowReasonModal(true);
  };

  // SUBMIT ACTION
  const handleActionSubmit = async () => {
    if (!reason.trim()) {
      return toast.error("Please enter reason");
    }

    try {
      setActionLoading(true);

      let endpoint = "";

      if (actionType === "cancel") {
        endpoint = `/orders/${id}/cancel`;
      }

      if (actionType === "return") {
        endpoint = `/orders/${id}/return`;
      }

      const res = await API.put(endpoint, {
        reason,
      });

      setOrder(res.data.order);

      toast.success(
        actionType === "cancel"
          ? "Order cancelled successfully"
          : "Return request submitted",
      );

      setShowReasonModal(false);
      setReason("");
      setActionType("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-12 h-12 rounded-full border-4 border-green-200 border-t-green-600 animate-spin"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-gray-700">Order not found</h2>

        <Link to="/orders" className="mt-4 text-green-600 font-semibold">
          Back to Orders
        </Link>
      </div>
    );
  }

  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    try {
      const item = order.items[0];

      await API.post("/reviews", {
        productId: item.product,
        orderId: order._id,
        rating,
        comment,
      });

      toast.success("Review submitted");

      setRating("");
      setComment("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit review");
    }
  };

  const currentIdx = STATUS_ORDER.indexOf(order.orderStatus);

  const isTerminal = ["cancelled", "returned"].includes(order.orderStatus);

  const canCancel = ["pending", "confirmed"].includes(order.orderStatus);

  const canReturn = order.orderStatus === "delivered";

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-4xl mx-auto">
        {/* BACK BUTTON */}
        <Link
          to="/orders"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-green-600 font-semibold mb-6 transition"
        >
          <LuChevronLeft />
          Back to Orders
        </Link>

        {/* CARD */}
        <div className="bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100">
          {/* HEADER */}
          <div className="bg-gradient-to-r from-green-600 to-emerald-500 p-8 text-white">
            <div className="flex justify-between items-center flex-wrap gap-5">
              <div>
                <p className="uppercase text-xs tracking-widest text-green-100 font-bold">
                  Order ID
                </p>

                <h2 className="text-3xl font-black mt-1">
                  #{order._id.slice(-8).toUpperCase()}
                </h2>
              </div>

              <div className="text-right">
                <p className="uppercase text-xs tracking-widest text-green-100 font-bold">
                  Total Amount
                </p>

                <h2 className="text-4xl font-black mt-1">
                  ₹{order.totalPrice?.toLocaleString()}
                </h2>
              </div>
            </div>
          </div>

          <div className="p-8 space-y-10">
            {/* TIMELINE */}
            {!isTerminal && (
              <div>
                <h3 className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-8">
                  Order Progress
                </h3>

                <div className="flex items-center justify-between">
                  {TIMELINE.map((step, idx) => {
                    const done = idx <= currentIdx;
                    const active = idx === currentIdx;

                    return (
                      <React.Fragment key={step.key}>
                        <div className="flex flex-col items-center gap-3">
                          <div
                            className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-500 ease-in-out transform
                            ${
                              done
                                ? "bg-green-600 border-green-600 text-white scale-110 shadow-lg"
                                : "bg-white border-gray-300 text-gray-400 scale-100"
                            }
                            ${active ? "ring-4 ring-green-100 animate-bounce" : ""}
                            `}
                          >
                            {done ? (
                              <Check
                                size={18}
                                className="animate-in fade-in zoom-in duration-300"
                              />
                            ) : (
                              step.icon
                            )}
                          </div>

                          <p
                            className={`text-[11px] text-center font-bold max-w-[70px]
                            ${done ? "text-green-600" : "text-gray-400"}
                            `}
                          >
                            {step.label}
                          </p>
                        </div>

                        {idx < TIMELINE.length - 1 && (
                          <div className="flex-1 h-1 mx-2 rounded-full bg-gray-200 overflow-hidden relative">
                            <div
                              className={`absolute top-0 left-0 h-full rounded-full bg-green-500 transition-all duration-700 ease-in-out`}
                              style={{
                                width: idx < currentIdx ? "100%" : "0%",
                              }}
                            />
                          </div>
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>
              </div>
            )}

            {/* CANCELLED / RETURNED */}
            {isTerminal && (
              <div
                className={`rounded-2xl p-5 border
                ${
                  order.orderStatus === "cancelled"
                    ? "bg-red-50 border-red-100"
                    : "bg-yellow-50 border-yellow-100"
                }
                `}
              >
                <h3 className="text-lg font-bold capitalize">
                  Order {order.orderStatus}
                </h3>

                <p className="text-sm text-gray-600 mt-2">
                  Reason: {order.cancelReason || order.returnReason}
                </p>
              </div>
            )}

            {/* TRACKING */}
            {order.trackingId && (
              <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                  <LuTruck size={22} className="text-blue-600" />
                </div>

                <div>
                  <p className="uppercase text-xs tracking-widest text-blue-500 font-bold">
                    Tracking ID
                  </p>

                  <h3 className="font-mono font-black text-blue-800 text-lg">
                    {order.trackingId}
                  </h3>
                </div>
              </div>
            )}

            {/* PAYMENT STATUS */}
            <div className="flex flex-wrap gap-4">
              <div className="bg-gray-50 rounded-2xl p-5 border flex-1 min-w-[220px]">
                <p className="uppercase text-xs text-gray-400 font-bold tracking-widest">
                  Payment Method
                </p>

                <h3 className="text-xl font-black mt-2 uppercase">
                  {order.paymentMethod}
                </h3>
              </div>

              <div className="bg-gray-50 rounded-2xl p-5 border flex-1 min-w-[220px]">
                <p className="uppercase text-xs text-gray-400 font-bold tracking-widest">
                  Payment Status
                </p>

                <h3
                  className={`text-xl font-black mt-2 uppercase
                  ${
                    order.paymentStatus === "paid"
                      ? "text-green-600"
                      : "text-orange-500"
                  }
                  `}
                >
                  {order.paymentStatus}
                </h3>
              </div>
            </div>

            {/* ITEMS */}
            <div>
              <h3 className="text-xs font-bold tracking-widest uppercase text-gray-400 mb-5">
                Purchased Items
              </h3>

              <div className="space-y-4">
                {order.items?.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between gap-4 bg-gray-50 border border-gray-100 rounded-2xl p-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-white rounded-2xl overflow-hidden border border-gray-100 flex items-center justify-center">
                        {item.image ? (
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <LuPackage size={22} className="text-gray-300" />
                        )}
                      </div>

                      <div>
                        <h3 className="font-bold text-gray-900">{item.name}</h3>

                        <p className="text-sm text-gray-500 mt-1">
                          Qty: {item.quantity}
                        </p>

                        <p className="text-sm text-gray-500">
                          ₹{item.price?.toLocaleString()} each
                        </p>
                      </div>
                    </div>

                    <h3 className="font-black text-lg text-gray-900">
                      ₹{(item.price * item.quantity).toLocaleString()}
                    </h3>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              {order.orderStatus === "delivered" ? (
                <div className="bg-green-50 border border-green-100 rounded-2xl p-4">
                  <p className="text-xs uppercase tracking-widest font-bold text-green-500">
                    Delivered Successfully
                  </p>

                  <h3 className="text-lg font-black text-green-700 mt-1">
                    Delivered on{" "}
                    {new Date(order.deliveredAt).toLocaleDateString("en-IN", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                    })}
                  </h3>
                </div>
              ) : (
                <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
                  <p className="text-xs uppercase tracking-widest font-bold text-blue-500">
                    Expected Delivery
                  </p>

                  <h3 className="text-lg font-black text-blue-700 mt-1">
                    Arriving by{" "}
                    {new Date(order.estimatedDelivery).toLocaleDateString(
                      "en-IN",
                      {
                        weekday: "short",
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      },
                    )}
                  </h3>
                </div>
              )}

              {order.orderStatus !== "delivered" && (
                <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4">
                  <p className="text-xs uppercase tracking-widest font-bold text-gray-400">
                    Delivery Verification Code
                  </p>

                  <div className="flex items-center justify-between mt-2">
                    <h3 className="text-2xl font-black tracking-widest font-mono text-gray-900">
                      {order.deliveryCode}
                    </h3>

                    <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-bold">
                      Share at delivery
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* ACTIONS */}
            <div className="flex flex-wrap gap-4 pt-3">
              {canCancel && (
                <button
                  onClick={() => openModal("cancel")}
                  className="px-6 py-3 rounded-2xl bg-red-50 border border-red-200 text-red-600 font-bold hover:bg-red-100 transition flex items-center gap-2"
                >
                  <LuCircleX />
                  Cancel Order
                </button>
              )}

              {canReturn && (
                <button
                  onClick={() => openModal("return")}
                  className="px-6 py-3 rounded-2xl bg-yellow-50 border border-yellow-200 text-yellow-700 font-bold hover:bg-yellow-100 transition flex items-center gap-2"
                >
                  <LuRefreshCcw />
                  Return Order
                </button>
              )}

              <Link
                to="/products"
                className="px-6 py-3 rounded-2xl bg-green-600 text-white font-bold hover:bg-green-700 transition shadow-lg shadow-green-100"
              >
                Continue Shopping
              </Link>
            </div>

            {/* review system */}
            {order.orderStatus === "delivered" && (
              <div className="bg-white border rounded-3xl p-6 mt-8">
                <h2 className="text-2xl font-black mb-5">Write a Review</h2>

                <form onSubmit={handleReviewSubmit} className="space-y-4">
                  <Rating
                    style={{ maxWidth: 180 }}
                    value={rating}
                    onChange={setRating}
                    isRequired
                  />
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Write your review..."
                    rows={5}
                    className="w-full border rounded-2xl p-4"
                  />

                  <button
                    type="submit"
                    className="bg-green-600 text-white px-6 py-3 rounded-2xl font-bold"
                  >
                    Submit Review
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MODAL */}
      {showReasonModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setShowReasonModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-black"
            >
              <LuX size={22} />
            </button>

            <h2 className="text-2xl font-black text-gray-900 mb-2">
              {actionType === "cancel" ? "Cancel Order" : "Return Order"}
            </h2>

            <p className="text-sm text-gray-500 mb-5">
              Please provide a reason.
            </p>

            <textarea
              rows={5}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Write your reason here..."
              className="w-full border border-gray-200 rounded-2xl p-4 outline-none focus:ring-2 focus:ring-green-500 resize-none"
            />

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowReasonModal(false)}
                className="flex-1 py-3 rounded-2xl border border-gray-200 font-bold hover:bg-gray-50 transition"
              >
                Close
              </button>

              <button
                onClick={handleActionSubmit}
                disabled={actionLoading}
                className="flex-1 py-3 rounded-2xl bg-green-600 text-white font-bold hover:bg-green-700 transition"
              >
                {actionLoading
                  ? "Submitting..."
                  : actionType === "cancel"
                    ? "Cancel Order"
                    : "Submit Return"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderDetails;
