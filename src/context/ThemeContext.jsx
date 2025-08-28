"use client";

import { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";

const ThemeContext = createContext({
  theme: "dark",
  isDark: false,
  toggleTheme: () => {},
  setTheme: () => {},
});

export const ThemeProvider = ({ children }) => {
  const getPreferredTheme = useCallback(() => {
    try {
      const stored = localStorage.getItem("theme");
      if (stored === "dark" || stored === "light") return stored;
      return "dark"; 
    } catch {
      return "dark";
    }
  }, []);

  // Initialize from storage immediately to avoid flash
  const [theme, setTheme] = useState(getPreferredTheme);

  // Apply theme to <html> class and persist
  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") root.classList.add("dark");
    else root.classList.remove("dark");
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((t) => (t === "dark" ? "light" : "dark"));
  }, []);

  const value = useMemo(
    () => ({
      theme,
      isDark: theme === "dark",
      toggleTheme,
      setTheme,
    }),
    [theme, toggleTheme]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => useContext(ThemeContext);


