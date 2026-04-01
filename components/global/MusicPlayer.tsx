"use client";

import React, { useState, useCallback, useRef } from "react";
import { useMusic } from "@/context/MusicContext";
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  ChevronUp, 
  ChevronDown,
  Waves,
  Music as MusicIcon,
  Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Global Music Player UI.
 * Refined with bottom-10 spacing and airy layouts for a 'Perfect Clean' feel.
 */
export default function MusicPlayer() {
  const { 
    isPlaying, 
    togglePlay, 
    volume, 
    setVolume, 
    currentTrack, 
    isMuted, 
    toggleMute, 
    nextTrack, 
    prevTrack,
    sfxEnabled,
    toggleSfx,
    isPlayerReady
  } = useMusic();
  
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="fixed bottom-4 left-4 md:bottom-6 md:left-6 z-[60] hide-on-intro">
      <div className="relative group">
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.9 }}
              className="absolute bottom-full left-0 mb-6 p-8 glass-panel rounded-[2.5rem] w-80 space-y-8 border border-white/5 bg-bg/60 backdrop-blur-2xl shadow-2xl"
            >
              {/* Track Info */}
              <div className="space-y-4 px-2">
                <div className="flex items-center gap-3 text-accent/80">
                  <MusicIcon className="w-4 h-4 animate-pulse" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Now Playing</span>
                </div>
                <div className="space-y-1">
                  <h4 className="text-xl font-syne font-extrabold text-[var(--text)] tracking-tight truncate">{currentTrack?.title}</h4>
                  <p className="text-[11px] text-text-muted font-bold uppercase tracking-[0.2em]">{currentTrack?.artist}</p>
                </div>
              </div>

              {/* SFX Toggle */}
              <div className="flex items-center justify-between px-4 py-3 bg-white/5 rounded-2xl border border-white/5">
                <div className="flex items-center gap-3">
                  <Waves className={`w-4 h-4 ${sfxEnabled ? "text-accent" : "text-text-muted"}`} />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--text)]">System SFX</span>
                </div>
                <button 
                  onClick={toggleSfx}
                  className={`w-10 h-5 rounded-full relative transition-colors ${sfxEnabled ? "bg-accent" : "bg-neutral-800"}`}
                >
                  <motion.div 
                    animate={{ x: sfxEnabled ? 20 : 2 }}
                    className="absolute top-1 w-3 h-3 bg-white rounded-full transition-all"
                  />
                </button>
              </div>

              {/* Volume Control (Simplified) */}
              <div className="space-y-6 pt-4 border-t border-black/5 dark:border-white/5">
                <div className="flex items-center gap-4">
                  <button onClick={toggleMute} className="text-text-muted hover:text-accent transition-colors flex-shrink-0">
                    {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                  </button>
                  <div className="relative flex-1 group h-6 flex items-center">
                    {/* Visual Track */}
                    <div className="absolute inset-x-0 h-1.5 bg-black/5 dark:bg-white/10 rounded-full overflow-hidden">
                      <motion.div 
                        initial={false}
                        animate={{ width: `${(isMuted ? 0 : volume) * 100}%` }}
                        className="h-full bg-accent"
                      />
                    </div>
                    {/* Interactive Input */}
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={isMuted ? 0 : volume}
                      onChange={(e) => setVolume(parseFloat(e.target.value))}
                      className="absolute inset-x-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    {/* Custom Thumb (Pseudo-indicator) */}
                    <motion.div 
                      initial={false}
                      animate={{ left: `calc(${(isMuted ? 0 : volume) * 100}% - 4px)` }}
                      className="absolute w-3 h-3 bg-accent rounded-full shadow-lg border-2 border-white pointer-events-none z-20"
                    />
                  </div>
                  <span className="text-[10px] font-mono font-bold text-text-muted w-8 text-right">{Math.round(volume * 100)}%</span>
                </div>
              </div>

              {/* Playback Control (Simplified) */}
              <div className="flex items-center justify-center pt-2">
                <button 
                  onClick={togglePlay} 
                  disabled={!isPlayerReady}
                  className={`w-20 h-20 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500 transform active:scale-95 ${
                    !isPlayerReady 
                      ? "bg-neutral-800 text-neutral-500 cursor-wait" 
                      : "bg-accent text-white shadow-accent/40 hover:scale-110"
                  }`}
                >
                  {!isPlayerReady ? (
                    <Loader2 className="w-10 h-10 animate-spin" />
                  ) : isPlaying ? (
                    <Pause className="w-10 h-10 fill-current" />
                  ) : (
                    <Play className="w-10 h-10 fill-current ml-1.5" />
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center gap-2 md:gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={togglePlay}
            disabled={!isPlayerReady}
            className={`p-4 rounded-[1.2rem] shadow-xl flex items-center justify-center transition-all ${
              !isPlayerReady
                ? "bg-neutral-800 text-neutral-500 cursor-wait"
                : isPlaying 
                  ? "bg-accent text-white shadow-accent/20" 
                  : "glass-panel bg-[var(--bg)]/10 border-[var(--border)] cursor-pointer hover:bg-white/10"
            }`}
          >
            {!isPlayerReady ? (
              <Loader2 className="w-5 h-5 md:w-6 md:h-6 animate-spin" />
            ) : isPlaying ? (
              <Pause className="w-5 h-5 md:w-6 md:h-6 fill-current" />
            ) : (
              <Play className="w-5 h-5 md:w-6 md:h-6 fill-current ml-0.5" />
            )}
          </motion.button>

          {/* Track info - animated entry/exit */}
          <AnimatePresence>
            {isPlaying && currentTrack && (
              <motion.div 
                initial={{ opacity: 0, x: -10, width: 0 }}
                animate={{ opacity: 1, x: 0, width: "auto" }}
                exit={{ opacity: 0, x: -10, width: 0 }}
                className="hidden md:block max-w-[130px] overflow-hidden whitespace-nowrap"
              >
                <p className="text-[10px] font-bold text-[var(--text)] truncate leading-tight"
                  title={currentTrack.title}>
                  {currentTrack.title}
                </p>
                <p className="text-[9px] text-text-muted truncate">{currentTrack.artist}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`p-3 glass-panel rounded-[1rem] hover:bg-white/10 transition-all border border-[var(--border)] ${
              isExpanded ? "bg-white/10 border-accent/20" : "bg-[var(--bg)]/10"
            }`}
          >
            {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronUp className="w-5 h-5" />}
          </button>
        </div>
      </div>
    </div>
  );
}
