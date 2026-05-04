"use client";

import React from "react";
import TimelineSection from "@/components/sections/TimelineSection";
import Terminal from "@/components/ui/Terminal";
import HttpBadge from "@/components/ui/HttpBadge";
import AsciiImage from "@/components/ui/AsciiImage";

export default function AboutPage() {
  const philosophyJson = `{
  "philosophy": {
    "core": "Engineering Stability",
    "mantra": "Great backend architecture is invisible.",
    "focus": ["Clean Architecture", "Data Integrity", "API Ecosystems"]
  },
  "obsession": {
    "current": "Query Optimization",
    "always": "System Reliability"
  }
}`;

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-10 py-12 min-h-[80vh]">
      
      <div className="flex items-center gap-4 mb-16 scroll-reveal">
        <h1 className="text-4xl md:text-5xl font-syne">/about</h1>
        <HttpBadge method="GET" endpoint="status: 200" className="cursor-default pointer-events-none" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-12">
        
        {/* Left Column: Philosophy & Text */}
        <div className="flex flex-col gap-10 scroll-reveal">
          {/* Profile Section */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 p-6 rounded-2xl bg-[var(--bg-card)] border border-[var(--border)] relative overflow-hidden group/about-photo">
            <div className="absolute top-0 right-0 w-40 h-40 bg-[var(--patch)]/5 blur-3xl rounded-full -mr-16 -mt-16" />
            
            <div className="relative shrink-0">
              <div className="absolute inset-0 bg-[var(--patch)] rounded-2xl blur-2xl opacity-15 group-hover/about-photo:opacity-30 transition-opacity" />
              <div className="relative w-64 h-64 md:w-72 md:h-72 rounded-2xl border-2 border-[var(--patch)]/40 overflow-hidden p-1 bg-[var(--bg)]">
                <AsciiImage 
                  src="/assets/imgs/falah.jpeg" 
                  alt="Ahmad Mathlaul Falah" 
                  resolution={60}
                />
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-[var(--bg-card)] border border-[var(--border)] flex items-center justify-center">
                 <div className="w-2 h-2 rounded-full bg-[var(--patch)] animate-pulse" />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <h2 className="font-syne text-2xl font-bold">Ahmad Mathlaul Falah</h2>
              <div className="flex flex-wrap gap-2">
                 <span className="font-mono text-[9px] uppercase bg-[var(--patch)]/10 text-[var(--patch)] px-2 py-0.5 rounded border border-[var(--patch)]/20">Lead Developer</span>
                 <span className="font-mono text-[9px] uppercase bg-[var(--get)]/10 text-[var(--get)] px-2 py-0.5 rounded border border-[var(--get)]/20">Backend Expert</span>
              </div>
              <p className="font-mono text-xs text-[var(--muted)] mt-2">
                "Building the invisible foundations of digital experiences."
              </p>
            </div>
          </div>

          <div className="space-y-6 text-[var(--muted)] text-sm leading-relaxed">
            <p>
              I believe that great backend architecture is invisible. It's the silent foundation that allows a product to scale, endure heavy loads, and remain secure.
            </p>
            <p className="border-l-2 border-[var(--patch)] pl-4 italic">
              "Fokus utama saya selalu pada ekosistem backend. Merancang struktur database yang aman, membangun RESTful API yang terstruktur, dan memastikan arsitektur Laravel yang scalable."
            </p>
          </div>

          <Terminal 
            title="json - philosophy.json"
            content={philosophyJson}
            className="w-full shadow-xl shadow-[var(--post)]/5"
          />
        </div>

        {/* Right Column: Timeline */}
        <div className="scroll-reveal" style={{ animationDelay: "0.2s" }}>
          <div className="mb-8 font-mono text-xs text-[var(--muted)] uppercase tracking-widest border-b border-[var(--border)] pb-2 inline-block">
            Execution Trace
          </div>
          <TimelineSection />
        </div>

      </div>
    </div>
  );
}
