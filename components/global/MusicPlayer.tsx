"use client";

import React, { useState } from "react";
import { useMusic } from "@/context/MusicContext";
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  SkipForward, 
  SkipBack, 
  Music as MusicIcon, 
  ChevronUp, 
  ChevronDown 
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
    prevTrack 
  } = useMusic();
  
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="fixed bottom-10 left-10 z-[60]">
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
                <h4 className="text-base font-syne font-extrabold text-white truncate px-0">{currentTrack?.title}</h4>
                <p className="text-[12px] text-text-muted truncate font-bold uppercase tracking-widest">{currentTrack?.artist}</p>
              </div>

              {/* Volume Control */}
              <div className="space-y-4 pt-2 border-t border-white/5">
                <div className="flex items-center justify-between">
                  <button onClick={toggleMute} className="text-text-muted hover:text-white transition-colors">
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
                  className="w-16 h-16 rounded-full bg-accent text-white flex items-center justify-center shadow-lg shadow-accent/20 hover:scale-110 transition-transform duration-500"
                >
                  {isPlaying ? <Pause className="w-8 h-8 fill-current" /> : <Play className="w-8 h-8 fill-current ml-1" />}
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

        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={togglePlay}
            className={`p-6 rounded-[2rem] shadow-xl flex items-center justify-center transition-all ${
              isPlaying 
                ? "bg-accent text-white shadow-accent/20" 
                : "glass-panel bg-white/5 border-white/5 text-text cursor-pointer hover:bg-white/10"
            }`}
          >
            {isPlaying ? (
              <Pause className="w-8 h-8 fill-current" />
            ) : (
              <Play className="w-8 h-8 fill-current ml-1" />
            )}
          </motion.button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className={`p-4 glass-panel rounded-[1.5rem] hover:bg-white/10 transition-all border border-white/5 ${
              isExpanded ? "bg-white/10 border-accent/20" : "bg-white/5"
            }`}
          >
            {isExpanded ? <ChevronDown className="w-6 h-6" /> : <ChevronUp className="w-6 h-6" />}
          </button>
        </div>
      </div>
    </div>
  );
}
