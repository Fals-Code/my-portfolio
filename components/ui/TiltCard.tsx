"use client";

import React, { useRef, MouseEvent } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useSound } from "@/hooks/useSound";
import { usePerformance } from "@/hooks/usePerformance";

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
}

export default function TiltCard({ children, className }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { isLow } = usePerformance();

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 100, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 100, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["17.5deg", "-17.5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-17.5deg", "17.5deg"]);

  const { playHover } = useSound();

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!ref.current || isLow) return;
    
    // Play sound on first enter
    if (x.get() === 0 && y.get() === 0) {
      playHover();
    }

    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateY: isLow ? 0 : rotateY,
        rotateX: isLow ? 0 : rotateX,
        transformStyle: isLow ? "flat" : "preserve-3d",
        perspective: isLow ? "none" : "1000px"
      }}
      className={`relative h-full w-full rounded-2xl overflow-hidden ${className} transform-gpu`}
    >
      <div 
        style={{
          transform: isLow ? "none" : "translateZ(75px)",
          transformStyle: isLow ? "flat" : "preserve-3d",
        }}
        className="h-full w-full"
      >
        {children}
      </div>

      {/* Glow Effect Leak */}
      <motion.div
        className="pointer-events-none absolute -inset-0.5 z-[-1] rounded-2xl bg-gradient-to-br from-accent/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100 blur-xl"
        style={{
          transform: "translateZ(-10px)",
        }}
      />
    </motion.div>
  );
}
