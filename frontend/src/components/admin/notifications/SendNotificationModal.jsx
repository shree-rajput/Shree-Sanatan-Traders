import React, { useState } from "react";
import API from "../../../services/api";
import toast from "react-hot-toast";

const SendNotificationModal = ({ open, onClose, onSent }) => {
  const [form, setForm] = useState({ title: "", message: "", type: "announcement", target: "all" });
  if (!open) return null;

  const send = async (event) => {
    event.preventDefault();
    try {
      await API.post("/admin/notifications", form);
      toast.success("Notification sent");
      onSent();
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send notification");
    }
  };

  return (
    <div className="fixed inset-0 z-[190] flex items-center justify-center bg-black/50 p-4">
      <form onSubmit={send} className="w-full max-w-lg rounded-3xl bg-white p-6 dark:bg-gray-900">
        <h3 className="text-xl font-black dark:text-white">Send Notification</h3>
        <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="mt-4 w-full rounded-2xl border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800 dark:text-white" placeholder="Title" />
        <textarea required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="mt-3 w-full rounded-2xl border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800 dark:text-white" rows={5} placeholder="Message" />
        <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="mt-3 w-full rounded-2xl border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800 dark:text-white">
          {["stock", "order", "payment", "delivery", "promotion", "announcement", "system"].map((type) => <option key={type} value={type}>{type}</option>)}
        </select>
        <div className="mt-5 flex justify-end gap-3">
          <button type="button" onClick={onClose} className="rounded-2xl bg-gray-100 px-5 py-3 font-black dark:bg-gray-800 dark:text-white">Cancel</button>
          <button className="rounded-2xl bg-green-600 px-5 py-3 font-black text-white">Send</button>
        </div>
      </form>
    </div>
  );
};

export default SendNotificationModal;
