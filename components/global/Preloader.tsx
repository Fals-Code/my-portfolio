"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const LOADING_STEPS = [
  "INITIALIZING KERNEL...",
  "ESTABLISHING SECURE GATEWAY...",
  "SYNCING GITHUB CORE...",
  "FETCHING BACKEND METRICS...",
  "OPTIMIZING UI INTERFACES...",
  "SYSTEM READY."
];

export default function Preloader() {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Step animation
    const stepInterval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev < LOADING_STEPS.length - 1) return prev + 1;
        clearInterval(stepInterval);
        return prev;
      });
    }, 400);

    // Progress animation
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setTimeout(() => setIsVisible(false), 500);
          return 100;
        }
        return prev + 2;
      });
    }, 40);

    return () => {
      clearInterval(stepInterval);
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] }}
          className="fixed inset-0 z-[9999] bg-[#0C0C0F] flex flex-col items-center justify-center p-6 select-none overflow-hidden"
        >
          {/* Background Grid Decorative */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
               style={{ backgroundImage: "radial-gradient(var(--text) 1px, transparent 1px)", backgroundSize: "30px 30px" }} />
          
          <div className="w-full max-w-sm relative">
            {/* Main Terminal Box */}
            <div className="mb-8 font-mono">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-2 h-2 rounded-full bg-[var(--get)] animate-pulse" />
                <span className="text-[10px] uppercase tracking-[0.3em] text-[var(--muted)] font-bold">
                  System Boot Sequence
                </span>
              </div>

              <div className="space-y-1.5 min-h-[100px]">
                {LOADING_STEPS.slice(0, currentStep + 1).map((step, idx) => (
                  <motion.div 
                    key={step}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-3"
                  >
                    <span className="text-[10px] text-[var(--muted)] w-8">0{idx + 1}</span>
                    <span className={`text-xs ${idx === currentStep ? "text-[var(--get)]" : "text-[var(--text)]"} font-medium`}>
                      {step}
                    </span>
                    {idx === currentStep && progress < 100 && (
                      <span className="inline-block w-1 h-3 bg-[var(--get)] animate-blink" />
                    )}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Progress Bar Container */}
            <div className="relative pt-4">
              <div className="flex items-center justify-between mb-2 font-mono text-[9px] uppercase tracking-widest text-[var(--muted)]">
                <span>Initialization Progress</span>
                <span className="text-[var(--get)] font-bold">{progress}%</span>
              </div>
              
              <div className="h-[2px] w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-gradient-to-r from-[var(--get)] to-[var(--patch)]"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ ease: "linear" }}
                />
              </div>

              {/* Decorative Scanline */}
              <motion.div 
                animate={{ top: ["0%", "100%", "0%"] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="absolute left-0 w-full h-[10px] bg-[var(--get)]/5 blur-xl pointer-events-none"
              />
            </div>
          </div>

          {/* Footer Branding */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="absolute bottom-12 font-syne text-[10px] uppercase tracking-[0.5em] text-[var(--muted)] font-black"
          >
            Falah.dev <span className="opacity-30">v3.0.0</span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
