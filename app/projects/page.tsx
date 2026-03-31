import React from "react";
import { Metadata } from "next";
import ProjectsHeroSection from "@/components/sections/ProjectsHeroSection";
import ProjectsSection from "@/components/sections/ProjectsSection";

export const metadata: Metadata = {
  title: "Projects | Falah.",
  description: "A showcase of technical projects and backend systems developed by Ahmad Mathlaul Falah.",
};

/**
 * Projects Page
 * Filterable gallery of professional work and experiments.
 */
export default function ProjectsPage() {
  return (
    <div className="flex flex-col w-full overflow-x-hidden">
      {/* 1. Hero: Title & Context */}
      <ProjectsHeroSection />

      {/* 2. Portfolio Grid: Category filtering */}
      <ProjectsSection />
    </div>
  );
}
