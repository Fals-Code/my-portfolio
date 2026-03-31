"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Fullscreen terminal intro simulation.
 * Redesigned with a macOS window aesthetic that downloads and expands.
 * Runs only on the home page and only once per session.
 */
export default function TerminalIntro() {
  const [isVisible, setIsVisible] = useState(true);
  const [lines, setLines] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const [expandFullscreen, setExpandFullscreen] = useState(false);

  const fullLines = [
    { text: "$ npx @falah/experience@latest install", reply: "Fetching portfolio assets..." },
    { text: "Downloading core modules...", reply: "" }
  ];

  useEffect(() => {
    // Check if seen before in session
    if (sessionStorage.getItem("terminal-shown")) {
      setIsVisible(false);
      return;
    }

    const runSequence = async () => {
      document.body.classList.add("intro-running");
      // Line 1: Type command
      setLines([""]);
      for (let char = 0; char <= fullLines[0].text.length; char++) {
        setLines([fullLines[0].text.substring(0, char)]);
        await new Promise((r) => setTimeout(r, 40));
      }
      await new Promise((r) => setTimeout(r, 400));
      // Line 1: Reply
      setLines((prev) => [prev[0] + "\n" + fullLines[0].reply]);
      await new Promise((r) => setTimeout(r, 600));

      // Line 2: Downloader start
      setLines((prev) => [...prev, ""]);
      for (let char = 0; char <= fullLines[1].text.length; char++) {
        setLines((prev) => [prev[0], fullLines[1].text.substring(0, char)]);
        await new Promise((r) => setTimeout(r, 30));
      }
      
      // Progress Bar Sequence
      await new Promise((r) => setTimeout(r, 300));
      for (let p = 0; p <= 100; p += Math.floor(Math.random() * 15) + 5) {
        setProgress(Math.min(p, 100));
        await new Promise((r) => setTimeout(r, Math.random() * 80 + 30));
      }
      setProgress(100);
      
      await new Promise((r) => setTimeout(r, 400));
      // End
      setLines((prev) => [
        prev[0], 
        prev[1], 
        "Successfully installed.\nLaunching experience..."
      ]);
      
      setIsDone(true);
      await new Promise((r) => setTimeout(r, 1000));
      
      // Expand Window
      setExpandFullscreen(true);
      sessionStorage.setItem("terminal-shown", "true");
      
      // Remove completely after expanding
      setTimeout(() => {
        setIsVisible(false);
        document.body.classList.remove("intro-running");
      }, 1200);
    };

    runSequence();
  }, []);

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="fixed inset-0 z-[100] bg-[#050505]/90 backdrop-blur-xl flex items-center justify-center font-mono p-4 md:p-6"
    >
      <motion.div 
        animate={
          expandFullscreen 
            ? { scale: [1, 50], opacity: [1, 0], backgroundColor: "#ffffff" } 
            : { scale: 1, opacity: 1 }
        }
        transition={{ duration: 1.2, ease: [0.83, 0, 0.17, 1] }}
        className="w-full max-w-2xl bg-neutral-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col relative z-10"
      >
        {/* macOS Window Header */}
        <div className="h-12 bg-neutral-950/80 border-b border-white/5 flex items-center px-4 relative">
          <div className="flex items-center gap-2 absolute left-4">
            <div className="w-3.5 h-3.5 rounded-full bg-[#ff5f56] shadow-[inset_0_0_2px_rgba(0,0,0,0.5)]" />
            <div className="w-3.5 h-3.5 rounded-full bg-[#ffbd2e] shadow-[inset_0_0_2px_rgba(0,0,0,0.5)]" />
            <div className="w-3.5 h-3.5 rounded-full bg-[#27c93f] shadow-[inset_0_0_2px_rgba(0,0,0,0.5)]" />
          </div>
          <div className="flex-1 text-center text-xs font-bold font-syne text-neutral-400 opacity-60">falah — sh — 80x24</div>
        </div>

        {/* Terminal Body */}
        <div className="p-6 md:p-8 space-y-4 text-emerald-400 font-medium text-sm md:text-base leading-relaxed h-[300px] overflow-y-auto">
          {lines.map((line, idx) => (
            <div key={idx} className="whitespace-pre-wrap">
              {line}
              {idx === lines.length - 1 && !isDone && progress === 0 && (
                <span className="inline-block w-2.5 h-5 bg-emerald-400 ml-1.5 animate-pulse align-middle" />
              )}
            </div>
          ))}
          
          {progress > 0 && (
            <div className="mt-6 flex items-center gap-4">
              <div className="text-emerald-500 font-bold min-w-[3rem] text-right">
                {progress}%
              </div>
              <div className="flex-1 h-2 bg-neutral-800 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: "0%" }}
                  animate={{ width: `${progress}%` }}
                  className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" 
                />
              </div>
            </div>
          )}

          {isDone && (
            <div className="mt-4 flex items-center gap-2 text-white">
              <span className="w-2.5 h-5 bg-white animate-pulse align-middle" />
            </div>
          )}
        </div>
      </motion.div>

      {/* Skip button container */}
      <AnimatePresence>
        {!expandFullscreen && (
          <motion.button
            exit={{ opacity: 0 }}
            onClick={() => {
              setExpandFullscreen(true);
              sessionStorage.setItem("terminal-shown", "true");
              setTimeout(() => {
                setIsVisible(false);
                document.body.classList.remove("intro-running");
              }, 1200);
            }}
            className="absolute bottom-10 right-10 text-[10px] font-bold uppercase tracking-[0.3em] text-white/30 hover:text-white/70 transition-colors duration-300 border border-white/20 hover:border-white/40 px-5 py-2.5 rounded-full z-20"
          >
            Skip →
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
