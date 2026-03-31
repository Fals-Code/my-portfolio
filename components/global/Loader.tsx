"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function Loader() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const dismiss = () => setIsLoading(false);

    // If the document is already fully loaded, dismiss immediately
    if (document.readyState === "complete") {
      // Small delay so the animation has time to render at least once
      const t = setTimeout(dismiss, 300);
      return () => clearTimeout(t);
    }

    // Otherwise wait for the actual load event
    window.addEventListener("load", dismiss);

    // Fallback: never show loader for more than 4s even on slow connections
    const fallback = setTimeout(dismiss, 4000);

    return () => {
      window.removeEventListener("load", dismiss);
      clearTimeout(fallback);
    };
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-bg"
        >
          <div className="text-center space-y-6">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-4xl md:text-6xl font-bold font-syne gradient-text tracking-tighter"
            >
              FALAH.DEV
            </motion.div>
            
            <div className="relative w-48 h-1 bg-border rounded-full mx-auto overflow-hidden">
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{ 
                  repeat: Infinity, 
                  duration: 1.5,
                  ease: "easeInOut"
                }}
                className="absolute inset-0 bg-accent"
              />
            </div>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-text-muted text-sm uppercase tracking-widest"
            >
              Initializing Digital Experience...
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
