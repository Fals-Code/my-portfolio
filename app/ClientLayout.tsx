"use client";

import React, { memo } from "react";
import { ThemeProvider } from "@/context/ThemeContext";
import { AchievementProvider, useAchievements } from "@/context/AchievementContext";
import { MusicProvider } from "@/context/MusicContext";
import Navbar from "@/components/global/Navbar";
import { usePerformance } from "@/hooks/usePerformance";
import dynamic from "next/dynamic";
import { Toaster } from "sonner";
import CustomCursor from "@/components/global/CustomCursor";
import StatusBar from "@/components/global/StatusBar";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

// Configure NProgress
NProgress.configure({ 
  showSpinner: false,
  trickleSpeed: 200,
  minimum: 0.3
});

const CommandPalette = dynamic(() => import("@/components/global/CommandPalette"), { ssr: false });
const TerminalMode = dynamic(() => import("@/components/global/TerminalMode"), { ssr: false });
const BackToTop = dynamic(() => import("@/components/global/BackToTop"), { ssr: false });
const Preloader = dynamic(() => import("@/components/global/Preloader"), { ssr: false });

import { useTheme } from "@/context/ThemeContext";

// Isolated Content to prevent re-renders traveling down from Top Providers
const MainContent = memo(function MainContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { theme } = useTheme();
  const { unlockAchievement } = useAchievements();
  const [visitedPages, setVisitedPages] = useState<Set<string>>(new Set());
  const [initialTheme] = useState(theme);

  // Track page visits and manage NProgress
  useEffect(() => {
    // Finish NProgress on route change
    NProgress.done();

    setVisitedPages(prev => {
      const next = new Set(prev);
      next.add(pathname);
      return next;
    });

    // Global click listener to start NProgress on any internal link click
    const handleAnchorClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const anchor = target.closest("a");
      
      if (anchor && 
          anchor.href && 
          anchor.href.startsWith(window.location.origin) && 
          !anchor.href.includes("#") &&
          anchor.target !== "_blank") {
        NProgress.start();
      }
    };

    window.addEventListener("click", handleAnchorClick);
    return () => window.removeEventListener("click", handleAnchorClick);
  }, [pathname]);

  // Unlock achievements based on stats
  useEffect(() => {
    if (visitedPages.size >= 3) {
      unlockAchievement("EXPLORER");
    }
  }, [visitedPages.size, unlockAchievement]);

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
  const { isLow } = usePerformance();

  useEffect(() => {
    if (isLow) {
      document.body.classList.add('low-performance');
    } else {
      document.body.classList.remove('low-performance');
    }
  }, [isLow]);

  return (
    <ThemeProvider>
      <MusicProvider>
        <AchievementProvider>
          <Preloader />
          <Toaster position="top-center" richColors theme="dark" />
          <MainContent>{children}</MainContent>

          <BackToTop />
          <CommandPalette />
          <TerminalMode />
        </AchievementProvider>
      </MusicProvider>
    </ThemeProvider>
  );
}
