import React from "react";
import StatusBadge from "../shared/StatusBadge";

const NotificationCard = ({ notification, onRead }) => (
  <div className="rounded-3xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
    <div className="flex items-start justify-between gap-4">
      <div>
        <h3 className="font-black text-gray-900 dark:text-white">{notification.title}</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{notification.message}</p>
        <p className="mt-3 text-xs text-gray-400">{new Date(notification.createdAt).toLocaleString()}</p>
      </div>
      <StatusBadge value={notification.read ? "active" : "pending"} />
    </div>
    {!notification.read && <button onClick={() => onRead(notification)} className="mt-4 rounded-xl bg-green-600 px-4 py-2 text-xs font-black text-white">Mark read</button>}
  </div>
);

export default NotificationCard;
