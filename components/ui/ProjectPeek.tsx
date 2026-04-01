"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring } from "framer-motion";
import Image from "next/image";

interface ProjectPeekProps {
  isVisible: boolean;
  imageSrc?: string;
  title?: string;
  category?: string;
}

export default function ProjectPeek({ isVisible, imageSrc, title, category }: ProjectPeekProps) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 150 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Offset the peek windows so it's not directly under the cursor
      mouseX.set(e.clientX + 20);
      mouseY.set(e.clientY + 20);
    };

    if (isVisible) {
      window.addEventListener("mousemove", handleMouseMove);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [isVisible, mouseX, mouseY]);

  return (
    <AnimatePresence>
      {isVisible && imageSrc && (
        <motion.div
          style={{
            position: "fixed",
            left: x,
            top: y,
            pointerEvents: "none",
            zIndex: 100,
          }}
          initial={{ opacity: 0, scale: 0.8, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 10 }}
          className="w-64 h-40 md:w-80 md:h-52 glass-panel p-2 overflow-hidden rounded-2xl shadow-2xl border border-white/20 bg-white/10 backdrop-blur-xl"
        >
          <div className="relative w-full h-full rounded-xl overflow-hidden group">
            <Image 
              src={imageSrc} 
              alt={title || "Project Preview"} 
              fill 
              className="object-cover"
              unoptimized
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-4">
              <span className="text-[9px] font-bold text-accent uppercase tracking-widest mb-1">{category}</span>
              <h5 className="text-sm font-bold text-white font-syne truncate">{title}</h5>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
