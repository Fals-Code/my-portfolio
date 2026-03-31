"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button, GradientText } from "@/components/ui/Primitives";
import { Download, Terminal, Mail, Globe, ArrowRight, Gamepad2 } from "lucide-react";
import { GitHub, Instagram } from "@/components/ui/Icons";
import Magnetic from "@/components/ui/Magnetic";
import { fadeReveal } from "@/lib/motion-tokens";

/**
 * Hero Section (Home Page)
 * Pure, elegant greeting and quick summary.
 */
export default function HeroSection() {
  return (
    <section className="relative overflow-hidden min-h-[90vh] flex items-center pt-32 pb-12">
      {/* Background Decorative Mesh */}
      <div className="absolute inset-0 mesh-bg opacity-30 pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-5xl space-y-10">
          
          {/* Status Label */}
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={fadeReveal}
            custom={0}
            className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full glass-panel border-accent/20 bg-accent/5 backdrop-blur-xl"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent"></span>
            </span>
            <span className="text-[12px] font-bold uppercase tracking-[0.3em] text-accent">
              Let's talk code
            </span>
          </motion.div>

          {/* Main Headline - Huge Greeting */}
          <div className="space-y-6">
            <motion.h1 
              initial="hidden"
              animate="visible"
              variants={fadeReveal}
              custom={1}
              className="font-syne font-extrabold leading-[0.9] tracking-tight text-[var(--text)] drop-shadow-2xl"
              style={{ fontSize: "clamp(3.5rem, 12vw, 8.5rem)" }}
            >
              Hi. I'm <GradientText>Falah.</GradientText>
            </motion.h1>
            
            <motion.p 
              initial="hidden"
              animate="visible"
              variants={fadeReveal}
              custom={2}
              className="text-xl md:text-3xl lg:text-4xl text-text-muted font-syne max-w-3xl leading-relaxed font-medium"
            >
              A passionate <span className="text-[var(--text)]">Backend Developer</span> transforming complex problems into elegant, scalable logic.
            </motion.p>
          </div>

          {/* CTA Buttons */}
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={fadeReveal}
            custom={3}
            className="flex flex-wrap gap-6 pt-6"
          >
            <Magnetic>
              <Button variant="primary" size="lg" asChild className="rounded-full px-10 group">
                <Link href="/projects" className="flex items-center gap-3 font-semibold text-base md:text-lg">
                  View My Work <ArrowRight className="w-5 h-5 group-hover:-rotate-45 transition-transform duration-300" />
                </Link>
              </Button>
            </Magnetic>
            
            <Magnetic>
               <Button variant="outline" size="lg" asChild className="rounded-full px-10 group border-white/10 hover:border-accent">
                   <a href="/cv.pdf" download className="flex items-center gap-3 font-medium text-base md:text-lg">
                     Download CV <Download className="w-5 h-5 opacity-60 group-hover:opacity-100 transition-opacity" />
                   </a>
               </Button>
            </Magnetic>

            <Magnetic>
               <Button variant="outline" size="lg" asChild className="rounded-full px-10 group border-white/10 hover:border-blue-500">
                   <Link href="/game" className="flex items-center gap-3 font-medium text-base md:text-lg hover:text-blue-400 transition-colors">
                     Play a Game <Gamepad2 className="w-5 h-5 opacity-60 group-hover:opacity-100 transition-opacity" />
                   </Link>
               </Button>
            </Magnetic>
          </motion.div>

          {/* Quick Socials & Info */}
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={fadeReveal}
            custom={4}
            className="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-12 pt-12 mt-12 border-t border-white/5"
          >
            <div className="flex items-center gap-4">
              {[
                { Icon: GitHub, href: "https://github.com/falah" },
                { Icon: Globe, href: "https://linkedin.com/in/falah" },
                { Icon: Instagram, href: "https://instagram.com/falah" },
                { Icon: Mail, href: "mailto:ahmadmathlaulfalah14@gmail.com" }
              ].map((social, i) => (
                <Link 
                  key={i} 
                  href={social.href} 
                  target="_blank"
                  className="p-4 glass-panel rounded-full hover:bg-accent/10 hover:border-accent/40 text-text-muted hover:text-[var(--text)] transition-all duration-300 group"
                >
                  <social.Icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                </Link>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Lighting Effects */}
      <div className="absolute top-0 -right-1/4 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[150px] -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 -left-1/4 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />
    </section>
  );
}
