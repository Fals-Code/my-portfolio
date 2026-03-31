"use client";

import React from "react";
import { services } from "@/data/services";
import { GlassPanel, GradientText, SectionLabel } from "@/components/ui/Primitives";
import { Code, Database, Terminal, Rocket } from "lucide-react";
import { motion } from "framer-motion";

/**
 * Maps icon names to Lucide components.
 */
function ServiceIcon({ name }: { name: string }) {
  switch (name) {
    case "code": return <Code className="w-6 h-6 text-accent" />;
    case "database": return <Database className="w-6 h-6 text-accent" />;
    case "terminal": return <Terminal className="w-6 h-6 text-accent" />;
    case "rocket": return <Rocket className="w-6 h-6 text-accent" />;
    default: return <Code className="w-6 h-6 text-accent" />;
  }
}

/**
 * Professional Services Section with Airy Layout.
 */
export default function ServicesSection() {
  return (
    <section className="container mx-auto px-6 section-pad">
      <div className="space-y-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div className="max-w-2xl space-y-4">
            <SectionLabel>My Services</SectionLabel>
            <h2 className="text-4xl md:text-5xl font-syne font-extrabold text-white">
              How I Can Add Value To <GradientText>Your Project</GradientText>
            </h2>
            <p className="text-text-muted text-lg leading-relaxed">
              Dari arsitektur database hingga integrasi pihak ketiga, saya membangun solusi backend yang kuat dan terukur.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 grid-airy">
          {services.map((service, idx) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group/card"
            >
              <GlassPanel className="h-full group-hover/card:-translate-y-2 transition-transform duration-500 border-none bg-white/[0.03]">
                <div className="p-10 space-y-8">
                  <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center group-hover/card:bg-accent/20 transition-colors">
                    <ServiceIcon name={service.icon} />
                  </div>
                  <div className="space-y-4">
                    <h3 className="text-xl font-syne font-bold text-white group-hover/card:text-accent transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-sm text-text-muted leading-relaxed">
                      {service.description}
                    </p>
                  </div>
                </div>
              </GlassPanel>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
