"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import SkillBar from "./SkillBar";

type ElementCategory = "core" | "frontend" | "backend" | "database" | "tooling";

interface TechElement {
  id: string;
  symbol: string;
  name: string;
  number: number;
  category: ElementCategory;
  row: number;
  col: number;
  description: string;
}

// Category colors mapping
const categoryColors: Record<ElementCategory, { bg: string, border: string, text: string }> = {
  core: { bg: "rgba(255, 170, 0, 0.1)", border: "rgba(255, 170, 0, 0.5)", text: "#ffaa00" }, // Orange
  frontend: { bg: "rgba(77, 156, 255, 0.1)", border: "rgba(77, 156, 255, 0.5)", text: "#4d9cff" }, // Blue
  backend: { bg: "rgba(255, 92, 106, 0.1)", border: "rgba(255, 92, 106, 0.5)", text: "#ff5c6a" }, // Red
  database: { bg: "rgba(0, 229, 160, 0.1)", border: "rgba(0, 229, 160, 0.5)", text: "#00e5a0" }, // Green
  tooling: { bg: "rgba(160, 160, 160, 0.1)", border: "rgba(160, 160, 160, 0.5)", text: "#a0a0a0" }, // Gray
};

const elements: TechElement[] = [
  { id: "html", symbol: "Ht", name: "HTML5", number: 1, category: "core", row: 1, col: 1, description: "Semantic markup & structure" },
  { id: "css", symbol: "Cs", name: "CSS3", number: 2, category: "core", row: 1, col: 2, description: "Styling and layout" },
  { id: "js", symbol: "Js", name: "JavaScript", number: 3, category: "core", row: 1, col: 3, description: "Dynamic client-side logic" },
  { id: "ts", symbol: "Ts", name: "TypeScript", number: 4, category: "core", row: 1, col: 4, description: "Static typing for JS" },
  
  { id: "react", symbol: "Re", name: "React", number: 5, category: "frontend", row: 2, col: 1, description: "UI Component library" },
  { id: "next", symbol: "Nx", name: "Next.js", number: 6, category: "frontend", row: 2, col: 2, description: "React framework for production" },
  { id: "vue", symbol: "Vu", name: "Vue.js", number: 7, category: "frontend", row: 2, col: 3, description: "Progressive JS framework" },
  { id: "tw", symbol: "Tw", name: "Tailwind", number: 8, category: "frontend", row: 2, col: 4, description: "Utility-first CSS" },
  
  { id: "php", symbol: "Ph", name: "PHP", number: 9, category: "backend", row: 3, col: 1, description: "Server-side scripting" },
  { id: "laravel", symbol: "Lv", name: "Laravel", number: 10, category: "backend", row: 3, col: 2, description: "PHP Framework for Web Artisans" },
  { id: "node", symbol: "Nd", name: "Node.js", number: 11, category: "backend", row: 3, col: 3, description: "JS runtime environment" },
  { id: "express", symbol: "Ex", name: "Express", number: 12, category: "backend", row: 3, col: 4, description: "Fast node.js framework" },

  { id: "mysql", symbol: "My", name: "MySQL", number: 13, category: "database", row: 4, col: 1, description: "Relational database" },
  { id: "pg", symbol: "Pg", name: "PostgreSQL", number: 14, category: "database", row: 4, col: 2, description: "Advanced relational DB" },
  { id: "redis", symbol: "Rd", name: "Redis", number: 15, category: "database", row: 4, col: 3, description: "In-memory data store" },
  { id: "mongo", symbol: "Mo", name: "MongoDB", number: 16, category: "database", row: 4, col: 4, description: "NoSQL document database" },

  { id: "git", symbol: "Gt", name: "Git", number: 17, category: "tooling", row: 5, col: 1, description: "Version control system" },
  { id: "docker", symbol: "Dk", name: "Docker", number: 18, category: "tooling", row: 5, col: 2, description: "Containerization platform" },
  { id: "linux", symbol: "Lx", name: "Linux", number: 19, category: "tooling", row: 5, col: 3, description: "Server operating system" },
  { id: "postman", symbol: "Pm", name: "Postman", number: 20, category: "tooling", row: 5, col: 4, description: "API development tool" },
];

