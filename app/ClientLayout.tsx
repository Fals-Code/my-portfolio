"use client";

import { useEffect } from "react";
import dynamic from "next/dynamic";
import { ThemeProvider } from "@/context/ThemeContext";
import { MusicProvider } from "@/context/MusicContext";
import { ChatbotProvider } from "@/context/ChatbotContext";

import Navbar from "@/components/global/Navbar";
import Footer from "@/components/global/Footer";
import Loader from "@/components/global/Loader";
import CursorGlow from "@/components/global/CursorGlow";
import ScrollProgress from "@/components/global/ScrollProgress";

// Dynamic Imports for Heavy Components
const ThreeBackground = dynamic(() => import("@/components/global/ThreeBackground"), { ssr: false });
const Chatbot = dynamic(() => import("@/components/global/Chatbot"), { ssr: false });
const MusicPlayer = dynamic(() => import("@/components/global/MusicPlayer"), { ssr: false });
const CommandPalette = dynamic(() => import("@/components/global/CommandPalette"), { ssr: false });
const BackToTop = dynamic(() => import("@/components/global/BackToTop"), { ssr: false });

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker
          .register("/sw.js")
          .then((reg) => console.log("Service Worker registered:", reg))
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
          <MusicPlayer />
          <Chatbot />
          <BackToTop />
          <CommandPalette />
          <ThreeBackground />
        </ChatbotProvider>
      </MusicProvider>
    </ThemeProvider>
  );
}
