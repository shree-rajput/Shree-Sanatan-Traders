import React from "react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const OrdersChart = ({ data = [] }) => (
  <div className="h-80 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
    <div className="mb-5">
      <h3 className="text-lg font-black text-gray-900 dark:text-white">Orders</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400">Monthly order growth</p>
    </div>
    <ResponsiveContainer width="100%" height="80%">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
        <XAxis dataKey="name" tickLine={false} axisLine={false} />
        <YAxis tickLine={false} axisLine={false} />
        <Tooltip />
        <Bar dataKey="orders" fill="#2563eb" radius={[10, 10, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  </div>
);

export default OrdersChart;
