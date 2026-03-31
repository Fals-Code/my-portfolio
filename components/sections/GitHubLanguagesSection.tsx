"use client";

import React from "react";
import { useGitHub } from "@/hooks/useGitHub";
import { SectionLabel, GlassPanel } from "@/components/ui/Primitives";
import { motion } from "framer-motion";

/**
 * GitHub Languages Section
 * Uses live data to show language distribution.
 */
export default function GitHubLanguagesSection() {
  const { languages, isLoading } = useGitHub();

  if (isLoading) {
    return (
      <section className="container mx-auto px-6 py-24">
        <div className="h-64 glass-panel rounded-3xl animate-shimmer" />
      </section>
    );
  }

  return (
    <section className="container mx-auto px-6 py-24">
      <div className="space-y-12">
        <div className="space-y-4">
          <SectionLabel>Skills</SectionLabel>
          <h2 className="text-3xl md:text-5xl font-syne font-extrabold text-[var(--text)]">
            Languages from GitHub
          </h2>
        </div>

        {/* Stacked Bar Chart */}
        <div className="w-full h-12 flex rounded-3xl overflow-hidden border border-border shadow-2xl">
          {languages.map((lang, idx) => (
            <motion.div
              key={lang.name}
              initial={{ width: 0 }}
              animate={{ width: `${lang.percentage}%` }}
              transition={{ duration: 1, delay: idx * 0.1 }}
              className="group relative h-full"
              style={{ backgroundColor: lang.color }}
            >
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap bg-bg-card p-2 rounded-lg border border-border text-[10px] font-bold z-20 pointer-events-none">
                {lang.name} • {lang.percentage.toFixed(1)}%
              </div>
            </motion.div>
          ))}
        </div>

        {/* Language Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {languages.map((lang, idx) => (
            <motion.div
              key={lang.name}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -3, borderColor: "var(--accent)" }}
              className="p-5 glass-panel rounded-2xl border-border transition-all group"
            >
              <div className="flex items-center gap-3 mb-4">
                <div 
                  className="w-3 h-3 rounded-full shadow-[0_0_10px_currentColor]" 
                  style={{ backgroundColor: lang.color, color: lang.color }} 
                />
                <span className="font-syne font-bold text-sm text-[var(--text)] group-hover:text-accent transition-colors">
                  {lang.name}
                </span>
                <span className="ml-auto text-[10px] font-mono text-text-muted">
                  {lang.percentage.toFixed(1)}%
                </span>
              </div>
              
              {/* Mini Progress Bar */}
              <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: `${lang.percentage}%` }}
                  transition={{ duration: 1.5 }}
                  className="h-full"
                  style={{ backgroundColor: lang.color }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
