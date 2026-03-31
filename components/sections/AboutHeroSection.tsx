"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { SectionLabel, GradientText, Button, GlassPanel } from "@/components/ui/Primitives";
import { MapPin, GraduationCap, Briefcase, Download } from "lucide-react";
import { springBouncy, fadeReveal } from "@/lib/motion-tokens";

/**
 * Personalized Photo Card with rotating decoration
 */
function PhotoCard() {
  return (
    <motion.div 
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={fadeReveal}
      className="relative group w-full max-w-[400px] aspect-square mx-auto"
    >
      {/* Decorative Rotating Ring */}
      <div className="absolute inset-0 border border-dotted border-accent/40 rounded-full animate-spin-slow group-hover:scale-105 transition-transform duration-700" />
      <div className="absolute inset-4 border border-border/40 rounded-full animate-spin-reverse-medium" />
      
      {/* Main Image */}
      <div className="absolute inset-8 rounded-full overflow-hidden border-4 border-bg-card shadow-2xl z-10 bg-bg-card">
        <Image 
          src="/assets/imgs/falah.jpeg" 
          alt="Ahmad Mathlaul Falah" 
          fill 
          className="object-cover group-hover:scale-110 transition-transform duration-700"
          unoptimized
        />
      </div>
    </motion.div>
  );
}

/**
 * About Hero Section
 */
export default function AboutHeroSection() {
  return (
    <section className="container mx-auto px-6 pt-32 pb-24">
      <div className="grid grid-cols-1 md:grid-cols-2 grid-airy items-center">
        {/* Left Column: Text */}
        <div className="flex-1 space-y-8">
          <SectionLabel>Who I Am</SectionLabel>
          <motion.h1 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeReveal}
            custom={1}
            className="text-4xl md:text-6xl font-syne font-extrabold leading-tight text-[var(--text)]"
          >
            Hi, I'm <GradientText>Falah</GradientText>
          </motion.h1>
          <motion.p 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeReveal}
            custom={2}
            className="text-lg md:text-xl text-text-muted leading-relaxed"
          >
            D4 Informatics Engineering student at <span className="text-[var(--text)] font-semibold">Universitas Airlangga</span> — 
            passionate about backend architecture, clean code, and building things that actually work.
          </motion.p>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeReveal}
            custom={3}
            className="flex flex-wrap gap-3"
          >
            <div className="px-4 py-2 glass-panel rounded-full text-[11px] font-bold flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-accent" /> Surabaya, ID
            </div>
            <div className="px-4 py-2 glass-panel rounded-full text-[11px] font-bold flex items-center gap-2">
              <GraduationCap className="w-3.5 h-3.5 text-accent" /> Informatics Eng.
            </div>
            <div className="px-4 py-2 glass-panel rounded-full text-[11px] font-bold flex items-center gap-2 text-green-500">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" /> Available for Project
            </div>
          </motion.div>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeReveal}
            custom={4}
            className="flex flex-wrap gap-4 pt-4"
          >
            <Button variant="primary" asChild>
              <Link href="/cv.pdf" download>
                <Download className="w-4 h-4 mr-2" /> Download CV
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/contact">Contact</Link>
            </Button>
          </motion.div>
        </div>

        {/* Right Column: Photo */}
        <div className="flex-1">
          <PhotoCard />
        </div>
      </div>
    </section>
  );
}
