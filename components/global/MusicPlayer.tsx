"use client";

import React, { useState, useCallback, useRef } from "react";
import { useMusic } from "@/context/MusicContext";
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  SkipForward, 
  SkipBack, 
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
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-accent">
                  <MusicIcon className="w-4 h-4 animate-pulse" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em]">Now Playing</span>
                </div>
                <h4 className="text-base font-syne font-extrabold text-[var(--text)] truncate px-0">{currentTrack?.title}</h4>
                <p className="text-[12px] text-text-muted truncate font-bold uppercase tracking-widest">{currentTrack?.artist}</p>
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

              {/* Volume Control */}
              <div className="space-y-4 pt-2 border-t border-white/5">
                <div className="flex items-center justify-between">
                  <button onClick={toggleMute} className="text-text-muted hover:text-[var(--text)] transition-colors">
                    {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                  </button>
                  <span className="text-[10px] font-mono text-text-muted">{Math.round(volume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="w-full accent-accent h-1 bg-white/5 rounded-full appearance-none cursor-pointer"
                />
              </div>

              {/* Navigation Controls */}
              <div className="flex items-center justify-center gap-8 pt-2">
                <button 
                  onClick={prevTrack} 
                  className="text-text-muted hover:text-accent transition-colors"
                  title="Previous Track"
                >
                  <SkipBack className="w-6 h-6 fill-current" />
                </button>
                <button 
                  onClick={togglePlay} 
                  disabled={!isPlayerReady}
                  className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg transition-all duration-500 ${
                    !isPlayerReady 
                      ? "bg-neutral-800 text-neutral-500 cursor-wait" 
                      : "bg-accent text-white shadow-accent/20 hover:scale-110"
                  }`}
                >
                  {!isPlayerReady ? (
                    <Loader2 className="w-8 h-8 animate-spin" />
                  ) : isPlaying ? (
                    <Pause className="w-8 h-8 fill-current" />
                  ) : (
                    <Play className="w-8 h-8 fill-current ml-1" />
                  )}
                </button>
                <button 
                  onClick={nextTrack} 
                  className="text-text-muted hover:text-accent transition-colors"
                  title="Next Track"
                >
                  <SkipForward className="w-6 h-6 fill-current" />
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

          {/* Track info - visible only on md+ when playing */}
          {isPlaying && currentTrack && (
            <div className="hidden md:block max-w-[130px] overflow-hidden">
              <p className="text-[10px] font-bold text-[var(--text)] truncate leading-tight"
                title={currentTrack.title}>
                {currentTrack.title}
              </p>
              <p className="text-[9px] text-text-muted truncate">{currentTrack.artist}</p>
            </div>
          )}

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
