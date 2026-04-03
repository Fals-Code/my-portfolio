"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { ThemeProvider } from "@/context/ThemeContext";
import { MusicProvider } from "@/context/MusicContext";
import { ChatbotProvider } from "@/context/ChatbotContext";

import Navbar from "@/components/global/Navbar";
import Footer from "@/components/global/Footer";
import Loader from "@/components/global/Loader";
import CursorGlow from "@/components/global/CursorGlow";
import ScrollProgress from "@/components/global/ScrollProgress";

// Dynamic Imports for Heavy Components with Loading Placeholders
const ThreeBackground = dynamic(() => import("@/components/global/ThreeBackground"), { ssr: false });

const Chatbot = dynamic(() => import("@/components/global/Chatbot"), { 
  ssr: false, 
  loading: () => <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 w-14 h-14 bg-accent/20 rounded-2xl animate-pulse" />
});

const MusicPlayer = dynamic(() => import("@/components/global/MusicPlayer"), { 
  ssr: false, 
  loading: () => <div className="fixed bottom-4 left-4 md:bottom-6 md:left-6 w-14 h-14 bg-accent/20 rounded-2xl animate-pulse" />
});

const CommandPalette = dynamic(() => import("@/components/global/CommandPalette"), { ssr: false });
const BackToTop = dynamic(() => import("@/components/global/BackToTop"), { ssr: false });

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [isIntroFinished, setIsIntroFinished] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const shown = sessionStorage.getItem("terminal-shown");
      if (shown) {
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
  }, []);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js")
          .catch((err) => console.log("Service Worker failed:", err));
      });
    }
  }, []);

  return (
    <ThemeProvider>
      <MusicProvider>
        <ChatbotProvider>
          <Loader />
          <ScrollProgress />
          <CursorGlow />
          <Navbar />
          <main className="relative z-10 flex flex-col min-h-screen pt-20">
            {children}
          </main>
          <Footer />
          {isIntroFinished && (
            <>
              <MusicPlayer />
              <Chatbot />
              <BackToTop />
              <CommandPalette />
              <ThreeBackground />
            </>
          )}
        </ChatbotProvider>
      </MusicProvider>
    </ThemeProvider>
  );
}
