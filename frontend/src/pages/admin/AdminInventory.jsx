import React, { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import API from "../../services/api";
import InventoryTable from "../../components/admin/inventory/InventoryTable";
import StockAlert from "../../components/admin/inventory/StockAlert";
import BulkUploadModal from "../../components/admin/inventory/BulkUploadModal";
import SearchBar from "../../components/admin/shared/SearchBar";
import Pagination from "../../components/admin/shared/Pagination";
import LoadingSkeleton from "../../components/admin/shared/LoadingSkeleton";

const AdminInventory = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [bulkOpen, setBulkOpen] = useState(false);

  const fetchInventory = useCallback(async () => {
    try {
      setLoading(true);
      const res = await API.get("/admin/inventory", { params: { page, search, status, limit: 15 } });
      setProducts(res.data.products || []);
      setPages(res.data.pages || 1);
    } catch {
      toast.error("Failed to load inventory");
    } finally {
      setLoading(false);
    }
  }, [page, search, status]);

  useEffect(() => { fetchInventory(); }, [fetchInventory]);
  const lowCount = products.filter((p) => ["low_stock", "out_of_stock"].includes(p.stockStatus)).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div><h1 className="text-3xl font-black dark:text-white">Inventory</h1><p className="text-gray-500">Stock, SKU, variants, thresholds and inventory logs.</p></div>
        <button onClick={() => setBulkOpen(true)} className="rounded-2xl bg-green-600 px-5 py-3 text-sm font-black text-white">Bulk Update</button>
      </div>
      <StockAlert count={lowCount} />
      <div className="flex flex-col gap-3 rounded-3xl bg-white p-4 dark:bg-gray-900 md:flex-row">
        <SearchBar value={search} onChange={setSearch} placeholder="Search product or SKU..." />
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm font-bold dark:border-gray-800 dark:bg-gray-900 dark:text-white">
          {["all", "in_stock", "low_stock", "out_of_stock"].map((item) => <option key={item} value={item}>{item.replaceAll("_", " ")}</option>)}
        </select>
      </div>
      {loading ? <LoadingSkeleton rows={6} /> : <InventoryTable products={products} onRefresh={fetchInventory} />}
      <Pagination page={page} pages={pages} onPageChange={setPage} />
      <BulkUploadModal open={bulkOpen} onClose={() => setBulkOpen(false)} onDone={fetchInventory} />
    </div>
  );
};

export default AdminInventory;
