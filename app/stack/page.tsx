"use client";

import React from "react";
import SkillBar from "@/components/ui/SkillBar";
import HttpBadge from "@/components/ui/HttpBadge";
import { useGitHub } from "@/hooks/useGitHub";
import { GitFork, Star, Users, BookOpen, AlertCircle } from "lucide-react";

const stackItems = [
  { tech: "Laravel", icon: "🐘", percentage: 90, level: "Expert", color: "GET" },
  { tech: "PHP", icon: "🐘", percentage: 85, level: "Advanced", color: "POST" },
  { tech: "MySQL", icon: "🛢️", percentage: 80, level: "Advanced", color: "GET" },
  { tech: "REST API", icon: "🔗", percentage: 95, level: "Expert", color: "POST" },
  { tech: "Postman", icon: "🚀", percentage: 85, level: "Advanced", color: "PATCH" },
  { tech: "Git / GitHub", icon: "🐙", percentage: 80, level: "Advanced", color: "PATCH" },
  { tech: "Next.js", icon: "⚛️", percentage: 65, level: "Intermediate", color: "PUT" },
  { tech: "Docker", icon: "🐳", percentage: 40, level: "Learning", color: "DELETE" },
] as const;

// ─── GitHub Stats Card ──────────────────────────────────────────────────────
function GitHubStatsSection() {
  const { stats, languages, isLoading, error } = useGitHub();

  if (error) {
    return (
      <div className="mt-12 bg-[var(--bg-card2)] border border-[var(--delete)]/30 rounded-lg p-5 flex items-center gap-3 font-mono text-sm text-[var(--delete)]">
        <AlertCircle className="w-4 h-4 shrink-0" />
        <span>
          <span className="font-bold">[WARN]</span> GitHub API sync failed — {error}
        </span>
      </div>
    );
  }

  return (
    <div className="mt-16 scroll-reveal" style={{ animationDelay: "0.3s" }}>
      {/* Section Label */}
      <div className="mb-8 font-mono text-xs text-[var(--muted)] uppercase tracking-widest border-b border-[var(--border)] pb-2 inline-block">
        GitHub Activity
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        {[
          {
            label: "Repositories",
            value: stats.repositories,
            icon: <BookOpen className="w-4 h-4" />,
            color: "var(--get)",
          },
          {
            label: "Stars",
            value: stats.stars,
            icon: <Star className="w-4 h-4" />,
            color: "var(--patch)",
          },
          {
            label: "Followers",
            value: stats.followers,
            icon: <Users className="w-4 h-4" />,
            color: "var(--post)",
          },
        ].map(({ label, value, icon, color }) => (
          <div
            key={label}
            className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg p-4 flex flex-col items-center justify-center gap-2 hover:border-[var(--muted)] transition-colors"
          >
            <div style={{ color }} className="opacity-70">
              {icon}
            </div>
            {isLoading ? (
              <div className="h-7 w-12 bg-[var(--border)] animate-pulse rounded" />
            ) : (
              <span
                className="font-syne text-2xl font-bold"
                style={{ color }}
              >
                {value}
              </span>
            )}
            <span className="font-mono text-[0.65rem] text-[var(--muted)] uppercase tracking-wider">
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* Language Distribution */}
      {(isLoading || languages.length > 0) && (
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg p-6">
          <div className="font-mono text-xs text-[var(--muted)] uppercase tracking-widest mb-5">
            Language Distribution
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {[80, 60, 45, 30].map((w, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full bg-[var(--border)] animate-pulse" />
                  <div
                    className="h-3 bg-[var(--border)] animate-pulse rounded"
                    style={{ width: `${w}%` }}
                  />
                </div>
              ))}
            </div>
          ) : (
            <>
              {/* Bar chart */}
              <div className="flex h-3 rounded-full overflow-hidden mb-5 gap-0.5">
                {languages.map((lang) => (
                  <div
                    key={lang.name}
                    title={`${lang.name} ${lang.percentage.toFixed(1)}%`}
                    className="h-full transition-all duration-700"
                    style={{
                      width: `${lang.percentage}%`,
                      backgroundColor: lang.color,
                    }}
                  />
                ))}
              </div>

              {/* Legend */}
              <div className="flex flex-wrap gap-x-5 gap-y-2">
                {languages.map((lang) => (
                  <div key={lang.name} className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: lang.color }}
                    />
                    <span className="font-mono text-xs text-[var(--text)]">
                      {lang.name}
                    </span>
                    <span className="font-mono text-xs text-[var(--muted)]">
                      {lang.percentage.toFixed(1)}%
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────
export default function StackPage() {
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

      {/* Skill Bars */}
      <div className="scroll-reveal" style={{ animationDelay: "0.2s" }}>
        <div className="mb-8 font-mono text-xs text-[var(--muted)] uppercase tracking-widest border-b border-[var(--border)] pb-2 inline-block">
          System Requirements
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
          {stackItems.map((item) => (
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
          ))}
        </div>
      </div>

      {/* GitHub Stats */}
      <GitHubStatsSection />

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
          Tech stack is monitored and updated regularly. Currently researching
          deeper implementations of CI/CD pipelines and advanced Docker
          orchestration.
        </p>
      </div>
    </div>
  );
}
