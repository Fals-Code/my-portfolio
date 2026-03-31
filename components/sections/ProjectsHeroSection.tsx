"use client";

import React from "react";
import { SectionLabel, GradientText } from "@/components/ui/Primitives";
import { motion } from "framer-motion";

/**
 * Projects Hero Section
 */
export default function ProjectsHeroSection() {
  return (
    <section className="container mx-auto px-6 pt-20 md:pt-12 pb-8">
      <div className="max-w-3xl space-y-8">
        <SectionLabel>What I've Built</SectionLabel>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-syne font-extrabold leading-tight text-[var(--text)]"
        >
          My <GradientText>Projects</GradientText>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-lg md:text-xl text-text-muted leading-relaxed"
        >
          A curated collection of real-world systems, backend architectures, and technical experiments focused on scalability and data integrity.
        </motion.p>
      </div>
    </section>
  );
}
