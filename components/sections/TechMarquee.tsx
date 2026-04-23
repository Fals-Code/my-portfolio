"use client";

import React from "react";
import { motion } from "framer-motion";

const TECH_STACK = [
  { name: "Next.js", icon: "https://skillicons.dev/icons?i=nextjs" },
  { name: "React", icon: "https://skillicons.dev/icons?i=react" },
  { name: "TypeScript", icon: "https://skillicons.dev/icons?i=ts" },
  { name: "Laravel", icon: "https://skillicons.dev/icons?i=laravel" },
  { name: "MySQL", icon: "https://skillicons.dev/icons?i=mysql" },
  { name: "PostgreSQL", icon: "https://skillicons.dev/icons?i=postgres" },
  { name: "Tailwind", icon: "https://skillicons.dev/icons?i=tailwind" },
  { name: "Docker", icon: "https://skillicons.dev/icons?i=docker" },
  { name: "Node.js", icon: "https://skillicons.dev/icons?i=nodejs" },
  { name: "Git", icon: "https://skillicons.dev/icons?i=git" },
];

export default function TechMarquee() {
  const displayItems = [...TECH_STACK, ...TECH_STACK];

  return (
    <div className="py-12 border-y border-white/[0.03] overflow-hidden bg-white/[0.01]">
      <div className="relative flex overflow-x-hidden">
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            duration: 40,
            repeat: Infinity,
            ease: "linear",
          }}
          className="flex whitespace-nowrap gap-20 items-center"
        >
          {displayItems.map((tech, i) => (
            <div 
              key={i} 
              className="flex items-center gap-4 opacity-20 hover:opacity-100 transition-opacity duration-500 cursor-default group"
            >
              <img 
                src={tech.icon} 
                alt={tech.name} 
                className="w-5 h-5 grayscale group-hover:grayscale-0 transition-all" 
              />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white">
                {tech.name}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
