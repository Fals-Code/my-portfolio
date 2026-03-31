"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { Message } from "@/types";

interface ChatbotContextType {
  messages: Message[];
  isOpen: boolean;
  isLoading: boolean;
  openChat: () => void;
  closeChat: () => void;
  toggleChat: () => void;
  sendMessage: (content: string) => Promise<void>;
  clearMessages: () => void;
}

const ChatbotContext = createContext<ChatbotContextType | undefined>(undefined);

const WELCOME_MESSAGE: Message = {
  id: "welcome",
  role: "assistant",
  content: "Halo! Saya Falah Bot 👋 Tanya apa saja tentang Falah — skill, proyek, atau cara menghubunginya!",
  timestamp: new Date(),
};

/**
 * Manages the state and logic for the Falah Bot AI assistant.
 */
export const ChatbotProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [hasOpenedBefore, setHasOpenedBefore] = useState(false);

  // Auto-send welcome message on first open
  useEffect(() => {
    if (isOpen && !hasOpenedBefore) {
      setMessages([WELCOME_MESSAGE]);
      setHasOpenedBefore(true);
    }
  }, [isOpen, hasOpenedBefore]);

  const openChat = () => setIsOpen(true);
  const closeChat = () => setIsOpen(false);
  const toggleChat = () => setIsOpen((prev) => !prev);

  const sendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Math.random().toString(36).substring(7),
      role: "user",
      content,
      timestamp: new Date(),
    };

    // 1. Optimistic update
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      // 2. Fetch from API
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: updatedMessages }),
      });

      if (!response.ok) throw new Error("Failed to send message");

      const data = await response.json();

      const assistantMessage: Message = {
        id: Math.random().toString(36).substring(7),
        role: "assistant",
        content: data.reply,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Chat Error:", error);
      const errorMessage: Message = {
        id: "error",
        role: "assistant",
        content: "Maaf, sepertinya sedang ada kendala teknis. Coba lagi nanti ya!",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearMessages = () => {
    setMessages([WELCOME_MESSAGE]);
  };

  return (
    <ChatbotContext.Provider 
      value={{ 
        messages, 
        isOpen, 
        isLoading, 
        openChat, 
        closeChat, 
        toggleChat, 
        sendMessage, 
        clearMessages 
      }}
    >
      {children}
    </ChatbotContext.Provider>
  );
};

/**
 * Access the chatbot state and actions.
 */
export const useChatbot = () => {
  const context = useContext(ChatbotContext);
  if (context === undefined) {
    throw new Error("useChatbot must be used within a ChatbotProvider");
  }
  return context;
};
