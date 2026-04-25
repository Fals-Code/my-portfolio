"use client";

import React from "react";
import SkillBar from "@/components/ui/SkillBar";
import HttpBadge from "@/components/ui/HttpBadge";
import { useGitHub } from "@/hooks/useGitHub";
import { GitFork, Star, Users, BookOpen, AlertCircle } from "lucide-react";
import dynamic from "next/dynamic";

const WakaTimeSection = dynamic(
  () => import("@/components/sections/WakaTimeSection"),
  { ssr: false }
);

// Helper for mapping icons and colors based on tech name
const getTechConfig = (name: string) => {
  const configs: Record<string, { icon: string, method: "GET" | "POST" | "PATCH" | "DELETE" | "PUT" }> = {
    PHP: { icon: "🐘", method: "POST" },
    JavaScript: { icon: "JS", method: "GET" },
    TypeScript: { icon: "TS", method: "GET" },
    HTML: { icon: "HTML", method: "PATCH" },
    CSS: { icon: "CSS", method: "PATCH" },
    Vue: { icon: "V", method: "POST" },
    React: { icon: "R", method: "PUT" },
    Blade: { icon: "B", method: "DELETE" },
    Laravel: { icon: "L", method: "POST" },
    MySQL: { icon: "SQL", method: "GET" },
  };
  return configs[name] || { icon: "{}", method: "PATCH" };
};

const getLevel = (percentage: number) => {
  if (percentage > 70) return "Expert";
  if (percentage > 40) return "Advanced";
  if (percentage > 10) return "Intermediate";
  return "Learning";
};

export default function StackPage() {
  const { stats, languages, isLoading, error } = useGitHub();

  // Combine GitHub languages with potential extra items (like frameworks)
  // In a real scenario, you could also check topics/names to detect Laravel etc.
  const dynamicStack = languages.map(lang => {
    const config = getTechConfig(lang.name);
    return {
      tech: lang.name,
      icon: config.icon,
      percentage: Math.round(lang.percentage),
      level: getLevel(lang.percentage),
      color: config.method
    };
  });

  // If we have PHP but no Laravel item, and we know we use Laravel, we could inject it
  // or just let GitHub data speak for itself.
  
  return (
    <div className="max-w-7xl mx-auto px-6 md:px-10 py-12 min-h-[80vh]">
      {/* Header */}
      <div className="flex items-center gap-4 mb-16 scroll-reveal">
        <h1 className="text-4xl md:text-5xl font-syne">/stack</h1>
        <HttpBadge
          method="PATCH"
          endpoint="status: 206 Partial Content"
          className="cursor-default pointer-events-none"
        />
      </div>

      {/* System Requirements (Dynamic Stack) */}
      <div className="scroll-reveal" style={{ animationDelay: "0.2s" }}>
        <div className="flex items-center justify-between mb-8">
          <div className="font-mono text-xs text-[var(--muted)] uppercase tracking-widest border-b border-[var(--border)] pb-2 inline-block">
            System Requirements (Synced)
          </div>
          <span className="font-mono text-[10px] text-[var(--patch)] animate-pulse">● LIVE FROM GITHUB</span>
        </div>

        {error ? (
          <div className="bg-[var(--bg-card2)] border border-[var(--delete)]/30 rounded-lg p-5 flex items-center gap-3 font-mono text-sm text-[var(--delete)]">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>[ERROR] Failed to sync dynamic stack — {error}</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
            {isLoading ? (
              // Loading Skeletons
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-[var(--bg-card)] border border-[var(--border)] p-6 rounded-lg animate-pulse h-24" />
              ))
            ) : (
              dynamicStack.map((item) => (
                <div
                  key={item.tech}
                  className="bg-[var(--bg-card)] border border-[var(--border)] p-6 rounded-lg hover:border-[var(--muted)] transition-colors"
                >
                  <SkillBar
                    techName={item.tech}
                    icon={item.icon}
                    percentage={item.percentage}
                    level={item.level}
                    colorMethod={item.color}
                  />
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* GitHub Activity */}
      <div className="mt-16 scroll-reveal" style={{ animationDelay: "0.3s" }}>
        <div className="mb-8 font-mono text-xs text-[var(--muted)] uppercase tracking-widest border-b border-[var(--border)] pb-2 inline-block">
          GitHub Activity
        </div>

        <div className="grid grid-cols-3 gap-4 mb-10">
          {[
            { label: "Repositories", value: stats.repositories, icon: <BookOpen className="w-4 h-4" />, color: "var(--get)" },
            { label: "Stars", value: stats.stars, icon: <Star className="w-4 h-4" />, color: "var(--patch)" },
            { label: "Followers", value: stats.followers, icon: <Users className="w-4 h-4" />, color: "var(--post)" },
          ].map(({ label, value, icon, color }) => (
            <div key={label} className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg p-4 flex flex-col items-center justify-center gap-2 hover:border-[var(--muted)] transition-colors">
              <div style={{ color }} className="opacity-70">{icon}</div>
              {isLoading ? (
                <div className="h-7 w-12 bg-[var(--border)] animate-pulse rounded" />
              ) : (
                <span className="font-syne text-2xl font-bold" style={{ color }}>{value}</span>
              )}
              <span className="font-mono text-[0.65rem] text-[var(--muted)] uppercase tracking-wider">{label}</span>
            </div>
          ))}
        </div>
      </div>

      <WakaTimeSection />

      {/* Warning Footer */}
      <div
        className="mt-12 bg-[var(--bg-card2)] border border-[var(--border)] p-6 rounded-lg scroll-reveal font-mono text-sm"
        style={{ animationDelay: "0.4s" }}
      >
        <div className="flex items-center gap-2 mb-4">
          <span className="text-[var(--patch)] font-bold">[WARN]</span>
          <span className="text-[var(--text)]">System continuously evolving</span>
        </div>
        <p className="text-[var(--muted)] pl-14">
          Data sinkronisasi otomatis dari GitHub. Keahlian dihitung berdasarkan distribusi kode di seluruh repositori publik.
        </p>
      </div>
    </div>
  );
}
