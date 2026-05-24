import React from "react";
import DeliveryTimeline from "./DeliveryTimeline";

const OrderDetailsModal = ({ order, onClose }) => {
  if (!order) return null;
  return (
    <div className="fixed inset-0 z-[180] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl dark:bg-gray-900">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl font-black text-gray-900 dark:text-white">Order #{order._id?.slice(-8).toUpperCase()}</h3>
            <p className="mt-1 text-sm text-gray-500">{order.user?.name || "Customer"} · INR {(order.totalPrice || 0).toLocaleString("en-IN")}</p>
          </div>
          <button onClick={onClose} className="rounded-xl bg-gray-100 px-3 py-2 font-black dark:bg-gray-800 dark:text-white">Close</button>
        </div>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <div>
            <h4 className="mb-3 font-black text-gray-900 dark:text-white">Items</h4>
            <div className="space-y-3">
              {order.items?.map((item) => (
                <div key={item._id || item.name} className="rounded-2xl bg-gray-50 p-4 dark:bg-gray-800">
                  <p className="font-bold text-gray-900 dark:text-white">{item.name}</p>
                  <p className="text-sm text-gray-500">{item.quantity} x INR {item.price}</p>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h4 className="mb-3 font-black text-gray-900 dark:text-white">Timeline</h4>
            <DeliveryTimeline history={order.statusHistory || []} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;
