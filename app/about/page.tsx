import React from "react";
import { Metadata } from "next";
import AboutHeroSection from "@/components/sections/AboutHeroSection";
import StatsSection from "@/components/sections/StatsSection";
import GitHubLanguagesSection from "@/components/sections/GitHubLanguagesSection";
import ServicesSection from "@/components/sections/ServicesSection";
import TimelineSection from "@/components/sections/TimelineSection";
import ToolsSection from "@/components/sections/ToolsSection";

export const metadata: Metadata = {
  title: "About | Falah.",
  description: "Learn more about Ahmad Mathlaul Falah, a Backend Developer focusing on Laravel and System Architecture.",
};

/**
 * About Page
 * Detailed professional profile, skills, and journey.
 */
export default function AboutPage() {
  return (
    <div className="flex flex-col w-full overflow-x-hidden">
      {/* 1. Hero: Bio & Profile */}
      <AboutHeroSection />

      {/* 2. Stats & Languages */}
      <section className="bg-bg-card/30 border-y border-border backdrop-blur-sm">
        <StatsSection />
        <GitHubLanguagesSection />
      </section>

      {/* 3. Services: What I do */}
      <ServicesSection />

      {/* 4. Journey: Education & Projects */}
      <TimelineSection />

      {/* 5. Tools & Goals */}
      <ToolsSection />
    </div>
  );
}
