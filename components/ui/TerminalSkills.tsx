"use client";

import React, { useState, useRef, useEffect } from "react";
import { Terminal as TerminalIcon, Maximize2, Minus, X } from "lucide-react";
import { motion } from "framer-motion";

interface CommandOutput {
  command: string;
  output: React.ReactNode;
}

const sysInfo = (
  <div className="flex flex-col md:flex-row gap-6 mt-2 text-sm text-[var(--muted)]">
    <div className="text-[var(--get)] font-bold font-mono whitespace-pre text-xs leading-tight hidden sm:block">
      {`
   .---.
  /     \\
  \\.@-@./
  /  _  \\
 //     \\\\
||  _  ||
 \\\\_-_//
  \`---\`
      `}
    </div>
    <div className="flex-1">
      <div className="text-[var(--patch)] font-bold mb-2">falah@backend-architect</div>
      <div className="grid grid-cols-[100px_1fr] gap-1">
        <span className="text-[var(--get)] font-bold">OS:</span> <span>Windows / WSL2 Ubuntu</span>
        <span className="text-[var(--get)] font-bold">Host:</span> <span>Falah-Dev-Rig</span>
        <span className="text-[var(--get)] font-bold">Kernel:</span> <span>5.15.90.1-microsoft</span>
        <span className="text-[var(--get)] font-bold">Uptime:</span> <span>24/7 (Caffeine dependent)</span>
        <span className="text-[var(--get)] font-bold">Packages:</span> <span>1042 (npm), 405 (composer)</span>
        <span className="text-[var(--get)] font-bold">Shell:</span> <span>zsh 5.8</span>
        <span className="text-[var(--get)] font-bold">Terminal:</span> <span>Windows Terminal</span>
        <span className="text-[var(--get)] font-bold">CPU:</span> <span>Brain Core i9 (16 threads)</span>
        <span className="text-[var(--get)] font-bold">Memory:</span> <span>8GB / 32GB (Coffee needed)</span>
      </div>
      <div className="flex gap-1 mt-3">
        <div className="w-4 h-4 bg-black"></div>
        <div className="w-4 h-4 bg-red-500"></div>
        <div className="w-4 h-4 bg-green-500"></div>
        <div className="w-4 h-4 bg-yellow-500"></div>
        <div className="w-4 h-4 bg-blue-500"></div>
        <div className="w-4 h-4 bg-purple-500"></div>
        <div className="w-4 h-4 bg-cyan-500"></div>
        <div className="w-4 h-4 bg-white"></div>
      </div>
    </div>
  </div>
);

const skillsOutput = (
  <div className="mt-2 text-sm text-[var(--muted)]">
    <div className="text-[var(--patch)] font-bold mb-2">Active Technical Skills:</div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <span className="text-[var(--get)] font-bold">Backend</span>
        <ul className="list-disc list-inside ml-2">
          <li>Laravel (PHP) - Expert</li>
          <li>Node.js (Express) - Advanced</li>
          <li>RESTful APIs - Expert</li>
        </ul>
      </div>
      <div>
        <span className="text-[var(--get)] font-bold">Frontend</span>
        <ul className="list-disc list-inside ml-2">
          <li>React / Next.js - Advanced</li>
          <li>Vue.js - Intermediate</li>
          <li>TailwindCSS - Expert</li>
        </ul>
      </div>
      <div>
        <span className="text-[var(--get)] font-bold">Database</span>
        <ul className="list-disc list-inside ml-2">
          <li>MySQL - Expert</li>
          <li>PostgreSQL - Advanced</li>
          <li>Redis - Intermediate</li>
        </ul>
      </div>
      <div>
        <span className="text-[var(--get)] font-bold">DevOps & Tools</span>
        <ul className="list-disc list-inside ml-2">
          <li>Git / GitHub - Advanced</li>
          <li>Docker - Intermediate</li>
          <li>Linux / Nginx - Advanced</li>
        </ul>
      </div>
    </div>
  </div>
);

const helpOutput = (
  <div className="mt-2 text-sm text-[var(--muted)]">
    <div className="text-[var(--patch)] font-bold mb-2">Available Commands:</div>
    <ul className="list-none space-y-1">
      <li><span className="text-[var(--get)] font-bold w-24 inline-block">neofetch</span> - Display system information</li>
      <li><span className="text-[var(--get)] font-bold w-24 inline-block">skills</span> - List technical skills</li>
      <li><span className="text-[var(--get)] font-bold w-24 inline-block">whoami</span> - Display current user profile</li>
      <li><span className="text-[var(--get)] font-bold w-24 inline-block">clear</span> - Clear terminal output</li>
      <li><span className="text-[var(--get)] font-bold w-24 inline-block">help</span> - Show this help message</li>
    </ul>
  </div>
);

