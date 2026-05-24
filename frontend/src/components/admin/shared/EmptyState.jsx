import React from "react";
import { LuInbox } from "react-icons/lu";

const EmptyState = ({ title = "Nothing found", description = "Try changing your filters.", icon: Icon = LuInbox }) => (
  <div className="rounded-3xl border border-dashed border-gray-200 bg-white p-12 text-center dark:border-gray-800 dark:bg-gray-900">
    <Icon className="mx-auto mb-4 text-gray-300 dark:text-gray-700" size={42} />
    <h3 className="text-lg font-black text-gray-900 dark:text-white">{title}</h3>
    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{description}</p>
  </div>
);

export default EmptyState;
