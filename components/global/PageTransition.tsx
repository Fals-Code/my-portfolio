"use client";

import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

/**
 * Provides smooth entry/exit animations between routes.
 * Uses usePathname as a key to trigger transitions on every route change.
 */
export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const variants = {
    initial: { opacity: 0, y: 16 },
    animate: { 
      opacity: 1, 
      y: 0, 
      transition: { 
        duration: 0.35, 
        ease: "easeInOut" as any 
      } 
    },
    exit: { 
      opacity: 0, 
      y: -8, 
      transition: { 
        duration: 0.2 
      } 
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={variants}
        className="w-full h-full flex flex-col"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