interface PeriodicTableProps {
  githubSkills?: {
    tech: string;
    icon: string;
    percentage: number;
    level: string;
    color: "GET" | "POST" | "PATCH" | "DELETE" | "PUT";
  }[];
}

export default function PeriodicTable({ githubSkills = [] }: PeriodicTableProps) {
  const [hoveredElement, setHoveredElement] = useState<TechElement | null>(null);
  const [lockedElement, setLockedElement] = useState<TechElement | null>(null);
  const [activeCategory, setActiveCategory] = useState<ElementCategory | null>(null);

  const displayElement = lockedElement || hoveredElement;
  
  const handleElementClick = (el: TechElement) => {
    if (lockedElement?.id === el.id) {
      setLockedElement(null); // Unlock
    } else {
      setLockedElement(el); // Lock
    }
  };

  return (
    <div className="w-full bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-4 md:p-8 flex flex-col md:flex-row gap-8 relative overflow-hidden shadow-2xl">
      {/* Background Decorative */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--patch)]/5 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
      
      {/* Table Grid (Left) */}
      <div className="flex-1 overflow-x-auto pb-4 md:pb-0 custom-scrollbar flex flex-col">
        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {(Object.keys(categoryColors) as ElementCategory[]).map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
              className="text-[10px] font-mono uppercase tracking-wider px-3 py-1.5 rounded transition-all duration-300 border"
              style={{
                backgroundColor: activeCategory === cat ? categoryColors[cat].bg : 'var(--bg)',
                borderColor: activeCategory === cat ? categoryColors[cat].text : 'var(--border)',
                color: activeCategory === cat ? categoryColors[cat].text : 'var(--muted)',
                boxShadow: activeCategory === cat ? `0 0 10px ${categoryColors[cat].text}40` : 'none'
              }}
            >
              {cat}
            </button>
          ))}
          {activeCategory && (
            <button 
              onClick={() => setActiveCategory(null)}
              className="text-[10px] font-mono uppercase tracking-wider px-3 py-1.5 rounded transition-all duration-300 border border-[var(--border)] text-[var(--muted)] hover:text-white"
            >
              Clear
            </button>
          )}
        </div>
        
        <div className="min-w-[500px] grid grid-cols-4 gap-2 md:gap-3">
          {elements.map((el) => {
            const colors = categoryColors[el.category];
            const isHovered = hoveredElement?.id === el.id;
            const isLocked = lockedElement?.id === el.id;
            const isActive = isHovered || isLocked;
            const isDimmed = activeCategory && activeCategory !== el.category;
            
            return (
              <motion.div
                key={el.id}
                onMouseEnter={() => !lockedElement && setHoveredElement(el)}
                onMouseLeave={() => !lockedElement && setHoveredElement(null)}
                onClick={() => handleElementClick(el)}
                className="relative p-2 border-[1.5px] rounded cursor-crosshair transition-all duration-300"
                style={{
                  backgroundColor: isActive ? colors.bg : 'var(--bg)',
                  borderColor: isActive ? colors.text : colors.border,
                  boxShadow: isActive ? `0 0 15px ${colors.text}40, inset 0 0 10px ${colors.bg}` : 'none',
                  zIndex: isActive ? 10 : 1,
                  opacity: isDimmed ? 0.3 : 1
                }}
                whileHover={{ scale: 1.05 }}
              >
                {/* Element Number */}
                <div className="absolute top-1 left-1.5 font-mono text-[8px] md:text-[10px]" style={{ color: colors.text, opacity: 0.7 }}>
                  {el.number}
                </div>
                
                {/* Symbol */}
                <div className="mt-3 md:mt-4 text-center font-syne font-bold text-xl md:text-3xl" style={{ color: colors.text }}>
                  {el.symbol}
                </div>
                
                {/* Name */}
                <div className="mt-1 md:mt-2 text-center font-mono text-[8px] md:text-[10px] truncate px-1" style={{ color: isActive ? '#fff' : 'var(--muted)' }}>
                  {el.name}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Info Panel (Right) */}
      <div className="w-full md:w-64 shrink-0 flex flex-col">
        <h3 className="font-mono text-xs text-[var(--muted)] uppercase tracking-widest border-b border-[var(--border)] pb-2 mb-4 flex justify-between items-center">
          <span>Element Inspector</span>
          {lockedElement && (
            <span className="text-[10px] bg-[var(--patch)]/10 text-[var(--patch)] px-2 py-0.5 rounded animate-pulse">LOCKED</span>
          )}
        </h3>
        
        <div className="flex-1 bg-[var(--bg)] border border-[var(--border)] rounded-lg p-5 flex flex-col items-center justify-center min-h-[250px] relative overflow-hidden">
          {displayElement ? (
            <motion.div 
              key={displayElement.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center w-full h-full relative z-10"
            >
              <div 
                className="w-20 h-20 md:w-24 md:h-24 border-2 rounded flex items-center justify-center mb-6 shadow-xl relative"
                style={{ 
                  borderColor: categoryColors[displayElement.category].text,
                  backgroundColor: categoryColors[displayElement.category].bg,
                  boxShadow: `0 0 30px ${categoryColors[displayElement.category].text}50`
                }}
              >
                <span className="font-syne font-bold text-4xl" style={{ color: categoryColors[displayElement.category].text }}>
                  {displayElement.symbol}
                </span>
                <span className="absolute top-1 left-1.5 font-mono text-[10px]" style={{ color: categoryColors[displayElement.category].text, opacity: 0.8 }}>
                  {displayElement.number}
                </span>
              </div>
              
              <h4 className="font-syne text-xl font-bold text-white mb-1">{displayElement.name}</h4>
              <div className="font-mono text-[10px] uppercase tracking-widest px-2 py-1 rounded mb-4" 
                   style={{ backgroundColor: categoryColors[displayElement.category].bg, color: categoryColors[displayElement.category].text }}>
                {displayElement.category}
              </div>
              
              <p className="text-xs text-center text-[var(--muted)] leading-relaxed">
                {displayElement.description}
              </p>
            </motion.div>
          ) : (
            <div className="flex flex-col w-full h-full relative z-10">
              <h4 className="font-mono text-[10px] text-[var(--patch)] uppercase tracking-widest mb-4 flex items-center justify-between border-b border-[var(--border)] pb-2">
                <span>Realtime GitHub Sync</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--patch)] animate-pulse" />
              </h4>
              
              <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-4">
                {githubSkills.length > 0 ? (
                  githubSkills.map((skill) => (
                    <SkillBar 
                      key={skill.tech}
                      techName={skill.tech} 
                      icon={skill.icon} 
                      percentage={skill.percentage} 
                      level={skill.level} 
                      colorMethod={skill.color} 
                    />
                  ))
                ) : (
                  <div className="flex flex-col items-center gap-4 mt-10">
                    <div className="text-center font-mono text-xs text-[var(--muted)] animate-pulse">
                      [ HOVER ELEMENT TO INSPECT ]
                    </div>
                  </div>
                )}
              </div>
              
              <div className="md:hidden flex items-center gap-2 text-[var(--patch)] animate-bounce mt-4 justify-center">
                <span className="font-mono text-[10px] uppercase tracking-tighter">Swipe table to explore</span>
              </div>
            </div>
          )}
          
          {/* Scanning lines effect on info panel */}
          <div className="absolute inset-0 pointer-events-none opacity-20 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] mix-blend-overlay" />
        </div>
      </div>
    </div>
  );
}
