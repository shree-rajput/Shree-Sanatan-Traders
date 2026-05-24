import React from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const RevenueChart = ({ data = [] }) => (
  <div className="h-80 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
    <div className="mb-5">
      <h3 className="text-lg font-black text-gray-900 dark:text-white">Revenue</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400">Monthly revenue performance</p>
    </div>
    <ResponsiveContainer width="100%" height="80%">
      <AreaChart data={data}>
        <defs>
          <linearGradient id="adminRevenue" x1="0" x2="0" y1="0" y2="1">
            <stop offset="5%" stopColor="#16a34a" stopOpacity={0.25} />
            <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
        <XAxis dataKey="name" tickLine={false} axisLine={false} />
        <YAxis tickLine={false} axisLine={false} />
        <Tooltip />
        <Area dataKey="revenue" stroke="#16a34a" strokeWidth={3} fill="url(#adminRevenue)" />
      </AreaChart>
    </ResponsiveContainer>
  </div>
);

export default RevenueChart;
