import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";
import { translations } from "../utils/translations";

const Orders = ({ lang = "en" }) => {
  const t = translations[lang] || translations["en"];
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await API.get("/orders", {
          headers: { Authorization: `Bearer ${token}` }
        });
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
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-emerald-500 border-opacity-75"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">{t.orderHistory}</h1>
          <span className="bg-emerald-100 text-emerald-800 text-sm font-bold px-3 py-1 rounded-full">{orders.length} {orders.length === 1 ? (lang === 'en' ? 'Order' : 'ऑर्डर') : (lang === 'en' ? 'Orders' : 'ऑर्डर')}</span>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-16 text-center">
             <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gray-100 mb-6">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{t.noOrders}</h2>
            <p className="text-gray-500 mb-8">{t.emptyCart}</p>
            <Link to="/products" className="inline-block bg-emerald-600 text-white font-bold px-8 py-3 rounded-full shadow hover:bg-emerald-700 transition">{t.browseProducts}</Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((o) => (
              <div key={o._id} className="bg-white rounded-2xl shadow-sm hover:shadow-md transition duration-300 border border-gray-100 overflow-hidden">
                <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">{t.orderID}</p>
                    <p className="font-mono text-sm text-gray-900 bg-gray-200/50 inline-block px-2 py-0.5 rounded">{o._id}</p>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">{t.totalPrice}</p>
                      <p className="font-black text-emerald-600 text-lg">₹{o.totalPrice || o.finalAmount || 0}</p>
                    </div>
                    {/* Status Badge */}
                    <div className="shrink-0">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                        o.paymentStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                        o.paymentStatus === 'paid' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {o.paymentStatus || 'unknown'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Items preview */}
                <div className="px-6 py-5">
                  <h4 className="text-sm font-semibold text-gray-700 mb-4">{t.itemsPurchased}</h4>
                  <div className="flex flex-wrap gap-3">
                    {/* Only show up to 3 items as pills to save space, but handle missing item data gracefully */}
                    {o.items?.slice(0, 3).map((item, idx) => (
                      <div key={idx} className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 flex items-center space-x-3">
                        <div className="w-8 h-8 rounded bg-gray-200 flex items-center justify-center overflow-hidden shrink-0">
                           {item.product?.image?.[0] ? <img src={item.product.image[0]} className="w-full h-full object-cover" alt="" /> : <span className="text-[10px]">📦</span>}
                        </div>
                        <div className="text-sm">
                          <p className="font-medium text-gray-900 truncate max-w-[120px]">{item.name || item.product?.name || "Product"}</p>
                          <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                        </div>
                      </div>
                    ))}
                    {o.items?.length > 3 && (
                      <div className="bg-orange-50 text-orange-700 font-medium border border-orange-100 rounded-lg px-3 py-2 flex items-center">
                        +{o.items.length - 3} more...
                      </div>
                    )}
                    {(!o.items || o.items.length === 0) && (
                      <p className="text-sm text-gray-500 italic">No item details available.</p>
                    )}
                  </div>
                  
                  {o.shippingAddress && (
                     <div className="mt-5 pt-4 border-t border-dashed border-gray-200">
                        <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold mb-1">{t.deliveredTo}</p>
                        <p className="text-sm text-gray-800 max-w-xl">{o.shippingAddress}</p>
                     </div>
                  )}
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