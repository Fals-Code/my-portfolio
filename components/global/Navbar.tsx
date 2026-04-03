"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/context/ThemeContext";
import { Menu, X, Sun, Moon, Laptop, Volume2, VolumeX, Ghost } from "lucide-react";
import { useMusic } from "@/context/MusicContext";
import { GlassPanel } from "../ui/Primitives";
import { GitHub, Instagram } from "../ui/Icons";
import { usePerformance } from "@/hooks/usePerformance";

/**
 * Global Navigation Component.
 * Features a dynamic background on scroll and a mobile-responsive drawer.
 * Optimized for low-end devices by disabling scroll listeners.
 */
export default function Navbar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { isLow, isMobileDevice } = usePerformance();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Disable scroll tracking on mobile/low-tier to save CPU
    if (isLow || isMobileDevice) {
      if (!isScrolled) setIsScrolled(true);
      return;
    }

    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 20);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isLow, isMobileDevice, isScrolled]);

  // Body Scroll Lock - Improved to prevent layout shifts
  useEffect(() => {
    if (isOpen) {
      const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${scrollBarWidth}px`;
    } else {
      document.body.style.overflow = "unset";
      document.body.style.paddingRight = "0px";
    }
    return () => {
      document.body.style.overflow = "unset";
      document.body.style.paddingRight = "0px";
    };
  }, [isOpen]);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Projects", href: "/projects" },
    { label: "Contact", href: "/contact" },
  ];

  const { isPlaying, togglePlay, isMuted, toggleMute, volume } = useMusic();

  return (
    <nav 
      className={`hide-on-intro fixed top-0 w-full ${isOpen ? "z-[150]" : "z-50"} ${
        isScrolled || isLow ? "glass-panel py-3 shadow-sm" : "bg-transparent py-4 md:py-7"
      } ${!isLow ? "transition-all duration-500 ease-in-out transform-gpu" : ""}`} 
      style={isLow ? {} : { willChange: "padding, background" }}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10 flex items-center justify-between relative z-[100]">
        <Link href="/" className="text-2xl md:text-3xl font-syne font-extrabold text-[var(--text)] hover:text-accent transition-colors">
          Falah.
        </Link>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-[12px] font-bold uppercase tracking-[0.3em] transition-all duration-300 hover:text-accent relative group ${
                pathname === link.href ? "text-accent" : "text-text-muted"
              }`}
            >
              {link.label}
              <span className={`absolute -bottom-2 left-0 h-[2px] bg-accent transition-all duration-300 ${
                pathname === link.href ? "w-full" : "w-0 group-hover:w-full"
              }`} />
            </Link>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center gap-6">
          <div className="flex items-center gap-2 p-1.5 glass-panel rounded-full">
            <button 
              onClick={togglePlay}
              className={`p-2 rounded-full transition-all ${isPlaying ? "bg-accent text-white" : "text-text-muted hover:bg-white/5"}`}
              title={isPlaying ? "Pause Music" : "Play Music"}
            >
              {isPlaying ? <Ghost className="w-4 h-4 animate-bounce" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <button 
              onClick={toggleMute}
              className="p-2 text-text-muted hover:bg-white/5 rounded-full transition-all"
            >
              {isMuted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>

          <button
            onClick={toggleTheme}
            className="p-3 glass-panel rounded-full text-text-muted hover:text-accent transition-all duration-300 group"
          >
            {theme === "dark" ? <Sun className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" /> : <Moon className="w-5 h-5 group-hover:-rotate-12 transition-transform" />}
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden p-3 glass-panel rounded-2xl text-[var(--text)] relative z-[200]"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <div className={`fixed inset-0 bg-black/60 backdrop-blur-md z-[140] lg:hidden transition-all duration-500 ${
        isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}>
        <div className={`absolute right-0 top-0 h-full w-[85%] max-w-sm bg-[var(--bg)] border-l border-white/5 p-10 flex flex-col transition-transform duration-500 ease-out-expo ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}>
          <div className="flex flex-col gap-10 mt-16">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className={`text-3xl font-syne font-extrabold transition-all duration-300 ${
                  pathname === link.href ? "text-accent translate-x-2" : "text-text-muted hover:text-[var(--text)]"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="mt-auto space-y-10">
             <div className="flex items-center gap-4">
                <button 
                  onClick={togglePlay}
                  className={`flex-1 py-4 flex items-center justify-center gap-3 rounded-2xl border transition-all ${
                    isPlaying ? "bg-accent border-accent text-white" : "border-white/5 text-text-muted"
                  }`}
                >
                  {isPlaying ? <Ghost className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                  <span className="font-bold uppercase tracking-widest text-[10px]">{isPlaying ? "Playing" : "Music Off"}</span>
                </button>
                <button
                  onClick={toggleTheme}
                  className="p-4 glass-panel rounded-2xl text-text-muted flex items-center justify-center"
                >
                  {theme === "dark" ? <Sun className="w-6 h-6" /> : <Moon className="w-6 h-6" />}
                </button>
             </div>

             <div className="flex items-center justify-between pt-6 border-t border-white/5">
                <div className="flex gap-4">
                  <Link href="https://github.com/MathlaulFalah" target="_blank" className="text-text-muted hover:text-accent transition-colors">
                    <GitHub className="w-6 h-6" />
                  </Link>
                  <Link href="https://instagram.com/mathlaul_falah" target="_blank" className="text-text-muted hover:text-accent transition-colors">
                    <Instagram className="w-6 h-6" />
                  </Link>
                </div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-text-muted opacity-40">© 2024 Falah</span>
             </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
