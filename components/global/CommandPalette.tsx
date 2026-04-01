"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Home, User, Briefcase, Mail, X, Command, Sparkles, Loader2, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useChat } from "@ai-sdk/react";
export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const router = useRouter();

  const { append, messages, isLoading: isAiLoading, setMessages } = useChat({
    api: "/api/chat",
    id: "command-palette-chat",
    initialMessages: [],
  });

  const lastAiResponse = messages[messages.length - 1];

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

  // AI Trigger: Send query when user stops typing
  useEffect(() => {
    if (query.length < 3) {
      setMessages([]);
      return;
    }

    const timeout = setTimeout(() => {
      setMessages([]); // Clear previous for a fresh context
      append({
        role: "user",
        content: `Search Query: "${query}". Respond with a very brief 1-sentence answer or a navigation suggestion (e.g. "Buka /projects").`,
      });
    }, 1000);

    return () => clearTimeout(timeout);
  }, [query, append, setMessages]);

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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999]"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="fixed top-[15%] left-1/2 -translate-x-1/2 w-full max-w-xl glass-panel z-[10000] overflow-hidden rounded-3xl border-accent/20 shadow-2xl bg-bg/95"
          >
            {/* Search Header */}
            <div className="p-6 border-b border-black/5 dark:border-white/5 flex items-center gap-4">
              <div className="relative">
                {isAiLoading ? (
                  <Loader2 className="w-5 h-5 text-accent animate-spin" />
                ) : (
                  <Search className="w-5 h-5 text-text-muted" />
                )}
              </div>
              <input
                autoFocus
                placeholder="Ask AI or search anything..."
                className="bg-transparent border-none outline-none text-text w-full placeholder:text-text-muted font-syne text-lg"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-black/5 dark:bg-white/5 rounded-xl border border-black/5 dark:border-white/10">
                <Command className="w-3 h-3 text-text-muted" />
                <span className="text-[10px] text-text-muted font-bold">K</span>
              </div>
            </div>

            <div className="p-4 max-h-[500px] overflow-y-auto custom-scrollbar space-y-6">
              {/* Local Navigation Section */}
              {filteredItems.length > 0 && (
                <div>
                  <p className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-accent mb-2">Internal Navigation</p>
                  <div className="space-y-1">
                    {filteredItems.map((item) => (
                      <button
                        key={item.href}
                        onClick={() => navigate(item.href)}
                        className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-black/5 dark:hover:bg-white/5 transition-colors group text-left"
                      >
                        <div className="p-2 bg-black/5 dark:bg-white/5 rounded-lg group-hover:bg-accent/10 group-hover:text-accent transition-colors">
                          {item.icon}
                        </div>
                        <span className="font-syne font-medium text-text">{item.name}</span>
                        <ArrowRight className="ml-auto w-4 h-4 text-text-muted opacity-0 group-hover:opacity-100 transition-all translate-x-2 group-hover:translate-x-0" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* AI Insight Section */}
              {query.length >= 3 && (
                <div className="mt-4 pt-4 border-t border-black/5 dark:border-white/5">
                  <div className="flex items-center gap-2 px-4 mb-4">
                    <Sparkles className="w-3.5 h-3.5 text-accent animate-pulse" />
                    <p className="text-[10px] font-bold uppercase tracking-widest text-text-muted">AI Insights</p>
                  </div>
                  
                  <div className="mx-4 p-5 rounded-[1.5rem] bg-accent/5 border border-accent/20 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-3 opacity-10">
                      <Sparkles className="w-12 h-12 text-accent" />
                    </div>
                    {isAiLoading && !lastAiResponse ? (
                      <div className="flex items-center gap-4 text-sm text-text-muted italic py-2">
                        <Loader2 className="w-4 h-4 animate-spin text-accent" />
                        Analyzing query with Falah...
                      </div>
                    ) : lastAiResponse ? (
                      <div className="space-y-3">
                        <p className="text-sm font-medium leading-relaxed text-text">
                          {lastAiResponse.role === 'assistant' ? lastAiResponse.content : "Calculating..."}
                        </p>
                        {lastAiResponse.content.includes('/') && (
                          <button 
                             onClick={() => {
                               const match = lastAiResponse.content.match(/\/[a-z]+/);
                               if (match) navigate(match[0]);
                             }}
                             className="text-[10px] font-bold uppercase tracking-widest text-accent flex items-center gap-2 hover:gap-3 transition-all"
                          >
                             Jump to destination <ArrowRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-text-muted italic">Type more for AI suggestions...</p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Footer Commands */}
            <div className="p-4 bg-black/5 dark:bg-black/40 border-t border-black/5 dark:border-white/5 flex items-center justify-between text-[10px] text-text-muted font-bold uppercase tracking-widest px-8">
              <div className="flex items-center gap-4">
                 <span>Type to search</span>
                 <span>↑↓ to navigate</span>
              </div>
              <div className="flex items-center gap-2 text-accent/60">
                 <Sparkles className="w-3 h-3" />
                 <span>AI Powered Center</span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
