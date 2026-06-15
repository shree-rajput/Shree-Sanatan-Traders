import React from "react";
import { LuMenu, LuSearch } from "react-icons/lu";
import ThemeToggle from "../shared/ThemeToggle";
import { useAuth } from "../../../context/AuthContext";

const AdminHeader = ({ onMenu }) => {
  const { user } = useAuth();
  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/85 px-4 py-4 backdrop-blur-xl dark:border-gray-800 dark:bg-gray-950/85 sm:px-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onMenu}
            className="rounded-2xl border border-gray-200 bg-gray-200 p-3 dark:border-gray-800 dark:bg-gray-900 lg:hidden"
          >
            <LuMenu size={20} className="" className="text-black" />
          </button>
          <div className="hidden w-80 items-center gap-3 rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-800 dark:bg-gray-900 md:flex">
            <LuSearch className="text-gray-400" size={17} />
            <span className="text-sm font-semibold text-gray-400">
              Search admin...
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <div className="rounded-2xl border border-gray-200 bg-white px-4 py-2 text-sm dark:border-gray-800 dark:bg-gray-900">
            <p className="font-black text-gray-900 dark:text-white">
              {user?.name || "Admin"}
            </p>
            <p className="text-xs text-gray-500">Administrator</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
