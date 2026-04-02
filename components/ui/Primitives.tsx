"use client";

import React from "react";
import { motion } from "framer-motion";
import { useSound } from "@/hooks/useSound";
import { Slot } from "@radix-ui/react-slot";
import { springSnappy, springBouncy } from "@/lib/motion-tokens";
import Magnetic from "./Magnetic";

export const SectionLabel = React.memo(({ children }: { children: React.ReactNode }) => (
  <div className="inline-flex items-center gap-3 mb-6">
    <div className="w-8 h-px bg-accent/30" />
    <span className="text-[12px] font-bold uppercase tracking-[0.25em] text-accent">
      {children}
    </span>
  </div>
));

export const GradientText = React.memo(({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <span className={`gradient-text ${className}`}>
    {children}
  </span>
));

export const GlassPanel = React.memo(({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <div className={`glass-panel p-8 rounded-[2.5rem] ${className}`}>
    {children}
  </div>
));

export const Button = React.memo(({ 
  children, 
  variant = "primary", 
  size = "md",
  asChild = false,
  onClick, 
  className = "" 
}: { 
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  asChild?: boolean;
  onClick?: (e?: React.MouseEvent) => void;
  className?: string;
}) => {
  const Comp = asChild ? Slot : motion.button;
  const { playHover, playClick } = useSound();
  
  const variants = {
    primary: "bg-accent text-white hover:bg-accent-hover shadow-lg shadow-accent/20",
    secondary: "bg-bg-card border border-black/10 dark:border-white/10 hover:bg-bg-hover text-text",
    outline: "border border-accent/40 text-accent hover:border-accent hover:bg-accent/5"
  };

  const sizes = {
    sm: "px-6 py-3 text-[11px]",
    md: "px-8 py-4 text-[12px]",
    lg: "px-10 py-5 text-base"
  };

  const motionProps = asChild ? {} : {
    whileHover: { scale: 1.02 },
    whileTap: { scale: 0.98 },
    transition: springSnappy // Snappy character for button feedback
  };

  const handleInteraction = (e: React.MouseEvent) => {
    playClick();
    if (onClick) onClick(e as any);
  };

  return (
    <Magnetic amount={0.15}>
      <Comp
        {...motionProps}
        onMouseEnter={() => playHover()}
        onClick={handleInteraction}
        className={`rounded-2xl font-bold transition-all uppercase tracking-[0.15em] inline-flex items-center justify-center ${variants[variant]} ${sizes[size]} ${className}`}
      >
        {children}
      </Comp>
    </Magnetic>
  );
});
