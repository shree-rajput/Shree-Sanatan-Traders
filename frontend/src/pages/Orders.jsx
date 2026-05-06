import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import { LuPackage, LuChevronRight, LuCalendar, LuBox, LuChevronLeft } from "react-icons/lu";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await API.get("/orders");
        setOrders(res.data);
      } catch (error) {
        console.error("Failed to fetch orders", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 py-16 px-6">
      <div className="max-w-4xl mx-auto">
        
        <div className="mb-12 flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Your <span className="text-green-600">Orders</span></h1>
          <Link to="/products" className="text-sm font-bold text-gray-400 hover:text-green-600 flex items-center gap-1 transition-colors">
            <LuChevronLeft size={16} /> Continue Shopping
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-3xl p-20 text-center border border-gray-100 shadow-sm">
             <LuBox size={48} className="mx-auto text-gray-200 mb-6" />
             <h2 className="text-xl font-bold text-gray-900 mb-2">No orders yet</h2>
             <p className="text-gray-500 mb-8">When you place an order, it will appear here.</p>
             <Link 
              to="/products" 
              className="inline-flex items-center gap-2 px-8 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-all shadow-lg shadow-green-100"
             >
                Browse Shop <LuChevronRight size={18} />
             </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div className="bg-gray-50/50 px-8 py-4 border-b border-gray-100 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex gap-8">
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Order Date</p>
                      <p className="text-sm font-bold text-gray-900 flex items-center gap-2">
                        <LuCalendar size={14} className="text-green-600" />
                        {new Date(order.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Order ID</p>
                      <p className="text-[10px] font-mono text-gray-500">#{order._id.slice(-8)}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                      order.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {order.paymentStatus || 'Pending'}
                    </span>
                    <p className="text-xl font-bold text-gray-900">₹{order.totalPrice.toLocaleString()}</p>
                  </div>
                </div>

                <div className="p-8">
                  <div className="grid gap-4">
                    {order.items?.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-100">
                             <LuPackage size={20} className="text-gray-300" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-gray-900">{item.name || "Product Name"}</p>
                            <p className="text-xs text-gray-400 font-medium">Quantity: {item.quantity}</p>
                          </div>
                        </div>
                        <p className="text-sm font-bold text-gray-600">₹{(item.price * item.quantity).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;