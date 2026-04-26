import React, { useEffect, useState } from "react";

import API from "../../services/api";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.get("/admin/orders", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOrders(res.data);
    } catch (err) {
      console.error("Failed to fetch admin orders", err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      await API.put(`/admin/orders/${orderId}`, { orderStatus: newStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Optimitically update UI
      setOrders(orders.map(o => o._id === orderId ? { ...o, orderStatus: newStatus } : o));
    } catch (err) {
      console.error("Failed to update status", err);
      alert("Failed to update status");
    }
  };

  return (
    <div className="max-w-6xl mx-auto animate-in fade-in duration-500">
        <h1 className="text-3xl font-black text-gray-900 mb-8 tracking-tight">Manage Orders</h1>
        
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          {loading ? (
             <div className="flex justify-center items-center h-64">
               <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-emerald-500"></div>
             </div>
          ) : (
             <div className="overflow-x-auto">
               <table className="w-full text-left border-collapse">
                 <thead>
                   <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase tracking-wider text-gray-500 font-bold">
                     <th className="p-4 pl-6">Order ID</th>
                     <th className="p-4">Customer</th>
                     <th className="p-4">Total Amount</th>
                     <th className="p-4 text-center">Payment</th>
                     <th className="p-4 pr-6">Order Status</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-100 text-sm">
                   {orders.map((order) => (
                     <tr key={order._id} className="hover:bg-emerald-50/50 transition-colors">
                       <td className="p-4 pl-6 font-mono text-xs text-gray-500">{order._id}</td>
                       <td className="p-4 font-bold text-gray-900">{order.user?.name || "Unknown"}</td>
                       <td className="p-4 font-black text-emerald-600 border-l border-r border-transparent">₹{order.totalPrice}</td>
                       <td className="p-4 text-center">
                         <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                            order.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                            order.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {order.paymentStatus || 'unknown'}
                          </span>
                       </td>
                       <td className="p-4 pr-6">
                         <select
                           value={order.orderStatus || "Processing"}
                           onChange={(e) => handleStatusChange(order._id, e.target.value)}
                           className="w-full bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-emerald-500 focus:border-emerald-500 block p-2.5 font-semibold shadow-sm outline-none cursor-pointer"
                         >
                           <option value="Processing">Processing</option>
                           <option value="Shipped">Shipped</option>
                           <option value="Delivered">Delivered</option>
                           <option value="Cancelled">Cancelled</option>
                         </select>
                       </td>
                     </tr>
                   ))}
                   {orders.length === 0 && (
                      <tr>
                        <td colSpan="5" className="p-8 text-center text-gray-500 italic">No orders available in the system.</td>
                      </tr>
                    )}
                 </tbody>
               </table>
             </div>
          )}
        </div>
      </div>

  );
};

export default AdminOrders;
