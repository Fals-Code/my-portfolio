"use client";

import React, { useEffect, useState, memo } from "react";
import dynamic from "next/dynamic";
import { ThemeProvider } from "@/context/ThemeContext";
import { MusicProvider } from "@/context/MusicContext";
import { ChatbotProvider } from "@/context/ChatbotContext";
import { usePerformance } from "@/hooks/usePerformance";

import Navbar from "@/components/global/Navbar";
import Footer from "@/components/global/Footer";
import Loader from "@/components/global/Loader";
// Dynamic Imports for Global UI (Desktop Only)
const ScrollProgress = dynamic(() => import("@/components/global/ScrollProgress"), { ssr: false });
const CursorGlow = dynamic(() => import("@/components/global/CursorGlow"), { ssr: false });

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
        const interval = setInterval(() => {
          if (!document.body.classList.contains("intro-running")) {
            setIsIntroFinished(true);
            clearInterval(interval);
          }
        }, 500);
        return () => clearInterval(interval);
      }
    }
  }, [isMobileDevice]);

  useEffect(() => {
    // Moved Service Worker registration to layout.tsx as an inline script for faster TTI
  }, []);

  return (
    <ThemeProvider>
      <Loader />
      {!isMobileDevice && <ScrollProgress />}
      {!isMobileDevice && <CursorGlow />}
      
      {/* 1. Main Page Content - Isolated from Music/Chatbot Re-renders */}
      <MainContent>{children}</MainContent>

      {/* 2. Isolated UI Features - They have their own providers locally */}
      {isIntroFinished && !isMobileDevice && (
        <>
          <MusicProvider>
            <MusicPlayerUI />
          </MusicProvider>
          
          <ChatbotProvider>
            <ChatbotUI />
          </ChatbotProvider>
          
          <BackToTop />
          <CommandPalette />
          <ThreeBackground />
        </>
      )}
      
      {/* 3. Essential Mobile-Friendly Overlay Tools (if any, currently none) */}
    </ThemeProvider>
  );
}
