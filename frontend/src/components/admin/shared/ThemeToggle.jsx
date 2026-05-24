import React from "react";
import { LuMoon, LuSun } from "react-icons/lu";
import { useTheme } from "../../../context/ThemeContext";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-gray-200 bg-white text-gray-700 shadow-sm transition hover:border-green-300 hover:text-green-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-200"
      title="Toggle theme"
    >
      {isDark ? <LuSun size={19} /> : <LuMoon size={19} />}
    </button>
  );
};

export default ThemeToggle;
