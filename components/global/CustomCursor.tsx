"use client";

import React, { useEffect, useState, useRef } from "react";
import { usePerformance } from "@/hooks/usePerformance";
import { useTheme } from "@/context/ThemeContext";

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isHidden, setIsHidden] = useState(true);
  const [isClicking, setIsClicking] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const { isMobileDevice } = usePerformance();
  const { theme } = useTheme();
  
  const cursorRef = useRef<HTMLDivElement>(null);
  const rafId = useRef<number>(0);

  useEffect(() => {
    if (isMobileDevice) return;

    const updatePosition = (e: MouseEvent) => {
      cancelAnimationFrame(rafId.current);
      rafId.current = requestAnimationFrame(() => {
        setPosition({ x: e.clientX, y: e.clientY });
        setIsHidden(false);

        const target = e.target as HTMLElement;
        const isClickable =
          target.tagName === "BUTTON" ||
          target.tagName === "A" ||
          target.closest("button") ||
          target.closest("a") ||
          target.classList.contains("cursor-pointer");

        setIsHovering(!!isClickable);
      });
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    const handleMouseLeave = () => setIsHidden(true);
    const handleMouseEnter = () => setIsHidden(false);

    window.addEventListener("mousemove", updatePosition);
    window.addEventListener("mousedown", handleMouseDown);
    window.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", updatePosition);
      window.removeEventListener("mousedown", handleMouseDown);
      window.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [isMobileDevice]);

  if (isMobileDevice) return null;

  return (
    <div
      ref={cursorRef}
      className="fixed pointer-events-none z-[99999]"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: `translate(-50%, -50%) scale(${isClicking ? 0.8 : isHovering ? 1.5 : 1})`,
        opacity: isHidden ? 0 : 1,
        transition: "opacity 0.2s ease, transform 0.15s ease-out",
        mixBlendMode: theme === "dark" ? "difference" : "normal",
      }}
    >
      {/* Outer Ring */}
      <div 
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full border border-[var(--get)] transition-opacity duration-300 ${isHovering ? 'opacity-100 bg-[var(--get)]/10' : 'opacity-30'}`} 
      />
      
      {/* Inner Dot */}
      <div 
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[var(--get)] shadow-[0_0_10px_var(--get)] transition-all duration-300 ${isHovering ? 'scale-0' : 'scale-100'}`} 
      />

      {/* Hover Effect Label (Optional/Micro-detail) */}
      {isHovering && (
        <div className="absolute top-10 left-1/2 -translate-x-1/2 whitespace-nowrap">
           <span className="text-[8px] font-mono text-[var(--get)] font-bold uppercase tracking-widest bg-black/40 px-1 rounded">EXECUTE</span>
        </div>
      )}
    </div>
  );
}
