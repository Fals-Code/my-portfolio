"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { 
  Database, 
  Server, 
  ShieldCheck, 
  Code2, 
  Terminal, 
  Zap,
  Cpu,
  Layers,
  Globe
} from "lucide-react";
import { usePerformance } from "@/hooks/usePerformance";
import { GlassPanel } from "./ui/Primitives";
import dynamic from "next/dynamic";

// Dynamic Import for heavy 3D components if any
const SkillsOrbit = dynamic(() => import("./ui/SkillsOrbit"), { 
    ssr: false,
    loading: () => <div className="w-full h-full bg-accent/5 rounded-[2.5rem]" />
});

// Performance-optimized animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  }
};

const lowPerfItemVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { duration: 0.3 }
    }
};

interface BentoItemProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  className?: string;
  isLow?: boolean;
}

const BentoItem = ({ title, description, icon, className = "", isLow }: BentoItemProps) => (
  <motion.div 
    variants={isLow ? lowPerfItemVariants : itemVariants}
    className={`group ${className}`}
  >
    <GlassPanel className="h-full p-6 md:p-8 flex flex-col gap-4 hover:border-accent/40 transition-colors duration-500">
      <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center text-accent group-hover:scale-110 transition-transform duration-500">
        {icon}
      </div>
      <div className="space-y-2">
        <h3 className="text-xl font-syne font-bold text-[var(--text)]">{title}</h3>
        <p className="text-sm text-text-muted leading-relaxed">{description}</p>
      </div>
    </GlassPanel>
  </motion.div>
);

export default function BentoGrid() {
  const { isLow, tier, isMobileDevice } = usePerformance();
  const MotionDiv = isMobileDevice ? "div" as any : motion.div;

  const skills = [
    {
      title: "Backend Core",
      description: "Expertise in PHP (Laravel) & Node.js for building robust server-side logic and RESTful APIs.",
      icon: <Server className="w-6 h-6" />,
      className: "md:col-span-2 md:row-span-1"
    },
    {
      title: "Architectural Patterns",
      description: "Implementing Clean Architecture, Repository Pattern, and SOLID principles for scalable systems.",
      icon: <Layers className="w-6 h-6" />,
      className: "md:col-span-1 md:row-span-1"
    },
    {
      title: "Database Management",
      description: "Proficient in SQL (MySQL/PostgreSQL) with focus on ACID compliance and optimization.",
      icon: <Database className="w-6 h-6" />,
      className: "md:col-span-1 md:row-span-2"
    },
    {
      title: "Security First",
      description: "Deep understanding of JWT, OAuth2, and web security best practices to protect user data.",
      icon: <ShieldCheck className="w-6 h-6" />,
      className: "md:col-span-2 md:row-span-1"
    },
    {
        title: "Performance Gated",
        description: "Applications designed to adapt based on device capabilities for zero-lag experience.",
        icon: <Zap className="w-6 h-6" />,
        className: "md:col-span-1 md:row-span-1"
    }
  ];

  return (
    <div className="w-full">
      <MotionDiv 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(180px,auto)]"
      >
        {/* Main interactive visualization or fallback */}
        <div className="md:col-span-2 md:row-span-2 relative min-h-[350px] overflow-hidden rounded-[2.5rem] bg-accent/5 border border-accent/10">
            {tier === "high" && !isMobileDevice ? (
                <SkillsOrbit />
            ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center space-y-6">
                    <div className="w-20 h-20 rounded-full bg-accent/10 flex items-center justify-center">
                        <Globe className="w-10 h-10 text-accent" />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-2xl font-syne font-bold text-[var(--text)]">Cloud Infrastructure</h3>
                        <p className="text-text-muted max-w-sm mx-auto">Deploying scalable backend services that connect global users with seamless performance.</p>
                    </div>
                </div>
            )}
        </div>

        {skills.map((skill, index) => (
          <BentoItem 
            key={index}
            {...skill}
            isLow={isLow}
          />
        ))}
      </MotionDiv>
    </div>
  );
}
