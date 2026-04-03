"use client";

import dynamic from "next/dynamic";
const TerminalIntro = dynamic(() => import("@/components/sections/TerminalIntro"), { ssr: false });
const HeroSection = dynamic(() => import("@/components/sections/HeroSection"), { ssr: false });
import ServicesSection from "@/components/sections/ServicesSection";
import Link from "next/link";
import { GradientText } from "@/components/ui/Primitives";

/**
 * Portfolio Home Page
 * Built with Next.js App Router.
 */
import { usePerformance } from "@/hooks/usePerformance";

export default function HomePage() {
  const { isMobileDevice } = usePerformance();

  return (
    <div className="flex flex-col w-full overflow-x-hidden">
      {/* 1. Fullscreen Command Sequence (Skip on mobile) */}
      {!isMobileDevice && <TerminalIntro />}

      {/* 2. Hero Section: Welcome & Core Identity */}
      <HeroSection />

      {/* 3. Services: What I do */}
      <ServicesSection />

      {/* 4. CTA: Call to action */}
      <section className="container mx-auto px-6 py-24 text-center space-y-8">
        <h2 className="text-3xl md:text-5xl font-syne font-extrabold text-[var(--text)]">
          Ready to build something <GradientText>great?</GradientText>
        </h2>
        <p className="text-text-muted text-lg max-w-lg mx-auto">
          Let's create something you're proud of. I'm always open to new opportunities and collaborations.
        </p>
        <Link 
          href="/contact"
          className="inline-flex items-center gap-2 bg-accent text-white px-10 py-5 rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-accent-hover transition-all shadow-lg shadow-accent/20 hover:shadow-accent/40"
        >
          Start a Conversation →
        </Link>
      </section>
    </div>
  );
}
