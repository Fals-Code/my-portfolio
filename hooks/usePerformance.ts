"use client";

import { useState, useEffect } from "react";

export type PerformanceTier = "low" | "medium" | "high";

/**
 * Hook to detect device performance capabilities and return a tier.
 * Used for adaptive rendering of heavy components (3D, complex filters).
 */
export function usePerformance() {
  const [tier, setTier] = useState<PerformanceTier>("medium");
  const [isReducedMotion, setIsReducedMotion] = useState(false);

  useEffect(() => {
    // 1. Check for reduced motion preference
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setIsReducedMotion(mediaQuery.matches);

    const handleMotionChange = (e: MediaQueryListEvent) => {
      setIsReducedMotion(e.matches);
    };
    mediaQuery.addEventListener("change", handleMotionChange);

    // 2. Deterministic Performance Check
    const checkPerformance = () => {
      const memory = (navigator as any).deviceMemory || 8; // Default 8GB if unknown
      const cores = navigator.hardwareConcurrency || 4; // Default 4 cores
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      );

      // Low Tier: Mobile or very old hardware
      if (isMobile || memory <= 4 || cores <= 4) {
        return "low";
      }

      // High Tier: Modern Desktop (8GB+ RAM, 8+ cores)
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

  return { tier, isLow: tier === "low", isHigh: tier === "high", isReducedMotion };
}
