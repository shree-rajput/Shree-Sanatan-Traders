import React from "react";

const baseClass =
  "w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3.5 text-sm text-gray-900 outline-none transition focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-500/10 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500";

const ProfileInput = ({
  label,
  value,
  onChange,
  type = "text",
  placeholder = "",
  disabled = false,
  required = false,
  error = "",
  name,
}) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-semibold text-gray-700">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <input
        name={name}
        type={type}
        value={value}
        disabled={disabled}
        required={required}
        placeholder={placeholder}
        onChange={onChange}
        className={`${baseClass} ${error ? "border-red-300 focus:border-red-500 focus:ring-red-500/10" : ""}`}
      />
      {error && <p className="text-xs font-medium text-red-500">{error}</p>}
    </div>
  );
};

export const ProfileTextarea = ({
  label,
  value,
  onChange,
  placeholder = "",
  rows = 4,
  name,
  error = "",
}) => (
  <div className="space-y-2">
    {label && <label className="block text-sm font-semibold text-gray-700">{label}</label>}
    <textarea
      name={name}
      value={value}
      onChange={onChange}
      rows={rows}
      placeholder={placeholder}
      className={`${baseClass} resize-none ${error ? "border-red-300 focus:border-red-500 focus:ring-red-500/10" : ""}`}
    />
    {error && <p className="text-xs font-medium text-red-500">{error}</p>}
  </div>
);

export const ToggleSwitch = ({ checked, onChange, label, description }) => (
  <div className="flex items-center justify-between gap-4 rounded-2xl border border-gray-100 bg-white p-4">
    <div>
      <p className="text-sm font-bold text-gray-900">{label}</p>
      {description && <p className="mt-1 text-xs text-gray-500">{description}</p>}
    </div>
    <button
      type="button"
      aria-pressed={checked}
      onClick={() => onChange(!checked)}
      className={`relative h-7 w-12 rounded-full transition ${checked ? "bg-green-600" : "bg-gray-300"}`}
    >
      <span
        className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${
          checked ? "left-6" : "left-1"
        }`}
      />
    </button>
  </div>
);

export const SectionHeader = ({ title, description, icon: Icon }) => (
  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
    <div>
      <h2 className="text-xl font-black text-gray-900 sm:text-2xl">{title}</h2>
      {description && <p className="mt-1 text-sm text-gray-500">{description}</p>}
    </div>
    {Icon && (
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-50 text-green-600">
        <Icon size={24} />
      </div>
    )}
  </div>
);

export const LoadingSkeleton = ({ rows = 4 }) => (
  <div className="space-y-4">
    {Array.from({ length: rows }).map((_, index) => (
      <div key={index} className="h-20 animate-pulse rounded-3xl bg-gray-100" />
    ))}
  </div>
);

export default ProfileInput;
