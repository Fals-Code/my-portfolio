"use client";

import React, { useRef, useEffect, useState } from "react";
import { useChatbot } from "@/context/ChatbotContext";
import { MessageSquare, X, Send, Trash2, Bot, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { usePerformance } from "@/hooks/usePerformance";
import ReactMarkdown from "react-markdown";
import remarkBreaks from "remark-breaks";

/**
 * Global Chatbot UI Component - MOBILE OPTIMIZED (Zero-Execution).
 */
export default function Chatbot() {
  const { isMobileDevice } = usePerformance();
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
    if (isLoading) {
      setThinkingMessage("Falah Bot is thinking...");
      timer1 = setTimeout(() => setThinkingMessage("Still processing..."), 3000);
    }
    return () => clearTimeout(timer1);
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
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, closeChat]);

  const renderChatWindow = () => {
    const content = (
      <div 
        className={`absolute bottom-full right-0 mb-6 w-[92vw] md:w-[480px] h-[550px] md:h-[650px] max-h-[75vh] rounded-3xl md:rounded-[3rem] overflow-hidden flex flex-col shadow-2xl border ${
          isMobileDevice 
            ? "bg-bg border-white/10" 
            : "glass-panel border-black/5 dark:border-white/5 bg-bg/95 backdrop-blur-md"
        }`}
        style={{ transform: "translateZ(0)" }}
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
                <span className="w-2 h-2 rounded-full bg-green-400" />
                <span className="text-[10px] font-bold opacity-80 uppercase tracking-tighter">AI AGENT</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={clearMessages} className="p-3 rounded-2xl hover:bg-white/20 transition-all"><Trash2 className="w-5 h-5" /></button>
            <button onClick={closeChat} className="p-3 rounded-2xl hover:bg-white/20 transition-all"><X className="w-5 h-5" /></button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 custom-scrollbar scroll-smooth">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`max-w-[85%] px-6 py-4 rounded-3xl text-[13px] md:text-sm leading-relaxed shadow-sm transform-gpu ${
                msg.role === "user" 
                  ? "bg-accent text-white rounded-br-sm shadow-accent/20" 
                  : "bg-black/5 dark:bg-white/15 border border-black/10 dark:border-white/10 text-[var(--text)] rounded-bl-sm"
              }`}>
                <div className="markdown-content">
                  <ReactMarkdown remarkPlugins={[remarkBreaks]}>{msg.content}</ReactMarkdown>
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-black/5 dark:bg-white/5 p-5 rounded-[2rem] flex items-center gap-3">
                <Loader2 className="w-5 h-5 animate-spin text-accent" />
                <span className="text-xs font-medium text-accent">{thinkingMessage}</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="p-6 md:p-8 border-t border-black/5 bg-white dark:bg-bg-card">
          <div className="flex gap-3 items-center">
            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              placeholder="Type a message..."
              className="w-full bg-white border border-gray-100 rounded-[1.5rem] px-6 py-4 text-sm focus:outline-none text-black placeholder:text-gray-400 font-medium"
              disabled={isLoading}
            />
            <button 
              type="submit" 
              disabled={isLoading || !input.trim()}
              className="bg-accent text-white p-4 h-[52px] w-[52px] rounded-2xl flex items-center justify-center shadow-xl shadow-accent/20"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            </button>
          </div>
        </form>
      </div>
    );

    if (isMobileDevice) return isOpen ? content : null;

    return (
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    );
  };

  return (
    <div ref={containerRef} className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-[60] hide-on-intro">
      {renderChatWindow()}

      {isMobileDevice ? (
        <button
          onClick={toggleChat}
          className="bg-accent text-white p-4 rounded-[1.2rem] shadow-xl flex items-center justify-center active:scale-95"
        >
          {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
        </button>
      ) : (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={toggleChat}
          className="bg-accent text-white p-4 rounded-[1.2rem] shadow-xl hover:shadow-accent/30 transition-all flex items-center justify-center relative group"
        >
          {isOpen ? <X className="w-6 h-6" /> : (
            <>
              <MessageSquare className="w-6 h-6 group-hover:scale-110 transition-transform duration-500" />
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center text-accent text-[10px] font-extrabold shadow-lg">1</span>
            </>
          )}
        </motion.button>
      )}
    </div>
  );
}
