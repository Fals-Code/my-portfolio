"use client";

import React from "react";
import TimelineSection from "@/components/sections/TimelineSection";
import Terminal from "@/components/ui/Terminal";
import HttpBadge from "@/components/ui/HttpBadge";

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
          <div className="space-y-6 text-[var(--muted)] font-mono text-sm leading-relaxed">
            <p>
              I believe that great backend architecture is invisible. It's the silent foundation that allows a product to scale, endure heavy loads, and remain secure.
            </p>
            <p className="border-l-2 border-[var(--patch)] pl-4">
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
