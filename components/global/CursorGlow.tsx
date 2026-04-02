"use client";

import React, { useEffect, useRef } from "react";
import { usePerformance } from "@/hooks/usePerformance";

/**
 * High-performance cursor glow.
 * Updates via direct DOM manipulation to avoid React re-renders at 60fps.
 */
export default function CursorGlow() {
  const glowRef = useRef<HTMLDivElement>(null);
  const { isLow } = usePerformance();

  useEffect(() => {
    // Disable on mobile or low-end devices
    if (isLow) return;

    const glow = glowRef.current;
    if (!glow) return;

    let mouseX = 0;
    let mouseY = 0;
    let currentX = 0;
    let currentY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const updatePosition = () => {
      // Smooth lerp (0.15) for buttery movement
      currentX += (mouseX - currentX) * 0.15;
      currentY += (mouseY - currentY) * 0.15;

      if (glow) {
        glow.style.transform = `translate3d(calc(${currentX}px - 50%), calc(${currentY}px - 50%), 0)`;
      }
      requestAnimationFrame(updatePosition);
    };

    window.addEventListener("mousemove", handleMouseMove);
    const animId = requestAnimationFrame(updatePosition);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animId);
    };
  }, [isLow]);

  if (isLow) return null;

  return (
    <div 
      ref={glowRef}
      id="custom-cursor-glow" 
      className="fixed top-0 left-0 w-[400px] h-[400px] pointer-events-none z-[9999] opacity-0 transition-opacity duration-500"
      style={{ 
        background: "radial-gradient(circle, rgba(232, 83, 58, 0.12) 0%, transparent 70%)",
        willChange: "transform"
      }}
      onMouseEnter={() => {
        if (glowRef.current) glowRef.current.style.opacity = "1";
      }}
    />
  );
}
