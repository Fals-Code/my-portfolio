"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { Theme } from "@/types";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: (e?: React.MouseEvent) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/**
 * Provides theme management (light/dark) across the application.
 * Persists choice to localStorage and detects system preferences.
 */
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // 1. Check localStorage
    const savedTheme = localStorage.getItem("falah-theme") as Theme;
    
    // 2. Check system preference if no saved theme
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    
    const initialTheme = savedTheme || systemTheme;
    
    setTheme(initialTheme);
    document.documentElement.setAttribute("data-theme", initialTheme);
    setMounted(true);
  }, []);

  const toggleTheme = (e?: React.MouseEvent) => {
    const newTheme = theme === "light" ? "dark" : "light";

    // Fallback for browsers that don't support View Transitions API
    if (!(document as any).startViewTransition) {
      setTheme(newTheme);
      localStorage.setItem("falah-theme", newTheme);
      document.documentElement.setAttribute("data-theme", newTheme);
      return;
    }

    // Set transition origin if event is provided
    if (e) {
      const x = e.clientX;
      const y = e.clientY;
      document.documentElement.style.setProperty("--transition-x", `${x}px`);
      document.documentElement.style.setProperty("--transition-y", `${y}px`);
    } else {
      // Default to center if no event (e.g., keyboard toggle)
      document.documentElement.style.setProperty("--transition-x", "50%");
      document.documentElement.style.setProperty("--transition-y", "50%");
    }

    (document as any).startViewTransition(() => {
      setTheme(newTheme);
      localStorage.setItem("falah-theme", newTheme);
      document.documentElement.setAttribute("data-theme", newTheme);
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className={mounted ? theme : ""} style={!mounted ? { visibility: "hidden" } : {}}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

/**
 * Access the current theme and toggle function.
 */
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
