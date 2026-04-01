"use client";

import React, { useRef, useEffect, useState } from "react";
import { useChatbot } from "@/context/ChatbotContext";
import { MessageSquare, X, Send, Trash2, Bot, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";

/**
 * Global Chatbot UI Component.
 * Upgraded to Gemini-Streaming with Vercel AI SDK.
 * Text appears word-by-word just like Gemini/ChatGPT.
 */
export default function Chatbot() {
  const { 
    messages, 
    input,
    handleInputChange,
    handleSubmit,
    isOpen, 
    isLoading, 
    toggleChat, 
    clearMessages,
    closeChat
  } = useChatbot();
  
  const [thinkingMessage, setThinkingMessage] = useState("Falah Bot is thinking...");
  
  useEffect(() => {
    let timer1: NodeJS.Timeout;
    let timer2: NodeJS.Timeout;
    let timer3: NodeJS.Timeout;

    if (isLoading) {
      setThinkingMessage("Falah Bot is thinking...");
      
      timer1 = setTimeout(() => {
        setThinkingMessage("Still processing your request...");
      }, 3000);
      
      timer2 = setTimeout(() => {
        setThinkingMessage("Almost there, preparing the answer...");
      }, 6000);
      
      timer3 = setTimeout(() => {
        setThinkingMessage("This is taking a bit longer than usual, please hold on...");
      }, 10000);
    }

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [isLoading]);
  
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) scrollToBottom();
  }, [messages, isOpen]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isOpen && containerRef.current && !containerRef.current.contains(event.target as Node)) {
        closeChat();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, closeChat]);

  return (
    <div ref={containerRef} className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-[60] hide-on-intro">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="absolute bottom-full right-0 mb-6 w-[calc(100vw-2rem)] md:w-[480px] h-[550px] md:h-[650px] max-h-[80vh] glass-panel rounded-[2rem] md:rounded-[3rem] overflow-hidden flex flex-col shadow-2xl border border-black/5 dark:border-white/5 bg-bg/60 backdrop-blur-2xl"
          >
            {/* Header */}
            <div className="p-6 md:p-8 bg-accent text-white flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-2xl">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-syne font-bold uppercase tracking-[0.2em] text-xs">Falah Bot</h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                    <span className="text-[10px] font-bold opacity-80 uppercase tracking-tighter">Powered by Gemini</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button 
                  onClick={clearMessages} 
                  title="Clear History"
                  className="p-3 rounded-2xl hover:bg-white/20 transition-all cursor-pointer"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
                <button 
                  onClick={closeChat} 
                  className="p-3 rounded-2xl hover:bg-white/20 transition-all font-bold cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 custom-scrollbar scroll-smooth">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] px-6 py-4 rounded-3xl text-[13px] md:text-sm leading-relaxed shadow-sm transform-gpu ${
                    msg.role === "user" 
                      ? "bg-accent text-white rounded-br-sm shadow-accent/20" 
                      : "bg-black/5 dark:bg-white/10 border border-black/10 dark:border-white/10 text-[var(--text)] rounded-bl-sm backdrop-blur-sm"
                  }`}>
                    <div className="markdown-content">
                      <ReactMarkdown remarkPlugins={[remarkBreaks]}>
                        {msg.content.replace(/([:.])\s\*/g, '$1\n\n*')}
                      </ReactMarkdown>
                    </div>
                  </div>
                </div>
              ))}
              
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 p-5 rounded-[2rem] flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2 duration-500">
                    <Loader2 className="w-5 h-5 animate-spin text-accent" />
                    <span className="text-xs font-medium text-accent animate-pulse">
                      {thinkingMessage}
                    </span>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input - Consistent White Design */}
            <form onSubmit={handleSubmit} className="p-6 md:p-8 border-t border-black/5 bg-white backdrop-blur-xl">
              <div className="flex gap-3 items-center">
                <div className="relative flex-1 group">
                  <input
                    type="text"
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Type a message..."
                    className="w-full bg-white border border-gray-100 focus:border-accent/40 focus:ring-4 focus:ring-accent/5 rounded-[1.5rem] px-6 py-4 text-sm focus:outline-none transition-all duration-300 text-black placeholder:text-gray-400 font-medium shadow-sm"
                    disabled={isLoading}
                    autoFocus
                  />
                </div>
                <button 
                  type="submit" 
                  disabled={isLoading || !input.trim()}
                  className="bg-accent text-white p-4 h-[52px] w-[52px] rounded-2xl hover:bg-accent-hover active:scale-90 hover:scale-105 transition-all duration-300 disabled:opacity-20 disabled:grayscale flex items-center justify-center shadow-xl shadow-accent/20"
                >
                  {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />}
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
        className="bg-accent text-white p-4 rounded-[1.2rem] shadow-xl hover:shadow-accent/30 transition-all flex items-center justify-center relative group"
      >
        {isOpen ? <X className="w-6 h-6" /> : (
          <>
            <MessageSquare className="w-6 h-6 group-hover:scale-110 transition-transform duration-500" />
            {!isOpen && <span className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center text-accent text-[10px] font-extrabold shadow-lg">1</span>}
          </>
        )}
      </motion.button>
    </div>
  );
}
