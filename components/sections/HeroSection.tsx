"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button, GradientText } from "@/components/ui/Primitives";
import { Download, Terminal, Mail, Globe, ArrowRight } from "lucide-react";
import { GitHub, Instagram } from "@/components/ui/Icons";
import Magnetic from "@/components/ui/Magnetic";
import { fadeReveal } from "@/lib/motion-tokens";
import CodeAnimation from "./CodeAnimation";
import { usePerformance } from "@/hooks/usePerformance";

/**
 * Hero Section (Home Page)
 * Pure, elegant greeting and quick summary.
 */
export default function HeroSection() {
  const { isLow, isMobileDevice } = usePerformance();
  const MotionDiv = (isLow || isMobileDevice) ? "div" : motion.div;
  const MotionH1 = (isLow || isMobileDevice) ? "h1" : motion.h1;
  const MotionP = (isLow || isMobileDevice) ? "p" : motion.p;

  return (
    <section className="relative overflow-hidden min-h-[85vh] flex items-center pt-28 md:pt-12 pb-12">
      {/* Background Decorative Mesh - Hidden on Mobile via CSS */}
      <div className="absolute inset-0 mesh-bg opacity-30 pointer-events-none" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 lg:items-center max-w-7xl mx-auto">
          
          {/* Left Column: Greeting & Info */}
          <div className="order-1 space-y-10 flex flex-col items-center lg:items-start text-center lg:text-left">
          {/* Status Label */}
          <MotionDiv 
            initial={isLow ? false : "hidden"}
            animate={isLow ? { opacity: 1 } : "visible"}
            variants={isLow ? undefined : fadeReveal}
            custom={{ i: 0, isLow }}
            className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full glass-panel border-accent/20 bg-accent/15"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-none absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-accent"></span>
            </span>
            <span className="text-[12px] font-bold uppercase tracking-[0.3em] text-accent">
              Let's talk code
            </span>
          </MotionDiv>

          {/* Main Headline - Huge Greeting */}
          <div className="space-y-6">
            <MotionH1 
              initial={isLow ? false : "hidden"}
              animate={isLow ? { opacity: 1 } : "visible"}
              variants={isLow ? undefined : fadeReveal}
              custom={{ i: 1, isLow }}
              className="font-syne font-extrabold leading-[0.95] tracking-tight text-[var(--text)] drop-shadow-2xl"
              style={{ fontSize: "clamp(2.8rem, 12vw, 7.5rem)" }}
            >
              Hi. I'm <GradientText>Falah.</GradientText>
            </MotionH1>
            
            <MotionP 
              initial={isLow ? false : "hidden"}
              animate={isLow ? { opacity: 1 } : "visible"}
              variants={isLow ? undefined : fadeReveal}
              custom={{ i: 2, isLow }}
              className="text-lg md:text-3xl text-text-muted font-syne max-w-2xl leading-relaxed font-medium"
            >
              A passionate <span className="text-[var(--text)]">Backend Developer</span> transforming complex problems into elegant, scalable logic.
            </MotionP>
          </div>

          {/* CTA Buttons */}
          <MotionDiv 
            initial={(isLow || isMobileDevice) ? false : "hidden"}
            animate={(isLow || isMobileDevice) ? { opacity: 1 } : "visible"}
            variants={(isLow || isMobileDevice) ? undefined : fadeReveal}
            custom={{ i: 3, isLow }}
            className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 md:gap-6 pt-6 w-full"
          >
            <Magnetic disabledOnMobile={true}>
              <Button variant="primary" size="lg" asChild className="rounded-full px-10 group w-full sm:w-auto h-14 md:h-16">
                <Link href="/projects" className="flex items-center justify-center gap-3 font-semibold text-lg">
                  View My Work <ArrowRight className="w-5 h-5 group-hover:-rotate-45 transition-transform duration-300" />
                </Link>
              </Button>
            </Magnetic>
            
            <Magnetic disabledOnMobile>
               <Button variant="outline" size="lg" asChild className="rounded-full px-10 group border-white/10 hover:border-accent w-full sm:w-auto h-14 md:h-16">
                   <a href="/cv.pdf" download className="flex items-center justify-center gap-3 font-medium text-lg">
                     Download CV <Download className="w-5 h-5 opacity-60 group-hover:opacity-100 transition-opacity" />
                   </a>
               </Button>
            </Magnetic>
          </MotionDiv>

          {/* Quick Socials & Info */}
          <MotionDiv 
            initial={isLow ? false : "hidden"}
            animate={isLow ? { opacity: 1 } : "visible"}
            variants={isLow ? undefined : fadeReveal}
            custom={{ i: 4, isLow }}
            className="flex flex-col lg:flex-row items-center lg:items-start gap-6 lg:gap-12 pt-10 mt-10 border-t border-white/5 w-full"
          >
            <div className="flex flex-wrap justify-center lg:justify-start items-center gap-4">
              {[
                { Icon: GitHub, href: "https://github.com/MathlaulFalah" },
                { Icon: Instagram, href: "https://instagram.com/mathlaul_falah" },
                { Icon: Mail, href: "mailto:ahmadmathlaulfalah14@gmail.com" }
              ].map((social, i) => (
                <Link 
                  key={i} 
                  href={social.href} 
                  target="_blank"
                  className="p-5 glass-panel rounded-full hover:bg-accent/10 hover:border-accent/40 text-text-muted hover:text-[var(--text)] transition-all duration-300 group"
                >
                  <social.Icon className="w-6 h-6 group-hover:scale-110 transition-transform" />
                </Link>
              ))}
            </div>
          </MotionDiv>
          </div>

          {/* Right Column: Code Animation (Hidden on mobile) */}
          {!isLow && (
            <div className="order-2 w-full flex justify-center lg:justify-end lg:pt-10">
              <CodeAnimation />
            </div>
          )}
        </div>
      </div>

      {/* Lighting Effects - Disabled on Low Performance to save GPU */}
      {!isLow && (
        <>
          <div className="absolute top-0 -right-1/4 w-[600px] h-[600px] bg-accent/5 rounded-full blur-[150px] -translate-y-1/2 pointer-events-none" />
          <div className="absolute bottom-0 -left-1/4 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />
        </>
      )}
    </section>
  );
}
