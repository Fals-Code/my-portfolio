"use client";

import React from "react";
import { motion } from "framer-motion";
import { useSound } from "@/hooks/useSound";
import { usePerformance } from "@/hooks/usePerformance";
import { Slot } from "@radix-ui/react-slot";
import { springSnappy } from "@/lib/motion-tokens";
import Magnetic from "./Magnetic";

export const SectionLabel = React.memo(({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <div className={`inline-flex items-center gap-3 mb-6 ${className}`} role="doc-subtitle">
    <span className="text-sm font-bold uppercase tracking-[0.2em] text-accent">
      {children}
    </span>
    <div className="w-8 h-[1px] bg-accent/30" aria-hidden="true" />
  </div>
));

export const RevealText = React.memo(({ 
  children, 
  delay = 0,
  className = "" 
}: { 
  children: React.ReactNode, 
  delay?: number,
  className?: string 
}) => {
  const { isLow } = usePerformance();
  
  if (isLow) return <div className={className}>{children}</div>;

  const lines = React.Children.toArray(children);

  return (
    <div className={className}>
      {lines.map((line, i) => (
        <span key={i} className="mask-reveal block">
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ 
              duration: 0.6, 
              ease: "easeOut",
              delay: delay + (i * 0.05)
            }}
            className="mask-reveal-inner"
          >
            {line}
          </motion.span>
        </span>
      ))}
    </div>
  );
});

export const GradientText = React.memo(({ 
  children, 
  className = "",
  variant = "silver"
}: { 
  children: React.ReactNode, 
  className?: string,
  variant?: "silver" | "accent"
}) => {
  return (
    <span className={`text-white ${className}`}>
      {children}
    </span>
  );
});

export const GlassPanel = React.memo(({ 
  children, 
  className = "",
  hoverEffect = true 
}: { 
  children: React.ReactNode, 
  className?: string,
  hoverEffect?: boolean
}) => {
  const { isLow } = usePerformance();
  
  return (
    <div className={`rounded-xl border border-white/10 bg-white/[0.02] backdrop-blur-sm transition-all duration-300 ${hoverEffect ? "hover:bg-white/[0.04] hover:border-white/20" : ""} ${className}`}>
      {children}
    </div>
  );
});

export const EditorialHeading = React.memo(({ 
  children, 
  sub, 
  className = "" 
}: { 
  children: React.ReactNode, 
  sub?: string,
  className?: string 
}) => (
  <div className={`space-y-4 ${className}`}>
    {sub && (
      <motion.div 
        initial={{ opacity: 0, x: -10 }}
        whileInView={{ opacity: 1, x: 0 }}
        className="text-[10px] font-bold uppercase tracking-[0.5em] text-accent/80 flex items-center gap-3"
      >
        <span className="w-8 h-px bg-accent/40" />
        {sub}
      </motion.div>
    )}
    <h2 className="text-4xl md:text-6xl font-serif italic text-white tracking-tight leading-[1.1]">
      {children}
    </h2>
  </div>
));

export const InteractiveContainer = React.memo(({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <motion.div
    whileHover={{ scale: 1.01 }}
    whileTap={{ scale: 0.99 }}
    transition={springSnappy}
    className={className}
  >
    {children}
  </motion.div>
));

export const Button = React.memo(({ 
  children, 
  variant = "primary", 
  size = "md",
  asChild = false,
  onClick, 
  disabled = false,
  ariaLabel,
  className = "" 
}: { 
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  asChild?: boolean;
  onClick?: (e?: React.MouseEvent) => void;
  disabled?: boolean;
  ariaLabel?: string;
  className?: string;
}) => {
  const { isLow } = usePerformance();
  const Comp = asChild ? Slot : (isLow ? "button" : motion.button);
  const { playHover, playClick } = useSound();
  
  const variants = {
    primary: "bg-white text-black hover:not-disabled:bg-neutral-200 active:scale-[0.98]",
    secondary: "bg-accent text-white hover:not-disabled:bg-accent-hover active:scale-[0.98]",
    outline: "border border-white/20 text-white hover:not-disabled:border-white/50 hover:not-disabled:bg-white/5 active:scale-[0.98]",
    ghost: "text-white/70 hover:not-disabled:text-white active:scale-[0.98]"
  };

  const sizes = {
    sm: "px-5 py-2.5 text-xs",
    md: "px-8 py-3.5 text-sm",
    lg: "px-10 py-5 text-base"
  };

  const handleInteraction = (e: React.MouseEvent) => {
    if (disabled) return;
    playClick();
    if (onClick) onClick(e as any);
  };

  return (
    <Magnetic amount={0.03} disabledOnMobile={true} disabled={disabled}>
      <Comp
        onMouseEnter={() => !isLow && !disabled && playHover()}
        onClick={handleInteraction}
        disabled={disabled}
        aria-label={ariaLabel}
        className={`rounded-xl font-bold transition-all duration-200 uppercase tracking-widest inline-flex items-center justify-center gap-3 whitespace-nowrap disabled:opacity-40 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
      >
        {children}
      </Comp>
    </Magnetic>
  );
});

