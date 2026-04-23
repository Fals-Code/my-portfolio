"use client";

import React, { useEffect, useState } from "react";
import { usePerformance } from "@/hooks/usePerformance";

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isHidden, setIsHidden] = useState(true);
  const { isMobileDevice } = usePerformance();

  useEffect(() => {
    // Disable custom cursor on mobile devices
    if (isMobileDevice) return;

    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (isHidden) setIsHidden(false);
    };

    const handleMouseLeave = () => setIsHidden(true);
    const handleMouseEnter = () => setIsHidden(false);

    window.addEventListener("mousemove", updatePosition);
    document.addEventListener("mouseleave", handleMouseLeave);
    document.addEventListener("mouseenter", handleMouseEnter);

    return () => {
      window.removeEventListener("mousemove", updatePosition);
      document.removeEventListener("mouseleave", handleMouseLeave);
      document.removeEventListener("mouseenter", handleMouseEnter);
    };
  }, [isMobileDevice, isHidden]);

  if (isMobileDevice) return null;

  return (
    <div
      className="fixed pointer-events-none z-[9999]"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: "translate(-50%, -50%)",
        opacity: isHidden ? 0 : 1,
        transition: "opacity 0.2s ease",
        mixBlendMode: "screen",
      }}
    >
      {/* Outer Ring */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full border border-[var(--get)] opacity-30 transition-transform duration-300 ease-out" />
      {/* Inner Dot */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-[var(--get)] shadow-[0_0_10px_var(--get)]" />
    </div>
  );
}
