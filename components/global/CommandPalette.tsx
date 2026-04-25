"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Home, User, Briefcase, Mail, X, Command, Sparkles, Loader2, ArrowRight, Sun, Moon, Music, Terminal as TerminalIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useChat } from "@ai-sdk/react";
import { useTheme } from "@/context/ThemeContext";
import { useMusic } from "@/context/MusicContext";

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const { togglePlay, isPlaying } = useMusic();

  const { append, messages, isLoading: isAiLoading, setMessages } = useChat({
    api: "/api/chat",
    id: "command-palette-chat",
    initialMessages: [],
  });

  const lastAiResponse = messages[messages.length - 1];

  const items = [
    // Navigation
    { id: 'home', name: "Home", icon: <Home className="w-4 h-4" />, href: "/", category: "Navigation" },
    { id: 'about', name: "About", icon: <User className="w-4 h-4" />, href: "/about", category: "Navigation" },
    { id: 'projects', name: "Projects", icon: <Briefcase className="w-4 h-4" />, href: "/projects", category: "Navigation" },
    { id: 'contact', name: "Contact", icon: <Mail className="w-4 h-4" />, href: "/contact", category: "Navigation" },
    // System Actions
    { 
      id: 'theme', 
      name: `Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`, 
      icon: theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />, 
      action: toggleTheme,
      category: "System"
    },
    { 
      id: 'music', 
      name: `${isPlaying ? 'Stop' : 'Play'} Background Music`, 
      icon: <Music className="w-4 h-4" />, 
      action: togglePlay,
      category: "System"
    },
    { 
      id: 'terminal', 
      name: "Open Terminal Mode", 
      icon: <TerminalIcon className="w-4 h-4" />, 
      action: () => {
        window.dispatchEvent(new CustomEvent('toggle-terminal'));
        setIsOpen(false);
      },
      category: "System"
    }
  ];

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(query.toLowerCase()) ||
    item.category.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setIsOpen(false);
      }
      
      if (!isOpen) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex(prev => (prev + 1) % filteredItems.length);
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex(prev => (prev - 1 + filteredItems.length) % filteredItems.length);
      }
      if (e.key === "Enter") {
        e.preventDefault();
        if (filteredItems[activeIndex]) {
          handleSelect(filteredItems[activeIndex]);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, filteredItems, activeIndex]);

  useEffect(() => {
    const handleToggle = () => setIsOpen(prev => !prev);
    window.addEventListener("toggle-command-palette", handleToggle);
    return () => window.removeEventListener("toggle-command-palette", handleToggle);
  }, []);

  // AI Trigger
  useEffect(() => {
    if (query.length < 3) {
      setMessages([]);
      return;
    }

    const timeout = setTimeout(() => {
      setMessages([]); 
      append({
        role: "user",
        content: `Search Query: "${query}". Respond with a very brief 1-sentence answer or a navigation suggestion (e.g. "Buka /projects").`,
      });
    }, 1500);

    return () => clearTimeout(timeout);
  }, [query, append, setMessages]);

  const handleSelect = (item: typeof items[0]) => {
    if (item.href) {
      router.push(item.href);
    } else if (item.action) {
      item.action();
    }
    setIsOpen(false);
    setQuery("");
    setMessages([]);
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
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[9999]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="fixed top-[15%] left-1/2 -translate-x-1/2 w-full max-w-xl z-[10000] overflow-hidden rounded-3xl border border-white/10 shadow-2xl bg-[#0c0c0f]/95 text-white"
          >
            {/* Search Header */}
            <div className="p-6 border-b border-white/5 flex items-center gap-4">
              <div className="relative">
                {isAiLoading ? (
                  <Loader2 className="w-5 h-5 text-[var(--get)] animate-spin" />
                ) : (
                  <Search className="w-5 h-5 text-gray-400" />
                )}
              </div>
              <input
                autoFocus
                placeholder="Search or execute system actions..."
                className="bg-transparent border-none outline-none text-white w-full placeholder:text-gray-500 font-syne text-lg"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 rounded-xl border border-white/10">
                <Command className="w-3 h-3 text-gray-400" />
                <span className="text-[10px] text-gray-400 font-bold">K</span>
              </div>
            </div>

            <div className="p-4 max-h-[450px] overflow-y-auto custom-scrollbar space-y-6">
              {filteredItems.length > 0 ? (
                <div className="space-y-1">
                  {filteredItems.map((item, index) => (
                    <button
                      key={item.id}
                      onClick={() => handleSelect(item)}
                      onMouseEnter={() => setActiveIndex(index)}
                      className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all group text-left ${
                        index === activeIndex ? 'bg-white/10' : 'hover:bg-white/5'
                      }`}
                    >
                      <div className={`p-2 rounded-lg transition-colors ${
                        index === activeIndex ? 'bg-[var(--get)]/20 text-[var(--get)]' : 'bg-white/5 text-gray-400'
                      }`}>
                        {item.icon}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-syne font-medium text-sm">{item.name}</span>
                        <span className="text-[10px] text-gray-500 uppercase tracking-widest">{item.category}</span>
                      </div>
                      {index === activeIndex && (
                        <div className="ml-auto flex items-center gap-2 text-[var(--get)] font-mono text-[10px] font-bold">
                           <span>EXECUTE</span>
                           <ArrowRight className="w-3 h-3" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center text-gray-500 font-mono text-xs">
                   NO MATCHING ENDPOINTS FOUND
                </div>
              )}

              {/* AI Insight Section */}
              {query.length >= 3 && (
                <div className="mt-4 pt-4 border-t border-white/5">
                  <div className="flex items-center gap-2 px-4 mb-4">
                    <Sparkles className="w-3.5 h-3.5 text-[var(--get)] animate-pulse" />
                    <p className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Neural Search Insight</p>
                  </div>
                  
                  <div className="mx-4 p-5 rounded-[1.5rem] bg-[var(--get)]/5 border border-[var(--get)]/20 relative overflow-hidden">
                    {isAiLoading && !lastAiResponse ? (
                      <div className="flex items-center gap-4 text-sm text-gray-400 italic py-2">
                        <Loader2 className="w-4 h-4 animate-spin text-[var(--get)]" />
                        Analyzing system queries...
                      </div>
                    ) : lastAiResponse ? (
                      <div className="space-y-3">
                        <p className="text-sm font-medium leading-relaxed text-gray-200">
                          {lastAiResponse.role === 'assistant' ? lastAiResponse.content : "Calculating..."}
                        </p>
                      </div>
                    ) : null}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 bg-black/40 border-t border-white/5 flex items-center justify-between text-[10px] text-gray-500 font-bold uppercase tracking-widest px-8">
              <div className="flex items-center gap-4">
                 <span>ENTER to select</span>
                 <span>↑↓ to navigate</span>
              </div>
              <div className="flex items-center gap-2 text-[var(--get)]/60">
                 <Sparkles className="w-3 h-3" />
                 <span>CORE v3.0</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
