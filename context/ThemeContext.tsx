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
 * - Default: "dark" (sesuai desain)
 * - Anti-flash: inline script di layout.tsx menangani init sebelum React render
 * - Class diterapkan ke <html> element agar CSS vars (:root/.dark/.light) bekerja
 */
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Default "dark" — inline script di layout sudah apply class sebelum hydration
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    // Baca dari localStorage setelah mount, sinkronkan dengan state
    try {
      const saved = localStorage.getItem("falah-theme-v2") as Theme | null;
      const initial: Theme = saved === "light" || saved === "dark" ? saved : "dark";

      setTheme(initial);
      applyTheme(initial);
    } catch {
      // localStorage tidak tersedia (SSR / private mode)
    }
  }, []);

  const applyTheme = (next: Theme) => {
    const html = document.documentElement;
    html.classList.remove("light", "dark");
    html.classList.add(next);
    html.setAttribute("data-theme", next);
  };

  const toggleTheme = (e?: React.MouseEvent) => {
    const next: Theme = theme === "dark" ? "light" : "dark";

    // Fallback untuk browser tanpa View Transitions API
    if (!(document as any).startViewTransition) {
      setTheme(next);
      applyTheme(next);
      try { localStorage.setItem("falah-theme-v2", next); } catch {}
      return;
    }

    // Set origin titik transisi
    if (e) {
      document.documentElement.style.setProperty("--transition-x", `${e.clientX}px`);
      document.documentElement.style.setProperty("--transition-y", `${e.clientY}px`);
    } else {
      document.documentElement.style.setProperty("--transition-x", "50%");
      document.documentElement.style.setProperty("--transition-y", "50%");
    }

    (document as any).startViewTransition(() => {
      setTheme(next);
      applyTheme(next);
      try { localStorage.setItem("falah-theme-v2", next); } catch {}
    });
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
