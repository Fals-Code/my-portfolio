"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/context/ThemeContext";
import { Menu, X, Sun, Moon } from "lucide-react";
import HttpBadge from "../ui/HttpBadge";

export default function Navbar() {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { method: "GET" as const, endpoint: "/about", href: "/about" },
    { method: "POST" as const, endpoint: "/projects", href: "/projects" },
    { method: "PATCH" as const, endpoint: "/stack", href: "/stack" },
    { method: "DELETE" as const, endpoint: "/contact", href: "/contact" },
  ];

  return (
    <nav 
      className={`fixed top-0 w-full z-[100] transition-all duration-300 ${
        isScrolled ? "bg-[var(--bg)]/80 backdrop-blur-md border-b border-[var(--border)] py-4" : "bg-transparent py-6"
      }`}
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

      {/* Mobile Menu */}
      <div className={`lg:hidden fixed inset-0 top-[73px] bg-[var(--bg)]/95 backdrop-blur-md z-[90] transition-transform duration-300 ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}>
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
          <div className="mt-8 pt-8 border-t border-[var(--border)]">
            <button
              onClick={() => {
                toggleTheme();
                setIsOpen(false);
              }}
              className="flex items-center gap-3 text-[var(--muted)] hover:text-[var(--text)] transition-colors"
            >
              {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              <span className="font-mono text-sm">Toggle Theme</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
