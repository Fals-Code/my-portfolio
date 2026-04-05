"use client";

import { useState, useEffect, useMemo } from "react";

export type PerformanceTier = "low" | "medium" | "high";

/**
 * Hook to detect device performance capabilities and return a tier.
 * Used for adaptive rendering of heavy components (3D, complex filters).
 */
export function usePerformance() {
  const initialIsMobile = useMemo(() => {
    if (typeof window !== "undefined") {
      return window.innerWidth < 768;
    }
    return false;
  }, []);

  const [tier, setTier] = useState<PerformanceTier>("medium");
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [isMobileDevice, setIsMobileDevice] = useState(initialIsMobile);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMobileDevice(window.innerWidth < 768);
    }

    // 1. Check for reduced motion preference
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setIsReducedMotion(mediaQuery.matches);

    const handleMotionChange = (e: MediaQueryListEvent) => {
      setIsReducedMotion(e.matches);
    };
    mediaQuery.addEventListener("change", handleMotionChange);

    // 2. Deterministic Performance Check
    const checkPerformance = (): PerformanceTier => {
      if (typeof window === "undefined") return "medium";

      const memory = (navigator as any).deviceMemory; 
      const cores = navigator.hardwareConcurrency || 2;
      const isSmallScreen = window.innerWidth < 768;
      const connection = (navigator as any).connection;
      const isSlowNetwork = connection && (connection.saveData || connection.effectiveType === '2g' || connection.effectiveType === '3g');
      
      // Force low for mobile OR slow network OR unknown/low memory
      if (isSmallScreen || isSlowNetwork || !memory || memory <= 4) {
        return "low";
      }
      
      // High Tier: Modern Desktop (8GB+ RAM AND 8+ cores)
      if (memory >= 8 && cores >= 8) {
        return "high";
      }
      
      return "medium";
    };

    setTier(checkPerformance());

    return () => {
      mediaQuery.removeEventListener("change", handleMotionChange);
    };
  }, []);

  return { 
    tier, 
    isLow: tier === "low" || isMobileDevice, 
    isHigh: tier === "high" && !isMobileDevice, 
    isReducedMotion,
    isMobileDevice 
  };
}
