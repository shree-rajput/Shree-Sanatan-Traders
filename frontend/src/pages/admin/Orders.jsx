import React, { useEffect, useState } from "react";
import API from "../../services/api";
import { 
  LuClipboardList, 
  LuSearch, 
  LuEye, 
  LuCircleCheck, 
  LuTruck, 
  LuLoaderCircle,
  LuChevronDown
} from "react-icons/lu";
import toast from "react-hot-toast";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await API.get("/admin/orders");
      setOrders(res.data);
    } catch (err) {
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await API.put(`/admin/orders/${orderId}`, { orderStatus: newStatus });
      setOrders(orders.map(o => o._id === orderId ? { ...o, orderStatus: newStatus } : o));
      toast.success(`Order status updated to ${newStatus}`);
    } catch (err) {
      toast.error("Failed to update order status");
    }
  };

  const filtered = orders.filter(o => 
    o._id.toLowerCase().includes(searchTerm.toLowerCase()) || 
    o.user?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Order Management</h1>
          <p className="text-gray-500 font-medium mt-1">Review and process customer orders.</p>
        </div>
        <div className="relative w-full md:w-96">
          <LuSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search by Order ID or Customer..."
            className="w-full pl-12 pr-4 py-3 bg-white border border-gray-100 rounded-2xl shadow-sm focus:ring-2 focus:ring-green-600 font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-400">
            <LuLoaderCircle className="animate-spin text-green-600 mb-4" size={32} />
            <p className="text-sm font-bold uppercase tracking-widest">Loading Orders...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50 text-gray-400 text-xs font-bold uppercase tracking-widest">
                  <th className="px-10 py-5">Order Reference</th>
                  <th className="px-10 py-5">Customer</th>
                  <th className="px-10 py-5">Total Amount</th>
                  <th className="px-10 py-5">Payment</th>
                  <th className="px-10 py-5">Status</th>
                  <th className="px-10 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-10 py-6">
                      <div className="flex flex-col">
                        <span className="font-bold text-gray-900 font-mono text-xs">#{order._id.slice(-8).toUpperCase()}</span>
                        <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-1">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center font-bold text-xs border border-gray-200">
                          {order.user?.name ? order.user.name[0] : "G"}
                        </div>
                        <span className="font-bold text-gray-900">{order.user?.name || "Guest User"}</span>
                      </div>
                    </td>
                    <td className="px-10 py-6">
                       <span className="font-bold text-gray-900">₹{order.totalPrice?.toLocaleString()}</span>
                    </td>
                    <td className="px-10 py-6">
                       <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                         order.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                       }`}>
                         {order.paymentStatus}
                       </span>
                    </td>
                    <td className="px-10 py-6">
                       <div className="relative group/select">
                          <select
                            value={order.orderStatus}
                            onChange={(e) => handleStatusChange(order._id, e.target.value)}
                            className="appearance-none bg-gray-50 border border-transparent text-gray-900 text-xs font-bold rounded-xl focus:ring-2 focus:ring-green-600 focus:bg-white block w-full p-2.5 pr-8 transition-all cursor-pointer outline-none"
                          >
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                          <LuChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
                       </div>
                    </td>
                    <td className="px-10 py-6 text-right">
                       <button 
                         onClick={() => window.open(`/orders/${order._id}`, '_blank')}
                         className="p-2.5 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-xl transition-all"
                         title="View Invoice"
                       >
                         <LuEye size={20} />
                       </button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan="6" className="py-20 text-center text-gray-400 font-bold uppercase tracking-widest text-sm">
                      No orders found
                    </td>
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
