import React from "react";

const StatsCard = ({ title, value, icon: Icon, accent = "green", caption }) => {
  const accents = {
    green: "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300",
    blue: "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
    amber: "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
    purple: "bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300",
  };
  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-xl dark:border-gray-800 dark:bg-gray-900">
      <div className={`mb-5 flex h-12 w-12 items-center justify-center rounded-2xl ${accents[accent] || accents.green}`}>
        {Icon && <Icon size={22} />}
      </div>
      <p className="text-xs font-black uppercase tracking-wide text-gray-400">{title}</p>
      <p className="mt-1 text-2xl font-black text-gray-900 dark:text-white">{value}</p>
      {caption && <p className="mt-2 text-xs font-semibold text-gray-500 dark:text-gray-400">{caption}</p>}
    </div>
  );
};

export default StatsCard;
