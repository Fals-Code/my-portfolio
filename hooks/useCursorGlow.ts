"use client";

import { useState, useEffect } from "react";

/**
 * Custom hook to track mouse position and update CSS properties on document.body.
 * 
 * @returns { x, y }
 */
export function useCursorGlow() {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Only active on non-touch devices
    const isTouchDevice = () => {
      return (
        "ontouchstart" in window ||
        navigator.maxTouchPoints > 0 ||
        (navigator as any).msMaxTouchPoints > 0
      );
    };

    if (isTouchDevice()) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      setPosition({ x: clientX, y: clientY });
      
      // Update CSS variables for .cursor-glow
      document.body.style.setProperty("--cursor-x", `${clientX}px`);
      document.body.style.setProperty("--cursor-y", `${clientY}px`);
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return position;
}
