"use client";

import React, { useState, useEffect } from "react";
import Terminal from "../ui/Terminal";
import HttpBadge from "../ui/HttpBadge";
import LiveStatus from "../ui/LiveStatus";
import { useGitHub } from "@/hooks/useGitHub";
import { useTheme } from "@/context/ThemeContext";
import { usePerformance } from "@/hooks/usePerformance";
import { Sun, Moon, Sunrise, Sunset, Music } from "lucide-react";
import AsciiImage from "../ui/AsciiImage";
import dynamic from "next/dynamic";

const Terminal = dynamic(() => import("../ui/Terminal"), { ssr: false });
const AbstractCanvas = dynamic(() => import("../ui/AbstractCanvas"), { ssr: false });

export default function HeroSection() {
  const { stats } = useGitHub();
  const { environment } = useTheme();
  const { isLow } = usePerformance();
  const [uptime, setUptime] = useState(99.98);
  const [isProjectsLoading, setIsProjectsLoading] = useState(false);
  const [isContactLoading, setIsContactLoading] = useState(false);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return { text: "Good Morning", icon: <Sunrise className="w-3 h-3" /> };
    if (hour < 17) return { text: "Good Afternoon", icon: <Sun className="w-3 h-3" /> };
    if (hour < 21) return { text: "Good Evening", icon: <Sunset className="w-3 h-3" /> };
    return { text: "Good Night", icon: <Moon className="w-3 h-3" /> };
  };

  const greeting = getGreeting();

  // Calculate Experience from GitHub account creation
  const startYear = stats.createdAt ? new Date(stats.createdAt).getFullYear() : 2021;
  const experienceYears = new Date().getFullYear() - startYear;

  // Live Uptime simulation (Disabled on low-performance devices to save CPU)
  useEffect(() => {
    if (isLow) return;
    
    const interval = setInterval(() => {
      setUptime(99.97 + Math.random() * 0.02);
    }, 2000); // Updated every 2s
    return () => clearInterval(interval);
  }, [isLow]);

  const terminalData = `{
  "name": "Ahmad Mathlaul Falah",
  "role": "Backend Developer",
  "focus": "Laravel · MySQL · Clean Architecture",
  "experience": "${experienceYears}+ years",
  "github_stats": {
    "repos": ${stats.repositories},
    "stars": ${stats.stars}
  },
  "status": "200 OK | Sistem Online ✓"
}`;

  return (
    <section id="hero" className="min-h-[85vh] flex items-center pt-10 pb-20 relative overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-10 w-full grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center scroll-reveal min-w-0">
        
        {/* Left Column: Text & CTA */}
        <div className="flex flex-col items-start gap-6">
          <div className="flex items-center gap-3 flex-wrap">
  <LiveStatus showLabel={true} />
  <div className="flex items-center gap-3 bg-[var(--bg-card)] px-4 py-2 rounded-full border border-[var(--border)]">
    <span className="status-dot" />
    <span className="font-mono text-xs text-[var(--muted)]">
      HTTP 200 | available for new projects
    </span>
  </div>
</div>

          <div className="flex items-center gap-2 px-3 py-1 bg-[var(--bg-card)] border border-[var(--border)] rounded-full text-[10px] font-bold uppercase tracking-widest text-[var(--muted)] animate-fade-in">
            <span className="text-[var(--get)]">{greeting.icon}</span>
            <span>{greeting.text}, Traveler</span>
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-syne leading-[1.1] break-words">
            the<br/>
            <span className="glitch-wrapper text-[var(--get)]">
              <span className="glitch-text" data-text="Backend">Backend</span>
            </span>
            <br/>
            Architect.
          </h1>

          <div className="pl-4 border-l-2 border-[var(--get)] my-4">
            <p className="text-[var(--muted)] max-w-md">
              Crafting robust APIs, scalable databases, and seamless server-side architectures from Surabaya, ID.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 mt-2">
            <HttpBadge 
              method="GET" 
              endpoint="/projects" 
              label="View Portfolio"
              href="/projects" 
              className="text-base px-5 py-2.5" 
              isLoading={isProjectsLoading}
              onClick={() => setIsProjectsLoading(true)}
            />
            <HttpBadge 
              method="POST" 
              endpoint="/contact" 
              label="Get In Touch"
              href="/contact" 
              className="text-base px-5 py-2.5" 
              isLoading={isContactLoading}
              onClick={() => setIsContactLoading(true)}
            />
          </div>
          
          <div className="mt-8 flex items-center gap-2 font-mono text-xs text-[var(--muted)] bg-[var(--bg-card)] px-3 py-1.5 rounded-md border border-[var(--border)]">
            <span className="text-[var(--get)] font-bold">GET</span>
            <span>/api/location</span>
            <span className="text-[var(--text)] mx-2">→</span>
            <span>Surabaya, ID</span>
          </div>

          {/* Mobile Music Hint */}
          <div className={`flex md:hidden items-center gap-3 mt-10 p-4 rounded-xl bg-[var(--get)]/5 border border-[var(--get)]/20 ${!isLow ? "animate-pulse" : ""} cursor-pointer`}
            onClick={() => {
               window.dispatchEvent(new CustomEvent('toggle-command-palette'));
            }}
          >
            <div className="w-8 h-8 rounded-full bg-[var(--get)]/20 flex items-center justify-center">
               <Music className="w-4 h-4 text-[var(--get)]" />
            </div>
            <div className="flex flex-col">
               <span className="text-[10px] font-mono font-bold text-[var(--get)] uppercase tracking-widest">Ambient Mode Available</span>
               <span className="text-[9px] font-mono text-[var(--muted)]">Tap to open palette & play radio</span>
            </div>
          </div>
        </div>

        {/* Right Column: Terminal & Metrics */}
        <div className="w-full flex flex-col gap-6 relative">
          
          <AbstractCanvas />
          
          <div className="relative z-10">
            <Terminal 
              title="bash - falah@backend-server"
              content={terminalData}
              typing={!isLow}
              typingSpeed={15}
              className="w-full shadow-2xl shadow-[var(--get)]/5"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: "Projects", value: `${stats.repositories}+`, color: "var(--get)" },
              { label: "Years Exp", value: `${experienceYears}+`, color: "var(--post)" },
              { label: "Total Stars", value: `${stats.stars}`, color: "var(--patch)", live: true }
            ].map((metric, i) => (
              <div key={i} className="bg-[var(--bg-card)] border border-[var(--border)] p-4 rounded-lg flex flex-col items-center justify-center gap-1 hover:border-[var(--muted)] transition-colors relative group/metric overflow-hidden">
                {metric.live && stats.stars > 0 && (
                  <div className="absolute top-2 right-2 flex items-center gap-1">
                    <span className="w-1 h-1 rounded-full bg-[var(--patch)] animate-pulse" />
                    <span className="text-[8px] font-bold text-[var(--patch)] opacity-60">SYNCED</span>
                  </div>
                )}
                <span className="font-mono text-[10px] text-[var(--muted)] uppercase tracking-wider">{metric.label}</span>
                <span className="font-syne text-2xl font-bold" style={{ color: metric.color }}>{metric.value}</span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
