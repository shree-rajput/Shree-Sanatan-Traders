import React, { useEffect, useState, useCallback } from "react";
import API from "../../services/api";
import toast from "react-hot-toast";

import {
  LuSearch,
  LuRefreshCcw,
  LuPackage,
  LuTruck,
  LuCircleCheck,
  LuBadgeX,
  LuLoader,
  LuCalendar,
  LuUser,
  LuPhone,
  LuChevronDown,
  LuChartBar,
} from "react-icons/lu";

const STATUS_FLOW = [
  "pending",
  "confirmed",
  "packed",
  "shipped",
  "out_for_delivery",
  "delivered",
  "cancelled",
  "returned",
];

const STATUS_STYLES = {
  pending: {
    label: "Pending",
    cls: "bg-amber-100 text-amber-700 border-amber-200",
  },
  confirmed: {
    label: "Confirmed",
    cls: "bg-blue-100 text-blue-700 border-blue-200",
  },
  packed: {
    label: "Packed",
    cls: "bg-indigo-100 text-indigo-700 border-indigo-200",
  },
  shipped: {
    label: "Shipped",
    cls: "bg-purple-100 text-purple-700 border-purple-200",
  },
  out_for_delivery: {
    label: "Out for Delivery",
    cls: "bg-orange-100 text-orange-700 border-orange-200",
  },
  delivered: {
    label: "Delivered",
    cls: "bg-green-100 text-green-700 border-green-200",
  },
  cancelled: {
    label: "Cancelled",
    cls: "bg-red-100 text-red-700 border-red-200",
  },
  returned: {
    label: "Returned",
    cls: "bg-gray-100 text-gray-700 border-gray-200",
  },
};

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [analytics, setAnalytics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [trackingInputs, setTrackingInputs] = useState({});

  const fetchOrders = useCallback(async () => {
    setLoading(true);

    try {
      const params = new URLSearchParams({ limit: 100 });

      if (filterStatus !== "all") {
        params.set("status", filterStatus);
      }

      const res = await API.get(`/orders/admin/all?${params}`);

      setOrders(res.data.orders || []);
      setAnalytics(res.data.analytics || []);
    } catch (err) {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, [filterStatus]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleStatusUpdate = async (
    orderId,
    status,
    trackingId
  ) => {
    setUpdatingId(orderId);

    try {
      await API.put(`/orders/${orderId}/status`, {
        status,
        trackingId: trackingId || undefined,
        note: `Status updated to ${status} by admin`,
      });

      toast.success(
        `Status updated: ${STATUS_STYLES[status]?.label || status
        }`
      );

      fetchOrders();
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Update failed"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  // Analytics totals
  const totalRevenue = analytics
    .filter(
      (a) => !["cancelled", "returned"].includes(a._id)
    )
    .reduce((s, a) => s + (a.revenue || 0), 0);

  const analyticsMap = {};

  analytics.forEach((a) => {
    analyticsMap[a._id] = a;
  });

  // Search Filter
  const filtered = orders.filter((o) => {
    if (!search) return true;

    const s = search.toLowerCase();

    return (
      o._id?.toLowerCase().includes(s) ||
      o.user?.name?.toLowerCase().includes(s) ||
      o.user?.phone?.toLowerCase().includes(s) ||
      o.user?.email?.toLowerCase().includes(s)
    );
  });

  const STAT_CARDS = [
    {
      label: "Total Orders",
      value: orders.length,
      color: "bg-blue-50 text-blue-700",
      icon: <LuPackage size={20} />,
    },
    {
      label: "Revenue",
      value: `₹${totalRevenue.toLocaleString()}`,
      color: "bg-green-50 text-green-700",
      icon: <LuChartBar size={20} />,
    },
    {
      label: "Pending",
      value: analyticsMap.pending?.count || 0,
      color: "bg-amber-50 text-amber-700",
      icon: <LuLoader size={20} />,
    },
    {
      label: "Delivered",
      value: analyticsMap.delivered?.count || 0,
      color: "bg-emerald-50 text-emerald-700",
      icon: <LuCircleCheck size={20} />,
    },
    {
      label: "Cancelled",
      value: analyticsMap.cancelled?.count || 0,
      color: "bg-red-50 text-red-700",
      icon: <LuBadgeX size={20} />,
    },
    {
      label: "Shipped",
      value: analyticsMap.shipped?.count || 0,
      color: "bg-purple-50 text-purple-700",
      icon: <LuTruck size={20} />,
    },
  ];

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Order Management
          </h1>

          <p className="text-sm text-gray-500 mt-1">
            Manage and track all customer orders
          </p>
        </div>

        <button
          onClick={fetchOrders}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-xl text-sm font-bold hover:bg-gray-50 transition-all shadow-sm"
        >
          <LuRefreshCcw size={16} />
          Refresh
        </button>
      </div>

      {/* Analytics */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {STAT_CARDS.map((card) => (
          <div
            key={card.label}
            className={`${card.color} rounded-2xl p-4 border border-opacity-20`}
          >
            <div className="flex items-center justify-between mb-2">
              {card.icon}
            </div>

            <p className="text-2xl font-bold">
              {card.value}
            </p>

            <p className="text-xs font-bold opacity-70 uppercase tracking-wide mt-1">
              {card.label}
            </p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <LuSearch
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by Order ID, customer name, phone..."
            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl text-sm font-medium outline-none focus:border-green-500 transition-colors"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {["all", ...STATUS_FLOW].map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-3 py-2 rounded-xl text-xs font-bold transition-all capitalize ${filterStatus === s
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                }`}
            >
              {s === "all"
                ? "All"
                : STATUS_STYLES[s]?.label || s}

              {s !== "all" && analyticsMap[s] && (
                <span className="ml-1 opacity-60">
                  ({analyticsMap[s].count})
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Orders */}
      {loading ? (
        <div className="flex items-center justify-center py-24 bg-white rounded-2xl border border-gray-100">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-green-600" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-20 text-center">
          <LuPackage
            size={48}
            className="mx-auto text-gray-200 mb-4"
          />

          <p className="text-gray-400 font-bold">
            No orders found
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((order) => {
            const cfg =
              STATUS_STYLES[order.orderStatus] ||
              STATUS_STYLES.pending;

            const isUpdating =
              updatingId === order._id;

            const trackingVal =
              trackingInputs[order._id] ??
              order.trackingId ??
              "";

            return (
              <div
                key={order._id}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
              >
                <div className="px-6 py-4 border-b border-gray-50 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex gap-6 flex-wrap">
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                        Order ID
                      </p>

                      <p className="text-xs font-mono font-bold text-gray-800">
                        #
                        {order._id
                          ?.slice(-8)
                          .toUpperCase()}
                      </p>
                    </div>

                    {order.user && (
                      <div>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                          Customer
                        </p>

                        <p className="text-sm font-bold text-gray-800 flex items-center gap-1">
                          <LuUser
                            size={12}
                            className="text-gray-400"
                          />
                          {order.user.name}
                        </p>

                        {order.user.phone && (
                          <p className="text-xs text-gray-400 flex items-center gap-1">
                            <LuPhone size={11} />
                            {order.user.phone}
                          </p>
                        )}
                      </div>
                    )}

                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                        Amount
                      </p>

                      <p className="text-lg font-bold text-gray-900">
                        ₹
                        {order.totalPrice?.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest border ${cfg.cls}`}
                  >
                    {cfg.label}
                  </span>
                </div>

                {/* Controls */}
                <div className="px-6 py-4 bg-gray-50/50 flex flex-wrap items-end gap-4">
                  <div>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                      Update Status
                    </p>

                    <div className="relative">
                      <select
                        defaultValue={order.orderStatus}
                        onChange={(e) =>
                          handleStatusUpdate(
                            order._id,
                            e.target.value,
                            trackingVal
                          )
                        }
                        disabled={isUpdating}
                        className="appearance-none bg-white border border-gray-200 text-gray-800 text-sm font-bold px-4 py-2.5 pr-8 rounded-xl focus:border-green-500 outline-none cursor-pointer disabled:opacity-50 shadow-sm"
                      >
                        {STATUS_FLOW.map((s) => (
                          <option key={s} value={s}>
                            {STATUS_STYLES[s]?.label || s}
                          </option>
                        ))}
                      </select>

                      <LuChevronDown
                        size={14}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                      />
                    </div>
                  </div>

                  <div className="flex-1 min-w-48">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">
                      Tracking ID
                    </p>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={trackingVal}
                        onChange={(e) =>
                          setTrackingInputs((prev) => ({
                            ...prev,
                            [order._id]:
                              e.target.value,
                          }))
                        }
                        placeholder="Enter tracking number..."
                        className="flex-1 bg-white border border-gray-200 text-sm font-medium px-4 py-2.5 rounded-xl outline-none focus:border-green-500 transition-colors"
                      />

                      <button
                        onClick={() =>
                          handleStatusUpdate(
                            order._id,
                            order.orderStatus,
                            trackingVal
                          )
                        }
                        disabled={isUpdating}
                        className="px-4 py-2.5 bg-green-600 text-white rounded-xl text-xs font-bold hover:bg-green-700 transition-all shadow-sm disabled:opacity-50 flex items-center gap-1"
                      >
                        {isUpdating ? (
                          <LuLoader
                            className="animate-spin"
                            size={14}
                          />
                        ) : (
                          <LuTruck size={14} />
                        )}

                        Save
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <p className="text-center text-xs text-gray-400 font-medium pb-4">
        Showing {filtered.length} of {orders.length} orders
      </p>
    </div>
  );
};

export default AdminOrders;