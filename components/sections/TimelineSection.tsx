"use client";

import React from "react";
import { timeline } from "@/data/timeline";
import { Briefcase, GraduationCap, Clock, BookOpen } from "lucide-react";

export default function TimelineSection() {
  return (
    <div className="flex flex-col gap-8 relative pl-6 border-l border-[var(--border)] ml-2">
      <div className="absolute -left-[1px] top-0 bottom-0 w-[2px] bg-gradient-to-b from-[var(--patch)] via-[var(--get)] to-transparent" />
      
      {timeline.map((item, index) => {
        const Icon = item.type === "work" ? Briefcase : (item.type === "education" ? GraduationCap : BookOpen);
        const color = item.type === "work" ? "var(--post)" : (item.type === "education" ? "var(--patch)" : "var(--put)");

        return (
          <div key={item.id} className="relative group transition-all duration-300">
            {/* Node Point */}
            <div 
              className="absolute -left-[31px] top-1.5 w-4 h-4 rounded-full border-2 border-[var(--bg)] transition-transform duration-300 group-hover:scale-125 z-10"
              style={{ backgroundColor: color }}
            />
            
            {/* Horizontal Connector */}
            <div className="absolute -left-6 top-3 w-4 h-[1px] bg-[var(--border)]" />

            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <span className="font-mono text-[10px] text-[var(--muted)] flex items-center gap-1 bg-[var(--bg-card)] px-2 py-0.5 rounded border border-[var(--border)]">
                  <Clock className="w-2.5 h-2.5" />
                  {item.date}
                </span>
                <span 
                  className="font-mono text-[10px] uppercase tracking-tighter px-1.5 rounded"
                  style={{ backgroundColor: `${color}15`, color }}
                >
                  {item.type}
                </span>
              </div>

              <div className="bg-[var(--bg-card)] border border-[var(--border)] p-4 rounded-lg group-hover:border-[var(--muted)] transition-colors">
                <h3 className="font-syne text-lg font-bold flex items-center gap-2">
                  <Icon className="w-4 h-4" style={{ color }} />
                  {item.title}
                </h3>
                <p className="font-mono text-xs text-[var(--get)] mt-0.5 mb-2">
                  @ {item.place}
                </p>
                <p className="text-[var(--muted)] font-mono text-xs leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          </div>
        );
      })}

      <div className="font-mono text-[10px] text-[var(--muted)] italic mt-4 flex items-center gap-2">
        <span className="w-1 h-1 rounded-full bg-[var(--muted)] animate-pulse" />
        Trace ending...
      </div>
    </div>
  );
}
