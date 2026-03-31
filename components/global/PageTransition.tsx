"use client";

import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

/**
 * Provides smooth entry animations on route change.
 * Uses a simple fade-in without exit animation to prevent
 * the blank-page issue with Next.js App Router client navigation.
 */
export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, y: 12 }}
      animate={{ 
        opacity: 1, 
        y: 0, 
        transition: { duration: 0.35, ease: "easeOut" } 
      }}
      className="w-full h-full flex flex-col"
    >
      {children}
    </motion.div>
  );
}
