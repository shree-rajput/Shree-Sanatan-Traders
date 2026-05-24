import React from "react";

const TopProducts = ({ products = [] }) => (
  <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
    <h3 className="text-lg font-black text-gray-900 dark:text-white">Top Products</h3>
    <div className="mt-5 space-y-4">
      {products.map((product) => (
        <div key={product._id || product.name} className="flex items-center justify-between gap-4">
          <div>
            <p className="font-bold text-gray-900 dark:text-white">{product.name}</p>
            <p className="text-xs text-gray-500">{product.sales || product.totalQty || 0} sold</p>
          </div>
          <p className="font-black text-gray-900 dark:text-white">INR {(product.revenue || 0).toLocaleString("en-IN")}</p>
        </div>
      ))}
      {products.length === 0 && <p className="text-sm text-gray-500">No product sales yet.</p>}
    </div>
  </div>
);

export default TopProducts;
