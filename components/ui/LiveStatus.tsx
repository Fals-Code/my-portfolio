"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Clock, MapPin } from "lucide-react";

export default function LiveStatus() {
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Surabaya is GMT+7
      const options: Intl.DateTimeFormatOptions = {
        timeZone: "Asia/Jakarta",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      };
      setTime(new Intl.DateTimeFormat("en-GB", options).format(now));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col h-full justify-between gap-4">
      <div className="flex items-center justify-between">
        <div className="p-2 bg-accent/10 rounded-lg">
          <Clock className="w-4 h-4 text-accent" />
        </div>
        <div className="px-2 py-1 bg-green-500/10 rounded-full flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
          <span className="text-[10px] font-bold text-green-500 uppercase tracking-tighter">Online</span>
        </div>
      </div>

      <div className="space-y-1">
        <p className="text-3xl font-mono font-bold text-[var(--text)] tracking-widest">
          {time || "00:00:00"}
        </p>
        <div className="flex items-center gap-1 text-text-muted">
          <MapPin className="w-3 h-3 text-accent" />
          <span className="text-[10px] font-medium uppercase tracking-widest">Gresik — Surabaya, ID</span>
        </div>
      </div>

      <motion.p 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-[10px] text-text-muted italic leading-tight border-t border-black/10 dark:border-white/10/20 pt-3"
      >
        "Crafting systems while you sleep."
      </motion.p>
    </div>
  );
}
