"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { usePerformance } from "@/hooks/usePerformance";

const codeLines = [
  { text: "import { auth } from '@falah/secure';", type: "keyword", delay: 0 },
  { text: "import { Redis } from 'ioredis';", type: "keyword", delay: 0.4 },
  { text: " ", type: "empty", delay: 0.7 },
  { text: "// Bootstrapping high-performance core", type: "comment", delay: 1.0 },
  { text: "const app = new BackendCore();", type: "keyword", delay: 1.3 },
  { text: "app.use(auth.shield());", type: "function", delay: 1.8 },
  { text: "app.use(Redis.rateLimit({ ms: 100 }));", type: "function", delay: 2.3 },
  { text: " ", type: "empty", delay: 2.6 },
  { text: "async function start() {", type: "keyword", delay: 3.0 },
  { text: "  await db.sync({ force: false });", type: "function", indent: 1, delay: 3.5 },
  { text: "  console.log('✨ Data models synced.');", type: "string", indent: 1, delay: 4.0 },
  { text: "  ", type: "empty", indent: 1, delay: 4.2 },
  { text: "  app.listen(3000, () => {", type: "function", indent: 1, delay: 4.5 },
  { text: "    log.info('🚀 System Online');", type: "string", indent: 2, delay: 5.0 },
  { text: "  });", type: "function", indent: 1, delay: 5.5 },
  { text: "}", type: "keyword", delay: 5.8 },
  { text: " ", type: "empty", delay: 6.0 },
  { text: "start();", type: "function", delay: 6.3 },
  { text: " ", type: "empty", delay: 6.5 },
  { text: "[RETRY] Connecting to Redis pool...", type: "comment", delay: 7.0 },
  { text: "[OK] Redis cluster ready.", type: "string", delay: 7.5 },
  { text: "> Listening on http://localhost:3000", type: "comment", delay: 8.2 }
];

export default function CodeAnimation() {
  const { isLow } = usePerformance();
  if (isLow) return null;

  const [displayedLines, setDisplayedLines] = useState<number>(0);
  const [key, setKey] = useState(0); // Used to restart the animation

  useEffect(() => {
    let timeoutIds: NodeJS.Timeout[] = [];
    
    // Start typing sequence
    codeLines.forEach((line, index) => {
      const id = setTimeout(() => {
        setDisplayedLines(prev => Math.max(prev, index + 1));
      }, line.delay * 1000);
      timeoutIds.push(id);
    });

    // Reset loop after entire sequence is done
    const totalDuration = codeLines[codeLines.length - 1].delay + 5; // 5s pause at the end
    const resetId = setTimeout(() => {
      setDisplayedLines(0);
      setKey(prev => prev + 1);
    }, totalDuration * 1000);
    timeoutIds.push(resetId);

    return () => {
      timeoutIds.forEach(clearTimeout);
    };
  }, [key]);

  const renderLine = (line: typeof codeLines[0]) => {
    let content = line.text;
    if (line.type === 'keyword') {
      content = content.replace(/import|from|const|await/g, match => `<span class="text-pink-400">${match}</span>`);
    } else if (line.type === 'string') {
      content = content.replace(/'.*?'/g, match => `<span class="text-green-400">${match}</span>`);
    } else if (line.type === 'function') {
      content = content.replace(/serve|connect|fetch|Response/g, match => `<span class="text-blue-400">${match}</span>`);
    } else if (line.type === 'comment') {
      content = `<span class="text-text-muted italic">${content}</span>`;
    }

    return (
      <div 
        className="font-mono text-[13px] md:text-sm leading-relaxed whitespace-pre"
        style={{ paddingLeft: `${(line.indent || 0) * 1.5}rem` }}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ 
        opacity: 1, 
        y: [0, -10, 0],
      }}
      transition={{ 
        opacity: { duration: 0.8, ease: "easeOut" },
        y: { duration: 6, ease: "easeInOut", repeat: Infinity }
      }}
      className="relative w-full max-w-lg mx-auto md:mr-0 z-20 transform-gpu"
      style={{ transform: "translateZ(0)" }}
    >
      {/* Decorative glows */}
      <div className="absolute -inset-1 bg-gradient-to-r from-accent to-blue-500 rounded-[2rem] blur-xl opacity-20 group-hover:opacity-40 transition duration-1000"></div>
      
      {/* Terminal Window */}
      <div className="relative glass-panel bg-[#0a0a0a]/90 border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        {/* Terminal Header */}
        <div className="flex items-center px-4 py-3 border-b border-white/5 bg-white/5">
          <div className="flex gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
          </div>
          <div className="mx-auto flex items-center gap-2">
            <span className="text-[10px] font-mono text-text-muted uppercase tracking-widest">falah@server:~</span>
          </div>
        </div>

        {/* Terminal Body */}
        <div className="p-6 h-[280px] overflow-hidden flex flex-col justify-end">
          <div className="flex-1 w-full flex flex-col justify-start">
            {codeLines.slice(0, displayedLines).map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
                className="text-gray-300"
              >
                {line.type === 'empty' ? <div className="h-6" /> : renderLine(line)}
              </motion.div>
            ))}
            
            {/* Blinking Cursor */}
            {displayedLines > 0 && displayedLines < codeLines.length && (
              <motion.div
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                className="w-2 h-4 bg-accent mt-1"
              />
            )}
            {displayedLines === codeLines.length && (
               <motion.div
                 animate={{ opacity: [1, 0] }}
                 transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                 className="w-2 h-4 bg-gray-400 ml-60 mt-[-1.25rem]"
               />
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
