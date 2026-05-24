import React from "react";
import { LuPackageOpen } from "react-icons/lu";

const EmptyState = ({
  icon: Icon = LuPackageOpen,
  title,
  description,
  actionLabel,
  onAction,
}) => {
  return (
    <div className="rounded-3xl border-2 border-dashed border-gray-200 bg-gray-50 px-6 py-14 text-center">
      <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-gray-100 bg-white text-green-600 shadow-sm">
        <Icon size={28} />
      </div>
      <h3 className="text-lg font-black text-gray-900">{title}</h3>
      {description && <p className="mx-auto mt-2 max-w-md text-sm text-gray-500">{description}</p>}
      {actionLabel && (
        <button
          type="button"
          onClick={onAction}
          className="mt-6 rounded-2xl bg-green-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-green-600/20 transition hover:bg-green-700"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
