"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * Fullscreen terminal intro simulation.
 * Runs only on the home page and only once per session.
 */
export default function TerminalIntro() {
  const [isVisible, setIsVisible] = useState(true);
  const [lines, setLines] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);

  const fullLines = [
    { text: "$ whoami", reply: "Ahmad Mathlaul Falah" },
    { text: "$ cat skills.txt", reply: "Laravel · PHP · MySQL · Git" },
    { text: "$ status --check", reply: "✓ Available for new projects" },
    { text: "$ ./portfolio --launch", reply: "" },
  ];

  useEffect(() => {
    // Check if seen before in session
    if (sessionStorage.getItem("terminal-shown")) {
      setIsVisible(false);
      return;
    }

    let currentLine = 0;
    let isTypingReply = false;

    const runSequence = async () => {
      for (let i = 0; i < fullLines.length; i++) {
        // Typing prompt
        setLines((prev) => [...prev, ""]);
        for (let char = 0; char <= fullLines[i].text.length; char++) {
          setLines((prev) => {
            const next = [...prev];
            next[i] = fullLines[i].text.substring(0, char);
            return next;
          });
          await new Promise((r) => setTimeout(r, 40));
        }

        await new Promise((r) => setTimeout(r, 400));

        // Adding reply
        if (fullLines[i].reply) {
          setLines((prev) => {
            const next = [...prev];
            next[i] = next[i] + "\n" + fullLines[i].reply;
            return next;
          });
        }

        // Special case for progress bar
        if (i === 3) {
          for (let p = 0; p <= 100; p += 5) {
            setProgress(p);
            await new Promise((r) => setTimeout(r, 50));
          }
        }

        await new Promise((r) => setTimeout(r, 300));
      }

      setIsDone(true);
      sessionStorage.setItem("terminal-shown", "true");
      setTimeout(() => setIsVisible(false), 800);
    };

    runSequence();
  }, []);

  if (!isVisible) return null;

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="fixed inset-0 z-[100] bg-[#0a0c14] flex items-center justify-center font-mono p-6"
    >
      <div className="max-w-2xl w-full">
        <div className="space-y-4 text-[#22c55e]">
          {lines.map((line, idx) => (
            <div key={idx} className="whitespace-pre-wrap">
              {line}
              {idx === lines.length - 1 && !isDone && (
                <span className="inline-block w-2 h-5 bg-[#22c55e] ml-1 animate-pulse align-middle" />
              )}
            </div>
          ))}
          
          {progress > 0 && (
            <div className="w-full h-1 bg-[#22c55e]/20 mt-4 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-[#22c55e]" 
                style={{ width: `${progress}%` }} 
              />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
