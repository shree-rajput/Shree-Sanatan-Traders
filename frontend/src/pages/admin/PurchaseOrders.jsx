import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import API from "../../services/api";
import { FaCheckCircle } from "react-icons/fa";
import { LuFileDown, LuClock } from "react-icons/lu";

const PurchaseOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await API.get("/admin/purchases");
      if (res.data.success) {
        setOrders(res.data.data);
      }
    } catch (error) {
      toast.error("Failed to load purchase orders");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      const res = await API.put(`/admin/purchases/${id}/status`, { status });
      if (res.data.success) {
        toast.success(`Order marked as ${status}`);
        fetchOrders(); // Refresh
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update status");
    }
  };

  const downloadPDF = (id) => {
    window.open(`${API.defaults.baseURL}/admin/purchases/${id}/pdf`, "_blank");
  };

  if (loading) return <div>Loading Purchase Orders...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black dark:text-white">Purchase Orders</h1>
        <p className="text-gray-500">
          Manage supplier orders and download invoices.
        </p>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-sm border border-gray-100 dark:border-gray-800">
        <table className="w-full text-left">
          <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 text-sm">
            <tr>
              <th className="px-6 py-4">PO Number</th>
              <th className="px-6 py-4">Supplier</th>
              <th className="px-6 py-4">Total Amount</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
            {orders.length === 0 ? (
              <tr>
                <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                  No purchase orders found.
                </td>
              </tr>
            ) : (
              orders.map((po) => (
                <tr key={po._id}>
                  <td className="px-6 py-4 font-medium dark:text-white">
                    {po._id.slice(-6).toUpperCase()}
                  </td>
                  <td className="px-6 py-4 dark:text-gray-300">
                    {po.supplier?.name || "Unknown"}
                  </td>
                  <td className="px-6 py-4 font-bold text-green-600">
                    Rs. {po.totalAmount}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        po.status === "received"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {po.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 flex justify-end gap-2">
                    {po.status !== "received" && (
                      <button
                        onClick={() => handleStatusUpdate(po._id, "received")}
                        className="bg-black text-white px-3 py-2 rounded-lg text-sm flex items-center gap-1 hover:bg-gray-800"
                        title="Mark as Received & Update Stock"
                      >
                        <FaCheckCircle /> Receive
                      </button>
                    )}
                    <button
                      onClick={() => downloadPDF(po._id)}
                      className="bg-blue-50 text-blue-600 px-3 py-2 rounded-lg text-sm flex items-center gap-1 hover:bg-blue-100 font-bold"
                    >
                      <LuFileDown /> PDF
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PurchaseOrders;
