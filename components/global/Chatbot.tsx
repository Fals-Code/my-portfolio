"use client";

import React, { useState, useRef, useEffect } from "react";
import { useChatbot } from "@/context/ChatbotContext";
import { MessageSquare, X, Send, Trash2, Bot, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Global Chatbot UI Component.
 * Refined with bottom-10 spacing and airy layouts for a 'Perfect Clean' feel.
 */
export default function Chatbot() {
  const { 
    messages, 
    isOpen, 
    isLoading, 
    toggleChat, 
    sendMessage, 
    clearMessages,
    closeChat
  } = useChatbot();
  
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    const text = inputValue;
    setInputValue("");
    await sendMessage(text);
  };

  return (
    <div className="fixed bottom-10 right-10 z-[60]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="absolute bottom-full right-0 mb-6 w-[380px] md:w-[480px] h-[650px] glass-panel rounded-[3rem] overflow-hidden flex flex-col shadow-2xl border border-white/5 bg-bg/60 backdrop-blur-2xl"
          >
            {/* Header */}
            <div className="p-8 bg-accent text-white flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-2xl">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-syne font-bold uppercase tracking-[0.2em] text-xs">Falah Bot</h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-[10px] font-bold opacity-80 uppercase tracking-tighter">System Online</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={clearMessages} 
                  title="Clear History"
                  className="p-3 rounded-2xl hover:bg-white/20 transition-all"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
                <button 
                  onClick={closeChat} 
                  className="p-3 rounded-2xl hover:bg-white/20 transition-all font-bold"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar scroll-smooth">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] p-5 rounded-[2rem] text-sm leading-relaxed ${
                    msg.role === "user" 
                      ? "bg-accent text-white shadow-xl shadow-accent/10" 
                      : "bg-white/5 border border-white/5 text-text"
                  }`}>
                    {msg.content}
                    <div className={`text-[9px] mt-2 font-bold uppercase opacity-50 ${msg.role === "user" ? "text-right" : "text-left"}`}>
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white/5 border border-white/5 p-5 rounded-[2rem]">
                    <Loader2 className="w-5 h-5 animate-spin text-accent" />
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="p-6 border-t border-white/5 bg-white/[0.02]">
              <div className="flex gap-4 items-center">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Ask anything about Falah..."
                  className="flex-1 bg-white/5 border border-white/5 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-accent/40 transition-all"
                  disabled={isLoading}
                />
                <button 
                  type="submit" 
                  disabled={isLoading || !inputValue.trim()}
                  className="bg-accent text-white p-4 rounded-2xl hover:bg-accent-hover transition-all disabled:opacity-50 disabled:grayscale hover:scale-110 active:scale-95 duration-300"
                >
                  <Send className="w-6 h-6" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={toggleChat}
        className="bg-accent text-white p-6 rounded-[2rem] shadow-xl hover:shadow-accent/30 transition-all flex items-center justify-center relative group"
      >
        {isOpen ? <X className="w-8 h-8" /> : (
          <>
            <MessageSquare className="w-8 h-8 group-hover:scale-110 transition-transform duration-500" />
            {!isOpen && <span className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center text-accent text-[11px] font-extrabold shadow-lg">1</span>}
          </>
        )}
      </motion.button>
    </div>
  );
}
