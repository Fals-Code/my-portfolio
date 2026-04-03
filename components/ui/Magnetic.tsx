"use client";

import React, { useRef, useState, ReactElement, useEffect } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

interface MagneticProps {
  children: ReactElement;
  amount?: number; 
  disabledOnMobile?: boolean;
  intense?: boolean;
}

/**
 * Desktop-only animated magnetic component using springs.
 */
function MagneticDesktop({ children, amount, intense }: { children: ReactElement, amount: number, intense: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = intense 
    ? { damping: 15, stiffness: 150, mass: 0.1 }
    : { damping: 20, stiffness: 100, mass: 0.1 };

  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current!.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
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

export default function Magnetic({ children, amount = 0.5, disabledOnMobile = false, intense = true }: MagneticProps) {
  const [useStatic, setUseStatic] = useState(true);

  useEffect(() => {
    setUseStatic(disabledOnMobile && window.innerWidth < 768);
  }, [disabledOnMobile]);

  if (useStatic) {
    return <div className="inline-block relative">{children}</div>;
  }

  return (
    <MagneticDesktop amount={amount} intense={intense}>
      {children}
    </MagneticDesktop>
  );
}
