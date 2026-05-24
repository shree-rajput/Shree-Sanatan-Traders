import React from "react";

const UserDetailsDrawer = ({ user, onClose }) => {
  if (!user) return null;
  return (
    <div className="fixed inset-0 z-[180] bg-black/40" onClick={onClose}>
      <aside onClick={(e) => e.stopPropagation()} className="ml-auto h-full w-full max-w-md overflow-y-auto bg-white p-6 shadow-2xl dark:bg-gray-900">
        <button onClick={onClose} className="mb-6 rounded-xl bg-gray-100 px-3 py-2 font-black dark:bg-gray-800 dark:text-white">Close</button>
        <h3 className="text-2xl font-black text-gray-900 dark:text-white">{user.name}</h3>
        <p className="mt-1 text-gray-500">{user.email}</p>
        <div className="mt-6 grid gap-4">
          <div className="rounded-2xl bg-gray-50 p-4 dark:bg-gray-800"><p className="text-xs text-gray-500">Phone</p><p className="font-black dark:text-white">{user.phone || "Not added"}</p></div>
          <div className="rounded-2xl bg-gray-50 p-4 dark:bg-gray-800"><p className="text-xs text-gray-500">Total purchases</p><p className="font-black dark:text-white">INR {(user.analytics?.totalPurchases || 0).toLocaleString("en-IN")}</p></div>
          <div className="rounded-2xl bg-gray-50 p-4 dark:bg-gray-800"><p className="text-xs text-gray-500">Role</p><p className="font-black dark:text-white">{user.role}</p></div>
        </div>
      </aside>
    </div>
  );
};

export default UserDetailsDrawer;
