"use client";

import React from "react";
import { EditorialHeading } from "@/components/ui/Primitives";
import { motion } from "framer-motion";
import { fadeReveal } from "@/lib/motion-tokens";

/**
 * Projects Hero Section
 */
export default function ProjectsHeroSection() {
  return (
    <section className="container mx-auto px-6 pt-32 pb-12">
      <div className="max-w-4xl">
        <EditorialHeading 
          sub="Artifacts of Logic"
        >
          Selected <br />
          <span className="text-[var(--text)]/40 italic">Industrial Works.</span>
        </EditorialHeading>
        <motion.p 
          initial="hidden"
          animate="visible"
          variants={fadeReveal}
          transition={{ delay: 0.2 }}
          className="text-lg md:text-xl text-[var(--text)]/60 leading-relaxed mt-10 max-w-2xl font-medium"
        >
          A highly curated collection of backend systems, API ecosystems, and architectural experiments focused on stability, performance, and intent.
        </motion.p>
      </div>
    </section>
  );
}
