"use client";

import React from "react";
import SkillBar from "@/components/ui/SkillBar";
import HttpBadge from "@/components/ui/HttpBadge";

const stackItems = [
  { tech: "Laravel", icon: "🐘", percentage: 90, level: "Expert", color: "GET" },
  { tech: "PHP", icon: "🐘", percentage: 85, level: "Advanced", color: "POST" },
  { tech: "MySQL", icon: "🛢️", percentage: 80, level: "Advanced", color: "GET" },
  { tech: "REST API", icon: "🔗", percentage: 95, level: "Expert", color: "POST" },
  { tech: "Postman", icon: "🚀", percentage: 85, level: "Advanced", color: "PATCH" },
  { tech: "Git / GitHub", icon: "🐙", percentage: 80, level: "Advanced", color: "PATCH" },
  { tech: "Next.js", icon: "⚛️", percentage: 65, level: "Intermediate", color: "PUT" },
  { tech: "Docker", icon: "🐳", percentage: 40, level: "Learning", color: "DELETE" }
] as const;

export default function StackPage() {
  return (
    <div className="max-w-7xl mx-auto px-6 md:px-10 py-12 min-h-[80vh]">
      
      <div className="flex items-center gap-4 mb-16 scroll-reveal">
        <h1 className="text-4xl md:text-5xl font-syne">/stack</h1>
        <HttpBadge method="PATCH" endpoint="status: 206 Partial Content" className="cursor-default pointer-events-none" />
      </div>

      <div className="scroll-reveal" style={{ animationDelay: "0.2s" }}>
        <div className="mb-8 font-mono text-xs text-[var(--muted)] uppercase tracking-widest border-b border-[var(--border)] pb-2 inline-block">
          System Requirements
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
          {stackItems.map((item, index) => (
            <div key={item.tech} className="bg-[var(--bg-card)] border border-[var(--border)] p-6 rounded-lg hover:border-[var(--muted)] transition-colors">
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

      <div className="mt-16 bg-[var(--bg-card2)] border border-[var(--border)] p-6 rounded-lg scroll-reveal font-mono text-sm" style={{ animationDelay: "0.4s" }}>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-[var(--patch)] font-bold">[WARN]</span>
          <span className="text-[var(--text)]">System continuously evolving</span>
        </div>
        <p className="text-[var(--muted)] pl-14">
          Tech stack is monitored and updated regularly. Currently researching deeper implementations of CI/CD pipelines and advanced Docker orchestration.
        </p>
      </div>

    </div>
  );
}
