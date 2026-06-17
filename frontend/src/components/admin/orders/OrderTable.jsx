import React, { useState } from "react";
import API from "../../../services/api";
import toast from "react-hot-toast";
import DataTable from "../shared/DataTable";
import StatusBadge from "../shared/StatusBadge";

const statuses = [
  "pending",
  "confirmed",
  "packed",
  "shipped",
  "out_for_delivery",
  "delivered",
  "cancelled",
  "returned",
];

const OrderTable = ({ orders = [], onRefresh, onSelect }) => {
  const [updating, setUpdating] = useState("");

  const updateStatus = async (order, status) => {
    try {
      setUpdating(order._id);
      await API.patch(`/admin/orders-v2/${order._id}`, { status });
      toast.success("Order status updated");
      onRefresh();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update order");
    } finally {
      setUpdating("");
    }
  };

  return (
    <DataTable
      data={orders}
      columns={[
        {
          key: "id",
          header: "Order",
          render: (o) => (
            <button
              onClick={() => onSelect(o)}
              className="font-black text-white dark:text-green-400"
            >
              #{o._id?.slice(-8).toUpperCase()}
            </button>
          ),
        },
        {
          key: "customer",
          header: "Customer",
          render: (o) => o.user?.name || "Customer",
        },
        {
          key: "total",
          header: "Total",
          render: (o) => `INR ${(o.totalPrice || 0).toLocaleString("en-IN")}`,
        },
        {
          key: "payment",
          header: "Payment",
          render: (o) => <StatusBadge value={o.paymentStatus} />,
        },
        {
          key: "status",
          header: "Status",
          render: (o) => <StatusBadge value={o.orderStatus} />,
        },
        {
          key: "actions",
          header: "Update",
          render: (o) => (
            <select
              disabled={updating === o._id}
              value={o.orderStatus}
              onChange={(e) => updateStatus(o, e.target.value)}
              className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-800"
            >
              {statuses.map((status) => (
                <option key={status} value={status}>
                  {status.replaceAll("_", " ")}
                </option>
              ))}
            </select>
          ),
        },
      ]}
    />
  );
};

export default OrderTable;
