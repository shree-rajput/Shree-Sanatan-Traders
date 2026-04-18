import React, { useEffect, useState } from "react";
import AdminSidebar from "../../components/AdminSidebar";
import API from "../../services/api";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await API.get("/admin/dashboard", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(res.data);
      } catch (err) {
        console.error("Dashboard error", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const cards = [
    { title: "Total Users", value: stats?.users || 0, icon: "👥", color: "from-blue-600 to-blue-400" },
    { title: "Total Orders", value: stats?.orders || 0, icon: "📝", color: "from-orange-600 to-orange-400" },
    { title: "Active Products", value: stats?.products || 0, icon: "📦", color: "from-green-600 to-green-400" },
  ];

  return (
    <AdminSidebar>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-black text-gray-900 mb-8 tracking-tight">Overview Dashboard</h1>
        
        {loading ? (
          <div className="animate-pulse grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1,2,3].map(i => <div key={i} className="h-40 bg-gray-200 rounded-2xl"></div>)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {cards.map((card, idx) => (
              <div key={idx} className={`bg-gradient-to-br ${card.color} rounded-2xl shadow-lg p-6 text-white relative overflow-hidden transform hover:-translate-y-1 transition duration-300`}>
                <div className="absolute -right-6 -bottom-6 text-white/10 text-9xl">{card.icon}</div>
                <h3 className="text-lg font-bold text-white/80 uppercase tracking-widest mb-2 relative z-10">{card.title}</h3>
                <p className="text-5xl font-black relative z-10">{card.value}</p>
              </div>
            ))}
          </div>
        )}

        <div className="mt-12 bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4 border-b border-gray-100 pb-2">Quick Actions</h2>
          <p className="text-gray-500 mb-6">Use the sidebar to navigate to specific modules to manage your eCommerce platform effectively.</p>
          <div className="flex gap-4">
            <span className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-semibold border border-blue-100">Review Users</span>
            <span className="px-4 py-2 bg-orange-50 text-orange-700 rounded-lg text-sm font-semibold border border-orange-100">Fulfill Orders</span>
            <span className="px-4 py-2 bg-green-50 text-green-700 rounded-lg text-sm font-semibold border border-green-100">Restock Products</span>
          </div>
        </div>
      </div>
    </AdminSidebar>
  );
};

export default AdminDashboard;
