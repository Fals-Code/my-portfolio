import { useCallback, useRef } from "react";
import { useMusic } from "@/context/MusicContext";

const SFX_URLS = {
  hover: "https://www.soundjay.com/buttons/sounds/button-29.mp3",
  click: "https://www.soundjay.com/buttons/sounds/button-16.mp3",
};

export function useSound() {
  const { sfxEnabled } = useMusic();
  const hoverSoundRef = useRef<HTMLAudioElement | null>(null);
  const clickSoundRef = useRef<HTMLAudioElement | null>(null);

  const playHover = useCallback(() => {
    if (typeof window === "undefined" || !sfxEnabled) return;
    if (!hoverSoundRef.current) {
      hoverSoundRef.current = new Audio(SFX_URLS.hover);
      hoverSoundRef.current.volume = 0.05; 
    }
    hoverSoundRef.current.currentTime = 0;
    hoverSoundRef.current.play().catch(() => {});
  }, [sfxEnabled]);

  const playClick = useCallback(() => {
    if (typeof window === "undefined" || !sfxEnabled) return;
    if (!clickSoundRef.current) {
      clickSoundRef.current = new Audio(SFX_URLS.click);
      clickSoundRef.current.volume = 0.1; 
    }
    clickSoundRef.current.currentTime = 0;
    clickSoundRef.current.play().catch(() => {});
  }, [sfxEnabled]);

  return { playHover, playClick };
}
