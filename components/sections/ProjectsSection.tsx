"use client";

import React, { useState } from "react";
import Link from "next/link";
import { projects } from "@/data/projects";
import { GlassPanel, Button, GradientText, SectionLabel } from "@/components/ui/Primitives";
import { ExternalLink, ArrowRight, Hospital, Warehouse, Book, Rocket } from "lucide-react";
import { GitHub } from "@/components/ui/Icons";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Maps icon names to Lucide components for projects.
 */
function ProjectIcon({ name, color }: { name: string; color?: string }) {
  const props = { className: "w-6 h-6", style: { color } };
  switch (name) {
    case "hospital": return <Hospital {...props} />;
    case "warehouse": return <Warehouse {...props} />;
    case "book": return <Book {...props} />;
    case "rocket": return <Rocket {...props} />;
    default: return <Rocket {...props} />;
  }
}

/**
 * Filterable Projects Gallery with Airy Layout.
 */
export default function ProjectsSection() {
  const [filter, setFilter] = useState("All");
  const categories = ["All", "Laravel", "Full-stack", "WIP"];

  const filteredProjects = projects.filter(p => 
    filter === "All" || p.tags.some(t => t.toLowerCase() === filter.toLowerCase())
  );

  return (
    <section className="container mx-auto px-6 section-pad overflow-hidden">
      <div className="space-y-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="max-w-2xl space-y-4">
            <SectionLabel>Selected Work</SectionLabel>
            <h2 className="text-4xl md:text-5xl font-syne font-extrabold text-white">
              Innovation Through <GradientText>Code & Design</GradientText>
            </h2>
            <p className="text-text-muted text-lg leading-relaxed">
              Pameran proyek pilihan yang menunjukkan keahlian saya dalam arsitektur backend dan pengembangan sistem.
            </p>
          </div>
          
          <div className="flex gap-2 p-1 glass-panel rounded-2xl w-fit">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-6 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all duration-300 ${
                  filter === cat 
                    ? "bg-accent text-white shadow-lg shadow-accent/20" 
                    : "text-text-muted hover:text-white"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 grid-airy"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((proj) => (
              <motion.div
                key={proj.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                className="group"
              >
                <GlassPanel className={`h-full flex flex-col p-10 transition-all duration-500 overflow-hidden relative ${
                  proj.featured ? "border-accent/30 shadow-[0_0_40px_rgba(232,83,58,0.05)]" : ""
                }`}>
                  {/* Badge Overlay */}
                  {proj.badge && (
                    <div className={`absolute top-0 right-0 px-4 py-1 text-[9px] font-bold uppercase tracking-widest rounded-bl-xl z-10 ${
                      proj.badge === "featured" ? "bg-accent text-white" : "bg-amber-500 text-black"
                    }`}>
                      {proj.badge}
                    </div>
                  )}

                  <div className="flex-1 space-y-8">
                    {/* Icon & Tech */}
                    <div className="flex items-start justify-between">
                      <div 
                        className="w-16 h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500"
                        style={{ backgroundColor: proj.iconBg || "rgba(232,83,58,0.1)" }}
                      >
                        <ProjectIcon name={proj.icon || ""} color={proj.iconColor} />
                      </div>
                      <div className="flex gap-2">
                        <Link href={proj.github} target="_blank" className="p-3 glass-panel rounded-xl hover:text-accent transition-colors">
                          <GitHub className="w-5 h-5" />
                        </Link>
                      </div>
                    </div>

                    {/* Text */}
                    <div className="space-y-4">
                      <h3 className="text-2xl font-syne font-extrabold text-white group-hover:text-accent transition-colors leading-tight">
                        {proj.title}
                      </h3>
                      <p className="text-sm text-text-muted leading-relaxed">
                        {proj.description}
                      </p>
                    </div>

                    {/* Tech Tags */}
                    <div className="flex flex-wrap gap-2 pt-2">
                      {proj.tech?.map((t) => (
                        <span key={t} className="text-[10px] font-bold uppercase tracking-tighter text-accent/80 bg-accent/5 px-3 py-1 rounded-lg border border-accent/10">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-8 mt-8 border-t border-border flex items-center justify-between">
                    <Link 
                      href={proj.caseStudy || "/projects"} 
                      className="text-[10px] font-bold uppercase tracking-widest text-white hover:text-accent flex items-center gap-2 group/link transition-colors"
                    >
                      Read Case Study <ArrowRight className="w-3 h-3 group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                    {proj.demo && (
                      <Link href={proj.demo} target="_blank" className="p-2 text-text-muted hover:text-white transition-colors">
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    )}
                  </div>
                </GlassPanel>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
