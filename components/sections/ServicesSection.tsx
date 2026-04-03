"use client";

import React from "react";
import { services } from "@/data/services";
import { GlassPanel, GradientText } from "@/components/ui/Primitives";
import { Code, Database, Terminal, Rocket } from "lucide-react";
import { motion } from "framer-motion";
import { usePerformance } from "@/hooks/usePerformance";

/**
 * Maps icon names to Lucide components.
 */
function ServiceIcon({ name }: { name: string }) {
  switch (name) {
    case "code": return <Code className="w-5 h-5 text-accent" />;
    case "database": return <Database className="w-5 h-5 text-accent" />;
    case "terminal": return <Terminal className="w-5 h-5 text-accent" />;
    case "rocket": return <Rocket className="w-5 h-5 text-accent" />;
    default: return <Code className="w-5 h-5 text-accent" />;
  }
}

/**
 * Compact "What I Do" snippet for the Home page.
 */
export default function ServicesSection() {
  const { isLow } = usePerformance();
  return (
    <section className="container mx-auto px-6 py-24">
      <div className="space-y-12 max-w-7xl mx-auto">
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-5xl font-syne font-extrabold text-[var(--text)]">
            What I <GradientText>Do</GradientText>
          </h2>
          <p className="text-text-muted text-base md:text-lg max-w-2xl mx-auto">
            My core focus is on building robust and scalable backends that make frontend applications shine.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, idx) => (
            <motion.div
              key={service.id}
              initial={isLow ? false : { opacity: 0, y: 20 }}
              whileInView={isLow ? undefined : { opacity: 1, y: 0 }}
              animate={isLow ? { opacity: 1, y: 0 } : undefined}
              viewport={{ once: true }}
              transition={isLow ? { duration: 0.1 } : { delay: idx * 0.1, duration: 0.5 }}
              className="group h-full"
            >
              <GlassPanel className="h-full p-8 group-hover:-translate-y-2 transition-transform duration-300 flex flex-col items-center text-center">
                <div className="w-12 h-12 mb-6 rounded-full bg-accent/5 flex items-center justify-center group-hover:bg-accent/20 group-hover:scale-110 transition-all">
                  <ServiceIcon name={service.icon} />
                </div>
                <h3 className="text-lg font-syne font-bold text-[var(--text)] mb-3 group-hover:text-accent transition-colors">
                  {service.title}
                </h3>
                <p className="text-sm text-text-muted leading-relaxed">
                  {service.description}
                </p>
              </GlassPanel>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
