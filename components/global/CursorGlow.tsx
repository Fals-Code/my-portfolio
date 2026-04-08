"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePerformance } from "@/hooks/usePerformance";

/**
 * High-performance cursor glow.
 * Updates via direct DOM manipulation to avoid React re-renders at 60fps.
 * Automatically disables on mobile and low-performance devices.
 */
export default function CursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null);
  const { isLow } = usePerformance();
  const [isEnabled, setIsEnabled] = useState(false);
  const enabledRef = useRef(false);

  useEffect(() => {
    // HARD DISABLED on mobile or low-perf devices
    if (isLow || typeof window === "undefined" || window.innerWidth < 1024) {
      setIsEnabled(false);
      enabledRef.current = false;
      return;
    }

    setIsEnabled(true);
    enabledRef.current = true;
    const glow = glowRef.current;
    if (!glow) return;

    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;
    let isVisible = false;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      if (!isVisible) {
        isVisible = true;
        if (glow) glow.style.opacity = "1";
      }
    };

    const handleMouseLeave = () => {
      isVisible = false;
      if (glow) glow.style.opacity = "0";
    };

    let animId: number;
    const updatePosition = () => {
      if (!enabledRef.current) return;
      // Smooth lerp (0.1) for buttery movement
      currentX += (mouseX - currentX) * 0.1;
      currentY += (mouseY - currentY) * 0.1;

      if (glow) {
        glow.style.transform = `translate3d(calc(${currentX}px - 50%), calc(${currentY}px - 50%), 0)`;
      }
      animId = requestAnimationFrame(updatePosition);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseout", handleMouseLeave);
    animId = requestAnimationFrame(updatePosition);

    return () => {
      enabledRef.current = false;
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseout", handleMouseLeave);
      cancelAnimationFrame(animId);
    };
  }, [isLow]);

  if (!isEnabled) return null;

  return (
    <div 
      ref={glowRef}
      id="custom-cursor-glow" 
      className="fixed top-0 left-0 w-[500px] h-[500px] pointer-events-none z-[9999] opacity-0 transition-opacity duration-1000"
      style={{ 
        background: "radial-gradient(circle, rgba(232, 83, 58, 0.08) 0%, transparent 70%)",
        willChange: "transform"
      }}
    />
  );
}
