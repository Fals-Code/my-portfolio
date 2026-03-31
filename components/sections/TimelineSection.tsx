"use client";

import React from "react";
import { timeline } from "@/data/timeline";
import { GlassPanel, GradientText } from "@/components/ui/Primitives";
import { GraduationCap, Briefcase, Calendar } from "lucide-react";
import { motion } from "framer-motion";

/**
 * Vertical Timeline Section
 */
export default function TimelineSection() {
  return (
    <section className="container mx-auto px-6 section-pad">
      <div className="grid grid-cols-1 lg:grid-cols-2 grid-airy">
        <div className="space-y-4 mb-16 text-center">
          <h2 className="text-3xl md:text-5xl font-syne font-extrabold text-white">
            My <GradientText>Journey</GradientText>
          </h2>
          <p className="text-text-muted text-sm uppercase tracking-widest font-bold">Education & Projects</p>
        </div>

        <div className="relative space-y-12">
          {/* Timeline Line */}
          <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-border to-transparent -translate-x-1/2" />

          {timeline.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: idx % 2 === 0 ? -20 : 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className={`relative flex flex-col md:flex-row gap-8 items-center ${
                idx % 2 === 0 ? "md:flex-row-reverse" : ""
              }`}
            >
              {/* Timeline Dot */}
              <div className="absolute left-0 md:left-1/2 top-8 w-4 h-4 bg-accent rounded-full border-4 border-bg-card -translate-x-1/2 z-10 shadow-[0_0_15px_rgba(232,83,58,0.5)]" />

              {/* Content Card */}
              <div className="w-full md:w-1/2 group">
                <GlassPanel className="p-8 group-hover:border-accent transition-colors duration-500 bg-white/[0.02]">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3 text-accent font-bold text-xs uppercase tracking-widest">
                      <Calendar className="w-3.5 h-3.5" />
                      {item.date}
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-xl font-syne font-bold text-white group-hover:text-accent transition-colors">
                        {item.title}
                      </h3>
                      <p className="text-sm font-bold text-text-muted">{item.place}</p>
                    </div>
                    <p className="text-sm text-text-muted leading-relaxed italic">
                      {item.description}
                    </p>
                  </div>
                </GlassPanel>
              </div>

              {/* Spacer for 2nd column */}
              <div className="hidden md:block w-1/2" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
