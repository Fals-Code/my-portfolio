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
  togglePlay: () => void;
  setVolume: (v: number) => void;
  toggleMute: () => void;
  nextTrack: () => void;
  prevTrack: () => void;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

// Hardcoded Lofi/Chill tracks
const PLAYLIST: Track[] = [
  { id: "jfKfPfyJRdk", title: "lofi hip hop radio - beats to relax/study to", artist: "Lofi Girl" },
  { id: "5qap5aO4i9A", title: "lofi hip hop radio - beats to sleep/chill to", artist: "Lofi Girl" },
  { id: "n61ULEU7CO4", title: "Chill Lofi Beats", artist: "ChilledCow" },
  { id: "7NOSDKb0HQH", title: "Night City Lofi", artist: "Dreamy" },
  { id: "kgx4WGK0o9k", title: "Sunset Vibes", artist: "Lofi Records" },
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
  
  const playerRef = useRef<any>(null);
  const [isApiReady, setIsApiReady] = useState(false);

  useEffect(() => {
    // 1. Load the YouTube IFrame API script
    if (!window.YT) {
      const tag = document.createElement("script");
      tag.src = "https://www.youtube.com/iframe_api";
      const firstScriptTag = document.getElementsByTagName("script")[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

      window.onYouTubeIframeAPIReady = () => {
        setIsApiReady(true);
      };
    } else {
      setIsApiReady(true);
    }
  }, []);

  useEffect(() => {
    if (isApiReady && !playerRef.current) {
      // 2. Initialize the player hidden
      const playerContainer = document.createElement("div");
      playerContainer.id = "yt-player-persistent";
      playerContainer.style.display = "none";
      document.body.appendChild(playerContainer);

      playerRef.current = new window.YT.Player("yt-player-persistent", {
        height: "0",
        width: "0",
        videoId: PLAYLIST[currentTrackIndex].id,
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          fs: 0,
          modestbranding: 1,
          rel: 0,
        },
        events: {
          onStateChange: (event: any) => {
            // YT.PlayerState.PLAYING = 1, PAUSED = 2, ENDED = 0
            if (event.data === 1) setIsPlaying(true);
            else if (event.data === 2) setIsPlaying(false);
            else if (event.data === 0) nextTrack();
          },
        },
      });
    }
  }, [isApiReady]);

  const togglePlay = () => {
    if (!playerRef.current) return;
    if (isPlaying) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
  };

  const setVolume = (v: number) => {
    const vol = Math.max(0, Math.min(1, v));
    setVolumeState(vol);
    if (playerRef.current) {
      playerRef.current.setVolume(vol * 100);
    }
  };

  const toggleMute = () => {
    if (!playerRef.current) return;
    if (isMuted) {
      playerRef.current.unMute();
    } else {
      playerRef.current.mute();
    }
    setIsMuted(!isMuted);
  };

  const nextTrack = () => {
    const nextIndex = (currentTrackIndex + 1) % PLAYLIST.length;
    setCurrentTrackIndex(nextIndex);
    if (playerRef.current) {
      playerRef.current.loadVideoById(PLAYLIST[nextIndex].id);
      playerRef.current.playVideo();
    }
  };

  const prevTrack = () => {
    const prevIndex = (currentTrackIndex - 1 + PLAYLIST.length) % PLAYLIST.length;
    setCurrentTrackIndex(prevIndex);
    if (playerRef.current) {
      playerRef.current.loadVideoById(PLAYLIST[prevIndex].id);
      playerRef.current.playVideo();
    }
  };

  return (
    <MusicContext.Provider 
      value={{ 
        isPlaying, 
        currentTrack: PLAYLIST[currentTrackIndex], 
        volume, 
        isMuted,
        togglePlay,
        setVolume,
        toggleMute,
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
  if (context === undefined) {
    throw new Error("useMusic must be used within a MusicProvider");
  }
  return context;
};
