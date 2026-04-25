"use client";

import React, { useState, useEffect } from "react";
import { Music, Play, Pause, SkipBack, SkipForward } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useMusic } from "@/context/MusicContext";

export default function AudioStatus() {
  const { 
    isPlaying, 
    currentTrack, 
    togglePlay, 
    nextTrack, 
    prevTrack,
    isPlayerReady 
  } = useMusic();
  
  const [progress, setProgress] = useState(0);

  // Simulated progress bar for feel
  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setProgress(prev => (prev >= 100 ? 0 : prev + 0.2));
      }, 1000);
      return () => clearInterval(interval);
    } else {
      setProgress(0);
    }
  }, [isPlaying]);

  const activeTitle = currentTrack?.title || "No Track Selected";
  const activeArtist = currentTrack?.artist || "System Idle";

  return (
    <div className="flex items-center gap-4 px-4 py-1.5 bg-black/40 rounded-xl border border-white/5 hover:border-[var(--get)]/20 transition-all group/player relative overflow-hidden">
      {/* Background Progress Bar */}
      <div className="absolute bottom-0 left-0 h-[1px] bg-[var(--get)]/20 w-full overflow-hidden">
         <motion.div 
            className="h-full bg-[var(--get)]"
            animate={{ width: `${progress}%` }}
            transition={{ ease: "linear", duration: 1 }}
         />
      </div>

      {/* Visualizer / Play Icon */}
      <div className="relative flex items-center justify-center w-6">
        <AnimatePresence mode="wait">
          {isPlaying ? (
            <motion.div 
              key="playing"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="flex items-end gap-[2px] h-3"
            >
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{ height: [4, 12, 6, 10, 4] }}
                  transition={{ 
                    repeat: Infinity, 
                    duration: 1 + (i * 0.2), 
                    ease: "easeInOut",
                    delay: i * 0.1 
                  }}
                  className="w-[3px] bg-[var(--get)] rounded-full shadow-[0_0_8px_var(--get)]"
                />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="paused"
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
            >
              <Music className="w-4 h-4 text-[var(--muted)]" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Track Info */}
      <div className="flex flex-col min-w-[100px] max-w-[150px]">
        <div className="flex items-center gap-2 overflow-hidden">
          <span className="text-[8px] font-black uppercase tracking-widest text-[var(--post)]">
            LOFI RADIO
          </span>
          <span className="w-1 h-1 rounded-full bg-[var(--muted)]/30" />
          <AnimatePresence mode="wait">
            <motion.p 
              key={activeTitle}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="text-[10px] font-bold text-[var(--text)] truncate"
            >
              {activeTitle}
            </motion.p>
          </AnimatePresence>
        </div>
        <p className="text-[8px] text-[var(--muted)] truncate">
          {activeArtist}
        </p>
      </div>

      {/* Controls (Always visible on mobile, hover on desktop) */}
      <div className="flex items-center gap-2 pl-2 border-l border-white/10 md:opacity-0 md:group-hover/player:opacity-100 transition-opacity">
        <button 
          onClick={(e) => { e.stopPropagation(); prevTrack(); }}
          className="p-1 hover:text-[var(--get)] transition-colors hidden xs:block"
          title="Previous Track"
        >
          <SkipBack className="w-3 h-3 fill-current" />
        </button>

        <button 
          onClick={(e) => { e.stopPropagation(); togglePlay(); }}
          className="p-1.5 bg-white/5 rounded-full hover:bg-[var(--get)]/20 hover:text-[var(--get)] transition-all"
        >
          {isPlaying ? (
            <Pause className="w-3 h-3 fill-current" />
          ) : (
            <Play className="w-3 h-3 fill-current ml-0.5" />
          )}
        </button>

        <button 
          onClick={(e) => { e.stopPropagation(); nextTrack(); }}
          className="p-1 hover:text-[var(--get)] transition-colors hidden xs:block"
          title="Next Track"
        >
          <SkipForward className="w-3 h-3 fill-current" />
        </button>
      </div>

      {/* Connection Status Dot */}
      <div className="absolute top-1 right-1">
         <span className={`w-1 h-1 rounded-full ${isPlayerReady ? 'bg-[var(--get)]' : 'bg-[var(--delete)]'} animate-pulse`} />
      </div>
    </div>
  );
}
