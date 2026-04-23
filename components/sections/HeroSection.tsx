"use client";

import React from "react";
import Terminal from "../ui/Terminal";
import HttpBadge from "../ui/HttpBadge";

export default function HeroSection() {
  const terminalData = `{
  "name": "Ahmad Mathlaul Falah",
  "role": "Backend Developer",
  "university": "Universitas Airlangga",
  "focus": "Laravel · MySQL · Clean Architecture",
  "available": true,
  "open_to": ["freelance", "collaboration"],
  "location": "Gresik → Surabaya, ID",
  "status": "200 OK | Sistem Online ✓"
}`;

  return (
    <section id="hero" className="min-h-[85vh] flex items-center pt-10 pb-20 relative">
      <div className="max-w-7xl mx-auto px-6 md:px-10 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center scroll-reveal">
        
        {/* Left Column: Text & CTA */}
        <div className="flex flex-col items-start gap-6">
          <div className="flex items-center gap-3 bg-[var(--bg-card)] px-4 py-2 rounded-full border border-[var(--border)]">
            <span className="status-dot" />
            <span className="font-mono text-xs text-[var(--muted)]">HTTP 200 | available for new projects</span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-syne leading-[1.1]">
            the<br/>
            <span className="glitch-wrapper text-[var(--get)]">
              <span className="glitch-text" data-text="Backend">Backend</span>
            </span>
            <br/>
            Architect.
          </h1>

          <div className="pl-4 border-l-2 border-[var(--get)] my-4">
            <p className="text-[var(--muted)] font-mono max-w-md">
              Crafting robust APIs, scalable databases, and seamless server-side architectures from Surabaya, ID.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 mt-2">
            <HttpBadge method="GET" endpoint="/projects" href="#projects" className="text-base px-5 py-2.5" />
            <HttpBadge method="POST" endpoint="/contact" href="/contact" className="text-base px-5 py-2.5" />
          </div>
          
          <div className="mt-8 flex items-center gap-2 font-mono text-xs text-[var(--muted)] bg-[var(--bg-card)] px-3 py-1.5 rounded-md border border-[var(--border)]">
            <span className="text-[var(--get)] font-bold">GET</span>
            <span>/api/location</span>
            <span className="text-[var(--text)] mx-2">→</span>
            <span>Surabaya, ID</span>
          </div>
        </div>

        {/* Right Column: Terminal & Metrics */}
        <div className="w-full flex flex-col gap-6">
          <Terminal 
            title="bash - falah@backend-server"
            content={terminalData}
            typing={true}
            typingSpeed={15}
            className="w-full shadow-2xl shadow-[var(--get)]/5"
          />

          <div className="grid grid-cols-3 gap-4">
            {[
              { label: "Projects", value: "20+", color: "var(--get)" },
              { label: "Years Exp", value: "3+", color: "var(--post)" },
              { label: "Uptime", value: "99.9%", color: "var(--patch)" }
            ].map((metric, i) => (
              <div key={i} className="bg-[var(--bg-card)] border border-[var(--border)] p-4 rounded-lg flex flex-col items-center justify-center gap-1 hover:border-[var(--muted)] transition-colors">
                <span className="font-mono text-xs text-[var(--muted)] uppercase tracking-wider">{metric.label}</span>
                <span className="font-syne text-2xl font-bold" style={{ color: metric.color }}>{metric.value}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
