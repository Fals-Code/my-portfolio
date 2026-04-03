import { useCallback, useRef } from "react";
import { useMusic } from "@/context/MusicContext";
import { usePerformance } from "@/hooks/usePerformance";

const SFX_URLS = {
  hover: "https://www.soundjay.com/buttons/sounds/button-29.mp3",
  click: "https://www.soundjay.com/buttons/sounds/button-16.mp3",
};

export function useSound() {
  const { sfxEnabled } = useMusic();
  const hoverSoundRef = useRef<HTMLAudioElement | null>(null);
  const clickSoundRef = useRef<HTMLAudioElement | null>(null);

  const { tier, isLow } = usePerformance();

  const playHover = useCallback(() => {
    if (typeof window === "undefined" || !sfxEnabled || isLow) return;
    
    try {
      if (!hoverSoundRef.current) {
        hoverSoundRef.current = new Audio(SFX_URLS.hover);
        hoverSoundRef.current.volume = 0.05; 
      }
      hoverSoundRef.current.currentTime = 0;
      hoverSoundRef.current.play().catch(() => {});
    } catch (e) {
      console.error("Audio playback failed", e);
    }
  }, [sfxEnabled, isLow]);

  const playClick = useCallback(() => {
    if (typeof window === "undefined" || !sfxEnabled || isLow) return;
    
    try {
      if (!clickSoundRef.current) {
        clickSoundRef.current = new Audio(SFX_URLS.click);
        clickSoundRef.current.volume = 0.1; 
      }
      clickSoundRef.current.currentTime = 0;
      clickSoundRef.current.play().catch(() => {});
    } catch (e) {
      console.error("Audio playback failed", e);
    }
  }, [sfxEnabled, isLow]);

  return { playHover, playClick };
}
