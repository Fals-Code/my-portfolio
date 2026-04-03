"use client";

import React from "react";
import { services } from "@/data/services";
import { GlassPanel, GradientText } from "@/components/ui/Primitives";
import { Code, Database, Terminal, Rocket } from "lucide-react";

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
 * ULTRA-PERFORMANT Services Section for Mobile.
 * ZERO framer-motion imports. ZERO transition overhead.
 * Wrapped in React.memo to isolate it from Context-driven re-renders.
 */
const ServicesSectionStatic = React.memo(function ServicesSectionStatic() {
  return (
    <section className="container mx-auto px-6 py-24 bg-bg">
      <div className="space-y-12 max-w-7xl mx-auto">
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-5xl font-syne font-extrabold text-[var(--text)]">
            What I <GradientText>Do</GradientText>
          </h2>
          <p className="text-text-muted text-base md:text-lg max-w-2xl mx-auto">
            My core focus is on building robust and scalable backends that make frontend applications shine.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {services.map((service) => (
            <div key={service.id} className="h-full">
              <GlassPanel className="h-full p-8 flex flex-col items-center text-center bg-bg shadow-sm border-white/5">
                <div className="w-12 h-12 mb-6 rounded-full bg-accent/5 flex items-center justify-center">
                  <ServiceIcon name={service.icon} />
                </div>
                <h3 className="text-lg font-syne font-bold text-[var(--text)] mb-3">
                  {service.title}
                </h3>
                <p className="text-sm text-text-muted leading-relaxed">
                  {service.description}
                </p>
              </GlassPanel>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});

export default ServicesSectionStatic;
