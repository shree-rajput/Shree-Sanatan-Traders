import React from "react";

const StockHistory = ({ logs = [] }) => (
  <div className="rounded-3xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
    <h3 className="font-black text-gray-900 dark:text-white">Stock History</h3>
    <div className="mt-4 space-y-3">
      {logs.slice(0, 8).map((log) => (
        <div key={log._id} className="rounded-2xl bg-gray-50 p-4 text-sm dark:bg-gray-800">
          <p className="font-bold text-gray-900 dark:text-white">{log.product?.name || "Product"}: {log.oldStock} -> {log.newStock}</p>
          <p className="text-xs text-gray-500">{log.reason} · {new Date(log.createdAt).toLocaleString()}</p>
        </div>
      ))}
    </div>
  </div>
);

export default StockHistory;
