import React, { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import API from "../../services/api";
import DataTable from "../../components/admin/shared/DataTable";
import SearchBar from "../../components/admin/shared/SearchBar";
import StatusBadge from "../../components/admin/shared/StatusBadge";
import Pagination from "../../components/admin/shared/Pagination";
import LoadingSkeleton from "../../components/admin/shared/LoadingSkeleton";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const res = await API.get("/admin/products-v2", {
        params: { page, search, limit: 15 },
      });
      setProducts(res.data.products || []);
      setPages(res.data.pages || 1);
    } catch {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  }, [page, search]);
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-black dark:text-white">Products</h1>
        <p className="text-gray-500">
          Catalog, variants, SEO, draft, featured and trending controls.
        </p>
      </div>
      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="Search products..."
      />
      {loading ? (
        <LoadingSkeleton rows={6} />
      ) : (
        <DataTable
          data={products}
          columns={[
            {
              key: "name",
              header: "Product",
              render: (p) => (
                <div>
                  <p className="font-black dark:text-white">{p.name}</p>
                  <p className="text-xs text-gray-500">
                    {p.brand || p.category?.name || "Uncategorized"}
                  </p>
                </div>
              ),
            },
            {
              key: "price",
              header: "Price",
              render: (p) => `INR ${(p.price || 0).toLocaleString("en-IN")}`,
            },
            {
              key: "stock",
              header: "Stock",
              render: (p) => (p.stock != 0 ? p.stock : 15),
              // : p.stockStatus === "out_of_stock"
              //   ? "Out of Stock"
              //   : "N/A",
            },
            {
              key: "status",
              header: "Status",
              render: (p) => <StatusBadge value={p.status || "active"} />,
            },
            {
              key: "stockStatus",
              header: "Inventory",
              render: (p) => <StatusBadge value={p.stockStatus} />,
            },
          ]}
        />
      )}
      <Pagination page={page} pages={pages} onPageChange={setPage} />
    </div>
  );
};

export default AdminProducts;
