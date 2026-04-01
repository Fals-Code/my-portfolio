"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";

export type LogLevel = "info" | "success" | "warn" | "error" | "system";

export interface LogEntry {
  id: string;
  timestamp: string;
  message: string;
  level: LogLevel;
}

interface SystemConsoleContextType {
  logs: LogEntry[];
  addLog: (message: string, level?: LogLevel) => void;
  clearLogs: () => void;
  isConsoleOpen: boolean;
  setConsoleOpen: (open: boolean) => void;
}

const SystemConsoleContext = createContext<SystemConsoleContextType | undefined>(undefined);

const BACKEND_JOKES = [
  "Caffeine intake detected. Compiler stability increasing.",
  "Warning: Production database found. Resisting urge to drop tables...",
  "Optimization complete. Code is now 0.0001% faster. You're welcome.",
  "Handshaking with API... it's a bit awkward.",
  "Garbage collection in progress. Cleaning up the mess you made.",
  "Stack overflow avoided. Just barely.",
  "Deploying to 'it-works-on-my-machine' cluster.",
  "Bypassing firewalls with recursive logic. Don't tell IT.",
  "Syncing the cloud. It's actually just someone else's computer.",
  "Laravel Eloquent: Making database queries look like poetry.",
];

export const SystemConsoleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isConsoleOpen, setConsoleOpen] = useState(false);

  const addLog = useCallback((message: string, level: LogLevel = "info") => {
    const newLog: LogEntry = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toLocaleTimeString('id-ID', { hour12: false }),
      message,
      level,
    };
    setLogs((prev) => [...prev.slice(-49), newLog]); // Keep last 50 logs
  }, []);

  const clearLogs = useCallback(() => setLogs([]), []);

  // Initial Boot Logs
  useEffect(() => {
    const bootSequence = [
      { msg: "SYSTEM BOOT SEQUENCE INITIATED", level: "system" as LogLevel },
      { msg: "Kernel: Ahmad_Mathlaul_Falah_v2.5.0", level: "info" as LogLevel },
      { msg: "Memory Check: [||||||||||] 100% OK", level: "success" as LogLevel },
      { msg: "Backend precision modules... LOADED", level: "success" as LogLevel },
      { msg: "Laravel_Service_Container... INITIALIZED", level: "info" as LogLevel },
      { msg: "PORTFOLIO_HANDSHAKE_COMPLETE", level: "system" as LogLevel },
    ];

    bootSequence.forEach((item, index) => {
      setTimeout(() => addLog(item.msg, item.level), index * 400);
    });

    // Random joke timer
    const interval = setInterval(() => {
      const joke = BACKEND_JOKES[Math.floor(Math.random() * BACKEND_JOKES.length)];
      addLog(joke, "info");
    }, 45000); // Every 45s a tiny backend joke

    return () => clearInterval(interval);
  }, [addLog]);

  return (
    <SystemConsoleContext.Provider value={{ logs, addLog, clearLogs, isConsoleOpen, setConsoleOpen }}>
      {children}
    </SystemConsoleContext.Provider>
  );
};

export const useSystemConsole = () => {
  const context = useContext(SystemConsoleContext);
  if (context === undefined) {
    throw new Error("useSystemConsole must be used within a SystemConsoleProvider");
  }
  return context;
};
