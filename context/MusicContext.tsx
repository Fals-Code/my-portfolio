"use client";

import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from "react";

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

const PLAYLIST: Track[] = [
  { id: "y4zdDXPYo0I", title: "Viva La Vida", artist: "Coldplay" },
  { id: "k5mX3NkA7jM", title: "Mary On A Cross", artist: "Ghost" },
  { id: "RbeR2qLYzS8", title: "Beggin'", artist: "Måneskin" },
  { id: "us3tczsrKQc", title: "Danza Kuduro", artist: "Extended Remix" },
];

declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void;
    YT: any;
  }
}

// Ensure YouTube IFrame API script is loaded once
let ytScriptLoaded = false;
function loadYTScript(): Promise<void> {
  return new Promise((resolve) => {
    if (window.YT && window.YT.Player) {
      resolve();
      return;
    }
    if (ytScriptLoaded) {
      // Script is loading, wait for the callback
      const prev = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (prev) prev();
        resolve();
      };
      return;
    }
    ytScriptLoaded = true;
    window.onYouTubeIframeAPIReady = () => resolve();
    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(tag);
  });
}

export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [volume, setVolumeState] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [sfxEnabled, setSfxEnabled] = useState(true);
  const [isPlayerReady, setIsPlayerReady] = useState(false);

  const playerRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const currentTrackIndexRef = useRef(currentTrackIndex);
  currentTrackIndexRef.current = currentTrackIndex;

  // Keep a ref to the nextTrack function for use inside YT callbacks
  const nextTrackFn = useRef<() => void>(() => {});

  // Create the hidden player container once on mount
  useEffect(() => {
    if (containerRef.current) return;
    const div = document.createElement("div");
    div.id = "yt-player-host";
    div.style.cssText = "position:fixed;bottom:5px;right:5px;width:1px;height:1px;opacity:0.01;pointer-events:none;z-index:1;";
    document.body.appendChild(div);
    containerRef.current = div;
    return () => { div.remove(); };
  }, []);

  const createPlayer = useCallback((trackId: string, playImmediately: boolean) => {
    return new Promise<void>((resolve) => {
      if (!containerRef.current) { resolve(); return; }

      // Destroy existing player if any
      if (playerRef.current) {
        try { playerRef.current.destroy(); } catch (_) {}
        playerRef.current = null;
      }

      // Reset the inner div
      const inner = document.createElement("div");
      inner.id = "yt-player-inner";
      containerRef.current.innerHTML = "";
      containerRef.current.appendChild(inner);

      playerRef.current = new window.YT.Player("yt-player-inner", {
        height: "1",
        width: "1",
        videoId: trackId,
        playerVars: {
          autoplay: playImmediately ? 1 : 0,
          mute: 0,
          controls: 0,
          disablekb: 1,
          fs: 0,
          modestbranding: 1,
          rel: 0,
          enablejsapi: 1,
          origin: window.location.origin,
        },
        events: {
          onReady: (event: any) => {
            event.target.setVolume(volume * 100);
            if (playImmediately) {
              event.target.playVideo();
              setIsPlaying(true);
            }
            setIsPlayerReady(true);
            resolve();
          },
          onStateChange: (event: any) => {
            // YT.PlayerState: PLAYING=1, PAUSED=2, ENDED=0
            if (event.data === 1) setIsPlaying(true);
            else if (event.data === 2) setIsPlaying(false);
            else if (event.data === 0) nextTrackFn.current();
          },
          onError: () => {
            // Skip errored track
            nextTrackFn.current();
          },
        },
      });
    });
  }, [volume]);

  // togglePlay: this MUST be called directly from a user gesture on mobile
  const togglePlay = useCallback(async () => {
    if (!isPlayerReady || !playerRef.current) {
      // First play: load API then create player synchronously inside gesture
      try {
        await loadYTScript();
        await createPlayer(PLAYLIST[currentTrackIndexRef.current].id, true);
      } catch (e) {
        console.error("MusicContext: Failed to start player", e);
      }
      return;
    }

    if (isPlaying) {
      playerRef.current.pauseVideo?.();
    } else {
      playerRef.current.unMute?.();
      playerRef.current.setVolume?.(volume * 100);
      playerRef.current.playVideo?.();
    }
  }, [isPlaying, isPlayerReady, createPlayer, volume]);

  const nextTrack = useCallback(() => {
    const nextIndex = (currentTrackIndexRef.current + 1) % PLAYLIST.length;
    setCurrentTrackIndex(nextIndex);
    if (isPlayerReady && playerRef.current) {
      playerRef.current.loadVideoById?.(PLAYLIST[nextIndex].id);
      setIsPlaying(true);
    }
  }, [isPlayerReady]);

  const prevTrack = useCallback(() => {
    const prevIndex = (currentTrackIndexRef.current - 1 + PLAYLIST.length) % PLAYLIST.length;
    setCurrentTrackIndex(prevIndex);
    if (isPlayerReady && playerRef.current) {
      playerRef.current.loadVideoById?.(PLAYLIST[prevIndex].id);
      setIsPlaying(true);
    }
  }, [isPlayerReady]);

  // Keep ref in sync
  nextTrackFn.current = nextTrack;

  const setVolume = useCallback((v: number) => {
    const vol = Math.max(0, Math.min(1, v));
    setVolumeState(vol);
    if (isPlayerReady && playerRef.current) {
      playerRef.current.setVolume?.(vol * 100);
      if (vol > 0 && isMuted) {
        setIsMuted(false);
        playerRef.current.unMute?.();
      }
    }
  }, [isPlayerReady, isMuted]);

  const toggleMute = useCallback(() => {
    if (!isPlayerReady || !playerRef.current) return;
    if (isMuted) {
      playerRef.current.unMute?.();
    } else {
      playerRef.current.mute?.();
    }
    setIsMuted(prev => !prev);
  }, [isPlayerReady, isMuted]);

  const toggleSfx = useCallback(() => setSfxEnabled(prev => !prev), []);

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
        prevTrack,
      }}
    >
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => {
  const context = useContext(MusicContext);
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
