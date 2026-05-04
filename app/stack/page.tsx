"use client";

import React from "react";
import { useGitHub } from "@/hooks/useGitHub";
import { Star, Users, BookOpen, AlertCircle, Server, Code2, Database, Layout } from "lucide-react";
import { GitHubCalendar } from "react-github-calendar";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";

const SystemArchitecture = dynamic(
  () => import("@/components/ui/SystemArchitecture"),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-full bg-[var(--bg-card)]/50 rounded-2xl border border-[var(--border)] animate-pulse" />
    )
  }
);

const WakaTimeSection = dynamic(
  () => import("@/components/sections/WakaTimeSection"),
  { ssr: false }
);

export default function StackPage() {
  const { stats, languages, isLoading } = useGitHub();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 py-12 min-h-[80vh] w-full">
      
      {/* Grid Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6 auto-rows-[minmax(180px,auto)]">
        
        {/* HEADER CARD - 2 cols wide */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="md:col-span-2 xl:col-span-2 bg-[var(--bg-card)]/40 backdrop-blur-md border border-[var(--border)] rounded-3xl p-8 relative overflow-hidden group hover:border-[var(--muted)] transition-colors"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--patch)]/10 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none group-hover:bg-[var(--patch)]/20 transition-all duration-700" />
          <h1 className="text-4xl md:text-5xl font-syne font-bold mb-4">/stack</h1>
          <p className="text-[var(--muted)] leading-relaxed max-w-md">
            The foundation of my digital architecture. A curated blend of robust backend systems, dynamic frontends, and reliable infrastructure.
          </p>
          <div className="mt-6 flex items-center gap-3">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--get)] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-[var(--get)]"></span>
            </span>
            <span className="font-mono text-xs uppercase tracking-widest text-[var(--muted)]">All systems operational</span>
          </div>
        </motion.div>

        {/* GITHUB STATS - 1 col */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-[var(--bg-card)]/40 backdrop-blur-md border border-[var(--border)] rounded-3xl p-6 relative overflow-hidden group hover:border-[var(--muted)] transition-colors flex flex-col justify-between"
        >
          <div className="flex items-center justify-between mb-4 text-[var(--muted)]">
            <span className="font-mono text-[10px] uppercase tracking-widest">Telemetry</span>
            <Star className="w-4 h-4 text-[var(--patch)]" />
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[var(--muted)]">
                <BookOpen className="w-4 h-4" /> <span className="text-sm">Repos</span>
              </div>
              <span className="font-syne font-bold text-xl">{isLoading ? '...' : stats.repositories}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[var(--muted)]">
                <Star className="w-4 h-4" /> <span className="text-sm">Stars</span>
              </div>
              <span className="font-syne font-bold text-xl text-[var(--patch)]">{isLoading ? '...' : stats.stars}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[var(--muted)]">
                <Users className="w-4 h-4" /> <span className="text-sm">Followers</span>
              </div>
              <span className="font-syne font-bold text-xl text-[var(--post)]">{isLoading ? '...' : stats.followers}</span>
            </div>
          </div>
        </motion.div>

        {/* CURRENT FOCUS - 1 col */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-gradient-to-br from-[var(--patch)]/10 to-transparent border border-[var(--border)] rounded-3xl p-6 relative overflow-hidden group hover:border-[var(--patch)]/30 transition-colors"
        >
          <div className="flex items-center justify-between mb-4 text-[var(--patch)]">
            <span className="font-mono text-[10px] uppercase tracking-widest font-bold">Current Focus</span>
            <Code2 className="w-4 h-4" />
          </div>
          <h3 className="font-syne text-2xl font-bold mb-2 text-white">System Design</h3>
          <p className="text-xs text-[var(--muted)]">
            Currently obsessed with building scalable microservices and optimizing database queries for high-traffic environments.
          </p>
        </motion.div>

        {/* SYSTEM ARCHITECTURE - 2 cols wide, spans 2 rows conceptually */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="md:col-span-2 xl:col-span-2 xl:row-span-2 bg-[var(--bg-card)]/40 backdrop-blur-md border border-[var(--border)] rounded-3xl overflow-hidden group hover:border-[var(--muted)] transition-colors"
          style={{ minHeight: 380 }}
        >
          <SystemArchitecture />
        </motion.div>

        {/* CORE SKILLS - 2 cols wide */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="md:col-span-2 xl:col-span-2 bg-[var(--bg-card)]/40 backdrop-blur-md border border-[var(--border)] rounded-3xl p-6 relative overflow-hidden group hover:border-[var(--muted)] transition-colors"
        >
          <div className="flex items-center justify-between mb-6">
            <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--muted)]">Core Technologies</span>
            <Server className="w-4 h-4 text-[var(--get)]" />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {isLoading 
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-[76px] rounded-xl bg-[var(--bg-card)] border border-[var(--border)] animate-pulse" />
                ))
              : languages.slice(0, 6).map((skill, i) => (
              <div key={skill.name} className="flex flex-col gap-2 p-3 rounded-xl bg-[var(--bg)] border border-[var(--border)] hover:border-[var(--muted)] transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-[var(--bg-card)] flex items-center justify-center border border-[var(--border)]" style={{ borderColor: `${skill.color}40` }}>
                    <Code2 className="w-4 h-4" style={{ color: skill.color }} />
                  </div>
                  <div>
                    <h4 className="font-syne font-bold text-sm">{skill.name}</h4>
                    <p className="text-[10px] text-[var(--muted)] font-mono">{skill.percentage.toFixed(1)}% Distribution</p>
                  </div>
                </div>
                {/* Progress bar line */}
                <div className="h-1 w-full bg-[var(--bg-card)] rounded-full overflow-hidden mt-1 relative">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.percentage}%` }}
                    transition={{ duration: 1, delay: 0.5 + (i * 0.1) }}
                    className="h-full rounded-full opacity-70 absolute left-0 top-0"
                    style={{ backgroundColor: skill.color, boxShadow: `0 0 10px ${skill.color}` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* WAKATIME - 2 cols wide */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="md:col-span-2 xl:col-span-2 bg-[var(--bg-card)]/40 backdrop-blur-md border border-[var(--border)] rounded-3xl p-6 relative overflow-hidden group hover:border-[var(--muted)] transition-colors flex flex-col"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--muted)]">Coding Activity</span>
            <AlertCircle className="w-4 h-4 text-[var(--post)]" />
          </div>
          <div className="flex-1 -mt-4">
            <WakaTimeSection />
          </div>
        </motion.div>

        {/* GITHUB CALENDAR - Full width span */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="md:col-span-2 xl:col-span-4 bg-[var(--bg-card)]/40 backdrop-blur-md border border-[var(--border)] rounded-3xl p-6 relative overflow-hidden group hover:border-[var(--muted)] transition-colors flex flex-col"
        >
          <div className="flex items-center justify-between mb-6">
            <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--muted)]">Contribution Graph</span>
          </div>
          <div className="flex-1 w-full flex items-center justify-center overflow-x-auto custom-scrollbar">
            <GitHubCalendar 
              username="Fals-Code" 
              colorScheme="dark"
              theme={{
                light: ['var(--bg)', 'var(--patch)', 'var(--patch)', 'var(--patch)', 'var(--patch)'], // Note: You'd typically adjust opacity here if library supports it, or use rgba
                dark: ['#131318', '#00e5a040', '#00e5a080', '#00e5a0c0', '#00e5a0'],
              }}
              labels={{
                totalCount: '{{count}} contributions in the last year',
              }}
            />
          </div>
        </motion.div>

      </div>
    </div>
  );
}