import React from "react";
import { LuSearch } from "react-icons/lu";

const SearchBar = ({ value, onChange, placeholder = "Search..." }) => (
  <div className="relative w-full">
    <LuSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={17} />
    <input
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      className="w-full rounded-2xl border border-gray-200 bg-white py-3 pl-11 pr-4 text-sm font-semibold text-gray-900 outline-none transition focus:border-green-500 focus:ring-4 focus:ring-green-500/10 dark:border-gray-800 dark:bg-gray-900 dark:text-white"
    />
  </div>
);

export default SearchBar;
