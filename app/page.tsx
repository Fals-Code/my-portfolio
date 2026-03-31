import React from "react";
import TerminalIntro from "@/components/sections/TerminalIntro";
import HeroSection from "@/components/sections/HeroSection";
import StatsSection from "@/components/sections/StatsSection";

/**
 * Portfolio Home Page
 * Built with Next.js 16 App Router.
 */
export default function HomePage() {
  return (
    <div className="flex flex-col w-full overflow-x-hidden">
      {/* 1. Fullscreen Command Sequence (Skip if seen) */}
      <TerminalIntro />

      {/* 2. Hero Section: Welcome & Core Identity */}
      <HeroSection />

      {/* 3. Static Stats: Real-time GitHub data */}
      <StatsSection />
      
      {/* Additional content could go here, like Featured Projects preview */}
    </div>
  );
}
