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
  // Menggunakan versi yang mengizinkan embed (bukan official MV yang dibatasi label)
  { id: "dvgZkm1xWPE", title: "Viva La Vida", artist: "Coldplay" },
  { id: "SvyEniVMiYM", title: "Mary On A Cross", artist: "Ghost" },
  { id: "RbeR2qLYzS8", title: "Beggin'", artist: "Måneskin" },
  { id: "7zp1TbLFPp8", title: "Danza Kuduro", artist: "Extended Remix" },
];

declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void;
    YT: any;
  }
}

let ytScriptLoaded = false;
function loadYTScript(): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') { resolve(); return; }
    if (window.YT && window.YT.Player) {
      resolve();
      return;
    }

    const prevCallback = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      if (prevCallback) prevCallback();
      resolve();
    };

    if (ytScriptLoaded) return;
    ytScriptLoaded = true;

    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    tag.onerror = () => {
      console.error("MusicContext: Failed to load YouTube IFrame API");
      resolve();
    };
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

  const nextTrackFn = useRef<() => void>(() => {});

  const createPlayer = useCallback((trackId: string, playImmediately: boolean) => {
    return new Promise<void>((resolve) => {
      if (typeof window === 'undefined' || !containerRef.current || !window.YT || !window.YT.Player) {
        console.warn("MusicContext: Cannot create player - missing dependencies", { 
          hasContainer: !!containerRef.current, 
          hasYT: !!window?.YT, 
          hasPlayer: !!window?.YT?.Player 
        });
        resolve();
        return;
      }

      if (playerRef.current) {
        try { playerRef.current.destroy(); } catch (_) {}
        playerRef.current = null;
      }

      const inner = document.createElement("div");
      inner.id = "yt-player-inner";
      containerRef.current.innerHTML = "";
      containerRef.current.appendChild(inner);

      const timeout = setTimeout(() => {
        console.warn("MusicContext: Player initialization timed out for track:", trackId);
        resolve();
      }, 8000);

      try {
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
            origin: typeof window !== 'undefined' ? window.location.origin : undefined,
            widget_referrer: typeof window !== 'undefined' ? window.location.origin : undefined,
          },
          events: {
            onReady: (event: any) => {
              clearTimeout(timeout);
              event.target.unMute();
              event.target.setVolume(volume * 100);
              if (playImmediately) {
                // Some browsers require an extra unmute call right before play
                event.target.unMute();
                event.target.playVideo();
                setIsPlaying(true);
              }
              setIsPlayerReady(true);
              resolve();
            },
            onStateChange: (event: any) => {
              if (event.data === 1) setIsPlaying(true);
              else if (event.data === 2) setIsPlaying(false);
              else if (event.data === 0) nextTrackFn.current();
            },
            onError: (event: any) => {
              clearTimeout(timeout);
              const errorCode = event.data || "unknown";
              const currentTrack = PLAYLIST[currentTrackIndexRef.current];
              
              if ([101, 150].includes(errorCode)) {
                 console.warn(`MusicContext: Video restricted by owner (Code ${errorCode}). Skipping "${currentTrack.title}"...`);
              } else {
                 console.error(`MusicContext: YouTube Player Error [Code: ${errorCode}]`, event);
              }
              
              resolve();
              // Use a small delay before skipping to avoid rapid loops
              setTimeout(() => {
                nextTrackFn.current();
              }, 1500);
            },
          },
        });
      } catch (e) {
        clearTimeout(timeout);
        console.error("MusicContext: Exception during player creation:", e);
        resolve();
      }
    });
  }, [volume]);

  // Initialize on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (!containerRef.current) {
      const div = document.createElement("div");
      div.id = "yt-player-host";
      // Using a small but not 1x1 size to avoid being blocked by aggressive throttlers
      div.style.cssText = "position:fixed;bottom:-100px;right:-100px;width:200px;height:200px;opacity:0.001;pointer-events:none;z-index:-100;overflow:hidden;";
      document.body.appendChild(div);
      containerRef.current = div;
    }

    // On mount, just load the script, don't create player yet (Safari/Mobile requirement)
    loadYTScript();

    return () => {
      if (containerRef.current) {
        containerRef.current.remove();
        containerRef.current = null;
      }
    };
  }, [createPlayer]);

  const togglePlay = useCallback(async () => {
    // If not ready, this first click will initialize the player (User Gesture)
    if (!isPlayerReady || !playerRef.current) {
      setIsPlaying(true); // Optimistic UI
      try {
        await loadYTScript();
        await createPlayer(PLAYLIST[currentTrackIndexRef.current].id, true);
      } catch (e) {
        console.error("MusicContext: Failed to start player manually", e);
        setIsPlaying(false);
      }
      return;
    }

    try {
      if (isPlaying) {
        playerRef.current.pauseVideo?.();
        setIsPlaying(false);
      } else {
        playerRef.current.unMute?.();
        playerRef.current.setVolume?.(volume * 100);
        playerRef.current.playVideo?.();
        setIsPlaying(true);
      }
    } catch (e) {
      console.error("MusicContext: TogglePlay execution error", e);
      // Fallback: re-create player tied to this gesture
      await createPlayer(PLAYLIST[currentTrackIndexRef.current].id, true);
    }
  }, [isPlaying, isPlayerReady, createPlayer, volume]);

  const nextTrack = useCallback(() => {
    const nextIndex = (currentTrackIndexRef.current + 1) % PLAYLIST.length;
    setCurrentTrackIndex(nextIndex);
    if (isPlayerReady && playerRef.current) {
      playerRef.current.loadVideoById?.(PLAYLIST[nextIndex].id);
      setIsPlaying(true);
    } else {
      createPlayer(PLAYLIST[nextIndex].id, true);
    }
  }, [isPlayerReady, createPlayer]);

  const prevTrack = useCallback(() => {
    const prevIndex = (currentTrackIndexRef.current - 1 + PLAYLIST.length) % PLAYLIST.length;
    setCurrentTrackIndex(prevIndex);
    if (isPlayerReady && playerRef.current) {
      playerRef.current.loadVideoById?.(PLAYLIST[prevIndex].id);
      setIsPlaying(true);
    } else {
      createPlayer(PLAYLIST[prevIndex].id, true);
    }
  }, [isPlayerReady, createPlayer]);

  nextTrackFn.current = nextTrack;

  // Watcher to ensure audio is never accidentally muted when playing
  useEffect(() => {
    if (isPlaying && isPlayerReady && playerRef.current) {
      try {
        playerRef.current.unMute?.();
        playerRef.current.setVolume?.(volume * 100);
      } catch (e) {}
    }
  }, [isPlaying, isPlayerReady, volume]);

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
