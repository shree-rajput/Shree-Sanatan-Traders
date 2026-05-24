import React, { useState } from "react";
import API from "../../../services/api";
import toast from "react-hot-toast";

const BulkUploadModal = ({ open, onClose, onDone }) => {
  const [text, setText] = useState("");
  if (!open) return null;

  const submit = async () => {
    try {
      const updates = JSON.parse(text);
      await API.patch("/admin/inventory/bulk-stock", { updates, reason: "Bulk admin update" });
      toast.success("Bulk stock updated");
      onDone();
      onClose();
    } catch (err) {
      toast.error("Use valid JSON: [{\"product\":\"id\",\"stock\":20}]");
    }
  };

  return (
    <div className="fixed inset-0 z-[190] flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-xl rounded-3xl bg-white p-6 dark:bg-gray-900">
        <h3 className="text-xl font-black dark:text-white">Bulk Stock Update</h3>
        <textarea value={text} onChange={(e) => setText(e.target.value)} rows={8} className="mt-4 w-full rounded-2xl border border-gray-200 bg-gray-50 p-4 text-sm font-mono dark:border-gray-700 dark:bg-gray-800 dark:text-white" placeholder='[{"product":"PRODUCT_ID","stock":25}]' />
        <div className="mt-4 flex justify-end gap-3">
          <button onClick={onClose} className="rounded-2xl bg-gray-100 px-5 py-3 font-black dark:bg-gray-800 dark:text-white">Cancel</button>
          <button onClick={submit} className="rounded-2xl bg-green-600 px-5 py-3 font-black text-white">Update</button>
        </div>
      </div>
    </div>
  );
};

export default BulkUploadModal;
