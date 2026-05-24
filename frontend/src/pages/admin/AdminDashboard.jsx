import React, { useEffect, useState } from "react";
import { LuBadgePercent, LuBoxes, LuPackage, LuShoppingCart, LuTrendingUp, LuUsers } from "react-icons/lu";
import toast from "react-hot-toast";
import API from "../../services/api";
import StatsCard from "../../components/admin/dashboard/StatsCard";
import RevenueChart from "../../components/admin/dashboard/RevenueChart";
import OrdersChart from "../../components/admin/dashboard/OrdersChart";
import TopProducts from "../../components/admin/dashboard/TopProducts";
import RecentOrders from "../../components/admin/dashboard/RecentOrders";
import LowStockProducts from "../../components/admin/dashboard/LowStockProducts";
import LoadingSkeleton from "../../components/admin/shared/LoadingSkeleton";

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/admin/dashboard-v2")
      .then((res) => setData(res.data))
      .catch(() => toast.error("Failed to load admin dashboard"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingSkeleton rows={8} />;

  const stats = data?.stats || {};
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-black text-gray-900 dark:text-white">Dashboard</h1>
        <p className="mt-2 text-gray-500 dark:text-gray-400">Revenue, orders, inventory, users and marketplace health.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard title="Total Revenue" value={`INR ${(stats.totalRevenue || 0).toLocaleString("en-IN")}`} icon={LuTrendingUp} />
        <StatsCard title="Total Orders" value={stats.totalOrders || 0} icon={LuShoppingCart} accent="blue" />
        <StatsCard title="Total Users" value={stats.totalUsers || 0} icon={LuUsers} accent="purple" />
        <StatsCard title="Total Products" value={stats.totalProducts || 0} icon={LuPackage} accent="amber" />
        <StatsCard title="Pending Orders" value={stats.pendingOrders || 0} icon={LuShoppingCart} accent="amber" />
        <StatsCard title="Low Stock" value={stats.lowStockProducts || 0} icon={LuBoxes} accent="amber" />
        <StatsCard title="Monthly Revenue" value={`INR ${(stats.monthlyRevenue || 0).toLocaleString("en-IN")}`} icon={LuTrendingUp} />
        <StatsCard title="Conversion Rate" value={`${stats.conversionRate || 0}%`} icon={LuBadgePercent} accent="blue" />
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <RevenueChart data={data?.revenueChart || []} />
        <OrdersChart data={data?.ordersChart || []} />
      </div>
      <div className="grid gap-6 xl:grid-cols-3">
        <TopProducts products={data?.topProducts || []} />
        <RecentOrders orders={data?.recentOrders || []} />
        <LowStockProducts products={data?.lowStockProducts || []} />
      </div>
    </div>
  );
};

export default AdminDashboard;
