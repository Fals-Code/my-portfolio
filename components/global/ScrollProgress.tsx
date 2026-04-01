"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "framer-motion";

/**
 * Global Scroll Progress Bar (The Code Line).
 * Displays a thin, glowing accent line at the top to indicate scroll progress.
 */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  return (
    <motion.div
      style={{ scaleX }}
      className="fixed top-0 left-0 right-0 h-[2px] bg-accent origin-left z-[9999] shadow-[0_0_8px_rgba(232,83,58,0.5)]"
    />
  );
}
