"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { fadeReveal } from "@/lib/motion-tokens";
import { 
  MapPin, 
  GraduationCap, 
  Briefcase, 
  Download, 
  Terminal, 
  Database,
  Code2,
  GitBranch,
  Layers,
  Server,
  Coffee,
  Gamepad2,
  BookOpen,
  Italic
} from "lucide-react";
import { GlassPanel, GradientText, Button } from "@/components/ui/Primitives";
import TiltCard from "@/components/ui/TiltCard";

const timeline = [
  {
    id: "edu-unair",
    year: "2024 — Present",
    title: "D4 Teknik Informatika",
    place: "Universitas Airlangga",
    desc: "Memperdalam pemahaman tentang arsitektur perangkat lunak, algoritma struktur data tingkat lanjut, serta praktek rekayasa backend secara profesional."
  },
  {
    id: "proj-rshp",
    year: "2025",
    title: "Hospital Info System (RSHP)",
    place: "Academic Project",
    desc: "Mengembangkan sistem manajemen antrian pasien dan jadwal dokter secara real-time yang meminimalisir tabrakan jadwal dengan Laravel."
  },
  {
    id: "proj-warehouse",
    year: "2025",
    title: "Warehouse Inventory System",
    place: "Academic Project",
    desc: "Fokus pada integrasi database terpusat yang memanfaatkan mekanisme 'Database Transactions' untuk menjamin keamanan update multi-tabel serentak."
  }
];

