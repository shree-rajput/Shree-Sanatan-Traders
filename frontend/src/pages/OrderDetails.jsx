import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import { LuChevronLeft, LuPackage, LuMapPin, LuCreditCard, LuCircleCheck, LuLoaderCircle, LuCalendar, LuHash, LuBox } from "react-icons/lu";
import toast from "react-hot-toast";

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await API.get(`/orders/${id}`);
        setOrder(res.data);
      } catch (err) {
        toast.error("Failed to load order details");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LuLoaderCircle className="animate-spin text-green-600" size={40} />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center">
        <LuBox size={60} className="text-gray-200 mb-6" />
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Order not found</h2>
        <button onClick={() => navigate("/orders")} className="px-8 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-all">
          Back to Orders
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 md:py-20 px-6">
      <div className="max-w-4xl mx-auto">
        <button onClick={() => navigate("/orders")} className="flex items-center gap-2 text-sm font-bold text-gray-400 hover:text-green-600 transition-colors mb-8">
          <LuChevronLeft size={20} /> Back to Orders
        </button>

        <div className="bg-white rounded-3xl shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="p-8 md:p-12 border-b border-gray-50 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
                <LuHash size={14} /> Order ID
              </div>
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">#{order._id.slice(-8).toUpperCase()}</h1>
              <div className="flex items-center gap-2 mt-2 text-gray-400 font-medium text-sm">
                <LuCalendar size={16} /> {new Date(order.createdAt).toLocaleDateString()}
              </div>
            </div>
            <div className={`px-6 py-2 rounded-full font-bold text-xs uppercase tracking-widest ${
              order.orderStatus === 'Delivered' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
            }`}>
              {order.orderStatus}
            </div>
          </div>

          <div className="p-8 md:p-12">
            {/* Items */}
            <div className="mb-12">
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-6">Items Purchased</h3>
              <div className="space-y-4">
                {order.items?.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between bg-gray-50 p-5 rounded-2xl border border-gray-100">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-white rounded-xl border border-gray-100 flex items-center justify-center text-gray-200 overflow-hidden">
                        {item.product?.images?.[0] ? (
                          <img src={item.product.images[0]} className="w-full h-full object-cover" alt="" />
                        ) : <LuPackage size={24} />}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{item.name || "Product"}</p>
                        <p className="text-xs text-gray-400 font-bold">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <p className="font-bold text-gray-900">₹{(item.price || 0).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Grid */}
            <div className="grid md:grid-cols-2 gap-10 pt-10 border-t border-gray-50">
              {/* Shipping */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
                  <LuMapPin size={16} className="text-green-600" /> Delivery Address
                </div>
                <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 text-gray-600 font-medium text-sm leading-relaxed">
                  {order.shippingAddress}
                </div>
              </div>

              {/* Summary */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
                  <LuCreditCard size={16} className="text-green-600" /> Payment Summary
                </div>
                <div className="bg-gray-900 text-white p-8 rounded-3xl space-y-4">
                  <div className="flex justify-between text-xs font-bold text-gray-400 uppercase tracking-widest">
                    <span>Payment Status</span>
                    <span className={order.paymentStatus === 'paid' ? 'text-green-400' : 'text-amber-400'}>{order.paymentStatus}</span>
                  </div>
                  <div className="pt-4 border-t border-white/10 flex justify-between items-end">
                    <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">Total Amount</span>
                    <span className="text-3xl font-bold">₹{order.totalPrice?.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-16 flex flex-col md:flex-row items-center justify-center gap-10 text-gray-300">
               <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
                  <LuCircleCheck className="text-green-600" size={16} /> Authentic Invoice
               </div>
               <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
                  <LuPackage className="text-green-600" size={16} /> Quality Verified
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
