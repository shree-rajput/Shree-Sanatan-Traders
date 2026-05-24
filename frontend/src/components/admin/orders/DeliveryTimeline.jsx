import React from "react";

const DeliveryTimeline = ({ history = [] }) => (
  <div className="space-y-3">
    {history.map((item, index) => (
      <div key={`${item.status}-${index}`} className="flex gap-3">
        <div className="mt-1 h-3 w-3 rounded-full bg-green-600" />
        <div>
          <p className="text-sm font-black capitalize text-gray-900 dark:text-white">{String(item.status).replaceAll("_", " ")}</p>
          <p className="text-xs text-gray-500">{item.note || "Status updated"} · {new Date(item.timestamp || Date.now()).toLocaleString()}</p>
        </div>
      </div>
    ))}
  </div>
);

export default DeliveryTimeline;
