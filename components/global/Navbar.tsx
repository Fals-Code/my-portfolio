"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/context/ThemeContext";
import { usePerformance } from "@/hooks/usePerformance";
import { Menu, X, Sun, Moon } from "lucide-react";
import HttpBadge from "../ui/HttpBadge";

export default function Navbar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { isLow } = usePerformance();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    { method: "GET" as const, endpoint: "/about", href: "/about" },
    { method: "POST" as const, endpoint: "/projects", href: "/projects" },
    { method: "PATCH" as const, endpoint: "/stack", href: "/stack" },
    { method: "DELETE" as const, endpoint: "/contact", href: "/contact" },
  ];

  return (
    <>
      <nav 
        className={`fixed top-0 w-full z-[120] transition-all duration-300 ${
          isScrolled || isOpen ? "border-b border-[var(--border)] py-4" : "py-6"
        }`}
        style={(isScrolled || isOpen) ? { 
          backgroundColor: 'var(--bg)', 
          backdropFilter: isLow ? 'none' : 'blur(10px)', 
          opacity: 1 
        } : { backgroundColor: 'transparent' }}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-10 flex items-center justify-between">
          <Link href="/" className="text-xl md:text-2xl font-bold font-syne text-[var(--text)] tracking-tight hover:text-[var(--get)] transition-colors">
            Falah<span className="text-[var(--get)]">.dev</span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <HttpBadge 
                key={link.href}
                method={link.method}
                endpoint={link.endpoint}
                href={link.href}
                active={pathname === link.href}
              />
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-md text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--bg-card)] transition-all border border-transparent hover:border-[var(--border)]"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-md text-[var(--text)] bg-[var(--bg-card)] border border-[var(--border)]"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu - Outside of nav to fix transparency/stacking */}
      <div 
        className={`lg:hidden fixed inset-0 top-[64px] z-[9999] transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ backgroundColor: 'var(--bg)', opacity: 1 }}
      >
        <div className="flex flex-col p-8 gap-6">
          {navLinks.map((link) => (
            <div key={link.href} className="w-full flex" onClick={() => setIsOpen(false)}>
              <HttpBadge 
                method={link.method}
                endpoint={link.endpoint}
                href={link.href}
                active={pathname === link.href}
                className="w-full justify-start py-3 text-lg"
              />
            </div>
          ))}
          <div className="mt-8 pt-8 border-t border-[var(--border)] space-y-4">
            <button
              onClick={() => {
                toggleTheme();
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-3 text-[var(--muted)] hover:text-[var(--text)] transition-colors py-2"
            >
              {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              <span className="font-mono text-sm uppercase tracking-widest font-bold">Toggle Theme</span>
            </button>

            <button
              onClick={() => {
                window.dispatchEvent(new CustomEvent('toggle-command-palette'));
                setIsOpen(false);
              }}
              className="w-full flex items-center gap-3 text-[var(--get)] hover:opacity-80 transition-colors py-2"
            >
              <span className="w-5 h-5 border border-current rounded flex items-center justify-center text-[10px] font-bold">K</span>
              <span className="font-mono text-sm uppercase tracking-widest font-bold">Open Palette</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
