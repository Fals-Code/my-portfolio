"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Terminal } from "lucide-react";
import { Button, GradientText } from "@/components/ui/Primitives";

/**
 * ULTRA-PERFORMANT Hero for Mobile.
 * ZERO framer-motion imports. ZERO JS logic besides simple React.
 * Wrapped in React.memo to isolate it from context-driven re-renders.
 */
const HeroSectionStatic = React.memo(function HeroSectionStatic() {
  return (
    <section className="relative overflow-hidden min-h-[80vh] flex items-center pt-20 pb-12 bg-bg">
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center lg:text-left space-y-8">
          
          {/* Status Badge */}
          <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full bg-accent/5 border border-accent/10">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-accent opacity-75 opacity-0"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
            </span>
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-accent">
              Available for projects
            </span>
          </div>

          {/* Main Title */}
          <div className="space-y-4">
            <h1 className="text-5xl sm:text-6xl md:text-8xl font-syne font-extrabold tracking-tight text-[var(--text)] leading-[1.1]">
              Backend <br />
              <GradientText className="inline-block">Specialist</GradientText>
            </h1>
            
            <p className="text-text-muted text-lg md:text-xl font-medium max-w-2xl mx-auto lg:mx-0 leading-relaxed pt-2">
              Building robust architectural foundations that power seamless digital experiences.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-6 w-full">
            <Button variant="primary" size="lg" asChild className="rounded-full px-10 w-full sm:w-auto h-14">
              <Link href="/projects" className="flex items-center justify-center gap-3 font-semibold text-lg">
                View My Work <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            
            <Button variant="outline" size="lg" asChild className="rounded-full px-10 w-full sm:w-auto h-14 border-white/10 bg-white/5">
              <Link href="/contact" className="flex items-center justify-center gap-3 font-semibold text-lg">
                <Terminal className="w-5 h-5" /> Let's Talk
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
});

export default HeroSectionStatic;