export default function AboutPage() {
  return (
    <div className="flex flex-col w-full min-h-screen overflow-x-hidden pt-16 md:pt-10 pb-32">
      
      {/* 1. Deep Dive Hero */}
      <section className="container mx-auto px-6 mb-24 max-w-4xl text-center">
        <motion.div 
          initial="hidden" 
          animate="visible" 
          variants={fadeReveal} 
          className="space-y-8"
        >
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-accent/20 bg-accent/5 text-[10px] uppercase tracking-[0.2em] font-bold text-accent">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            The Mind Behind The Code
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-[4.5rem] font-syne font-extrabold leading-[1] text-[var(--text)] tracking-tight">
            Crafting digital backbones <br className="hidden md:block" />
            <span className="text-text-muted italic font-medium text-[0.8em]">with intention.</span>
          </h1>
        </motion.div>
      </section>

      {/* 2. Background and Identity Bento */}
      <section className="container mx-auto px-6 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
          
          {/* Persona Card (Col span 5) */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="md:col-span-5"
          >
           <TiltCard className="p-1 glass-panel h-full group bg-gradient-to-br from-white/[0.05] to-transparent">
             <div className="relative w-full h-[450px] md:h-full min-h-[450px] rounded-[2rem] overflow-hidden">
               <div className="absolute inset-0 bg-accent/10 mix-blend-overlay z-10 group-hover:bg-transparent transition-colors duration-700" />
               <Image 
                  src="/assets/imgs/falah.jpeg" 
                  alt="Ahmad Mathlaul Falah" 
                  fill 
                  priority
                  quality={60}
                  sizes="(max-width: 768px) 100vw, 500px"
                  className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700"
               />
               <div className="absolute bottom-6 left-6 right-6 z-20">
                  <div className="glass-panel p-6 rounded-3xl backdrop-blur-xl bg-black/60 border-white/10 space-y-4">
                    <h3 className="text-2xl font-syne font-bold text-white">Ahmad Mathlaul Falah</h3>
                    <p className="text-sm text-white/70 font-medium italic">Mahasiswa D4 Teknik Informatika Universitas Airlangga.</p>
                    <div className="h-px w-full bg-white/10" />
                    <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-widest text-accent">
                       <span className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5" /> Surabaya</span>
                       <span className="flex items-center gap-2"><Briefcase className="w-3.5 h-3.5" /> Backend Dev</span>
                    </div>
                  </div>
               </div>
             </div>
           </TiltCard>
          </motion.div>

          {/* Core Philosophy & Background (Col span 7) */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="md:col-span-7 space-y-6 md:space-y-8 flex flex-col"
          >
             <TiltCard className="p-1 glass-panel flex-1 bg-white/[0.01]">
                <div className="p-8 md:p-12 h-full flex flex-col justify-center space-y-6">
                   <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4">
                     <Terminal className="w-5 h-5 text-text-muted" />
                   </div>
                   <h2 className="text-2xl md:text-3xl font-syne font-bold text-[var(--text)] leading-tight">
                     Pondasi <GradientText>Clean Architecture.</GradientText>
                   </h2>
                   <p className="text-base md:text-lg text-text-muted leading-relaxed font-medium">
                     Perjalanan saya di Universitas Airlangga mengajarkan bahwa kode yang baik bukan hanya tentang membuat aplikasi berjalan, tapi tentang mendesain sistem yang kokoh dan mudah di <strong>maintenance</strong> untuk masa depan.
                   </p>
                   <p className="text-base text-text-muted/80 leading-relaxed italic border-l-2 border-accent/40 pl-6 py-2">
                     "Fokus utama saya selalu pada ekosistem backend. Merancang struktur <strong>database</strong> yang aman (ACID compliance), membangun RESTful API yang terstruktur, dan memastikan arsitektur Laravel yang <strong>scalable</strong>."
                   </p>
                </div>
             </TiltCard>

             {/* Beyond The Screen - Hobbies / Interests */}
             <TiltCard className="p-1 glass-panel">
                <div className="p-8 md:p-10 space-y-8 border border-white/5">
                   <div className="flex items-center gap-3 border-b border-black/10 dark:border-white/10/50 pb-4">
                      <h3 className="text-sm font-bold uppercase tracking-widest text-accent flex items-center gap-2">
                        <BookOpen className="w-4 h-4" /> Beyond The Screen
                      </h3>
                   </div>
                   <p className="text-text-muted text-base">Saat saya sedang tidak berkutat dengan kode dan terminal, saya biasanya menghabiskan waktu dengan:</p>
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="flex items-start gap-4 p-5 rounded-2xl glass-panel group hover:border-accent/40 transition-colors">
                        <div className="p-2.5 rounded-xl bg-accent/20 group-hover:bg-accent/30 text-accent transition-colors">
                          <Coffee className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-[var(--text)] font-syne text-lg">Kulineran</h4>
                          <p className="text-sm text-text-muted mt-1 leading-relaxed">Mengeksplorasi kopi dan kuliner lokal baru untuk <strong>recharge</strong> inspirasi.</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-4 p-5 rounded-2xl glass-panel group hover:border-blue-500/40 transition-colors">
                        <div className="p-2.5 rounded-xl bg-blue-500/20 group-hover:bg-blue-500/30 text-blue-400 transition-colors">
                          <Gamepad2 className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-[var(--text)] font-syne text-lg">Pro Evolution Soccer 21</h4>
                          <p className="text-sm text-text-muted mt-1 leading-relaxed">Mengasah mental taktikal dan istirahat sejenak lewat mode <strong>Local Match</strong> alias <i>Bantai-bantai player lain</i> di PES 21.</p>
                        </div>
                      </div>
                   </div>
                </div>
             </TiltCard>
          </motion.div>

          {/* Experience Vertical Timeline (Full Width below) */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="md:col-span-12 mt-8"
          >
             <TiltCard className="p-1 glass-panel">
                <div className="p-10 md:p-14 border border-[var(--border)] flex flex-col items-start bg-[var(--bg)]/10">
                   <div className="flex flex-col md:flex-row md:items-center w-full justify-between gap-6 mb-16 border-b border-[var(--border)] pb-8">
                      <div className="flex items-center gap-4">
                        <div className="p-3.5 rounded-2xl bg-accent/10 border border-accent/20">
                           <GraduationCap className="w-7 h-7 text-accent" />
                        </div>
                        <div>
                           <h3 className="text-3xl font-syne font-extrabold text-[var(--text)]">The Timeline</h3>
                           <p className="text-accent text-[11px] font-bold uppercase tracking-widest mt-2">Edu & Projects</p>
                        </div>
                      </div>
                   </div>

                   <div className="relative pl-6 md:pl-8 space-y-16 md:space-y-20 before:absolute before:inset-0 before:ml-[7px] md:before:ml-[11px] before:-translate-x-px md:before:translate-x-0 before:h-full before:w-[2px] before:bg-gradient-to-b before:from-accent before:via-accent/20 before:to-transparent">
                      {timeline.map((item, i) => (
                         <div key={item.id} className="relative group flex flex-col md:flex-row gap-6 md:gap-12">
                            {/* Timeline Node - Increased hit-zone for mobile accessibility (48px) */}
                            <div className="absolute -left-[38px] md:-left-[47px] mt-0.5 w-[48px] h-[48px] flex items-center justify-center">
                               <div className="w-4 h-4 rounded-full bg-accent border-[3px] border-bg shadow-[0_0_15px_rgba(232,83,58,0.5)] group-hover:scale-125 transition-transform" />
                            </div>
                            
                            {/* Left Side: Date/Place metadata */}
                            <div className="w-full md:w-1/3 shrink-0 flex flex-col gap-3">
                               <span className="self-start text-[10px] md:text-sm font-bold uppercase tracking-widest text-accent bg-accent/10 px-4 py-1.5 rounded-full border border-accent/20">{item.year}</span>
                               <p className="text-base font-bold text-neutral-400 font-syne group-hover:text-[var(--text)] transition-colors">{item.place}</p>
                            </div>

                            {/* Right Side: Content */}
                            <div className="space-y-4 pt-1 md:pt-0">
                               <h4 className="text-2xl md:text-3xl font-syne font-extrabold text-[var(--text)] leading-tight">
                                  {item.title}
                               </h4>
                               <p className="text-base md:text-lg text-text-muted leading-relaxed max-w-3xl">
                                  {item.desc}
                               </p>
                            </div>
                         </div>
                      ))}
                   </div>
                </div>
             </TiltCard>
          </motion.div>

        </div>
      </section>
      
    </div>
  );
}
