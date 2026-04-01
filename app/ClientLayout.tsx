"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { ThemeProvider } from "@/context/ThemeContext";
import { MusicProvider } from "@/context/MusicContext";
import { ChatbotProvider } from "@/context/ChatbotContext";

import Navbar from "@/components/global/Navbar";
import Footer from "@/components/global/Footer";
import Loader from "@/components/global/Loader";
import CursorGlow from "@/components/global/CursorGlow";
import MusicPlayer from "@/components/global/MusicPlayer";
import Chatbot from "@/components/global/Chatbot";
import BackToTop from "@/components/global/BackToTop";
import CommandPalette from "@/components/global/CommandPalette";
import ThreeBackground from "@/components/global/ThreeBackground";

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
