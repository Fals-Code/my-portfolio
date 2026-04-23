"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Mail } from "lucide-react";
import { Button, GradientText } from "@/components/ui/Primitives";

/**
 * ULTRA-PERFORMANT Hero for Mobile - v2
 * Zero framer-motion. Pure SSR-friendly layout.
 */
const HeroSectionStatic = React.memo(function HeroSectionStatic() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center pt-24 pb-12 bg-bg overflow-hidden text-center">
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto space-y-10">
          
          {/* Status Badge */}
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-white/5 bg-white/5">
            <span className="relative flex h-2 w-2">
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
            </span>
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">
              Backend Developer
            </span>
          </div>

          {/* Headline */}
          <div className="space-y-6">
            <h1 className="text-white">
              Crafting <span className="font-serif italic font-normal text-white/80">Elegance</span> in <br />
              <GradientText variant="accent">Logic & Code.</GradientText>
            </h1>
            <p className="text-lg text-text-muted max-w-xl mx-auto font-medium leading-relaxed">
              Building scalable systems and refined digital experiences with precision.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-4 pt-4 w-full px-4">
            <Button variant="primary" size="lg" asChild className="h-14 font-bold">
              <Link href="/projects" className="flex items-center justify-center gap-3">
                See My Work <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>
            
            <Button variant="outline" size="lg" asChild className="h-14 font-bold border-white/5 bg-white/5">
               <Link href="/contact" className="flex items-center justify-center gap-3">
                 Let's Talk <Mail className="w-4 h-4 opacity-40" />
               </Link>
            </Button>
          </div>
        </div>
      </div>
      
      {/* Static Rings */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150vw] h-[150vw] border border-white/[0.02] rounded-full pointer-events-none" />
    </section>
  );
});

export default HeroSectionStatic;

