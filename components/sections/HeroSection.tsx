"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useTypewriter } from "@/hooks/useTypewriter";
import { GradientText, Button } from "@/components/ui/Primitives";
import OrbitAnimation from "./OrbitAnimation";
import Magnetic from "@/components/ui/Magnetic";

/**
 * Home Hero Section
 * Features a 2-column layout with typewriter text and orbiting tech icons.
 */
export default function HeroSection() {
  const { displayText } = useTypewriter({
    words: ["Backend Developer", "Laravel Specialist", "Database Architect", "Problem Solver"],
    speed: 80,
    deleteSpeed: 50,
  });

  return (
    <section className="container mx-auto px-6 section-pad">
      <div className="grid grid-cols-1 md:grid-cols-3 grid-airy items-center gap-12">
        {/* Left Column: Text */}
        <div className="md:col-span-2 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1 bg-green-500/10 text-green-500 rounded-full text-xs font-bold uppercase tracking-widest border border-green-500/20"
          >
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            Available for new projects
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-6xl font-syne font-extrabold leading-tight text-white"
          >
            Crafting <GradientText>Digital</GradientText> Experiences with Backend Precision.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-text-muted max-w-xl"
          >
            I'm <span className="text-white font-medium">Ahmad Mathlaul Falah</span>, a{" "}
            <span className="text-accent font-bold h-7 inline-block">{displayText}</span>{" "}
            specializing in building robust, scalable systems.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap gap-6 pt-4"
          >
            <Magnetic>
              <Button variant="primary" asChild className="px-8 py-6 text-base">
                <Link href="/projects">View My Work</Link>
              </Button>
            </Magnetic>
            <Magnetic>
              <Button variant="outline" asChild className="px-8 py-6 text-base">
                <Link href="/game">Play Game</Link>
              </Button>
            </Magnetic>
            <Magnetic>
              <Button variant="outline" asChild className="px-8 py-6 text-base">
                <Link href="/contact">Contact</Link>
              </Button>
            </Magnetic>
          </motion.div>
        </div>

        {/* Right Column: Visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex-1 w-full"
        >
          <OrbitAnimation />
        </motion.div>
      </div>
    </section>
  );
}
