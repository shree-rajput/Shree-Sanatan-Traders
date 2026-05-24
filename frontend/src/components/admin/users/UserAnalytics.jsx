import React from "react";

const UserAnalytics = ({ users = [] }) => {
  const admins = users.filter((u) => u.role === "admin").length;
  const banned = users.filter((u) => u.isBanned).length;
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <div className="rounded-3xl bg-white p-5 dark:bg-gray-900"><p className="text-xs font-black text-gray-400">Users</p><p className="text-2xl font-black dark:text-white">{users.length}</p></div>
      <div className="rounded-3xl bg-white p-5 dark:bg-gray-900"><p className="text-xs font-black text-gray-400">Admins</p><p className="text-2xl font-black dark:text-white">{admins}</p></div>
      <div className="rounded-3xl bg-white p-5 dark:bg-gray-900"><p className="text-xs font-black text-gray-400">Banned</p><p className="text-2xl font-black dark:text-white">{banned}</p></div>
    </div>
  );
};

export default UserAnalytics;
