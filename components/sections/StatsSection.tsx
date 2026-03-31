"use client";

import React, { useState, useEffect, useRef } from "react";
import { useGitHub } from "@/hooks/useGitHub";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { GlassPanel } from "@/components/ui/Primitives";

/**
 * Animated counter component using Intersection Observer.
 */
function Counter({ value, label }: { value: number; label: string }) {
  const [count, setCount] = useState(0);
  const containerRef = useScrollReveal<HTMLDivElement>();
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    if (containerRef.current?.classList.contains("revealed") && !hasStarted) {
      setHasStarted(true);
      let start = 0;
      const end = value;
      const duration = 2000;
      const stepTime = Math.abs(Math.floor(duration / end));
      
      const timer = setInterval(() => {
        start += 1;
        setCount(start);
        if (start >= end) clearInterval(timer);
      }, stepTime || 20);

      return () => clearInterval(timer);
    }
  }, [containerRef, value, hasStarted]);

  return (
    <div ref={containerRef} className="text-center p-8 space-y-2 opacity-0 -translate-y-4 transition-all duration-700">
      <div className="text-4xl md:text-5xl font-syne font-extrabold text-[var(--text)] tracking-tight">
        {count}
        <span className="text-accent">+</span>
      </div>
      <div className="text-xs md:text-sm font-bold uppercase tracking-widest text-text-muted">{label}</div>
    </div>
  );
}

/**
 * GitHub Statistics Section
 */
export default function StatsSection() {
  const { stats, isLoading, error } = useGitHub();

  if (isLoading) {
    return (
      <section className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 glass-panel rounded-3xl animate-shimmer bg-accent/5 overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="container mx-auto px-6 section-pad">
      <div className="grid grid-cols-1 md:grid-cols-3 grid-airy">
        <GlassPanel>
          <Counter value={stats.repositories} label="Repositories" />
        </GlassPanel>
        <GlassPanel>
          <Counter value={stats.stars} label="Total Stars" />
        </GlassPanel>
        <GlassPanel>
          <Counter value={stats.followers} label="Followers" />
        </GlassPanel>
      </div>
      {error && <p className="text-center text-red-500/50 text-xs mt-4 italic">{error}</p>}
    </section>
  );
}
