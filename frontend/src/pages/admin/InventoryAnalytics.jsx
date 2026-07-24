import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis, Bar, BarChart } from "recharts";
import API from "../../services/api";
import LoadingSkeleton from "../../components/admin/shared/LoadingSkeleton";

const InventoryAnalytics = () => {
  const [loading, setLoading] = useState(true);
  const [forecastData, setForecastData] = useState([]);
  const [reorderSuggestions, setReorderSuggestions] = useState([]);
  const [salesTrends, setSalesTrends] = useState(null);

  useEffect(() => {
    const fetchAIAnalytics = async () => {
      try {
        const [forecastRes, reorderRes, trendsRes] = await Promise.all([
          API.get("/admin/analytics/forecast"),
          API.get("/admin/analytics/reorder-suggestions"),
          API.get("/admin/analytics/sales-trends"),
        ]);
        
        if (forecastRes.data.success) setForecastData(forecastRes.data.data);
        if (reorderRes.data.success) setReorderSuggestions(reorderRes.data.data);
        if (trendsRes.data.success) setSalesTrends(trendsRes.data.data);
      } catch (error) {
        toast.error("Failed to load AI Analytics");
      } finally {
        setLoading(false);
      }
    };
    
    fetchAIAnalytics();
  }, []);

  if (loading) return <LoadingSkeleton rows={12} />;

  // Prepare chart data (top 10 products by forecast)
  const forecastChartData = forecastData.slice(0, 10).map((item) => ({
    name: item.productName,
    "Next 30 Days Forecast": item.forecastedDemand,
    "Past 30 Days Sales": item.totalQuantitySold,
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black dark:text-white flex items-center gap-2">
          🧠 AI Inventory & Warehouse Analytics
        </h1>
        <p className="text-gray-500">Demand forecasting, auto reorder suggestions, and sales trend predictions.</p>
      </div>

      {/* Sales Trends Summary */}
      {salesTrends && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-3xl bg-white p-6 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm">
            <h3 className="text-gray-500 text-sm font-medium">Revenue Growth (Month over Month)</h3>
            <div className="mt-2 flex items-baseline gap-2">
              <p className="text-3xl font-bold dark:text-white">
                {salesTrends.trendIndicator === "UP" ? "+" : ""}{salesTrends.revenueGrowthPercentage}%
              </p>
              <span className={`text-sm font-medium ${salesTrends.trendIndicator === "UP" ? "text-green-500" : "text-red-500"}`}>
                {salesTrends.trendIndicator}
              </span>
            </div>
          </div>
          <div className="rounded-3xl bg-white p-6 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm">
            <h3 className="text-gray-500 text-sm font-medium">Current Month Revenue</h3>
            <p className="mt-2 text-3xl font-bold dark:text-white">
              ₹{salesTrends.currentMonth?.totalRevenue?.toLocaleString()}
            </p>
          </div>
          <div className="rounded-3xl bg-white p-6 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm">
            <h3 className="text-gray-500 text-sm font-medium">Auto Reorder Action Items</h3>
            <p className="mt-2 text-3xl font-bold text-red-500">
              {reorderSuggestions.length} Products
            </p>
          </div>
        </div>
      )}

      {/* Demand Forecast Chart */}
      <div className="rounded-3xl bg-white p-6 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm">
        <h2 className="text-xl font-bold mb-6 dark:text-white">Demand Forecast (Next 30 Days)</h2>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={forecastChartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#374151" />
              <XAxis dataKey="name" tick={{ fill: "#6b7280" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#6b7280" }} axisLine={false} tickLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: "#1f2937", borderRadius: "12px", border: "none", color: "#fff" }} 
              />
              <Bar dataKey="Past 30 Days Sales" fill="#9ca3af" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Next 30 Days Forecast" fill="#3b82f6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Reorder Suggestions Table */}
      <div className="rounded-3xl bg-white overflow-hidden dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm">
        <div className="p-6 border-b border-gray-100 dark:border-gray-800">
          <h2 className="text-xl font-bold dark:text-white">Auto Reorder Suggestions</h2>
          <p className="text-gray-500 text-sm">Products that have hit or dropped below their calculated reorder point.</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 dark:bg-gray-800/50 text-gray-500 text-sm">
              <tr>
                <th className="px-6 py-4 font-medium">Product Name</th>
                <th className="px-6 py-4 font-medium">Current Stock</th>
                <th className="px-6 py-4 font-medium">Reorder Point</th>
                <th className="px-6 py-4 font-medium">Daily Avg Sales</th>
                <th className="px-6 py-4 font-medium text-blue-500">Suggested Qty</th>
                <th className="px-6 py-4 font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {reorderSuggestions.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                    No products currently need reordering! Stock levels are healthy.
                  </td>
                </tr>
              ) : (
                reorderSuggestions.map((item) => (
                  <tr key={item.productId} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4 dark:text-white font-medium">{item.name}</td>
                    <td className="px-6 py-4 text-red-500 font-bold">{item.currentStock}</td>
                    <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{item.reorderPoint}</td>
                    <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{item.dailySales} / day</td>
                    <td className="px-6 py-4 text-blue-500 font-bold">+{item.suggestedReorderQuantity}</td>
                    <td className="px-6 py-4">
                      <button 
                        className="bg-black text-white dark:bg-white dark:text-black px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors"
                        onClick={() => toast.success(`Added ${item.suggestedReorderQuantity} of ${item.name} to draft Purchase Order!`)}
                      >
                        Create PO
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default InventoryAnalytics;
