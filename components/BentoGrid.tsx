"use client";

import { motion } from "framer-motion";
import { 
  Globe, 
  Mail, 
  MessageCircle, 
  Code2, 
  User,
  ArrowUpRight,
  MapPin,
  Briefcase,
  GraduationCap,
  Database,
  Terminal,
  Box,
  GitBranch
} from "lucide-react";
import Image from "next/image";
import TiltCard from "./ui/TiltCard";
import LiveStatus from "./ui/LiveStatus";
import { GitHub, Instagram } from "./ui/Icons";
import { springBouncy } from "@/lib/motion-tokens";
import { useGitHub } from "@/hooks/useGitHub";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: springBouncy, // Character entrance
  },
};

export default function BentoGrid() {
  const { stats, isLoading } = useGitHub();

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-7xl mx-auto p-4 md:p-8"
    >
      {/* Profile Card (2x2) */}
      <motion.div
        variants={itemVariants}
        className="md:col-span-2 md:row-span-2 group"
      >
        <TiltCard className="p-1 glass-panel">
          <div className="p-10 h-full flex flex-col justify-between">
            <div className="space-y-8">
              <div className="flex items-start justify-between">
                <div className="relative w-28 h-28 rounded-3xl overflow-hidden border-2 border-border/40 group-hover:border-accent/40 transition-colors duration-500">
                  <div className="absolute inset-0 bg-neutral-900 flex items-center justify-center">
                    <User className="w-12 h-12 text-neutral-700" />
                  </div>
                  <Image 
                    src="/assets/imgs/falah.jpeg" 
                    alt="Ahmad Mathlaul Falah" 
                    fill 
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                    unoptimized 
                  />
                </div>
                <div className="px-4 py-2 rounded-full border border-green-500/20 bg-green-500/5 text-[11px] font-bold uppercase tracking-widest text-green-400 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  Available for Work
                </div>
              </div>
              
              <div className="space-y-4">
                <h1 className="text-5xl font-bold tracking-tight text-[var(--text)] leading-tight font-syne">
                  Ahmad Mathlaul <br />
                  <span className="text-neutral-500">Falah</span>
                </h1>
                <p className="text-xl text-neutral-300 font-medium font-syne">
                  Backend Developer
                </p>
                <p className="text-text-muted leading-relaxed max-w-md">
                  Fokus pada arsitektur backend, clean code, dan pembangunan sistem scalable menggunakan Laravel.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3 mt-12">
              <div className="flex items-center gap-2 px-4 py-2 rounded-2xl border border-border bg-white/[0.02] text-[11px] font-bold text-text-muted uppercase tracking-wider">
                <MapPin className="w-3.5 h-3.5 text-accent" />
                Gresik — Surabaya
              </div>
              <div className="flex items-center gap-2 px-4 py-2 rounded-2xl border border-border bg-white/[0.02] text-[11px] font-bold text-text-muted uppercase tracking-wider">
                <Briefcase className="w-3.5 h-3.5 text-accent" />
                Backend Precision
              </div>
            </div>
          </div>
        </TiltCard>
      </motion.div>

      {/* Featured Project (2x1) */}
      <motion.div
        variants={itemVariants}
        className="md:col-span-2 md:row-span-1 group"
      >
        <TiltCard className="p-1 glass-panel overflow-hidden">
          <div className="p-10 h-full flex flex-col justify-between relative z-10">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-accent">Featured Project</span>
                <div className="h-px w-8 bg-accent/30" />
              </div>
              <h3 className="text-3xl font-bold text-[var(--text)] group-hover:text-accent transition-colors font-syne">RSHP – Hospital Info System</h3>
              <p className="mt-3 text-text-muted max-w-sm">Digitalisasi registrasi pasien dan jadwal dokter secara real-time.</p>
            </div>
            
            <div className="flex items-center gap-3">
              {['Laravel', 'MySQL', 'Eloquent'].map(tag => (
                <span key={tag} className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-[11px] font-bold text-text-muted uppercase tracking-tighter">
                  {tag}
                </span>
              ))}
            </div>

            <div className="absolute top-10 right-10 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-4 group-hover:translate-x-0">
              <div className="p-3 rounded-full bg-accent text-white shadow-lg shadow-accent/20">
                <ArrowUpRight className="w-5 h-5" />
              </div>
            </div>
          </div>
          {/* Abstract Deco */}
          <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-accent/5 rounded-full blur-[80px] group-hover:bg-accent/10 transition-colors" />
        </TiltCard>
      </motion.div>

      {/* GitHub Stats (1x1) */}
      <motion.div
        variants={itemVariants}
        className="md:col-span-1 md:row-span-1 group"
      >
        <TiltCard className="p-1 glass-panel">
          <div className="p-8 h-full flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <h3 className="text-[11px] font-bold uppercase tracking-widest text-text-muted">GitHub Stats</h3>
              <a href="https://github.com/Fals-Code" target="_blank" rel="noopener noreferrer">
                <Terminal className="w-4 h-4 text-accent hover:scale-110 transition-transform" />
              </a>
            </div>
            <div className="space-y-4">
              <div className="flex items-end justify-between">
                <span className="text-4xl font-bold text-[var(--text)] font-syne">
                  {isLoading ? "..." : stats.repositories}
                </span>
                <span className="text-[11px] text-text-muted mb-1 font-bold uppercase">Repos</span>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: isLoading ? "20%" : `${Math.min((stats.repositories / 30) * 100, 100)}%` }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                  className="h-full bg-accent/50" 
                />
              </div>
              <div className="flex justify-between text-[11px] font-bold uppercase tracking-tighter text-text-muted">
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-accent" />
                  Stars: {isLoading ? "..." : stats.stars}
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  Followers: {isLoading ? "..." : stats.followers}
                </div>
              </div>
            </div>
          </div>
        </TiltCard>
      </motion.div>

      {/* Socials Card (1x1) */}
      <motion.div
        variants={itemVariants}
        className="md:col-span-1 md:row-span-1 group"
      >
        <TiltCard className="p-1 glass-panel">
          <div className="grid grid-cols-2 gap-3 h-full p-6">
            {[
              { name: "LinkedIn", Icon: Globe, href: "https://linkedin.com/in/falah", color: "hover:bg-blue-600/10 hover:text-blue-400" },
              { name: "GitHub", Icon: GitHub, href: "https://github.com/Fals-Code", color: "hover:bg-white/10 hover:text-white" },
              { name: "Instagram", Icon: Instagram, href: "https://instagram.com/falahh.am", color: "hover:bg-pink-600/10 hover:text-pink-400" },
              { name: "Mail", Icon: Mail, href: "mailto:ahmadmathlaulfalah14@gmail.com", color: "hover:bg-accent/10 hover:text-accent" }
            ].map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                title={social.name}
                className={`flex items-center justify-center rounded-2xl border border-border bg-white/[0.02] transition-all duration-300 group ${social.color}`}
              >
                <social.Icon className="w-5 h-5 opacity-50 group-hover/card:opacity-100 group-hover:opacity-100 transition-opacity" />
              </a>
            ))}
          </div>
        </TiltCard>
      </motion.div>

      {/* Timeline Card (2x1) */}
      <motion.div
        variants={itemVariants}
        className="md:col-span-2 md:row-span-1 group"
      >
        <TiltCard className="p-1 glass-panel">
          <div className="p-10 h-full flex flex-col justify-between">
            <div className="flex items-center gap-4 mb-6">
              <div className="p-3 rounded-2xl bg-accent/5 border border-accent/20">
                <GraduationCap className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-xl font-bold font-syne">Education</h3>
            </div>
            
            <div className="relative pl-8 space-y-2 border-l border-border">
              <div className="absolute top-0 left-[-5.5px] w-2.5 h-2.5 rounded-full bg-accent shadow-[0_0_10px_rgba(232,83,58,0.5)]" />
              <p className="text-[11px] font-bold text-accent uppercase tracking-widest">2024 — Present</p>
              <h4 className="text-lg font-bold text-[var(--text)] leading-snug font-syne">
                D4 Teknik Informatika <br />
                <span className="text-neutral-500 font-medium">Universitas Airlangga</span>
              </h4>
            </div>
          </div>
        </TiltCard>
      </motion.div>

      {/* Main Stack Card (1x2) */}
      <motion.div
        variants={itemVariants}
        className="md:col-span-1 md:row-span-2 group"
      >
        <TiltCard className="p-1 glass-panel">
          <div className="p-10 h-full flex flex-col">
            <div className="flex items-center gap-3 mb-10">
              <div className="px-4 py-2 glass-panel rounded-full text-[11px] font-bold flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-accent" /> Surabaya, ID
            </div>
              <h3 className="font-bold text-lg uppercase tracking-tight font-syne">Mastery</h3>
            </div>
            
            <div className="space-y-6 flex-1">
              {[
                { name: "Laravel", color: "text-red-500" },
                { name: "MySQL", color: "text-blue-500" },
                { name: "JavaScript", color: "text-yellow-500" },
                { name: "TypeScript", color: "text-blue-400" },
                { name: "Git", color: "text-orange-500" },
                { name: "Docker", color: "text-blue-600" },
              ].map((tech) => (
                <div key={tech.name} className="flex items-center gap-4 group cursor-default">
                  <div className="w-1.5 h-1.5 rounded-full bg-border group-hover:bg-accent transition-colors" />
                  <div>
                    <p className="text-sm font-bold text-text-muted group-hover:text-[var(--text)] transition-colors">{tech.name}</p>
                    <div className="h-px w-0 group-hover:w-full bg-accent/30 transition-all duration-500 mt-1" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TiltCard>
      </motion.div>
      
      {/* Live Status Card (1x1) */}
      <motion.div
        variants={itemVariants}
        className="md:col-span-1 md:row-span-1 group"
      >
        <TiltCard className="p-1 glass-panel">
          <div className="p-8 h-full">
            <LiveStatus />
          </div>
        </TiltCard>
      </motion.div>
    </motion.div>
  );
}
