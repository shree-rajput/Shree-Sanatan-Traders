import React, { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import API from "../../services/api";
import OrderTable from "../../components/admin/orders/OrderTable";
import OrderDetailsModal from "../../components/admin/orders/OrderDetailsModal";
import SearchBar from "../../components/admin/shared/SearchBar";
import Pagination from "../../components/admin/shared/Pagination";
import LoadingSkeleton from "../../components/admin/shared/LoadingSkeleton";
import EmptyState from "../../components/admin/shared/EmptyState";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const res = await API.get("/admin/orders-v2", { params: { page, search, status, limit: 15 } });
      setOrders(res.data.orders || []);
      setPages(res.data.pages || 1);
    } catch {
      toast.error("Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, [page, search, status]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  return (
    <div className="space-y-6">
      <div><h1 className="text-3xl font-black dark:text-white">Orders</h1><p className="text-gray-500">Track payments, delivery, refunds and lifecycle status.</p></div>
      <div className="flex flex-col gap-3 rounded-3xl bg-white p-4 dark:bg-gray-900 md:flex-row">
        <SearchBar value={search} onChange={setSearch} placeholder="Search order id..." />
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-bold dark:border-gray-800 dark:bg-gray-900 dark:text-white">
          {["all", "pending", "confirmed", "packed", "shipped", "out_for_delivery", "delivered", "cancelled", "returned"].map((item) => <option key={item} value={item}>{item.replaceAll("_", " ")}</option>)}
        </select>
      </div>
      {loading ? <LoadingSkeleton rows={6} /> : orders.length ? <OrderTable orders={orders} onRefresh={fetchOrders} onSelect={setSelected} /> : <EmptyState title="No orders found" />}
      <Pagination page={page} pages={pages} onPageChange={setPage} />
      <OrderDetailsModal order={selected} onClose={() => setSelected(null)} />
    </div>
  );
};

export default AdminOrders;
