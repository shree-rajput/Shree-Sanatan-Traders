import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await API.get(`/orders/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOrder(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load order details.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-orange-500"></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">{error || "Order not found"}</h2>
        <button onClick={() => navigate("/orders")} className="text-orange-600 underline font-semibold">Return to Orders</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <button onClick={() => navigate("/orders")} className="mb-6 flex items-center text-sm font-medium text-gray-500 hover:text-orange-600 transition">
          &larr; Back to all orders
        </button>

        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          <div className="bg-orange-600 px-8 py-6 flex flex-col sm:flex-row sm:items-center justify-between text-white">
            <div>
              <p className="text-orange-200 text-sm font-semibold uppercase tracking-wider">Order Receipt</p>
              <h1 className="text-2xl font-bold">ID: {order._id}</h1>
            </div>
            <div className="mt-4 sm:mt-0 text-left sm:text-right">
               <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider bg-white ${
                  order.paymentStatus === 'pending' ? 'text-yellow-600' : 
                  order.paymentStatus === 'paid' ? 'text-green-600' : 'text-gray-900'
                }`}>
                  {order.paymentStatus || 'Status Unknown'}
                </span>
            </div>
          </div>

          <div className="p-8">
            <h3 className="text-lg font-bold text-gray-900 mb-6 border-b border-gray-100 pb-2">Items Overview</h3>
            <div className="space-y-4 mb-8">
              {order.items?.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between bg-gray-50 p-4 rounded-xl border border-gray-100">
                  <div className="flex items-center space-x-4">
                    <div className="w-16 h-16 bg-white rounded-lg border border-gray-200 overflow-hidden shrink-0">
                      {item.product?.image?.[0] ? <img src={item.product.image[0]} className="w-full h-full object-cover" alt="" /> : <div className="w-full h-full flex items-center justify-center text-gray-400">📦</div>}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">{item.name || item.product?.name || "Item"}</p>
                      <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-gray-100">
              <div>
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Delivery Address</h3>
                <p className="text-gray-800 bg-gray-50 p-4 rounded-xl border border-gray-100">{order.shippingAddress || "N/A"}</p>
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Payment Details</h3>
                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-2">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Products Total</span>
                    <span>₹{order.totalPrice - (order.deliveryCharge || 0)}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Delivery Charge</span>
                    <span>₹{order.deliveryCharge || 0}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between items-center">
                    <span className="font-bold text-gray-900">Grand Total</span>
                    <span className="font-black text-xl text-orange-600">₹{order.totalPrice}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;
