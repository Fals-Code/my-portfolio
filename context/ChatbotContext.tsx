"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useChat, Message } from "ai/react";

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

export const ChatbotProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasOpenedBefore, setHasOpenedBefore] = useState(false);

  // useChat from 'ai/react' handles streaming and state automatically
  const { 
    messages, 
    input, 
    handleInputChange, 
    handleSubmit, 
    setMessages, 
    isLoading 
  } = useChat({
    api: "/api/chat",
    initialMessages: [
      {
        id: "welcome",
        role: "assistant",
        content: "Halo! Saya Falah Bot 🤖 Tanya apa saja tentang Falah — skill, proyek, atau cara menghubunginya!",
      },
    ],
  });

  const openChat = () => setIsOpen(true);
  const closeChat = () => setIsOpen(false);
  const toggleChat = () => setIsOpen((prev) => !prev);

  const clearMessages = () => {
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content: "Halo! Saya Falah Bot 🤖 Tanya apa saja tentang Falah — skill, proyek, atau cara menghubunginya!",
      },
    ]);
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
