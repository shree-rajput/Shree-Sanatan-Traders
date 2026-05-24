import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import API from "../../services/api";
import LoadingSkeleton from "../../components/admin/shared/LoadingSkeleton";
import TopProducts from "../../components/admin/dashboard/TopProducts";

const AdminAnalytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    API.get("/admin/analytics").then((res) => setData(res.data)).catch(() => toast.error("Failed to load analytics")).finally(() => setLoading(false));
  }, []);
  if (loading) return <LoadingSkeleton rows={8} />;
  const chartData = (data?.sales || []).map((item) => ({ name: item._id, revenue: item.revenue, orders: item.orders }));
  return (
    <div className="space-y-6">
      <div><h1 className="text-3xl font-black dark:text-white">Analytics</h1><p className="text-gray-500">Sales, product performance, user growth and order growth.</p></div>
      <div className="h-96 rounded-3xl bg-white p-6 dark:bg-gray-900">
        <ResponsiveContainer width="100%" height="100%"><BarChart data={chartData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis /><Tooltip /><Bar dataKey="revenue" fill="#16a34a" radius={[8, 8, 0, 0]} /></BarChart></ResponsiveContainer>
      </div>
      <TopProducts products={data?.productPerformance || []} />
    </div>
  );
};

export default AdminAnalytics;
