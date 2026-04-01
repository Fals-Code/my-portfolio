"use client";

import React, { createContext, useContext, useState } from "react";
import { useChat, Message } from "@ai-sdk/react";

interface ChatbotContextType {
  messages: Message[];
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isOpen: boolean;
  isLoading: boolean;
  openChat: () => void;
  closeChat: () => void;
  toggleChat: () => void;
  clearMessages: () => void;
}

const ChatbotContext = createContext<ChatbotContextType | undefined>(undefined);

const INITIAL_MESSAGES: Message[] = [];

export const ChatbotProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  // useChat from '@ai-sdk/react' is now stabilized with INITIAL_MESSAGES.
  const { 
    messages, 
    input, 
    handleInputChange, 
    handleSubmit, 
    setMessages, 
    isLoading 
  } = useChat({
    api: "/api/chat",
    streamProtocol: "data",
    initialMessages: INITIAL_MESSAGES,
    fetch: (url, options) => {
      return fetch(url, { ...options, cache: "no-store" });
    },
    onError: (error) => {
      console.error("DEBUG - FULL STREAM ERROR:", error);
      // Try to log the error object details
      if (error && typeof error === 'object') {
        console.dir(error);
      }
    }
  });

  const openChat = () => setIsOpen(true);
  const closeChat = () => setIsOpen(false);
  const toggleChat = () => setIsOpen((prev) => !prev);

  const clearMessages = () => {
    setMessages([]);
  };

  return (
    <ChatbotContext.Provider 
      value={{ 
        messages, 
        input, 
        handleInputChange, 
        handleSubmit, 
        isOpen, 
        isLoading, 
        openChat, 
        closeChat, 
        toggleChat, 
        clearMessages 
      }}
    >
      {children}
    </ChatbotContext.Provider>
  );
};

export const useChatbot = () => {
  const context = useContext(ChatbotContext);
  if (context === undefined) {
    throw new Error("useChatbot must be used within a ChatbotProvider");
  }
  return context;
};
