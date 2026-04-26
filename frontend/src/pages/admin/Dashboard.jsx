import React, { useEffect, useState } from "react";
import API from "../../services/api";

import { 
  LuTrendingUp as TrendingUp, 
  LuPackage as Package, 
  LuUsers as Users, 
  LuTriangleAlert as AlertTriangle, 
  LuDollarSign as DollarSign,
  LuShoppingCart as ShoppingCart
} from "react-icons/lu";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";
import { motion } from "framer-motion";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/admin/dashboard")
      .then((res) => {
        setStats(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="flex justify-center items-center h-full text-green-700 font-bold">Loading Stats...</div>;

  const statCards = [
    { title: "Total Sales", value: `₹${stats?.totalSales.toLocaleString()}`, icon: <DollarSign size={24} />, color: "bg-green-100 text-green-700" },
    { title: "Total Orders", value: stats?.ordersCount, icon: <ShoppingCart size={24} />, color: "bg-blue-100 text-blue-700" },
    { title: "Total Products", value: stats?.productsCount, icon: <Package size={24} />, color: "bg-purple-100 text-purple-700" },
    { title: "Low Stock Items", value: stats?.lowStockCount, icon: <AlertTriangle size={24} />, color: "bg-red-100 text-red-700" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-black text-gray-900">Dashboard Overview</h1>
          <div className="text-sm text-gray-500 font-medium">{new Date().toLocaleDateString('en-IN', { dateStyle: 'full' })}</div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((card, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              key={i} 
              className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-2xl ${card.color}`}>{card.icon}</div>
                <TrendingUp className="text-green-500" size={16} />
              </div>
              <h3 className="text-gray-500 text-sm font-bold uppercase tracking-wider">{card.title}</h3>
              <p className="text-2xl font-black text-gray-900 mt-1">{card.value}</p>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Sales Chart */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="text-xl font-black text-gray-900 mb-6">Sales Performance</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={stats?.salesData}>
                  <defs>
                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#15803d" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#15803d" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="_id" tickFormatter={(val) => ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][val-1]} />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="total" stroke="#15803d" fillOpacity={1} fill="url(#colorTotal)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Low Stock Table */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-gray-900">Low Stock Alerts</h3>
              <button className="text-green-700 font-bold text-sm hover:underline">View All</button>
            </div>
            <div className="space-y-4">
              {stats?.lowStockProducts.map((p, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-red-50 rounded-2xl border border-red-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-red-600 font-bold">
                      {p.name[0]}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm">{p.name}</p>
                      <p className="text-xs text-red-600 font-medium">Only {p.stock} units left</p>
                    </div>
                  </div>
                  <button className="bg-white text-red-600 px-4 py-1.5 rounded-lg text-xs font-bold shadow-sm border border-red-200 hover:bg-red-600 hover:text-white transition-colors">
                    Restock
                  </button>
                </div>
              ))}
              {stats?.lowStockProducts.length === 0 && <p className="text-gray-500 text-center py-10 font-medium">All products are well stocked! ✅</p>}
            </div>
          </div>
        </div>

        {/* Recent Orders */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-8 border-b border-gray-50 flex justify-between items-center">
            <h3 className="text-xl font-black text-gray-900">Recent Transactions</h3>
            <button className="text-green-700 font-bold text-sm hover:underline">Download Report</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-xs font-black uppercase tracking-wider">
                  <th className="px-8 py-4">Customer</th>
                  <th className="px-8 py-4">Date</th>
                  <th className="px-8 py-4">Status</th>
                  <th className="px-8 py-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {stats?.recentSales.map((order, i) => (
                  <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold text-xs">
                          {order.user?.name ? order.user.name[0] : "U"}
                        </div>
                        <span className="font-bold text-gray-900 text-sm">{order.user?.name || "Guest User"}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5 text-sm text-gray-500 font-medium">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-8 py-5">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                        order.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right font-black text-gray-900 text-sm">
                      ₹{order.totalPrice.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

  );
};

export default AdminDashboard;
