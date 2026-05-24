import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import API from "../../services/api";
import DataTable from "../../components/admin/shared/DataTable";
import StatusBadge from "../../components/admin/shared/StatusBadge";

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const fetchReviews = () => API.get("/admin/reviews").then((res) => setReviews(res.data.reviews || [])).catch(() => toast.error("Failed to load reviews"));
  useEffect(() => { fetchReviews(); }, []);
  const update = async (review, status) => {
    await API.patch(`/admin/reviews/${review._id}`, { status });
    toast.success("Review updated");
    fetchReviews();
  };
  const remove = async (review) => {
    await API.delete(`/admin/reviews/${review._id}`);
    toast.success("Review deleted");
    fetchReviews();
  };
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-black dark:text-white">Reviews</h1>
      <DataTable data={reviews} columns={[
        { key: "product", header: "Product", render: (r) => r.product?.name || "Product" },
        { key: "user", header: "User", render: (r) => r.user?.name || "Customer" },
        { key: "rating", header: "Rating", render: (r) => `${r.rating || 0}/5` },
        { key: "comment", header: "Comment" },
        { key: "status", header: "Status", render: (r) => <StatusBadge value={r.status || "pending"} /> },
        { key: "actions", header: "Actions", render: (r) => <div className="flex gap-2"><button onClick={() => update(r, "approved")} className="rounded-xl bg-green-600 px-3 py-2 text-xs font-black text-white">Approve</button><button onClick={() => update(r, "spam")} className="rounded-xl bg-amber-500 px-3 py-2 text-xs font-black text-white">Spam</button><button onClick={() => remove(r)} className="rounded-xl bg-red-600 px-3 py-2 text-xs font-black text-white">Delete</button></div> },
      ]} />
    </div>
  );
};
export default AdminReviews;
