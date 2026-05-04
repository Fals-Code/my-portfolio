"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { Terminal, X, ChevronRight } from "lucide-react";
import { useAchievements } from "@/context/AchievementContext";

interface LogEntry {
  type: "command" | "output" | "error" | "system";
  content: string | React.ReactNode;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  unlocked: boolean;
}

export default function TerminalMode() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const { achievements, unlockAchievement } = useAchievements();

  // Trigger achievement when terminal opens
  useEffect(() => {
    if (isOpen) {
      unlockAchievement("HACKER_MODE");
    }
  }, [isOpen, unlockAchievement]);
  const [logs, setLogs] = useState<LogEntry[]>([
    { type: "system", content: "Falah.OS [Version 2.0.425]" },
    { type: "system", content: "(c) 2026 Falah. All rights reserved." },
    { type: "system", content: "Type 'help' to see available commands." },
  ]);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Listen for toggle shortcut (backtick or Ctrl+`)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "`" && !e.ctrlKey && !e.metaKey && !e.shiftKey) {
        // Only trigger if not typing in an input/textarea
        if (
          document.activeElement?.tagName !== "INPUT" &&
          document.activeElement?.tagName !== "TEXTAREA"
        ) {
          e.preventDefault();
          setIsOpen((prev) => !prev);
        }
      }
      
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    const handleToggle = () => setIsOpen(prev => !prev);
    window.addEventListener("toggle-terminal", handleToggle);
    return () => window.removeEventListener("toggle-terminal", handleToggle);
  }, []);

  // Auto-focus input when terminal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Scroll to bottom when logs update
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const handleCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim().toLowerCase();
    if (!trimmedCmd) return;

    // Add command to logs
    setLogs((prev) => [...prev, { type: "command", content: `> ${cmd}` }]);
    setHistory((prev) => [cmd, ...prev]);
    setHistoryIndex(-1);

    const parts = trimmedCmd.split(" ");
    const baseCmd = parts[0];
    const args = parts.slice(1);

    switch (baseCmd) {
      case "achievements":
        setLogs((prev) => [
          ...prev,
          {
            type: "output",
            content: (
              <div className="my-4 space-y-3">
                <p className="text-[var(--get)] font-bold uppercase tracking-widest text-[10px]">System Achievements</p>
                <div className="grid grid-cols-1 gap-3">
                  {achievements.map((a: Achievement) => (
                    <div key={a.id} className={`flex items-center gap-3 p-2 border ${a.unlocked ? 'border-[var(--get)]/30 bg-[var(--get)]/5' : 'border-white/5 opacity-40'}`}>
                      <div className={a.unlocked ? 'text-[var(--get)]' : 'text-[var(--muted)]'}>
                        {a.icon}
                      </div>
                      <div>
                        <p className={`font-bold text-xs ${a.unlocked ? 'text-white' : 'text-[var(--muted)]'}`}>{a.title}</p>
                        <p className="text-[10px] text-[var(--muted)]">{a.description}</p>
                      </div>
                      {a.unlocked && <span className="ml-auto text-[var(--get)] text-[10px] font-bold">[UNLOCKED]</span>}
                    </div>
                  ))}
                </div>
              </div>
            )
          }
        ]);
        break;

      case "help":
        setLogs((prev) => [
          ...prev,
          {
            type: "output",
            content: (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1 my-2">
                <div><span className="text-[var(--get)]">help</span> - Show this message</div>
                <div><span className="text-[var(--get)]">ls</span> - List all pages</div>
                <div><span className="text-[var(--get)]">cd [path]</span> - Navigate to a page</div>
                <div><span className="text-[var(--get)]">cat [file]</span> - Read a file (try: skills.json)</div>
                <div><span className="text-[var(--get)]">whoami</span> - Display user info</div>
                <div><span className="text-[var(--get)]">ping [host]</span> - Send ICMP ECHO_REQUEST</div>
                <div><span className="text-[var(--get)]">achievements</span> - View your badges</div>
                <div><span className="text-[var(--get)]">clear</span> - Clear terminal screen</div>
                <div><span className="text-[var(--get)]">exit</span> - Close terminal</div>
                <div><span className="text-[var(--get)]">projects</span> - View all projects</div>
                <div><span className="text-[var(--get)]">stack</span> - View tech stack</div>
                <div><span className="text-[var(--get)]">contact</span> - Go to contact page</div>
              </div>
            ),
          },
        ]);
        break;

      case "ls":
        setLogs((prev) => [
          ...prev,
          {
            type: "output",
            content: (
              <div className="flex flex-wrap gap-4 my-2 text-[var(--post)] font-bold">
                <span>/home</span>
                <span>/about</span>
                <span>/projects</span>
                <span>/stack</span>
                <span>/contact</span>
              </div>
            ),
          },
        ]);
        break;

      case "cd":
        const path = args[0];
        if (!path) {
          setLogs((prev) => [...prev, { type: "error", content: "Error: cd requires a path" }]);
        } else {
          const target = path.startsWith("/") ? path : `/${path}`;
          const validPaths = ["/", "/home", "/about", "/projects", "/stack", "/contact", "/cyber-drive"];
          
          if (validPaths.includes(target === "/home" ? "/" : target)) {
            const actualPath = target === "/home" ? "/" : target;
            setLogs((prev) => [...prev, { type: "system", content: `Navigating to ${actualPath}...` }]);
            setTimeout(() => {
              router.push(actualPath);
              setIsOpen(false);
            }, 500);
          } else {
            setLogs((prev) => [...prev, { type: "error", content: `Error: Path not found: ${path}` }]);
          }
        }
        break;

      case "whoami":
        setLogs((prev) => [
          ...prev,
          {
            type: "output",
            content: (
              <div className="my-2 space-y-1">
                <p><span className="text-[var(--patch)]">Name:</span> Ahmad Mathlaul Falah</p>
                <p><span className="text-[var(--patch)]">Role:</span> Backend Architect / Fullstack Developer</p>
                <p><span className="text-[var(--patch)]">Focus:</span> PHP (Laravel), TypeScript (Next.js), System Design</p>
                <p><span className="text-[var(--patch)]">Status:</span> Coding from Indonesia...</p>
              </div>
            ),
          },
        ]);
        break;

      case "cat":
        if (args[0] === "skills.json") {
          setLogs((prev) => [
            ...prev,
            {
              type: "output",
              content: (
                <div className="my-2 space-y-1 text-[var(--get)] font-mono whitespace-pre">
{`{
  "languages": ["PHP", "TypeScript", "JavaScript", "SQL"],
  "frameworks": ["Laravel", "Next.js", "React", "Express"],
  "databases": ["MySQL", "PostgreSQL", "Redis"],
  "tools": ["Docker", "Git", "Postman", "Linux"],
  "architecture": ["REST", "Microservices", "Clean Architecture"]
}`}
                </div>
              ),
            },
          ]);
        } else if (!args[0]) {
          setLogs((prev) => [...prev, { type: "error", content: "cat: missing file operand" }]);
        } else {
          setLogs((prev) => [...prev, { type: "error", content: `cat: ${args[0]}: No such file or directory` }]);
        }
        break;

      case "ping":
        const targetHost = args[0] || "falah.dev";
        setLogs((prev) => [...prev, { type: "system", content: `PING ${targetHost} (192.168.1.1): 56 data bytes` }]);
        
        let pings = 0;
        const pingInterval = setInterval(() => {
          pings++;
          const time = (Math.random() * 20 + 5).toFixed(1);
          setLogs((prev) => [
            ...prev,
            { type: "output", content: `64 bytes from ${targetHost}: icmp_seq=${pings} ttl=64 time=${time} ms` }
          ]);
          
          if (pings >= 4) {
            clearInterval(pingInterval);
            setTimeout(() => {
              setLogs((prev) => [
                ...prev,
                { type: "system", content: `--- ${targetHost} ping statistics ---` },
                { type: "system", content: `4 packets transmitted, 4 packets received, 0.0% packet loss` }
              ]);
            }, 500);
          }
        }, 800);
        break;

      case "projects":
        router.push("/projects");
        setIsOpen(false);
        break;

      case "stack":
        router.push("/stack");
        setIsOpen(false);
        break;

      case "contact":
        router.push("/contact");
        setIsOpen(false);
        break;

      case "clear":
        setLogs([]);
        break;

      case "exit":
        setIsOpen(false);
        break;

      default:
        setLogs((prev) => [
          ...prev,
          { type: "error", content: `Command not found: ${baseCmd}. Type 'help' for assistance.` },
        ]);
    }

    setInput("");
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleCommand(input);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length > 0) {
        const nextIndex = Math.min(historyIndex + 1, history.length - 1);
        setHistoryIndex(nextIndex);
        setInput(history[nextIndex]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex > 0) {
        const nextIndex = historyIndex - 1;
        setHistoryIndex(nextIndex);
        setInput(history[nextIndex]);
      } else {
        setHistoryIndex(-1);
        setInput("");
      }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[10001]"
          />
          
          {/* Terminal Window */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed inset-4 md:inset-10 lg:inset-20 bg-[#0c0c0f] border border-[var(--border)] rounded-lg shadow-2xl z-[10002] flex flex-col overflow-hidden font-mono text-sm"
          >
            {/* Header */}
            <div className="bg-[#1a1a1e] border-b border-[var(--border)] p-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-[var(--get)]" />
                <span className="text-xs font-bold text-[var(--muted)] uppercase tracking-widest">Falah.OS Terminal</span>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="hover:bg-white/10 p-1 rounded transition-colors"
              >
                <X className="w-4 h-4 text-[var(--muted)]" />
              </button>
            </div>

            {/* Content area */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-6 space-y-2 custom-scrollbar selection:bg-[var(--get)] selection:text-black"
            >
              {logs.map((log, i) => (
                <div key={i} className={`
                  ${log.type === "command" ? "text-white" : ""}
                  ${log.type === "output" ? "text-[var(--muted)]" : ""}
                  ${log.type === "error" ? "text-[var(--delete)]" : ""}
                  ${log.type === "system" ? "text-[var(--patch)]" : ""}
                `}>
                  {log.content}
                </div>
              ))}
              
              {/* Input Line */}
              <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/5">
                <span className="text-[var(--get)] font-bold">falah@dev:~$</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={onKeyDown}
                  className="flex-1 bg-transparent border-none outline-none text-white p-0"
                  spellCheck={false}
                  autoComplete="off"
                />
              </div>
            </div>

            {/* Scanlines Effect Overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-[1] bg-[length:100%_2px,3px_100%]" />
            
            {/* CRT Flicker/Glow */}
            <div className="absolute inset-0 pointer-events-none z-[0] shadow-[inset_0_0_100px_rgba(0,0,0,0.5)]" />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
