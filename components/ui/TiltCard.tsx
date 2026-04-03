"use client";

import React, { useRef, MouseEvent } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { usePerformance } from "@/hooks/usePerformance";

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Mobile-First Optimized TiltCard.
 * Completely bypasses heavy spring physics for low-performance/mobile devices
 * by splitting the rendering into a PureStatic version and a RichDynamic version.
 */
export default function TiltCard({ children, className }: TiltCardProps) {
  const { isLow, tier } = usePerformance();
  const isHighPerf = !isLow && tier === "high";

  if (!isHighPerf) {
    return (
      <div className={`relative h-full w-full rounded-2xl overflow-hidden ${className}`}>
        {children}
      </div>
    );
  }

  return <RichTiltCard className={className}>{children}</RichTiltCard>;
}

function RichTiltCard({ children, className }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 100, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 100, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7.5deg", "-7.5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7.5deg", "7.5deg"]);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
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
        rotateY,
        rotateX,
        transformStyle: "preserve-3d",
        perspective: "1000px"
      }}
      className={`relative h-full w-full rounded-2xl overflow-hidden transform-gpu ${className}`}
    >
      <div style={{ transform: "translateZ(50px)", transformStyle: "preserve-3d" }} className="h-full w-full">
        {children}
      </div>
      <div 
        className="pointer-events-none absolute -inset-0.5 z-[-1] rounded-2xl bg-gradient-to-br from-accent/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity blur-xl" 
        style={{ transform: "translateZ(-10px)" }} 
      />
    </motion.div>
  );
}
