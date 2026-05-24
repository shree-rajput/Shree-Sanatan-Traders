import React from "react";

const ConfirmModal = ({ open, title, message, onCancel, onConfirm, confirmLabel = "Confirm" }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl dark:bg-gray-900">
        <h3 className="text-xl font-black text-gray-900 dark:text-white">{title}</h3>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{message}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onCancel} className="rounded-2xl bg-gray-100 px-5 py-3 text-sm font-black text-gray-700 dark:bg-gray-800 dark:text-gray-200">Cancel</button>
          <button onClick={onConfirm} className="rounded-2xl bg-red-600 px-5 py-3 text-sm font-black text-white">{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
