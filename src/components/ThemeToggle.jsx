"use client";

import { memo } from "react";
import { useTheme } from "../context/ThemeContext";

const ThemeToggle = memo(({ className = "" }) => {
  const { isDark, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      className={`px-3 py-2 text-sm rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${className}`}
      aria-label="Toggle theme"
    >
      {isDark ? "🌙 Dark" : "☀️ Light"}
    </button>
  );
});

ThemeToggle.displayName = 'ThemeToggle';

export default ThemeToggle;


