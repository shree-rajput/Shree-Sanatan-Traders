import React from "react";
import DataTable from "../shared/DataTable";
import StatusBadge from "../shared/StatusBadge";

const UserTable = ({ users = [], onSelect, onToggleBan, onPromote }) => (
  <DataTable
    data={users}
    columns={[
      {
        key: "name",
        header: "User",
        render: (u) => (
          <button onClick={() => onSelect(u)} className="text-left">
            <p className="font-black text-white dark:text-white">{u.name}</p>
            <p className="text-xs text-gray-200">{u.email}</p>
          </button>
        ),
      },
      {
        key: "role",
        header: "Role",
        render: (u) => (
          <StatusBadge value={u.role === "admin" ? "active" : "pending"} />
        ),
      },
      {
        key: "orders",
        header: "Orders",
        render: (u) => u.analytics?.orders || 0,
      },
      {
        key: "spent",
        header: "Purchases",
        render: (u) =>
          `INR ${(u.analytics?.totalPurchases || 0).toLocaleString("en-IN")}`,
      },
      {
        key: "lastLogin",
        header: "Last Login",
        render: (u) =>
          u.lastLogin ? new Date(u.lastLogin).toLocaleDateString() : "Never",
      },
      {
        key: "actions",
        header: "Actions",
        render: (u) => (
          <div className="flex gap-2">
            <button
              onClick={() => onToggleBan(u)}
              className="rounded-xl bg-gray-100 px-3 py-2 text-xs font-black dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-black dark:text-white"
            >
              {u.isBanned ? "Unban" : "Ban"}
            </button>
            <button
              onClick={() => onPromote(u)}
              className="rounded-xl bg-green-600 px-3 py-2 text-xs font-black text-white"
            >
              {u.role === "admin" ? "User" : "Admin"}
            </button>
          </div>
        ),
      },
    ]}
  />
);

export default UserTable;
