import React, { useEffect, useState } from "react";
import API from "../../services/api";
import {
  LuTrendingUp,
  LuPackage,
  LuUsers,
  LuTriangleAlert,
  LuDollarSign,
  LuShoppingCart,
  LuCalendar,
  LuArrowRight
} from "react-icons/lu";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import toast from "react-hot-toast";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.get("/admin/dashboard");
        setStats(res.data);
      } catch (err) {
        toast.error("Failed to load dashboard statistics");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 text-green-600 font-bold">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mr-3"></div>
        Loading Dashboard...
      </div>
    );
  }

  const statCards = [
    { title: "Total Revenue", value: `₹${stats?.totalSales?.toLocaleString()}`, icon: <LuDollarSign size={24} />, color: "text-green-600", bg: "bg-green-50" },
    { title: "Total Orders", value: stats?.ordersCount, icon: <LuShoppingCart size={24} />, color: "text-blue-600", bg: "bg-blue-50" },
    { title: "Total Products", value: stats?.productsCount, icon: <LuPackage size={24} />, color: "text-purple-600", bg: "bg-purple-50" },
    { title: "Active Users", value: stats?.usersCount || 0, icon: <LuUsers size={24} />, color: "text-orange-600", bg: "bg-orange-50" },
  ];

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Dashboard Overview</h1>
          <p className="text-gray-500 font-medium mt-1">Welcome back to your administration panel.</p>
        </div>
        <div className="flex items-center gap-3 px-5 py-2.5 bg-white rounded-2xl shadow-sm border border-gray-100 text-gray-500 font-bold text-sm">
          <LuCalendar size={18} className="text-green-600" />
          {new Date().toLocaleDateString('en-IN', { dateStyle: 'full' })}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, i) => (
          <div key={i} className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow group">
            <div className={`w-14 h-14 rounded-2xl ${card.bg} ${card.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
              {card.icon}
            </div>
            <h3 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">{card.title}</h3>
            <p className="text-3xl font-bold text-gray-900 tracking-tight">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sales Chart */}
        <div className="lg:col-span-2 bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-xl font-bold text-gray-900">Revenue Performance</h3>
            <div className="flex items-center gap-2 text-xs font-bold text-green-600 bg-green-50 px-3 py-1 rounded-full uppercase tracking-widest">
              <LuTrendingUp size={14} /> +12% this month
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats?.salesData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="_id" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="total" stroke="#10b981" fillOpacity={1} fill="url(#colorRevenue)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Low Stock */}
        <div className="bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-gray-100 flex flex-col">
          <h3 className="text-xl font-bold text-gray-900 mb-8">Low Stock Alerts</h3>
          <div className="flex-1 space-y-4 overflow-y-auto max-h-[350px] pr-2 custom-scrollbar">
            {stats?.lowStockProducts?.map((p, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-red-50 rounded-2xl border border-red-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-red-600 font-bold border border-red-100">
                    {p.name[0]}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm leading-tight">{p.name}</p>
                    <p className="text-xs text-red-600 font-bold mt-0.5">{p.stock} units left</p>
                  </div>
                </div>
                <LuTriangleAlert className="text-red-400" size={18} />
              </div>
            ))}
            {!stats?.lowStockProducts?.length && (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-50 py-10">
                <LuPackage size={48} className="text-gray-200 mb-4" />
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Inventory Healthy</p>
              </div>
            )}
          </div>
          <button className="w-full mt-8 flex items-center justify-center gap-2 py-4 bg-gray-900 text-white rounded-2xl font-bold text-sm hover:bg-black transition-colors group">
            Manage Inventory <LuArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-8 md:p-10 border-b border-gray-50 flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-900">Recent Transactions</h3>
          <button className="text-sm font-bold text-green-600 hover:text-green-700 transition-colors">View All Orders</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 text-gray-400 text-xs font-bold uppercase tracking-widest">
                <th className="px-10 py-5">Customer</th>
                <th className="px-10 py-5">Date</th>
                <th className="px-10 py-5">Status</th>
                <th className="px-10 py-5 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {stats?.recentSales?.map((order, i) => (
                <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-10 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-green-100 text-green-700 flex items-center justify-center font-bold text-xs">
                        {order.user?.name ? order.user.name[0] : "U"}
                      </div>
                      <span className="font-bold text-gray-900">{order.user?.name || "Guest"}</span>
                    </div>
                  </td>
                  <td className="px-10 py-6 text-sm text-gray-500 font-medium">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-10 py-6">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${order.paymentStatus === 'paid' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="px-10 py-6 text-right font-bold text-gray-900">
                    ₹{order.totalPrice?.toLocaleString()}
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
