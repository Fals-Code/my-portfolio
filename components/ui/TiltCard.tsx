"use client";

import React from "react";
import dynamic from "next/dynamic";
import { usePerformance } from "@/hooks/usePerformance";

const RichTiltCard = dynamic(() => import("./RichTiltCard"), { 
    ssr: false,
    loading: () => null 
});

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
