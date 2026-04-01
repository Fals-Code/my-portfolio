"use client";

import React, { useRef, useState, ReactElement } from "react";
import { motion, useSpring, useMotionValue, useTransform } from "framer-motion";

interface MagneticProps {
  children: ReactElement;
  amount?: number; // Strength of the pull
}

export default function Magnetic({ children, amount = 0.5 }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 15, stiffness: 150, mass: 0.1 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current!.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    
    // Scale the movement by the 'amount' prop
    mouseX.set(middleX * amount);
    mouseY.set(middleY * amount);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x, y }}
      className="inline-block relative"
    >
      {children}
    </motion.div>
  );
}
