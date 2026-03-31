"use client";

import React from "react";
import Image from "next/image";
import { GlassPanel, GradientText, SectionLabel } from "@/components/ui/Primitives";
import { motion } from "framer-motion";

/**
 * Technical Stack / Toolbox Section
 */
export default function ToolsSection() {
  const tools = [
    { name: "PHP", icon: "php" },
    { name: "Laravel", icon: "laravel" },
    { name: "MySQL", icon: "mysql" },
    { name: "JavaScript", icon: "js" },
    { name: "TypeScript", icon: "ts" },
    { name: "React", icon: "react" },
    { name: "Next.js", icon: "nextjs" },
    { name: "Tailwind CSS", icon: "tailwind" },
    { name: "Git", icon: "git" },
    { name: "Docker", icon: "docker" },
    { name: "Postman", icon: "postman" },
    { name: "Vercel", icon: "vercel" },
  ];

  return (
    <section className="container mx-auto px-6 section-pad">
      <div className="space-y-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="max-w-2xl space-y-4">
            <SectionLabel>Tools & Technologies</SectionLabel>
            <h2 className="text-4xl md:text-5xl font-syne font-extrabold text-white">
              My Creative <GradientText>Toolbox</GradientText>
            </h2>
            <p className="text-text-muted text-lg leading-relaxed">
              Tools yang saya gunakan untuk mengubah ide menjadi solusi digital yang nyata.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 grid-airy">
          {tools.map((tool, idx) => (
            <motion.div
              key={tool.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.05 }}
              whileHover={{ scale: 1.05 }}
              className="group cursor-default"
            >
              <GlassPanel className="p-10 flex flex-col items-center justify-center gap-6 group-hover:border-accent transition-colors duration-500">
                <div className="relative w-16 h-16 group-hover:drop-shadow-[0_0_15px_rgba(232,83,58,0.3)] transition-all duration-500">
                  <Image 
                    src={`https://skillicons.dev/icons?i=${tool.icon}`} 
                    alt={tool.name} 
                    width={64} 
                    height={64} 
                    className="object-contain"
                  />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest text-text-muted group-hover:text-white transition-colors">
                  {tool.name}
                </span>
              </GlassPanel>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
