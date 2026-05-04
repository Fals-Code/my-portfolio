"use client";

import React, { useEffect, useState, useRef } from "react";
import { usePerformance } from "@/hooks/usePerformance";
import { useTheme } from "@/context/ThemeContext";
import { motion } from "framer-motion";

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
        const target = e.target as HTMLElement;
        const isInput = 
          target.tagName === "INPUT" || 
          target.tagName === "TEXTAREA" || 
          target.isContentEditable ||
          target.closest('.no-custom-cursor');

        if (isInput) {
          setIsHidden(true);
          document.body.classList.add('show-default-cursor');
          return;
        }

        document.body.classList.remove('show-default-cursor');
        setPosition({ x: e.clientX, y: e.clientY });
        setIsHidden(false);

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
      className="fixed pointer-events-none z-[99999] flex items-center justify-center"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: `translate(-50%, -50%) scale(${isClicking ? 0.8 : isHovering ? 1.4 : 1})`,
        opacity: isHidden ? 0 : 1,
        transition: "opacity 0.2s ease, transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
      }}
    >
      {/* Main Outer Ring */}
      <div 
        className={`w-8 h-8 rounded-full border border-[var(--get)] transition-all duration-300 ${
          isHovering 
            ? 'bg-[var(--get)]/20 border-[var(--get)] scale-110' 
            : 'bg-transparent border-[var(--get)]/30 scale-100'
        }`} 
      />
      
      {/* Center Dot */}
      <div 
        className={`absolute w-1.5 h-1.5 rounded-full bg-[var(--get)] shadow-[0_0_12px_var(--get)] transition-transform duration-300 ${
          isHovering ? 'scale-0' : 'scale-100'
        }`} 
      />

      {/* Execute Label for interactive items */}
      {isHovering && (
        <div className="absolute top-10 whitespace-nowrap overflow-hidden">
          <motion.span 
            initial={{ y: 5, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-[7px] font-mono text-[var(--get)] font-black uppercase tracking-[0.2em] bg-black/80 px-1.5 py-0.5 rounded border border-[var(--get)]/20"
          >
            EXECUTE
          </motion.span>
        </div>
      )}
    </div>
  );
}
