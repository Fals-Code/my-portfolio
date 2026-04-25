"use client";

import React, { memo } from "react";
import { ThemeProvider } from "@/context/ThemeContext";
import { AchievementProvider, useAchievements } from "@/context/AchievementContext";
import Navbar from "@/components/global/Navbar";
import { usePerformance } from "@/hooks/usePerformance";
import dynamic from "next/dynamic";
import { Toaster } from "sonner";
import CustomCursor from "@/components/global/CustomCursor";
import StatusBar from "@/components/global/StatusBar";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const CommandPalette = dynamic(() => import("@/components/global/CommandPalette"), { ssr: false });
const TerminalMode = dynamic(() => import("@/components/global/TerminalMode"), { ssr: false });
const BackToTop = dynamic(() => import("@/components/global/BackToTop"), { ssr: false });

import { useTheme } from "@/context/ThemeContext";

// Isolated Content to prevent re-renders traveling down from Top Providers
const MainContent = memo(function MainContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { theme } = useTheme();
  const { unlockAchievement } = useAchievements();
  const [visitedPages, setVisitedPages] = useState<Set<string>>(new Set());
  const [initialTheme] = useState(theme);

  // Track page visits
  useEffect(() => {
    setVisitedPages(prev => {
      const next = new Set(prev);
      next.add(pathname);
      if (next.size >= 3) {
        unlockAchievement("EXPLORER");
      }
      return next;
    });
  }, [pathname, unlockAchievement]);

  // Track theme changes
  useEffect(() => {
    if (theme !== initialTheme) {
      unlockAchievement("THEME_MASTER");
    }
  }, [theme, initialTheme, unlockAchievement]);

  return (
    <>
      <Navbar />
      <CustomCursor />
      {/* Reduced pt-20 to pt-32 for better spacing with the new navigation */}
      <div className="relative z-10 flex flex-col min-h-screen pt-32 pb-16">
        {children}
      </div>
      <StatusBar />
    </>
  );
});

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const { isMobileDevice } = usePerformance();

  return (
    <ThemeProvider>
      <AchievementProvider>
        <Toaster position="top-center" richColors theme="dark" />
        <MainContent>{children}</MainContent>

        {!isMobileDevice && (
          <>
            <BackToTop />
            {/* Optional: keep command palette if user wants it */}
            <CommandPalette />
            <TerminalMode />
          </>
        )}
      </AchievementProvider>
    </ThemeProvider>
  );
}
