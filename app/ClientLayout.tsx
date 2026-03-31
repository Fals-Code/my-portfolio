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

  const pathname = usePathname();
  const isGamePage = pathname === "/game";

  return (
    <ThemeProvider>
      <MusicProvider>
        <ChatbotProvider>
          <Loader />
          <CursorGlow />
          {!isGamePage && <Navbar />}
          <main className={`relative z-10 flex flex-col min-h-screen ${isGamePage ? "" : "pt-20"}`}>
            {children}
          </main>
          {!isGamePage && <Footer />}
          {!isGamePage && <MusicPlayer />}
          {!isGamePage && <Chatbot />}
          <BackToTop />
          <CommandPalette />
        </ChatbotProvider>
      </MusicProvider>
    </ThemeProvider>
  );
}
