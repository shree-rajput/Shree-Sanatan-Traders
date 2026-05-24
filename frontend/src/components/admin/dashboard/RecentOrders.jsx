import React from "react";
import StatusBadge from "../shared/StatusBadge";

const RecentOrders = ({ orders = [] }) => (
  <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
    <h3 className="text-lg font-black text-gray-900 dark:text-white">Recent Orders</h3>
    <div className="mt-5 space-y-4">
      {orders.map((order) => (
        <div key={order._id} className="flex items-center justify-between gap-4 rounded-2xl bg-gray-50 p-4 dark:bg-gray-800/70">
          <div>
            <p className="font-black text-gray-900 dark:text-white">#{order._id?.slice(-8).toUpperCase()}</p>
            <p className="text-xs text-gray-500">{order.user?.name || "Customer"}</p>
          </div>
          <StatusBadge value={order.orderStatus} />
        </div>
      ))}
    </div>
  </div>
);

export default RecentOrders;
