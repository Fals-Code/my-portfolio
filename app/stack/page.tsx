"use client";

import React from "react";
import { motion } from "framer-motion";
import { GlassPanel, GradientText, SectionLabel } from "@/components/ui/Primitives";
import { 
  Monitor, 
  Terminal, 
  Cpu, 
  Settings, 
  Wind, 
  Cloud,
  Code2,
  Database,
  Globe
} from "lucide-react";

const stack = {
  software: [
    { name: "VS Code", desc: "Main code editor with extensions for Laravel and React.", icon: <Monitor className="w-5 h-5" /> },
    { name: "Laragon", desc: "Local development server for PHP and MySQL.", icon: <Cpu className="w-5 h-5" /> },
    { name: "Postman", desc: "API testing and documentation.", icon: <Globe className="w-5 h-5" /> },
    { name: "TablePlus", desc: "Modern and native database management.", icon: <Database className="w-5 h-5" /> },
    { name: "GitBash", desc: "Terminal and version control interface.", icon: <Terminal className="w-5 h-5" /> },
    { name: "DBeaver", desc: "Universal database tool for complex queries.", icon: <Database className="w-5 h-5" /> },
  ],
  devTools: [
    { name: "Laravel", desc: "Favorite PHP Framework for scale.", icon: <Wind className="w-5 h-5" /> },
    { name: "Next.js", desc: "React framework for high-performance frontends.", icon: <Cloud className="w-5 h-5" /> },
    { name: "Tailwind CSS", desc: "Rapid UI building with utility classes.", icon: <Globe className="w-5 h-5" /> },
    { name: "Docker", desc: "Containerization for consistent environments.", icon: <Settings className="w-5 h-5" /> },
  ]
};

export default function StackPage() {
  return (
    <div className="flex flex-col w-full min-h-screen pt-24 pb-32 px-6">
      <section className="container mx-auto max-w-4xl text-center mb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <SectionLabel>Tools & Kit</SectionLabel>
          <h1 className="text-4xl md:text-6xl font-syne font-extrabold text-[var(--text)]">
            My Creative <GradientText>Stack.</GradientText>
          </h1>
          <p className="text-text-muted text-lg max-w-2xl mx-auto">
            Kumpulan alat, perangkat lunak, dan teknologi yang saya gunakan sehari-hari untuk membangun arsitektur backend yang kokoh.
          </p>
        </motion.div>
      </section>

      <section className="container mx-auto max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Software & Apps */}
        <motion.div
           initial={{ opacity: 0, x: -20 }}
           whileInView={{ opacity: 1, x: 0 }}
           viewport={{ once: true }}
           className="space-y-8"
        >
           <h3 className="text-2xl font-syne font-bold flex items-center gap-3">
             <Code2 className="text-accent" /> Software & Apps
           </h3>
           <div className="grid grid-cols-1 gap-4">
              {stack.software.map((item) => (
                <GlassPanel key={item.name} className="p-6 flex items-start gap-4 hover:border-accent/30 transition-all">
                  <div className="p-3 rounded-xl bg-accent/10 text-accent">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-lg font-syne">{item.name}</h4>
                    <p className="text-sm text-text-muted">{item.desc}</p>
                  </div>
                </GlassPanel>
              ))}
           </div>
        </motion.div>

        {/* Development & OS */}
        <motion.div
           initial={{ opacity: 0, x: 20 }}
           whileInView={{ opacity: 1, x: 0 }}
           viewport={{ once: true }}
           className="space-y-8"
        >
           <h3 className="text-2xl font-syne font-bold flex items-center gap-3">
             <Settings className="text-blue-500" /> Dev & Ecosystem
           </h3>
           <div className="grid grid-cols-1 gap-4">
              {stack.devTools.map((item) => (
                <GlassPanel key={item.name} className="p-6 flex items-start gap-4 hover:border-blue-500/30 transition-all">
                  <div className="p-3 rounded-xl bg-blue-500/10 text-blue-400">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-lg font-syne">{item.name}</h4>
                    <p className="text-sm text-text-muted">{item.desc}</p>
                  </div>
                </GlassPanel>
              ))}
           </div>
        </motion.div>
      </section>
    </div>
  );
}
