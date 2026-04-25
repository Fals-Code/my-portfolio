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
    <span className={`text-[var(--text)] ${className}`}>
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
    <div className={`rounded-xl border border-[var(--border)] bg-[var(--bg-card)]/50 backdrop-blur-sm transition-all duration-300 ${hoverEffect ? "hover:bg-[var(--bg-card)] hover:border-[var(--muted)]" : ""} ${className}`}>
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
    <h2 className="text-4xl md:text-6xl font-serif italic text-[var(--text)] tracking-tight leading-[1.1]">
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
    primary: "bg-[var(--text)] text-[var(--bg)] hover:not-disabled:opacity-90 active:scale-[0.98]",
    secondary: "bg-[var(--accent)] text-[var(--bg)] hover:not-disabled:opacity-90 active:scale-[0.98]",
    outline: "border border-[var(--border)] text-[var(--text)] hover:not-disabled:bg-[var(--bg-card)] active:scale-[0.98]",
    ghost: "text-[var(--muted)] hover:not-disabled:text-[var(--text)] active:scale-[0.98]"
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

