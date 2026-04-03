"use client";

import React, { useRef, useState, ReactElement } from "react";
import { motion, useSpring, useMotionValue, useTransform } from "framer-motion";

interface MagneticProps {
  children: ReactElement;
  amount?: number; // Strength of the pull
  disabledOnMobile?: boolean;
  intense?: boolean;
}

export default function Magnetic({ children, amount = 0.5, disabledOnMobile = false, intense = true }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  React.useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = intense 
    ? { damping: 15, stiffness: 150, mass: 0.1 }
    : { damping: 20, stiffness: 100, mass: 0.1 };

  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (disabledOnMobile && isMobile) return;
    
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

  const isDisabled = disabledOnMobile && isMobile;

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={isDisabled ? undefined : { x, y }}
      className="inline-block relative"
    >
      {children}
    </motion.div>
  );
}
