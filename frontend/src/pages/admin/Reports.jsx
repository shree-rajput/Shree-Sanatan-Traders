import React, { useState } from "react";
import {
  LuDownload,
  LuCalendar,
  LuChartBar,
  LuChevronDown,
  LuTrendingUp,
  LuPackage,
  LuArrowUpRight,
  LuChartPie
} from "react-icons/lu";
import { useTheme } from "../../context/ThemeContext";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie
} from "recharts";

const AdminReports = () => {
  const [dateRange, setDateRange] = useState("Last 30 Days");
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const categoryData = [
    { name: "Fertilizers", value: 45000, color: "#10b981" },
    { name: "Seeds", value: 32000, color: "#3b82f6" },
    { name: "Tools", value: 15000, color: "#8b5cf6" },
    { name: "Machinery", value: 28000, color: "#f59e0b" },
  ];

  const dailySales = [
    { day: "Mon", sales: 4000 },
    { day: "Tue", sales: 3000 },
    { day: "Wed", sales: 2000 },
    { day: "Thu", sales: 2780 },
    { day: "Fri", sales: 1890 },
    { day: "Sat", sales: 2390 },
    { day: "Sun", sales: 3490 },
  ];

  return (
    <div className="space-y-10 min-h-screen p-6 bg-gray-50 dark:bg-gray-950 transition-colors duration-300">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">
            Business Intelligence
          </h1>
          <p className="text-gray-500 dark:text-gray-400 font-medium mt-1">
            Detailed analysis of your shop performance.
          </p>
        </div>

        <div className="flex gap-4 w-full md:w-auto">
          <button className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl text-sm font-bold text-gray-700 dark:text-gray-300 shadow-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">
            <LuCalendar size={18} className="text-green-600 dark:text-green-500" />
            {dateRange}
            <LuChevronDown size={16} />
          </button>

          <button className="flex items-center gap-2 px-6 py-3 bg-gray-900 dark:bg-green-600 text-white rounded-2xl text-sm font-bold shadow-lg hover:bg-black dark:hover:bg-green-700 transition-all">
            <LuDownload size={18} />
            Export Data
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Category Breakdown */}
        <div className="bg-white dark:bg-gray-900 p-8 md:p-10 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-3">
            <LuChartPie size={24} className="text-green-600 dark:text-green-500" />
            Revenue by Category
          </h3>

          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  innerRadius={70}
                  outerRadius={90}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} stroke="none" />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ 
                    borderRadius: '16px', 
                    border: 'none', 
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                    backgroundColor: isDark ? '#111827' : '#ffffff',
                    color: isDark ? '#ffffff' : '#000000'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-4 mt-8">
            {categoryData.map((c, i) => (
              <div key={i} className="flex justify-between items-center p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                <div className="flex items-center gap-3">
                   <div className="w-3 h-3 rounded-full" style={{ backgroundColor: c.color }} />
                   <span className="font-bold text-gray-700 dark:text-gray-300 text-sm">{c.name}</span>
                </div>
                <span className="font-bold text-gray-900 dark:text-white">₹{c.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Performance */}
        <div className="bg-white dark:bg-gray-900 p-8 md:p-10 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 lg:col-span-2">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-3">
            <LuChartBar size={24} className="text-green-600 dark:text-green-500" />
            Weekly Sales Volume
          </h3>

          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailySales}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={isDark ? '#1f2937' : '#f1f5f9'} />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: isDark ? '#64748b' : '#94a3b8', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: isDark ? '#64748b' : '#94a3b8', fontSize: 12 }} />
                <Tooltip
                  cursor={{ fill: isDark ? '#1f2937' : '#f8fafc' }}
                  contentStyle={{ 
                    borderRadius: '16px', 
                    border: 'none', 
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                    backgroundColor: isDark ? '#111827' : '#ffffff',
                    color: isDark ? '#ffffff' : '#000000'
                  }}
                />
                <Bar dataKey="sales" fill="#10b981" radius={[10, 10, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminReports;