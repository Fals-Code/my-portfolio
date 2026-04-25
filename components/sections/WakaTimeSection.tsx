"use client";

import React from "react";
import { useWakaTime } from "@/hooks/useWakaTime";
import { Clock, Code2, Zap, BarChart2, AlertCircle } from "lucide-react";

function formatSeconds(s: number): string {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

export default function WakaTimeSection() {
  const { weeklyStats, todayStatus, weeklyTotal, dailyAvg, isCoding, isLoading, error } =
    useWakaTime();

  if (error) {
    return (
      <div className="mt-12">
        <div className="mb-8 font-mono text-xs text-[var(--muted)] uppercase tracking-widest border-b border-[var(--border)] pb-2 inline-block">
          Coding Activity
        </div>
        <div className="bg-[var(--bg-card2)] border border-[var(--border)] rounded-lg p-5 flex items-center gap-3 font-mono text-sm text-[var(--muted)]">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>WakaTime stats tidak tersedia — pastikan WAKATIME_API_KEY sudah di-set.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-16 scroll-reveal" style={{ animationDelay: "0.4s" }}>
      {/* Section Label */}
      <div className="flex items-center justify-between mb-8">
        <div className="font-mono text-xs text-[var(--muted)] uppercase tracking-widest border-b border-[var(--border)] pb-2 inline-block">
          Coding Activity (7 Days)
        </div>
        {isCoding && (
          <div className="flex items-center gap-2 font-mono text-xs text-[var(--post)] animate-pulse">
            <span className="w-2 h-2 rounded-full bg-[var(--post)]" />
            LIVE — Sedang Coding
          </div>
        )}
      </div>

      {/* Today Quick Stats */}
      {(isLoading || todayStatus) && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: "Today",
              value: isLoading ? "..." : todayStatus?.todayTotal || "0 mins",
              color: "var(--get)",
              icon: <Clock className="w-4 h-4" />,
            },
            {
              label: "This Week",
              value: isLoading ? "..." : weeklyTotal,
              color: "var(--post)",
              icon: <BarChart2 className="w-4 h-4" />,
            },
            {
              label: "Daily Avg",
              value: isLoading ? "..." : dailyAvg,
              color: "var(--patch)",
              icon: <Zap className="w-4 h-4" />,
            },
            {
              label: "Top Language",
              value: isLoading ? "..." : weeklyStats?.languages[0]?.name || "—",
              color: "var(--put)",
              icon: <Code2 className="w-4 h-4" />,
            },
          ].map(({ label, value, color, icon }) => (
            <div
              key={label}
              className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg p-4 flex flex-col items-center gap-2 hover:border-[var(--muted)] transition-colors"
            >
              <div style={{ color }} className="opacity-70">{icon}</div>
              {isLoading ? (
                <div className="h-7 w-16 bg-[var(--border)] animate-pulse rounded" />
              ) : (
                <span className="font-syne text-lg font-bold" style={{ color }}>
                  {value}
                </span>
              )}
              <span className="font-mono text-[0.65rem] text-[var(--muted)] uppercase tracking-wider">
                {label}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Language Distribution */}
      {(isLoading || (weeklyStats?.languages?.length ?? 0) > 0) && (
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg p-6">
          <div className="font-mono text-xs text-[var(--muted)] uppercase tracking-widest mb-5">
            Languages This Week
          </div>
          {isLoading ? (
            <div className="space-y-3">
              {[70, 50, 35, 20].map((w, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="h-3 w-24 bg-[var(--border)] animate-pulse rounded" />
                  <div className="flex-1 h-2 bg-[var(--border)] animate-pulse rounded-full" />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {weeklyStats?.languages.map((lang) => (
                <div key={lang.name} className="flex items-center gap-4">
                  <span className="font-mono text-xs text-[var(--text)] w-20 shrink-0">
                    {lang.name}
                  </span>
                  <div className="flex-1 h-1.5 bg-[var(--bg-card2)] rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-1000"
                      style={{
                        width: `${lang.percent}%`,
                        backgroundColor: "var(--post)",
                        boxShadow: "0 0 8px var(--post)40",
                      }}
                    />
                  </div>
                  <span className="font-mono text-xs text-[var(--muted)] w-12 text-right">
                    {lang.percent.toFixed(1)}%
                  </span>
                  <span className="font-mono text-xs text-[var(--muted)] hidden sm:block w-16 text-right">
                    {lang.text}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Current Project (jika sedang coding) */}
      {todayStatus?.currentProject && (
        <div className="mt-4 bg-[var(--post)]/10 border border-[var(--post)]/30 rounded-lg p-4 flex items-center gap-3 font-mono text-sm">
          <Code2 className="w-4 h-4 text-[var(--post)] shrink-0" />
          <span className="text-[var(--text)]">
            Sedang mengerjakan:{" "}
            <span className="text-[var(--post)] font-bold">
              {todayStatus.currentProject}
            </span>
            {todayStatus.currentLanguage && (
              <span className="text-[var(--muted)]">
                {" "}({todayStatus.currentLanguage})
              </span>
            )}
          </span>
        </div>
      )}
    </div>
  );
}