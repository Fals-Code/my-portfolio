"use client";

import React, { useState, useRef, useEffect } from "react";
import { useChat } from "@ai-sdk/react";
import { Bot, X, Send, User, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AIChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat({
    api: "/api/chat",
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 p-4 rounded-full bg-[var(--get)] text-black shadow-lg shadow-[var(--get)]/20 hover:scale-105 transition-transform z-[100] ${
          isOpen ? "hidden" : "block"
        }`}
        aria-label="Tanya Falah Bot"
      >
        <MessageSquare className="w-6 h-6" />
      </button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 w-[90vw] md:w-[380px] h-[500px] max-h-[80vh] bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl shadow-2xl flex flex-col z-[101] overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-[var(--bg-card2)] border-b border-[var(--border)]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[var(--get)]/20 flex items-center justify-center text-[var(--get)]">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-syne font-bold text-sm text-[var(--text)]">Falah Bot</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--get)] animate-pulse" />
                    <span className="text-[10px] text-[var(--muted)] font-mono">Online</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-[var(--muted)] hover:text-[var(--delete)] transition-colors p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
              {messages.length === 0 && (
                <div className="text-center text-[var(--muted)] mt-10 space-y-2">
                  <Bot className="w-8 h-8 mx-auto opacity-50" />
                  <p className="text-sm">Halo! Saya Falah Bot. Ada yang ingin ditanyakan seputar portofolio atau skill Falah?</p>
                </div>
              )}
              
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                      m.role === "user" ? "bg-[var(--post)]/20 text-[var(--post)]" : "bg-[var(--get)]/20 text-[var(--get)]"
                    }`}
                  >
                    {m.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </div>
                  <div
                    className={`px-4 py-2.5 rounded-2xl max-w-[80%] text-sm ${
                      m.role === "user"
                        ? "bg-[var(--post)]/10 border border-[var(--post)]/20 text-[var(--text)] rounded-tr-sm"
                        : "bg-[var(--bg-card2)] border border-[var(--border)] text-[var(--muted)] rounded-tl-sm"
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex gap-3">
                  <div className="w-7 h-7 rounded-full bg-[var(--get)]/20 text-[var(--get)] flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="px-4 py-3 rounded-2xl bg-[var(--bg-card2)] border border-[var(--border)] rounded-tl-sm flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--muted)] animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--muted)] animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--muted)] animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Form */}
            <div className="p-3 bg-[var(--bg-card2)] border-t border-[var(--border)]">
              <form onSubmit={handleSubmit} className="flex gap-2 relative">
                <input
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Tanya sesuatu..."
                  disabled={isLoading}
                  className="flex-1 bg-[var(--bg-card)] border border-[var(--border)] rounded-full px-4 py-2.5 text-sm outline-none focus:border-[var(--get)] transition-colors text-[var(--text)] disabled:opacity-50"
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  className="w-10 h-10 rounded-full bg-[var(--get)] text-black flex items-center justify-center shrink-0 disabled:opacity-50 disabled:bg-[var(--border)] transition-colors hover:scale-105 active:scale-95"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
