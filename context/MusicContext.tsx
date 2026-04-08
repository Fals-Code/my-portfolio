"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from "react";

interface Track {
  id: string;
  title: string;
  artist: string;
}

interface MusicContextType {
  isPlaying: boolean;
  currentTrack: Track | null;
  volume: number;
  isMuted: boolean;
  sfxEnabled: boolean;
  isPlayerReady: boolean;
  togglePlay: () => void;
  setVolume: (v: number) => void;
  toggleMute: () => void;
  toggleSfx: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

// Hardcoded Lofi/Chill tracks
// Hardcoded Favorite Tracks
const PLAYLIST: Track[] = [
  { id: "y4zdDXPYo0I", title: "Viva La Vida", artist: "Coldplay" },
];

declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void;
    YT: any;
  }
}

/**
 * Handles persistent music playback using the YouTube IFrame API.
 */
export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [volume, setVolumeState] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [sfxEnabled, setSfxEnabled] = useState(true);
  
  const playerRef = useRef<any>(null);
  const [isApiReady, setIsApiReady] = useState(false);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const nextTrackRef = useRef<() => void>(() => {});
  const initializingRef = useRef(false);

  // YouTube Player initialization removed from mount to save CPU.
  // It will now be triggered only on user interaction.

  const initYouTube = () => {
    if (typeof window === "undefined") return;
    if (initializingRef.current) return;
    initializingRef.current = true;

    console.log("MusicContext: Lazy Initializing YouTube API...");

    let playerContainer = document.getElementById("yt-player-persistent");
    if (!playerContainer) {
      playerContainer = document.createElement("div");
      playerContainer.id = "yt-player-persistent";
      playerContainer.style.display = "none";
      document.body.appendChild(playerContainer);
    }
    
    const tag = document.createElement("script");
    tag.id = "yt-iframe-api";
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    window.onYouTubeIframeAPIReady = () => {
      console.log("MusicContext: onYouTubeIframeAPIReady fired.");
      setIsApiReady(true);
      delete (window as any).onYouTubeIframeAPIReady;
    };
  };

  useEffect(() => {
    if (isApiReady && !playerRef.current) {
      console.log("MusicContext: Creating YT player...");

      try {
        playerRef.current = new window.YT.Player("yt-player-persistent", {
          height: "0",
          width: "0",
          videoId: PLAYLIST[currentTrackIndex].id,
          playerVars: {
            autoplay: 1, // Start immediately since this is user-triggered
            controls: 0,
            disablekb: 1,
            fs: 0,
            modestbranding: 1,
            rel: 0,
            enablejsapi: 1,
            origin: typeof window !== 'undefined' ? window.location.origin : '',
          },
          events: {
            onReady: (event: any) => {
              console.log("MusicContext: Player Ready.");
              setIsPlayerReady(true);
              event.target.playVideo();
            },
            onStateChange: (event: any) => {
              if (event.data === 1) setIsPlaying(true);
              else if (event.data === 2) setIsPlaying(false);
              else if (event.data === 0) nextTrackRef.current();
            },
          },
        });
      } catch (err) {
        console.error("MusicContext: Exception during player creation:", err);
      }
    }
  }, [isApiReady]);

  // Handle case where playlist or index changes while player exists
  useEffect(() => {
    if (isPlayerReady && playerRef.current && typeof playerRef.current.loadVideoById === "function") {
      playerRef.current.loadVideoById(PLAYLIST[currentTrackIndex].id);
      playerRef.current.pauseVideo();
    }
  }, [currentTrackIndex, isPlayerReady]);

  const togglePlay = () => {
    if (!isApiReady) {
      initYouTube();
      return;
    }
    if (!isPlayerReady || !playerRef.current) return;
    
    if (isPlaying) {
      if (typeof playerRef.current.pauseVideo === "function") {
        playerRef.current.pauseVideo();
      }
    } else {
      if (typeof playerRef.current.playVideo === "function") {
        playerRef.current.playVideo();
      }
    }
  };

  const setVolume = (v: number) => {
    const vol = Math.max(0, Math.min(1, v));
    setVolumeState(vol);
    
    if (isPlayerReady && playerRef.current) {
      if (typeof playerRef.current.setVolume === "function") {
        playerRef.current.setVolume(vol * 100);
      }
      
      // Auto-unmute if volume is increased
      if (vol > 0 && isMuted) {
        setIsMuted(false);
        if (typeof playerRef.current.unMute === "function") {
          playerRef.current.unMute();
        }
      }
    }
  };

  const toggleMute = () => {
    if (!isPlayerReady || !playerRef.current) return;
    if (isMuted) {
      if (typeof playerRef.current.unMute === "function") {
        playerRef.current.unMute();
      }
    } else {
      if (typeof playerRef.current.mute === "function") {
        playerRef.current.mute();
      }
    }
    setIsMuted(!isMuted);
  };

  const nextTrack = () => {
    if (!isApiReady) {
      initYouTube();
      return;
    }
    const nextIndex = (currentTrackIndex + 1) % PLAYLIST.length;
    setCurrentTrackIndex(nextIndex);
    if (isPlayerReady && playerRef.current && typeof playerRef.current.loadVideoById === "function") {
      playerRef.current.loadVideoById(PLAYLIST[nextIndex].id);
      if (typeof playerRef.current.playVideo === "function") {
        playerRef.current.playVideo();
      }
    }
  };

  // Keep the ref in sync so the YouTube event handler always has a fresh reference
  nextTrackRef.current = nextTrack;

  const toggleSfx = () => {
    setSfxEnabled(!sfxEnabled);
  };

  const prevTrack = () => {
    if (!isApiReady) {
      initYouTube();
      return;
    }
    const prevIndex = (currentTrackIndex - 1 + PLAYLIST.length) % PLAYLIST.length;
    setCurrentTrackIndex(prevIndex);
    if (isPlayerReady && playerRef.current && typeof playerRef.current.loadVideoById === "function") {
      playerRef.current.loadVideoById(PLAYLIST[prevIndex].id);
      if (typeof playerRef.current.playVideo === "function") {
        playerRef.current.playVideo();
      }
    }
  };

  return (
    <MusicContext.Provider 
      value={{ 
        isPlaying, 
        currentTrack: PLAYLIST[currentTrackIndex], 
        volume, 
        isMuted,
        sfxEnabled,
        isPlayerReady,
        togglePlay,
        setVolume,
        toggleMute,
        toggleSfx,
        nextTrack,
        prevTrack
      }}
    >
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => {
  const context = useContext(MusicContext);
  // Safe fallback to prevent crashes on mobile where Provider is skipped for performance
  if (context === undefined) {
    return {
      isPlaying: false,
      currentTrack: null,
      volume: 0,
      isMuted: true,
      sfxEnabled: false,
      isPlayerReady: false,
      togglePlay: () => {},
      setVolume: () => {},
      toggleMute: () => {},
      toggleSfx: () => {},
      nextTrack: () => {},
      prevTrack: () => {},
    };
  }
  return context;
};
