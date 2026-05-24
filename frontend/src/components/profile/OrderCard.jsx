import React from "react";
import { LuCalendarDays, LuChevronRight, LuPackage, LuTruck } from "react-icons/lu";

const badgeStyles = {
  delivered: "bg-green-50 text-green-700 border-green-200",
  paid: "bg-green-50 text-green-700 border-green-200",
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  confirmed: "bg-blue-50 text-blue-700 border-blue-200",
  packed: "bg-indigo-50 text-indigo-700 border-indigo-200",
  shipped: "bg-purple-50 text-purple-700 border-purple-200",
  out_for_delivery: "bg-cyan-50 text-cyan-700 border-cyan-200",
  cancelled: "bg-red-50 text-red-700 border-red-200",
  failed: "bg-red-50 text-red-700 border-red-200",
  refunded: "bg-gray-50 text-gray-700 border-gray-200",
  returned: "bg-gray-50 text-gray-700 border-gray-200",
};

const StatusBadge = ({ value }) => (
  <span className={`rounded-full border px-3 py-1 text-xs font-black capitalize ${badgeStyles[value] || badgeStyles.pending}`}>
    {String(value || "pending").replaceAll("_", " ")}
  </span>
);

const OrderCard = ({ order, onDetails }) => {
  const productCount = order.items?.reduce((sum, item) => sum + (item.quantity || 0), 0) || 0;

  return (
    <button
      type="button"
      onClick={() => onDetails(order)}
      className="w-full rounded-3xl border border-gray-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-green-300 hover:shadow-xl"
    >
      <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-green-50 text-green-600">
            <LuPackage size={25} />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wide text-gray-400">Order ID</p>
            <h3 className="mt-1 text-lg font-black text-gray-900">#{order._id?.slice(-8).toUpperCase()}</h3>
            <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
              <LuCalendarDays size={15} />
              {new Date(order.createdAt).toLocaleDateString("en-IN", { dateStyle: "medium" })}
            </div>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5 lg:items-center">
          <div>
            <p className="text-xs font-bold text-gray-400">Total</p>
            <p className="font-black text-gray-900">INR {(order.totalPrice || 0).toLocaleString("en-IN")}</p>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400">Payment</p>
            <StatusBadge value={order.paymentStatus} />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400">Order</p>
            <StatusBadge value={order.orderStatus || order.status} />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400">Items</p>
            <p className="font-black text-gray-900">{productCount}</p>
          </div>
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold text-gray-400">Tracking</p>
              <p className="flex items-center gap-1 font-black text-gray-900">
                <LuTruck size={15} />
                {order.trackingId || "Not assigned"}
              </p>
            </div>
            <LuChevronRight className="text-gray-400" size={22} />
          </div>
        </div>
      </div>
    </button>
  );
};

export default OrderCard;
