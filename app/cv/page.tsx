"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Mail, 
  MapPin, 
  Printer, 
  ArrowLeft, 
  Globe, 
  ExternalLink,
  Briefcase,
  GraduationCap,
  Code2,
  Database
} from "lucide-react";
import { GitHub, Instagram } from "@/components/ui/Icons";
import Link from "next/link";
import { SectionLabel } from "@/components/ui/Primitives";

export default function CVPage() {
  const handlePrint = () => window.print();

  return (
    <div className="min-h-screen bg-bg dark:bg-bg-card font-dm-sans py-20 px-8 print:p-0 print:bg-white print:text-black print:min-h-0 text-[var(--text)]">
      {/* UI Controls - Hidden on Print */}
      <div className="max-w-4xl mx-auto mb-10 flex items-center justify-between print:hidden">
        <Link href="/" className="flex items-center gap-2 text-text-muted hover:text-accent transition-all font-bold uppercase tracking-widest text-[10px]">
          <ArrowLeft className="w-4 h-4" /> Back to Site
        </Link>
        <button 
          onClick={handlePrint}
          className="flex items-center gap-2 px-6 py-3 bg-accent text-white rounded-2xl font-bold uppercase tracking-widest text-[10px] shadow-lg shadow-accent/20 hover:scale-105 transition-all"
        >
          <Printer className="w-4 h-4" /> Save as PDF / Print
        </button>
      </div>

      <motion.main 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto bg-bg-card dark:bg-neutral-900/50 p-12 md:p-20 rounded-[3rem] border border-black/5 dark:border-white/5 shadow-2xl print:shadow-none print:border-none print:p-0 print:bg-transparent print:rounded-none"
      >
        {/* Header Section */}
        <section className="border-b-2 border-accent/20 pb-12 mb-12 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="space-y-4">
             <h1 className="text-5xl md:text-6xl font-syne font-extrabold tracking-tighter text-[var(--text)] print:text-black">
                Ahmad Mathlaul <br />
                <span className="text-accent underline decoration-4 underline-offset-8">Falah.</span>
             </h1>
             <p className="text-xl font-bold text-text-muted uppercase tracking-[0.3em] print:text-neutral-600">
                Backend Developer
             </p>
          </div>
          
          <div className="grid grid-cols-1 gap-3 text-[12px] font-bold text-text-muted print:text-black">
             <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-accent" />
                <span>ahmadmathlaulfalah14@gmail.com</span>
             </div>
             <div className="flex items-center gap-3">
                <GitHub className="w-4 h-4 text-accent" />
                <span>github.com/Fals-Code</span>
             </div>
             <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-accent" />
                <span>Gresik — Surabaya, Indonesia</span>
             </div>
             <div className="flex items-center gap-3">
                <Globe className="w-4 h-4 text-accent" />
                <span>falah.com (Portfolio)</span>
             </div>
          </div>
        </section>

        {/* Profile Summary */}
        <section className="mb-16">
          <SectionLabel>Professional Summary</SectionLabel>
          <p className="text-lg leading-relaxed text-text-muted max-w-2xl print:text-black print:text-base">
            Highly skilled Backend Developer specializing in the **Laravel** ecosystem. Passionate about architecting robust, 
            high-performance database systems and write clean, scalable, and maintainable code. 
            Currently pursuing an Applied Science degree at Universitas Airlangga with a focus on core informatics and system precision.
          </p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
          {/* Main Content Column */}
          <div className="md:col-span-2 space-y-16">
             {/* Education */}
             <section>
                <SectionLabel>Education</SectionLabel>
                <div className="space-y-8">
                   <div className="relative pl-8 border-l border-accent/30">
                      <div className="absolute top-0 left-[-5.5px] w-2.5 h-2.5 rounded-full bg-accent" />
                      <p className="text-[10px] font-black text-accent uppercase tracking-widest mb-1">2024 — Present</p>
                      <h4 className="text-xl font-bold font-syne text-[var(--text)] print:text-black">Universitas Airlangga</h4>
                      <p className="text-sm font-bold text-text-muted">Applied Science (D4) in Informatics</p>
                      <p className="mt-4 text-sm text-text-muted italic print:text-black">Focusing on System Design, Data Structures, and Software Engineering.</p>
                   </div>
                </div>
             </section>

             {/* Projects */}
             <section>
                <SectionLabel>Featured Projects</SectionLabel>
                <div className="space-y-12">
                   <div className="space-y-3">
                      <h4 className="text-xl font-bold font-syne text-[var(--text)] print:text-black">RSHP – Hospital Info System</h4>
                      <p className="text-sm text-text-muted print:text-black leading-relaxed">
                         Developed a comprehensive patient registration and real-time medical scheduling platform using Laravel. 
                         Optimized queuing algorithms and data fetching to handle high-frequency hospital traffic.
                      </p>
                      <div className="flex gap-2 flex-wrap">
                         {['Laravel', 'MySQL', 'Real-time'].map(tag => (
                           <span key={tag} className="px-2 py-1 bg-accent/10 text-accent text-[9px] font-bold rounded-md">{tag}</span>
                         ))}
                      </div>
                   </div>

                   <div className="space-y-3">
                      <h4 className="text-xl font-bold font-syne text-[var(--text)] print:text-black">Warehouse Inventory System</h4>
                      <p className="text-sm text-text-muted print:text-black leading-relaxed">
                         Architected a centralized inventory management system. Implemented rigorous ACID compliance using database 
                         transactions to ensure data integrity during simultaneous multi-user stock updates.
                      </p>
                      <div className="flex gap-2 flex-wrap">
                         {['PHP', 'Transaction Locking', 'ACID'].map(tag => (
                           <span key={tag} className="px-2 py-1 bg-accent/10 text-accent text-[9px] font-bold rounded-md">{tag}</span>
                         ))}
                      </div>
                   </div>
                </div>
             </section>
          </div>

          {/* Sidebar Area Column */}
          <div className="space-y-16">
             {/* Tech Stack */}
             <section>
                <SectionLabel>Mastery</SectionLabel>
                <div className="grid grid-cols-1 gap-4">
                   {[
                     { name: "Laravel", level: "Expert", Icon: Code2 },
                     { name: "MySQL", level: "Advanced", Icon: Database },
                     { name: "Docker", level: "Intermediate", Icon: Globe },
                     { name: "Git", level: "Advanced", Icon: GitHub },
                     { name: "PHP", level: "Expert", Icon: Code2 },
                     { name: "TypeScript", level: "Learning", Icon: Code2 }
                   ].map((skill) => (
                      <div key={skill.name} className="flex items-center gap-3">
                         <div className="p-2 rounded-lg bg-black/5 dark:bg-white/5 border border-white/5">
                            <skill.Icon className="w-4 h-4 text-accent" />
                         </div>
                         <div>
                            <p className="text-xs font-bold text-[var(--text)] print:text-black">{skill.name}</p>
                            <p className="text-[10px] text-text-muted uppercase tracking-tighter">{skill.level}</p>
                         </div>
                      </div>
                   ))}
                </div>
             </section>

             {/* Languages */}
             <section>
                <SectionLabel>Communication</SectionLabel>
                <ul className="space-y-2 text-sm font-bold text-text-muted print:text-black">
                   <li className="flex justify-between border-b border-black/5 pb-1"><span>Bahasa Indonesia</span> <span className="text-accent">Native</span></li>
                   <li className="flex justify-between border-b border-black/5 pb-1"><span>English</span> <span className="text-accent">Working Proficiency</span></li>
                </ul>
             </section>
          </div>
        </div>

        <footer className="mt-20 pt-10 border-t border-black/5 dark:border-white/5 text-center text-[10px] text-text-muted print:hidden">
           <p className="font-bold opacity-30 uppercase tracking-[0.5em]">This document is dynamically generated from falah.com</p>
        </footer>
      </motion.main>

      <style jsx global>{`
        @media print {
          @page {
            size: A4;
            margin: 0;
          }
          nav, footer, .hide-on-print {
            display: none !important;
          }
          body {
            background-color: white !important;
            color: black !important;
          }
          .glass-panel {
            background: transparent !important;
            backdrop-filter: none !important;
            border: none !important;
            box-shadow: none !important;
          }
        }
      `}</style>
    </div>
  );
}
