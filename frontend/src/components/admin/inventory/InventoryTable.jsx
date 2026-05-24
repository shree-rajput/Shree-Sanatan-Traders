import React, { useState } from "react";
import API from "../../../services/api";
import toast from "react-hot-toast";
import DataTable from "../shared/DataTable";
import StatusBadge from "../shared/StatusBadge";

const InventoryTable = ({ products = [], onRefresh }) => {
  const [drafts, setDrafts] = useState({});

  const saveStock = async (product) => {
    const stock = drafts[product._id] ?? product.stock;
    try {
      await API.patch(`/admin/inventory/${product._id}/stock`, { stock, reason: "Admin inventory update" });
      toast.success("Stock updated");
      onRefresh();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update stock");
    }
  };

  return (
    <DataTable
      data={products}
      columns={[
        { key: "name", header: "Product", render: (p) => <div><p className="font-black text-gray-900 dark:text-white">{p.name}</p><p className="text-xs text-gray-500">{p.sku || "No SKU"}</p></div> },
        { key: "stockStatus", header: "Status", render: (p) => <StatusBadge value={p.stockStatus} /> },
        { key: "reservedStock", header: "Reserved", render: (p) => p.reservedStock || 0 },
        { key: "soldStock", header: "Sold", render: (p) => p.soldStock || p.soldCount || 0 },
        { key: "threshold", header: "Threshold", render: (p) => p.lowStockThreshold || 5 },
        {
          key: "stock",
          header: "Stock",
          render: (p) => (
            <div className="flex items-center gap-2">
              <input type="number" min="0" value={drafts[p._id] ?? p.stock ?? 0} onChange={(e) => setDrafts((d) => ({ ...d, [p._id]: e.target.value }))} className="w-24 rounded-xl border border-gray-200 bg-white px-3 py-2 dark:border-gray-700 dark:bg-gray-800" />
              <button onClick={() => saveStock(p)} className="rounded-xl bg-green-600 px-3 py-2 text-xs font-black text-white">Save</button>
            </div>
          ),
        },
      ]}
    />
  );
};

export default InventoryTable;
