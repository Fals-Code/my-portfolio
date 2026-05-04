"use client";

import React, { useEffect, useState, useRef } from "react";
import { usePerformance } from "@/hooks/usePerformance";

const LOG_TEMPLATES = [
  "[INFO] Connection established from 192.168.1.xxx",
  "[WARN] High memory usage detected in worker-04",
  "[DEBUG] Query execution time: 14ms",
  "[INFO] Migrations successfully applied.",
  "[ERROR] Failed to fetch cache key 'user_stats_104'",
  "[INFO] New block added to chain: 0x8f2a...",
  "[DEBUG] Cleaning up orphaned sockets...",
  "[INFO] User authentication successful (ID: 4091)",
  "[WARN] Rate limit threshold approaching for IP 10.0.0.1",
  "[INFO] Worker thread 2 restarted automatically.",
  "[DEBUG] Sent payload: 1042 bytes",
  "[INFO] Garbage collection cycle completed: freed 42MB",
  "[WARN] Deprecated API endpoint called: /v1/users",
  "[INFO] Load balancer scaled up to 3 instances",
  "[DEBUG] Rebuilding search index...",
  "--- SERVER_STATUS_OK ---",
  "[INFO] Routing traffic to fallback region: AP-SOUTHEAST",
];

export default function ServerLogsBackground() {
  const { isLow } = usePerformance();
  const [logs, setLogs] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isLow) return; // Conditional logic inside hook instead of early return before hook

    // Initial fill
    const initialLogs = Array.from({ length: 40 }).map(() => 
      LOG_TEMPLATES[Math.floor(Math.random() * LOG_TEMPLATES.length)]
    );
    setLogs(initialLogs);

    const interval = setInterval(() => {
      setLogs((prev) => {
        const newLog = LOG_TEMPLATES[Math.floor(Math.random() * LOG_TEMPLATES.length)];
        // Keep array size manageable (e.g. 50 items)
        const updated = [...prev, newLog];
        if (updated.length > 50) updated.shift();
        return updated;
      });
    }, 1500); // Add a new log every 1.5s

    return () => clearInterval(interval);
  }, []);

  // Calculate a timestamp for realism
  const getTimeString = () => {
    const now = new Date();
    return `${now.toISOString().replace('T', ' ').substring(0, 19)}`;
  };
  // If low performance mode is active, don't render the logs to save CPU
  if (isLow) return null;

  return (
    <div className="fixed inset-0 z-[-2] pointer-events-none overflow-hidden opacity-[0.03] flex justify-end">
      {/* 
        We use a right-aligned container that takes up part of the screen 
        so it looks like a terminal window running in the background.
      */}
      <div 
        ref={containerRef}
        className="w-full md:w-1/2 lg:w-1/3 h-full flex flex-col justify-end p-4 font-mono text-[10px] leading-relaxed text-[var(--get)] select-none mask-image-gradient"
        style={{
          // Fade out the top of the logs so they disappear smoothly
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 20%, black 100%)',
          maskImage: 'linear-gradient(to bottom, transparent 0%, black 20%, black 100%)'
        }}
      >
        <div className="flex flex-col justify-end">
          {logs.map((log, index) => (
            <div key={index} className="flex gap-2 w-full break-all animate-fade-in-up">
              <span className="opacity-50 min-w-[130px] shrink-0">[{getTimeString()}]</span>
              <span>{log}</span>
            </div>
          ))}
        </div>
      </div>
      
      {/* Custom styles for the animation */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fadeInUpLog {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fadeInUpLog 0.3s ease-out forwards;
        }
      `}} />
    </div>
  );
}
