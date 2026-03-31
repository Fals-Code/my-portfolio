"use client";

import { motion } from "framer-motion";
import { 
  ExternalLink, 
  Globe, 
  Mail, 
  MessageCircle, 
  Share2, 
  Code2, 
  Cpu, 
  Layers, 
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

// Using icons from Lucide that are definitely available in common versions
// If brands are missing, we'll use fallbacks

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
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
    },
  },
};

export default function BentoGrid() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-7xl mx-auto p-4 md:p-8"
    >
      {/* Profile Card (2x2) */}
      <motion.div
        variants={itemVariants}
        className="md:col-span-2 md:row-span-2 bento-card p-10 flex flex-col justify-between group"
      >
        <div className="space-y-8">
          <div className="flex items-start justify-between">
            <div className="relative w-28 h-28 rounded-3xl overflow-hidden border-2 border-card-border group-hover:border-blue-500/30 transition-colors">
              {/* Fallback image if /assets/imgs/falah.jpeg is missing */}
              <div className="absolute inset-0 bg-neutral-900 flex items-center justify-center">
                <User className="w-12 h-12 text-neutral-700" />
              </div>
              <Image 
                src="/assets/imgs/falah.jpeg" 
                alt="Ahmad Mathlaul Falah" 
                fill 
                className="object-cover group-hover:scale-110 transition-transform duration-700"
                unoptimized // Just in case the file isn't in public yet
              />
            </div>
            <div className="px-4 py-2 rounded-full border border-green-500/20 bg-green-500/5 text-[10px] font-bold uppercase tracking-widest text-green-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Available for Work
            </div>
          </div>
          
          <div className="space-y-4">
            <h1 className="text-5xl font-bold tracking-tight text-white leading-tight">
              Ahmad Mathlaul <br />
              <span className="text-neutral-500">Falah</span>
            </h1>
            <p className="text-xl text-neutral-400 font-medium">
              Backend Developer
            </p>
            <p className="text-neutral-500 leading-relaxed max-w-md">
              Fokus pada arsitektur backend, clean code, dan pembangunan sistem scalable menggunakan Laravel.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mt-12">
          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl border border-card-border bg-white/[0.02] text-sm text-neutral-400">
            <MapPin className="w-4 h-4 text-blue-400" />
            Gresik — Surabaya, ID
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-2xl border border-card-border bg-white/[0.02] text-sm text-neutral-400">
            <Briefcase className="w-4 h-4 text-purple-400" />
            Backend Precision
          </div>
        </div>
      </motion.div>

      {/* Featured Project (2x1) */}
      <motion.div
        variants={itemVariants}
        className="md:col-span-2 md:row-span-1 bento-card group cursor-pointer overflow-hidden"
      >
        <div className="p-10 h-full flex flex-col justify-between relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-400">Featured Project</span>
              <div className="h-px w-8 bg-blue-500/30" />
            </div>
            <h3 className="text-3xl font-bold text-white group-hover:text-blue-400 transition-colors">RSHP – Hospital Info System</h3>
            <p className="mt-3 text-neutral-400 max-w-sm">Digitalisasi registrasi pasien dan jadwal dokter real-time.</p>
          </div>
          
          <div className="flex items-center gap-3">
            {['Laravel', 'MySQL', 'Eloquent'].map(tag => (
              <span key={tag} className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] font-medium text-neutral-300">
                {tag}
              </span>
            ))}
          </div>

          <div className="absolute top-10 right-10 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
            <div className="p-3 rounded-full bg-blue-500 text-white shadow-lg shadow-blue-500/20">
              <ArrowUpRight className="w-5 h-5" />
            </div>
          </div>
        </div>
        {/* Abstract Deco */}
        <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-blue-500/5 rounded-full blur-[80px] group-hover:bg-blue-500/10 transition-colors" />
      </motion.div>

      {/* GitHub Stats (1x1) */}
      <motion.div
        variants={itemVariants}
        className="md:col-span-1 md:row-span-1 bento-card p-8 flex flex-col justify-between group"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-500">GitHub Stats</h3>
          <Terminal className="w-5 h-5 text-neutral-600 group-hover:text-white transition-colors" />
        </div>
        <div className="space-y-4">
          <div className="flex items-end justify-between">
            <span className="text-4xl font-bold text-white">12+</span>
            <span className="text-[10px] text-neutral-600 mb-1">Repos</span>
          </div>
          <div className="h-1 w-full bg-neutral-800 rounded-full overflow-hidden">
            <div className="h-full w-2/3 bg-blue-500/50" />
          </div>
          <div className="flex justify-between text-[10px] font-medium text-neutral-500">
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-yellow-500/50" />
              Stars: 5
            </div>
            <div className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-purple-500/50" />
              Followers: 8
            </div>
          </div>
        </div>
      </motion.div>

      {/* Socials Card (1x1) */}
      <motion.div
        variants={itemVariants}
        className="md:col-span-1 md:row-span-1 bento-card p-4"
      >
        <div className="grid grid-cols-2 gap-2 h-full">
          {[
            { name: "LinkedIn", Icon: Globe, color: "hover:bg-blue-600/10 hover:text-blue-400" },
            { name: "GitHub", Icon: Globe, color: "hover:bg-white/10 hover:text-white" },
            { name: "Instagram", Icon: MessageCircle, color: "hover:bg-pink-600/10 hover:text-pink-400" },
            { name: "Mail", Icon: Mail, color: "hover:bg-red-600/10 hover:text-red-400" }
          ].map((social) => (
            <a
              key={social.name}
              href="#"
              className={`flex items-center justify-center rounded-2xl border border-card-border bg-white/[0.01] transition-all group ${social.color}`}
            >
              <social.Icon className="w-5 h-5 opacity-50 group-hover:opacity-100 transition-opacity" />
            </a>
          ))}
        </div>
      </motion.div>

      {/* Timeline Card (2x1) */}
      <motion.div
        variants={itemVariants}
        className="md:col-span-2 md:row-span-1 bento-card p-10 flex flex-col justify-between"
      >
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/20">
            <GraduationCap className="w-6 h-6 text-purple-400" />
          </div>
          <h3 className="text-xl font-bold">Education</h3>
        </div>
        
        <div className="relative pl-8 space-y-2 border-l border-neutral-800">
          <div className="absolute top-0 left-[-5px] w-2.5 h-2.5 rounded-full bg-purple-500" />
          <p className="text-sm font-bold text-neutral-400">2024 — Present</p>
          <h4 className="text-lg font-bold text-white leading-snug">
            D4 Teknik Informatika <br />
            <span className="text-neutral-500 font-medium">Universitas Airlangga</span>
          </h4>
        </div>
      </motion.div>

      {/* Stack Card (1x2) */}
      <motion.div
        variants={itemVariants}
        className="md:col-span-1 md:row-span-2 bento-card p-10 flex flex-col"
      >
        <div className="flex items-center gap-3 mb-10">
          <div className="p-2 bg-blue-500/10 rounded-lg">
            <Code2 className="w-5 h-5 text-blue-400" />
          </div>
          <h3 className="font-bold text-lg uppercase tracking-tight">Main Stack</h3>
        </div>
        
        <div className="space-y-6 flex-1">
          {[
            { name: "PHP / Laravel", icon: <Database className="w-4 h-4" /> },
            { name: "MySQL", icon: <Database className="w-4 h-4" /> },
            { name: "JavaScript", icon: <Terminal className="w-4 h-4" /> },
            { name: "Git", icon: <GitBranch className="w-4 h-4" /> },
            { name: "Docker", icon: <Box className="w-4 h-4" /> },
          ].map((tech) => (
            <div key={tech.name} className="flex items-center gap-4 group cursor-default">
              <div className="w-10 h-10 rounded-xl border border-card-border bg-white/[0.02] flex items-center justify-center group-hover:border-blue-500/50 group-hover:bg-blue-500/5 transition-all">
                <span className="text-neutral-600 group-hover:text-blue-400 transition-colors">{tech.icon}</span>
              </div>
              <div>
                <p className="text-sm font-bold text-neutral-300 group-hover:text-white transition-colors">{tech.name}</p>
                <div className="h-0.5 w-0 group-hover:w-full bg-blue-500/30 transition-all duration-300 mt-1" />
              </div>
            </div>
          ))}
        </div>
      </motion.div>
      
      {/* Bio / Philosophy (1x1) - Filler to make it look even */}
      <motion.div
        variants={itemVariants}
        className="md:col-span-1 md:row-span-1 bento-card p-8 flex flex-col justify-center gap-4 group"
      >
         <h3 className="text-neutral-600 text-[10px] font-bold uppercase tracking-widest group-hover:text-purple-400 transition-colors">Philosophy</h3>
         <p className="text-sm text-neutral-500 italic leading-relaxed">
           "Crafting Digital Experiences with Backend Precision."
         </p>
      </motion.div>
    </motion.div>
  );
}
