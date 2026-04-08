"use client";

import React, { useEffect, useState, memo } from "react";
import dynamic from "next/dynamic";
import { ThemeProvider } from "@/context/ThemeContext";
const MusicProvider = dynamic(() => import("@/context/MusicContext").then(mod => mod.MusicProvider), { ssr: false });
const ChatbotProvider = dynamic(() => import("@/context/ChatbotContext").then(mod => mod.ChatbotProvider), { ssr: false });
import { usePerformance } from "@/hooks/usePerformance";

import Navbar from "@/components/global/Navbar";
import Footer from "@/components/global/Footer";
import Loader from "@/components/global/Loader";
// Dynamic Imports for Global UI (Desktop Only)
// Desktop-only dynamic imports moved to a component wrapper to prevent module loading on mobile
const DesktopOnlyGlobalUI = memo(function DesktopOnlyGlobalUI() {
  const ScrollProgress = dynamic(() => import("@/components/global/ScrollProgress"), { ssr: false });
  const CursorGlow = dynamic(() => import("@/components/global/CursorGlow"), { ssr: false });
  
  return (
    <>
      <ScrollProgress />
      <CursorGlow />
    </>
  );
});

// Dynamic Imports for Heavy Components
const ThreeBackground = dynamic(() => import("@/components/global/ThreeBackground"), { ssr: false });
const ChatbotUI = dynamic(() => import("@/components/global/Chatbot"), { 
  ssr: false, 
  loading: () => null 
});
const MusicPlayerUI = dynamic(() => import("@/components/global/MusicPlayer"), { 
  ssr: false, 
  loading: () => null 
});
const CommandPalette = dynamic(() => import("@/components/global/CommandPalette"), { ssr: false });
const BackToTop = dynamic(() => import("@/components/global/BackToTop"), { ssr: false });

/**
 * Optimized "Cold-Mode" Layout.
 * Isolates providers to prevent the main Page tree from re-rendering
 * when the Music or Chatbot states change.
 */

// Isolated Content to prevent re-renders traveling down from Top Providers
const MainContent = memo(function MainContent({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main className="relative z-10 flex flex-col min-h-screen pt-20">
        {children}
      </main>
      <Footer />
    </>
  );
});

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [isIntroFinished, setIsIntroFinished] = useState(false);
  const { isMobileDevice } = usePerformance();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const shown = sessionStorage.getItem("terminal-shown");
      if (shown || isMobileDevice) {
        setIsIntroFinished(true);
      } else {
        const handleIntroComplete = () => {
          setIsIntroFinished(true);
        };
        window.addEventListener("falah-intro-complete", handleIntroComplete);
        return () => window.removeEventListener("falah-intro-complete", handleIntroComplete);
      }
    }
  }, [isMobileDevice]);

  useEffect(() => {
    // Moved Service Worker registration to layout.tsx as an inline script for faster TTI
  }, []);

  return (
    <ThemeProvider>
      <Loader />
      {!isMobileDevice && <DesktopOnlyGlobalUI />}
      
      {/* 1. Main Page Content - Isolated from Music/Chatbot Re-renders */}
      <MainContent>{children}</MainContent>

      {/* 2. Isolated Features - Cross-device (Desktop Only) */}
      {isIntroFinished && !isMobileDevice && (
        <>
          <MusicProvider>
            <MusicPlayerUI />
          </MusicProvider>
          
          <ChatbotProvider>
            <ChatbotUI />
          </ChatbotProvider>
        </>
      )}

      {/* 3. Desktop Exclusive Features */}
      {isIntroFinished && !isMobileDevice && (
        <>
          <BackToTop />
          <CommandPalette />
          <ThreeBackground />
        </>
      )}
      
      {/* 3. Essential Mobile-Friendly Overlay Tools (if any, currently none) */}
    </ThemeProvider>
  );
}
