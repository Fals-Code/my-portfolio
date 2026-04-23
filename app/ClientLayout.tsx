"use client";

import React, { memo } from "react";
import { ThemeProvider } from "@/context/ThemeContext";
import Navbar from "@/components/global/Navbar";
import { usePerformance } from "@/hooks/usePerformance";
import dynamic from "next/dynamic";

const CommandPalette = dynamic(() => import("@/components/global/CommandPalette"), { ssr: false });
const BackToTop = dynamic(() => import("@/components/global/BackToTop"), { ssr: false });

// Isolated Content to prevent re-renders traveling down from Top Providers
const MainContent = memo(function MainContent({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      {/* Reduced pt-20 to pt-32 for better spacing with the new navigation */}
      <div className="relative z-10 flex flex-col min-h-screen pt-32 pb-16">
        {children}
      </div>
    </>
  );
});

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const { isMobileDevice } = usePerformance();

  return (
    <ThemeProvider>
      <MainContent>{children}</MainContent>

      {!isMobileDevice && (
        <>
          <BackToTop />
          {/* Optional: keep command palette if user wants it */}
          <CommandPalette />
        </>
      )}
    </ThemeProvider>
  );
}
