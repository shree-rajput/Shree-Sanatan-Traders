import React, { useState } from "react";

import { 
  LuDownload as Download, 
  LuFilter as Filter, 
  LuCalendar as Calendar, 
  LuFileText as FileText, 
  LuChartPie as PieChartIcon, 
  LuChartBar as BarChartIcon,
  LuChevronDown as ChevronDown,
  LuTrendingUp as TrendingUp
} from "react-icons/lu";
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
  const [dateRange, setDateRange] = useState("This Month");

  const categoryData = [
    { name: "Trailers", value: 45000, color: "#15803d" },
    { name: "Irrigation", value: 32000, color: "#1d4ed8" },
    { name: "Tools", value: 15000, color: "#a21caf" },
    { name: "Seeds", value: 8000, color: "#ea580c" },
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
    <div className="space-y-8 animate-in fade-in duration-500">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black text-gray-900">Reports & Analytics</h1>
            <p className="text-gray-500 font-medium">Deep dive into your business performance</p>
          </div>
          <div className="flex gap-3">
            <div className="relative">
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-100 rounded-xl text-sm font-bold text-gray-700">
                <Calendar size={16} />
                {dateRange}
                <ChevronDown size={14} />
              </button>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-emerald-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-emerald-100">
              <Download size={16} />
              Export CSV
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sales by Category */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 lg:col-span-1">
            <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2">
              <PieChartIcon size={20} className="text-emerald-700" />
              Sales by Category
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3 mt-4">
              {categoryData.map((c, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: c.color }}></div>
                    <span className="text-sm font-bold text-gray-600">{c.name}</span>
                  </div>
                  <span className="text-sm font-black text-gray-900">₹{c.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Daily Sales Bar */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 lg:col-span-2">
            <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2">
              <BarChartIcon size={20} className="text-emerald-700" />
              Weekly Revenue
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={dailySales}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 700 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: 700 }} />
                  <Tooltip cursor={{ fill: '#f8fafc' }} />
                  <Bar dataKey="sales" fill="#15803d" radius={[6, 6, 0, 0]} barSize={30} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Profit Estimation */}
          <div className="bg-gradient-to-br from-emerald-700 to-emerald-900 p-8 rounded-3xl shadow-xl text-white">
            <h3 className="text-lg font-bold opacity-80 mb-2">Estimated Profit</h3>
            <p className="text-4xl font-black mb-6">₹1,24,500</p>
            <div className="flex items-center gap-2 text-green-300 font-bold text-sm">
              <TrendingUp size={18} />
              <span>+15% from last month</span>
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 md:col-span-2 lg:col-span-2">
            <h3 className="text-lg font-black text-gray-900 mb-6">Top Selling Products</h3>
            <div className="space-y-4">
              {[1, 2, 3].map((_, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                  <div className="flex items-center gap-4">
                    <span className="text-2xl font-black text-gray-200">0{i+1}</span>
                    <div>
                      <p className="font-bold text-gray-900">Premium Water Pump {i+1}</p>
                      <p className="text-xs text-gray-500 font-medium">Category: Pumps</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-emerald-700">₹{4500 * (3-i)}</p>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{12 - i*3} Units Sold</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

  );
};

export default AdminReports;
