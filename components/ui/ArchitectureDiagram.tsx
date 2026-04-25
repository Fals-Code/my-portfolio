"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Server, Database, Globe, Cpu, Zap, ShieldCheck, Box } from "lucide-react";
import { usePerformance } from "@/hooks/usePerformance";

interface NodeProps {
  id: string;
  icon: React.ReactNode;
  label: string;
  tech: string[];
  description: string;
  x: number;
  y: number;
  active: boolean;
  onHover: (id: string | null) => void;
}

const Node = ({ id, icon, label, tech, description, x, y, active, onHover }: NodeProps) => (
  <motion.div
    className={`absolute ${active ? "z-[60]" : "z-10"}`}
    style={{ left: `${x}%`, top: `${y}%`, transform: "translate(-50%, -50%)" }}
    onMouseEnter={() => onHover(id)}
    onMouseLeave={() => onHover(null)}
    onClick={() => onHover(active ? null : id)}
  >
    <div className={`relative group cursor-crosshair transition-all duration-300 ${active ? "scale-110" : "scale-100"}`}>
      {/* Node Circle */}
      <div className={`w-16 h-16 rounded-xl border-2 flex items-center justify-center bg-[var(--bg-card)] transition-all duration-500 ${
        active ? "border-[var(--get)] shadow-[0_0_20px_rgba(0,229,160,0.3)]" : "border-[var(--border)]"
      }`}>
        <div className={`${active ? "text-[var(--get)]" : "text-[var(--muted)]"} transition-colors duration-300`}>
          {icon}
        </div>
      </div>

      {/* Label */}
      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-center">
        <div className="font-syne text-[10px] font-black uppercase tracking-tighter text-[var(--text)]">{label}</div>
      </div>

      {/* Detail Tooltip */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.95 }}
            className="absolute top-20 left-1/2 -translate-x-1/2 w-48 bg-[var(--bg-card2)] border border-[var(--border)] p-4 rounded-lg shadow-2xl z-50 pointer-events-none"
          >
            <div className="font-mono text-[9px] text-[var(--get)] mb-2 uppercase tracking-widest font-bold">Details:</div>
            <p className="text-[var(--text)] text-[11px] leading-tight mb-3 font-mono">{description}</p>
            <div className="flex flex-wrap gap-1">
              {tech.map((t) => (
                <span key={t} className="text-[8px] px-1.5 py-0.5 bg-[var(--bg-card)] border border-[var(--border)] rounded text-[var(--muted)] font-mono">
                  {t}
                </span>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  </motion.div>
);

const Connection = ({ from, to, active, isLow }: { from: [number, number], to: [number, number], active: boolean, isLow: boolean }) => (
  <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
    <motion.line
      x1={`${from[0]}%`}
      y1={`${from[1]}%`}
      x2={`${to[0]}%`}
      y2={`${to[1]}%`}
      stroke={active ? "var(--get)" : "var(--border)"}
      strokeWidth={active ? "2" : "1"}
      strokeDasharray="4 4"
      initial={{ pathLength: 0, opacity: 0.2 }}
      animate={{ 
        pathLength: 1, 
        opacity: active ? 1 : 0.3,
        ...(isLow ? {} : { strokeDashoffset: active ? [0, -20] : 0 })
      }}
      transition={{ 
        ...(isLow ? {} : { strokeDashoffset: { repeat: Infinity, duration: 2, ease: "linear" } }),
        opacity: { duration: 0.3 }
      }}
    />
  </svg>
);

export default function ArchitectureDiagram() {
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const [scale, setScale] = useState(1);
  const { isLow } = usePerformance();

  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.2, 2.5));
  const handleZoomOut = () => setScale(prev => Math.max(prev - 0.2, 0.5));
  const resetZoom = () => setScale(1);

  const nodes = [
    {
      id: "client",
      icon: <Globe className="w-7 h-7" />,
      label: "Client Tier",
      tech: ["React", "Vue", "Next.js"],
      description: "Responsive web applications & consumer interfaces consuming RESTful APIs.",
      x: 15,
      y: 50
    },
    {
      id: "api",
      icon: <Server className="w-7 h-7" />,
      label: "API Gateway",
      tech: ["Laravel", "Nginx", "JWT"],
      description: "Routing, Authentication, and Rate Limiting for secure backend access.",
      x: 40,
      y: 50
    },
    {
      id: "logic",
      icon: <Cpu className="w-7 h-7" />,
      label: "Core Logic",
      tech: ["Clean Arch", "Solid", "Events"],
      description: "Business rules and service layers implemented with high maintainability.",
      x: 65,
      y: 35
    },
    {
      id: "db",
      icon: <Database className="w-7 h-7" />,
      label: "Persistence",
      tech: ["MySQL", "PostgreSQL", "Redis"],
      description: "Relational data storage with optimized indexing and caching layers.",
      x: 90,
      y: 50
    },
    {
      id: "infra",
      icon: <Box className="w-7 h-7" />,
      label: "Infrastructure",
      tech: ["Docker", "CI/CD", "VPS"],
      description: "Containerized deployment and automated pipeline management.",
      x: 65,
      y: 65
    }
  ];

  const connections = [
    { from: "client", to: "api" },
    { from: "api", to: "logic" },
    { from: "logic", to: "db" },
    { from: "api", to: "infra" },
    { from: "infra", to: "db" }
  ];

  return (
    <div className="w-full pb-6">
      <div className="relative w-full h-[450px] bg-[var(--bg-card)]/30 rounded-3xl border border-[var(--border)] overflow-hidden my-4 lg:my-16 group">
        
        {/* Header Overlay */}
        <div className="absolute top-6 left-8 flex flex-col gap-1 z-20 pointer-events-none">
          <div className="font-mono text-[10px] text-[var(--get)] uppercase tracking-[0.3em] font-bold">Architecture Visualization</div>
          <div className="font-syne text-lg text-[var(--text)] italic">The Backend Blueprint</div>
        </div>

        {/* Zoom Controls */}
        <div className="absolute top-6 right-8 flex items-center gap-2 z-30">
          <div className="flex bg-[var(--bg-card2)] border border-[var(--border)] rounded-lg p-1 shadow-xl">
            <button 
              onClick={handleZoomOut}
              className="p-2 hover:text-[var(--get)] transition-colors border-r border-[var(--border)]"
              title="Zoom Out"
            >
              <motion.div whileTap={{ scale: 0.9 }}>-</motion.div>
            </button>
            <button 
              onClick={resetZoom}
              className="px-3 py-2 text-[9px] font-mono hover:text-[var(--get)] transition-colors border-r border-[var(--border)] uppercase"
            >
              {Math.round(scale * 100)}%
            </button>
            <button 
              onClick={handleZoomIn}
              className="p-2 hover:text-[var(--get)] transition-colors"
              title="Zoom In"
            >
              <motion.div whileTap={{ scale: 0.9 }}>+</motion.div>
            </button>
          </div>
        </div>

        {/* Interaction Hint */}
        <div className="absolute bottom-6 left-8 flex items-center gap-2 z-20 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="font-mono text-[9px] text-[var(--muted)] uppercase tracking-widest bg-[var(--bg-card2)]/80 px-2 py-1 rounded">
            Drag to pan • Click nodes for details
          </div>
        </div>

        <div className="absolute bottom-6 right-8 flex items-center gap-2 z-20">
          <Zap className={`w-3 h-3 text-[var(--get)] ${!isLow ? 'animate-pulse' : ''}`} />
          <span className="font-mono text-[9px] text-[var(--muted)] uppercase tracking-widest italic">Live Interaction Active</span>
        </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: "radial-gradient(var(--text) 1px, transparent 1px)", backgroundSize: "20px 20px" }} />

      {/* Main Draggable Area */}
      <motion.div 
        className="w-full h-full relative cursor-grab active:cursor-grabbing"
        drag
        dragConstraints={{ left: -300, right: 300, top: -200, bottom: 200 }}
        dragElastic={0.1}
        animate={{ scale }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="absolute inset-0 min-w-[800px] h-full left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          {/* Connections Layer */}
          {connections.map((conn, idx) => {
            const fromNode = nodes.find(n => n.id === conn.from)!;
            const toNode = nodes.find(n => n.id === conn.to)!;
            const isActive = activeNode === conn.from || activeNode === conn.to;
            return (
              <Connection 
                key={idx} 
                from={[fromNode.x, fromNode.y]} 
                to={[toNode.x, toNode.y]} 
                active={isActive}
                isLow={isLow}
              />
            );
          })}

          {/* Nodes Layer */}
          {nodes.map((node) => (
            <Node
              key={node.id}
              {...node}
              active={activeNode === node.id}
              onHover={setActiveNode}
            />
          ))}
          
          {/* Decorative Elements */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-0 w-4 h-[1px] bg-[var(--border)]" />
            <div className="absolute top-1/2 right-0 w-4 h-[1px] bg-[var(--border)]" />
          </div>
        </div>
      </motion.div>
      </div>
    </div>
  );
}
