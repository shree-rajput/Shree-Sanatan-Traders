import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import API from "../../services/api";
import DataTable from "../../components/admin/shared/DataTable";
import StatusBadge from "../../components/admin/shared/StatusBadge";

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [form, setForm] = useState({ code: "", type: "percentage", value: "", expiry: "", usageLimit: 0, active: true });
  const fetchCoupons = () => API.get("/admin/coupons").then((res) => setCoupons(res.data.coupons || [])).catch(() => toast.error("Failed to load coupons"));
  useEffect(() => { fetchCoupons(); }, []);
  const createCoupon = async (event) => {
    event.preventDefault();
    await API.post("/admin/coupons", form);
    toast.success("Coupon created");
    setForm({ code: "", type: "percentage", value: "", expiry: "", usageLimit: 0, active: true });
    fetchCoupons();
  };
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-black dark:text-white">Coupons</h1>
      <form onSubmit={createCoupon} className="grid gap-3 rounded-3xl bg-white p-5 dark:bg-gray-900 md:grid-cols-6">
        <input required value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} placeholder="CODE" className="rounded-2xl border p-3 dark:border-gray-700 dark:bg-gray-800 dark:text-white" />
        <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="rounded-2xl border p-3 dark:border-gray-700 dark:bg-gray-800 dark:text-white"><option value="percentage">Percentage</option><option value="flat">Flat</option></select>
        <input required type="number" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} placeholder="Value" className="rounded-2xl border p-3 dark:border-gray-700 dark:bg-gray-800 dark:text-white" />
        <input type="date" value={form.expiry} onChange={(e) => setForm({ ...form, expiry: e.target.value })} className="rounded-2xl border p-3 dark:border-gray-700 dark:bg-gray-800 dark:text-white" />
        <input type="number" value={form.usageLimit} onChange={(e) => setForm({ ...form, usageLimit: e.target.value })} placeholder="Limit" className="rounded-2xl border p-3 dark:border-gray-700 dark:bg-gray-800 dark:text-white" />
        <button className="rounded-2xl bg-green-600 px-4 py-3 font-black text-white">Create</button>
      </form>
      <DataTable data={coupons} columns={[
        { key: "code", header: "Code", render: (c) => <span className="font-black">{c.code}</span> },
        { key: "type", header: "Type", render: (c) => c.type || c.discountType },
        { key: "value", header: "Value", render: (c) => c.value || c.discountValue },
        { key: "expiry", header: "Expiry", render: (c) => c.expiry || c.expiryDate ? new Date(c.expiry || c.expiryDate).toLocaleDateString() : "No expiry" },
        { key: "active", header: "Status", render: (c) => <StatusBadge value={(c.active ?? c.isActive) ? "active" : "cancelled"} /> },
      ]} />
    </div>
  );
};
export default AdminCoupons;
