import React from "react";
import { LuTriangleAlert } from "react-icons/lu";

const LowStockProducts = ({ products = [] }) => (
  <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
    <h3 className="text-lg font-black text-gray-900 dark:text-white">Low Stock</h3>
    <div className="mt-5 space-y-4">
      {products.map((product) => (
        <div key={product._id} className="flex items-center justify-between rounded-2xl bg-red-50 p-4 text-red-700 dark:bg-red-950 dark:text-red-300">
          <div>
            <p className="font-black">{product.name}</p>
            <p className="text-xs">{product.stock} units left</p>
          </div>
          <LuTriangleAlert size={20} />
        </div>
      ))}
      {products.length === 0 && <p className="text-sm text-gray-500">Inventory is healthy.</p>}
    </div>
  </div>
);

export default LowStockProducts;
