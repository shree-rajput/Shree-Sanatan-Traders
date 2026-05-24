import React from "react";
import { LuTriangleAlert } from "react-icons/lu";

const StockAlert = ({ count = 0 }) => (
  <div className="rounded-3xl border border-amber-200 bg-amber-50 p-5 text-amber-800 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-300">
    <div className="flex items-center gap-3">
      <LuTriangleAlert size={22} />
      <div>
        <p className="font-black">{count} products need attention</p>
        <p className="text-sm opacity-80">Low stock and out of stock products are detected automatically.</p>
      </div>
    </div>
  </div>
);

export default StockAlert;