export default function TerminalSkills() {
  const [history, setHistory] = useState<CommandOutput[]>([
    {
      command: "neofetch",
      output: sysInfo
    }
  ]);
  const [input, setInput] = useState("");
  const endOfTerminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (endOfTerminalRef.current) {
      endOfTerminalRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [history]);

  const handleCommand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const cmd = input.trim().toLowerCase();
    let newOutput: React.ReactNode = null;

    if (cmd === "clear") {
      setHistory([]);
      setInput("");
      return;
    }

    switch (cmd) {
      case "neofetch":
        newOutput = sysInfo;
        break;
      case "skills":
      case "skills --all":
        newOutput = skillsOutput;
        break;
      case "whoami":
        newOutput = <div className="mt-2 text-[var(--patch)]">Falah - Backend Architect & Fullstack Developer</div>;
        break;
      case "help":
        newOutput = helpOutput;
        break;
      default:
        newOutput = <div className="mt-2 text-[var(--delete)]">bash: {cmd}: command not found. Type 'help' for available commands.</div>;
    }

    setHistory([...history, { command: input, output: newOutput }]);
    setInput("");
  };

  const handleSuggestionClick = (cmd: string) => {
    setInput(cmd);
    // Focus input? We can just simulate the submit
    // But keeping it simple, let user hit enter or we do it for them:
  };

  return (
    <div className="w-full bg-[#1e1e1e] border border-[var(--border)] rounded-xl overflow-hidden shadow-2xl font-mono text-sm">
      {/* Terminal Header */}
      <div className="bg-[#2d2d2d] border-b border-[#3c3c3c] px-4 py-2 flex items-center justify-between select-none">
        <div className="flex items-center gap-2">
          <TerminalIcon className="w-4 h-4 text-[#cccccc]" />
          <span className="text-[#cccccc] text-xs">falah@ubuntu:~</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#ff5f56] flex items-center justify-center group cursor-pointer">
            <X className="w-2 h-2 text-black opacity-0 group-hover:opacity-100" />
          </div>
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e] flex items-center justify-center group cursor-pointer">
            <Minus className="w-2 h-2 text-black opacity-0 group-hover:opacity-100" />
          </div>
          <div className="w-3 h-3 rounded-full bg-[#27c93f] flex items-center justify-center group cursor-pointer">
            <Maximize2 className="w-2 h-2 text-black opacity-0 group-hover:opacity-100" />
          </div>
        </div>
      </div>

      {/* Terminal Body */}
      <div className="p-4 h-[400px] overflow-y-auto custom-scrollbar bg-[#1e1e1e] text-[#cccccc]">
        {history.map((item, i) => (
          <div key={i} className="mb-4">
            <div className="flex gap-2 text-[var(--patch)]">
              <span className="font-bold text-[var(--get)]">falah@ubuntu</span>
              <span className="text-white">:</span>
              <span className="text-[var(--post)]">~</span>
              <span className="text-white">$</span>
              <span className="text-white ml-1">{item.command}</span>
            </div>
            {item.output}
          </div>
        ))}
        
        <form onSubmit={handleCommand} className="flex gap-2 text-[var(--patch)] mt-2">
          <span className="font-bold text-[var(--get)]">falah@ubuntu</span>
          <span className="text-white">:</span>
          <span className="text-[var(--post)]">~</span>
          <span className="text-white">$</span>
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-white caret-white"
            autoFocus
            autoComplete="off"
            spellCheck="false"
          />
        </form>
        <div ref={endOfTerminalRef} />
      </div>
      
      {/* Suggestions Footer */}
      <div className="bg-[#252526] border-t border-[#3c3c3c] p-2 flex flex-wrap gap-2 text-xs">
        <span className="text-[#858585] py-1 px-2">Quick cmds:</span>
        {['neofetch', 'skills', 'whoami', 'clear', 'help'].map(cmd => (
          <button 
            key={cmd}
            onClick={() => {
              setInput(cmd);
            }}
            className="bg-[#3c3c3c] hover:bg-[#4c4c4c] text-[#cccccc] px-2 py-1 rounded transition-colors"
          >
            {cmd}
          </button>
        ))}
      </div>
    </div>
  );
}
