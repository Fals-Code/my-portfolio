"use client";

import React from "react";
import { SectionLabel, GradientText } from "@/components/ui/Primitives";
import { motion } from "framer-motion";

/**
 * Contact Hero Section
 */
export default function ContactHeroSection() {
  return (
    <section className="container mx-auto px-6 pt-28 md:pt-32 pb-8">
      <div className="max-w-3xl space-y-8">
        <SectionLabel>Get In Touch</SectionLabel>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-syne font-extrabold leading-tight text-[var(--text)]"
        >
          Let's <GradientText>Talk</GradientText>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-lg md:text-xl text-text-muted leading-relaxed"
        >
          Punya pertanyaan soal proyek, mau kolaborasi, atau sekadar ingin berjejaring? Feel free to reach out anytime via the form below or my social handles.
        </motion.p>
      </div>
    </section>
  );
}
