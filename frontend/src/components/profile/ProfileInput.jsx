const ProfileInput = ({
  label,
  value,
  onChange,
  type = "text",
  placeholder = "",
  disabled = false,
}) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-gray-700">
        {label}
      </label>

      <input
        type={type}
        value={value}
        disabled={disabled}
        placeholder={placeholder}
        onChange={onChange}
        className="w-full px-5 py-4 rounded-2xl border border-gray-200 bg-gray-50 focus:border-green-500 focus:bg-white outline-none transition-all"
      />
    </div>
  );
};

export default ProfileInput;
