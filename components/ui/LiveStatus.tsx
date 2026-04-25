"use client";

import React from "react";
import { useOnlineStatus } from "@/hooks/useOnlineStatus";
import { Code2, Coffee } from "lucide-react";

interface LiveStatusProps {
  className?: string;
  showLabel?: boolean;
  compact?: boolean;
}

export default function LiveStatus({
  className = "",
  showLabel = true,
  compact = false,
}: LiveStatusProps) {
  const { isOnline, isCoding, lastSeen, isLoading } = useOnlineStatus();

  if (isLoading) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="w-2 h-2 rounded-full bg-[var(--muted)] animate-pulse" />
        {showLabel && (
          <span className="font-mono text-xs text-[var(--muted)]">
            checking...
          </span>
        )}
      </div>
    );
  }

  const color = isCoding
    ? "var(--post)" // biru = sedang coding
    : isOnline
    ? "var(--get)"  // hijau = online
    : "var(--muted)"; // abu = offline

  const label = isCoding
    ? "Sedang Coding"
    : isOnline
    ? "Online"
    : "Offline";

  const Icon = isCoding ? Code2 : Coffee;

  if (compact) {
    return (
      <div
        className={`flex items-center gap-1.5 ${className}`}
        title={`${label}${lastSeen ? ` • Last seen: ${new Date(lastSeen).toLocaleString("id-ID")}` : ""}`}
      >
        <span
          className="w-2 h-2 rounded-full"
          style={{
            backgroundColor: color,
            boxShadow: isOnline ? `0 0 6px ${color}` : "none",
            animation: isCoding ? "pulse-status 2s infinite" : "none",
          }}
        />
      </div>
    );
  }

  return (
    <div
      className={`flex items-center gap-2 px-3 py-1.5 rounded-full border font-mono text-xs transition-all ${className}`}
      style={{
        borderColor: `${color}40`,
        backgroundColor: `${color}10`,
        color,
      }}
    >
      <Icon className="w-3 h-3" />
      {showLabel && <span>{label}</span>}
      {isCoding && (
        <span
          className="w-1.5 h-1.5 rounded-full"
          style={{
            backgroundColor: color,
            animation: "pulse-status 1.5s infinite",
          }}
        />
      )}
    </div>
  );
}