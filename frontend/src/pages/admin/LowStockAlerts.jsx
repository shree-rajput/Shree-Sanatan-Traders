import React, { useState, useEffect } from "react";
import API from "../../services/api";
import { socket } from "../../socket/socket";
import toast from "react-hot-toast";
import { FaCheckCircle } from "react-icons/fa";
import { LuBadgeAlert, LuTrendingUp } from "react-icons/lu";

const LowStockAlerts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLowStock();

    socket.on("low_stock_alert", (data) => {
      toast.error(`⚠️ ${data.count} items are low on stock!`);
      fetchLowStock(); // Refresh list on alert
    });

    socket.on("stock_updated", () => {
      fetchLowStock(); // Refresh on any stock change
    });

    return () => {
      socket.off("low_stock_alert");
      socket.off("stock_updated");
    };
  }, []);

  const fetchLowStock = async () => {
    try {
      const res = await API.get("/admin/products-v2");
      if (res.data.success) {
        const allProducts = res.data.data;
        const lowStock = allProducts.filter(
          (p) => p.stock <= (p.lowStockThreshold || 5),
        );
        setProducts(lowStock.sort((a, b) => a.stock - b.stock));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <LuBadgeAlert className="text-4xl text-red-500" />
        <div>
          <h1 className="text-3xl font-black dark:text-white">
            Low Stock Alerts
          </h1>
          <p className="text-gray-500">
            Products that have fallen below their minimum stock threshold.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {products.length === 0 ? (
          <div className="bg-green-50 text-green-700 p-6 rounded-2xl flex flex-col items-center justify-center border border-green-200">
            <FaCheckCircle className="text-4xl mb-2" />
            <h2 className="text-xl font-bold">All Good!</h2>
            <p>No products are currently low on stock.</p>
          </div>
        ) : (
          products.map((product) => (
            <div
              key={product._id}
              className="bg-white dark:bg-gray-900 p-6 rounded-3xl shadow-sm border border-red-100 dark:border-red-900/30 flex items-center justify-between"
            >
              <div className="flex items-center gap-4">
                <img
                  src={product.images?.[0] || "/placeholder.jpg"}
                  alt={product.name}
                  className="w-16 h-16 rounded-xl object-cover bg-gray-100"
                />
                <div>
                  <h3 className="text-lg font-bold dark:text-white">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-500">SKU: {product.sku}</p>
                </div>
              </div>

              <div className="flex items-center gap-8 text-right">
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">
                    Current Stock
                  </p>
                  <p className="text-2xl font-black text-red-500">
                    {product.stock}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-1">
                    Threshold
                  </p>
                  <p className="text-xl font-bold text-gray-900 dark:text-gray-300">
                    {product.lowStockThreshold || 5}
                  </p>
                </div>

                <a
                  href="/admin/ai-inventory"
                  className="bg-black text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-gray-800 transition"
                >
                  <LuTrendingUp /> AI Reorder
                </a>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default LowStockAlerts;
