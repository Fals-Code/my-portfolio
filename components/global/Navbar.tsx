"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/context/ThemeContext";
import { Sun, Moon, Menu, X, Mail, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Magnetic from "../ui/Magnetic";
import { GitHub, Instagram } from "../ui/Icons";

/**
 * Global Navigation Component.
 * Features a dynamic background on scroll and a mobile-responsive drawer.
 */
export default function Navbar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Body Scroll Lock for Menu/Drawers
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "About", href: "/about" },
    { label: "Projects", href: "/projects" },
    { label: "Contact", href: "/contact" },
  ];

  return (
    <nav className={`hide-on-intro fixed top-0 w-full transition-[background,padding,box-shadow,color] duration-500 ease-in-out transform-gpu ${isOpen ? "z-[150]" : "z-50"} ${isScrolled ? "glass-panel py-3 shadow-sm shadow-black/5" : "bg-transparent py-4 md:py-7"}`} style={{ willChange: "padding, background" }}>
      <div className="max-w-7xl mx-auto px-6 md:px-10 flex items-center justify-between relative z-[100]">
        <Link href="/" className="text-2xl md:text-3xl font-syne font-extrabold text-[var(--text)] hover:text-accent transition-colors">
          Falah.
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-12">
          {navLinks.map((link) => (
            <Magnetic key={link.href} amount={0.2}>
              <Link 
                href={link.href} 
                className={`text-[10px] font-bold uppercase tracking-[0.3em] transition-all hover:text-accent p-2 ${
                  pathname === link.href ? "text-accent" : "text-text-muted"
                }`}
              >
                {link.label}
              </Link>
            </Magnetic>
          ))}
          <Magnetic amount={0.3}>
            <button 
              onClick={(e) => toggleTheme(e)} 
              className="p-3 rounded-2xl glass-panel hover:bg-white/5 transition-all outline-none"
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </Magnetic>
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden flex items-center gap-3">
          <button 
            onClick={(e) => toggleTheme(e)} 
            className="p-3 rounded-2xl glass-panel relative z-[160]"
          >
            {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="p-2 relative z-[160]"
          >
            {isOpen ? <X className="w-6 h-6 text-accent" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-[90]"
          />
        )}
      </AnimatePresence>

      {/* The Tech Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="md:hidden fixed top-0 right-0 h-[100dvh] w-[82vw] md:w-[60vw] bg-[var(--bg)] border-l border-[var(--border)] dark:border-accent/20 z-[101] p-8 md:p-12 flex flex-col justify-between shadow-2xl transition-colors duration-400 rounded-l-[2rem] md:rounded-l-[3.5rem] transform-gpu overflow-hidden"
            style={{ willChange: "transform" }}
          >
            <div className="space-y-10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-1.5 bg-accent rounded-full" />
                  <span className="text-xl font-syne font-black tracking-tighter text-accent">Navigation.</span>
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-3 bg-black/5 dark:bg-white/5 rounded-xl hover:bg-accent/10 transition-colors group"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <nav className="space-y-3">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + i * 0.05 }}
                  >
                    <Link 
                      href={link.href} 
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center justify-between group py-5 px-4 rounded-3xl transition-all ${
                        pathname === link.href ? "text-accent bg-accent/5 font-bold" : "text-[var(--text)] hover:text-accent hover:bg-black/5 dark:hover:bg-white/5"
                      }`}
                    >
                       <span className="text-2xl font-syne font-bold uppercase tracking-tight">{link.label}</span>
                       <ArrowLeft className={`w-5 h-5 transition-all duration-500 scale-0 group-hover:scale-100 ${pathname === link.href ? "scale-100 rotate-180" : ""}`} />
                    </Link>
                  </motion.div>
                ))}
              </nav>
            </div>

            {/* Drawer Footer */}
            <div className="space-y-12">
              {/* Simple & Elegant Theme Switcher */}
              <div 
                 onClick={(e) => toggleTheme(e)}
                 className="flex items-center justify-between p-6 rounded-[2rem] bg-[var(--bg-card)] border border-[var(--border)] cursor-pointer hover:bg-[var(--bg-hover)] transition-all"
              >
                 <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-accent/10">
                       {theme === "dark" ? <Moon className="w-5 h-5 text-accent" /> : <Sun className="w-5 h-5 text-accent" />}
                    </div>
                    <div>
                       <p className="text-xs font-bold text-[var(--text)] tracking-wide">Theme</p>
                       <p className="text-[10px] text-text-muted uppercase tracking-widest">{theme === "dark" ? "Dark" : "Light"}</p>
                    </div>
                 </div>

                 <div className={`w-12 h-6 rounded-full relative transition-colors duration-500 ${theme === "dark" ? "bg-accent" : "bg-neutral-200 dark:bg-neutral-800"}`}>
                    <motion.div 
                      animate={{ x: theme === "dark" ? 28 : 4 }}
                      transition={{ type: "spring", damping: 25, stiffness: 300 }}
                      className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-md" 
                    />
                 </div>
              </div>

              <div className="space-y-6">
                <p className="text-[10px] font-bold text-text-muted uppercase tracking-[0.2em] pl-4">Socials & Contact</p>
                <div className="flex gap-4">
                  <a href="https://github.com/Fals-Code" className="flex-1 flex items-center justify-center p-6 bg-[var(--bg-card)] border border-[var(--border)] rounded-3xl text-[var(--text)] hover:border-accent hover:text-accent hover:shadow-xl hover:shadow-accent/5 transition-all"><GitHub className="w-6 h-6" /></a>
                  <a href="https://instagram.com/falahh.am" className="flex-1 flex items-center justify-center p-6 bg-[var(--bg-card)] border border-[var(--border)] rounded-3xl text-[var(--text)] hover:border-accent hover:text-accent hover:shadow-xl hover:shadow-accent/5 transition-all"><Instagram className="w-6 h-6" /></a>
                  <a href="mailto:ahmadmathlaulfalah14@gmail.com" className="flex-1 flex items-center justify-center p-6 bg-[var(--bg-card)] border border-[var(--border)] rounded-3xl text-[var(--text)] hover:border-accent hover:text-accent hover:shadow-xl hover:shadow-accent/5 transition-all"><Mail className="w-6 h-6" /></a>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
