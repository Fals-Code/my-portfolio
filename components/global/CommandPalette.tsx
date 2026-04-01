"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Home, User, Briefcase, Mail, X, Command } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const items = [
    { name: "Home", icon: <Home className="w-4 h-4" />, href: "/" },
    { name: "About", icon: <User className="w-4 h-4" />, href: "/about" },
    { name: "Projects", icon: <Briefcase className="w-4 h-4" />, href: "/projects" },
    { name: "Contact", icon: <Mail className="w-4 h-4" />, href: "/contact" },
  ];

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(query.toLowerCase())
  );

  const navigate = (href: string) => {
    router.push(href);
    setIsOpen(false);
    setQuery("");
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-xl glass-panel z-[10000] overflow-hidden rounded-3xl border-accent/20 shadow-2xl"
          >
            <div className="p-6 border-b border-white/5 flex items-center gap-4">
              <Search className="w-5 h-5 text-text-muted" />
              <input
                autoFocus
                placeholder="Search levels, projects, or sections..."
                className="bg-transparent border-none outline-none text-[var(--text)] w-full placeholder:text-text-muted font-syne"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <div className="flex items-center gap-1 px-2 py-1 bg-white/5 rounded-md border border-white/10">
                <span className="text-[10px] text-text-muted font-bold">ESC</span>
              </div>
            </div>

            <div className="p-4 max-h-[400px] overflow-y-auto custom-scrollbar">
              <p className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-accent mb-2">Navigation</p>
              {filteredItems.length > 0 ? (
                <div className="space-y-1">
                  {filteredItems.map((item) => (
                    <button
                      key={item.href}
                      onClick={() => navigate(item.href)}
                      className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-white/5 transition-colors group text-left"
                    >
                      <div className="p-2 bg-white/5 rounded-lg group-hover:bg-accent/10 group-hover:text-accent transition-colors">
                        {item.icon}
                      </div>
                      <span className="font-syne font-medium text-[var(--text)]">{item.name}</span>
                      <span className="ml-auto text-[10px] text-text-muted opacity-0 group-hover:opacity-100 transition-opacity">Jump to {item.name}</span>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-text-muted italic">
                  No results found for "{query}"
                </div>
              )}
            </div>

            <div className="p-4 bg-black/20 border-t border-white/5 flex items-center justify-between text-[10px] text-text-muted font-bold uppercase tracking-tighter">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1"><Command className="w-3 h-3" /> + K to Close</span>
              </div>
              <div className="flex items-center gap-4">
                 <span>Navigate with Arrows</span>
                 <span>Enter to select</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
