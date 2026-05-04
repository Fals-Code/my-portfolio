"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, Server, Database, Shield, Zap, ChevronRight, LucideIcon } from "lucide-react";

interface NodeData {
  id: string;
  label: string;
  sublabel: string;
  icon: LucideIcon;
  color: string;
  // Relative positions (0–1 range of canvas)
  rx: number;
  ry: number;
  desc: string;
  techs: string[];
}

const initialNodes: NodeData[] = [
  { id: "client",  label: "Client",      sublabel: "Next.js · React",  icon: Globe,     color: "#00e5a0", rx: 0.05, ry: 0.45, desc: "SSR/SSG frontend. Handles UI state, data fetching, and optimistic UI updates.",            techs: ["Next.js 14", "React", "Tailwind"] },
  { id: "gateway", label: "Gateway",     sublabel: "Nginx · CF",        icon: Shield,    color: "#6c7bff", rx: 0.30, ry: 0.08, desc: "SSL termination, rate limiting, CORS enforcement, and request routing.",                    techs: ["Nginx", "Cloudflare"] },
  { id: "api",     label: "Laravel API", sublabel: "PHP 8.2 · REST",    icon: Server,    color: "#ffaa00", rx: 0.55, ry: 0.45, desc: "Core business logic. Auth, queues, validations, and complex transactions.",                 techs: ["Laravel 11", "Sanctum", "Horizon"] },
  { id: "db",      label: "MySQL",       sublabel: "Primary DB",        icon: Database,  color: "#ff5c6a", rx: 0.80, ry: 0.08, desc: "Persistent relational storage. Normalized schema with optimized indexing.",                 techs: ["MySQL 8", "InnoDB", "Eloquent"] },
  { id: "cache",   label: "Redis",       sublabel: "Cache · Queue",     icon: Zap,       color: "#00e5a0", rx: 0.80, ry: 0.78, desc: "In-memory store for caching, session management, and job queuing.",                       techs: ["Redis 7", "Predis", "Horizon"] },
];

const edgeDefs = [
  { from: "client", to: "gateway" },
  { from: "gateway", to: "api" },
  { from: "api", to: "db" },
  { from: "api", to: "cache" },
];

const NODE_W = 100;
const NODE_H = 52;

export default function SystemArchitecture() {
  const [nodes, setNodes] = useState<NodeData[]>(initialNodes);
  const [active, setActive] = useState<string | null>(null);
  const [canvasSize, setCanvasSize] = useState({ w: 600, h: 240 });
  const canvasRef = useRef<HTMLDivElement>(null);

  // Observe canvas size
  useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;
    const obs = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width > 0 && height > 0) setCanvasSize({ w: width, h: height });
      }
    });
    obs.observe(el);
    // Initial read
    const { width, height } = el.getBoundingClientRect();
    if (width > 0 && height > 0) setCanvasSize({ w: width, h: height });
    return () => obs.disconnect();
  }, []);

  const getAbsPos = (n: NodeData) => ({
    ax: n.rx * canvasSize.w,
    ay: n.ry * canvasSize.h,
    cx: n.rx * canvasSize.w + NODE_W / 2,
    cy: n.ry * canvasSize.h + NODE_H / 2,
  });

  const handleDrag = useCallback(
    (id: string, info: { point: { x: number; y: number } }) => {
      if (!canvasRef.current) return;
      const rect = canvasRef.current.getBoundingClientRect();
      const ax = Math.max(0, Math.min(info.point.x - rect.left - NODE_W / 2, canvasSize.w - NODE_W));
      const ay = Math.max(0, Math.min(info.point.y - rect.top - NODE_H / 2, canvasSize.h - NODE_H));
      setNodes((prev) =>
        prev.map((n) =>
          n.id === id ? { ...n, rx: ax / canvasSize.w, ry: ay / canvasSize.h } : n
        )
      );
    },
    [canvasSize]
  );

  const activeNode = nodes.find((n) => n.id === active);

  return (
    <div className="w-full h-full flex flex-col gap-0">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-5 pb-3 shrink-0">
        <span className="font-mono text-[10px] text-[var(--muted)] uppercase tracking-widest">
          Architecture Stack
        </span>
        <span className="flex items-center gap-1.5 font-mono text-[9px] text-[var(--patch)] uppercase tracking-wider">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--patch)] animate-pulse inline-block" />
          Drag nodes
        </span>
      </div>

      {/* Canvas — grows to fill card */}
      <div
        ref={canvasRef}
        className="relative flex-1 overflow-hidden mx-3 mb-0 rounded-xl bg-[var(--bg)]/40"
        style={{ minHeight: 200 }}
      >
        {/* SVG Edges */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {edgeDefs.map((edge) => {
            const fn = nodes.find((n) => n.id === edge.from)!;
            const tn = nodes.find((n) => n.id === edge.to)!;
            const { cx: fx, cy: fy } = getAbsPos(fn);
            const { cx: tx, cy: ty } = getAbsPos(tn);
            const mx = (fx + tx) / 2;
            const my = (fy + ty) / 2 - Math.abs(tx - fx) * 0.2;
            const isLit = active === edge.from || active === edge.to;
            return (
              <path
                key={edge.from + edge.to}
                d={`M ${fx} ${fy} Q ${mx} ${my} ${tx} ${ty}`}
                fill="none"
                stroke={isLit ? fn.color : "var(--border)"}
                strokeWidth={isLit ? 1.5 : 0.8}
                strokeDasharray="5 4"
                opacity={isLit ? 0.75 : 0.25}
                style={{ transition: "stroke 0.25s, opacity 0.25s" }}
              />
            );
          })}
        </svg>

        {/* Draggable Nodes */}
        {nodes.map((n) => {
          const { ax, ay } = getAbsPos(n);
          const Icon = n.icon;
          const isActive = active === n.id;

          return (
            <motion.div
              key={n.id}
              drag
              dragMomentum={false}
              dragElastic={0}
              dragConstraints={canvasRef}
              style={{
                position: "absolute",
                left: ax,
                top: ay,
                width: NODE_W,
                height: NODE_H,
                zIndex: isActive ? 20 : 10,
              }}
              onDrag={(_, info) => handleDrag(n.id, info)}
              onClick={() => setActive(active === n.id ? null : n.id)}
              whileHover={{ scale: 1.06 }}
              whileDrag={{ scale: 1.09, zIndex: 30 }}
              className="cursor-grab active:cursor-grabbing"
            >
              <div
                className="w-full h-full rounded-xl border flex flex-col items-center justify-center gap-1"
                style={{
                  background: isActive ? `${n.color}18` : "var(--bg-card)",
                  borderColor: isActive ? n.color : "var(--border)",
                  boxShadow: isActive
                    ? `0 0 20px ${n.color}35, 0 4px 20px rgba(0,0,0,0.3)`
                    : "0 2px 8px rgba(0,0,0,0.3)",
                  transition: "background 0.2s, border-color 0.2s, box-shadow 0.2s",
                }}
              >
                <div
                  className="w-6 h-6 rounded-md flex items-center justify-center"
                  style={{
                    background: isActive ? `${n.color}22` : "var(--bg)",
                    border: `1px solid ${isActive ? n.color : "var(--border)"}`,
                    transition: "all 0.2s",
                  }}
                >
                  <Icon className="w-3 h-3" color={isActive ? n.color : "var(--muted)"} />
                </div>
                <div className="text-center leading-tight px-1">
                  <div
                    className="font-syne font-bold text-[10px]"
                    style={{ color: isActive ? "#fff" : "var(--muted)", transition: "color 0.2s" }}
                  >
                    {n.label}
                  </div>
                  <div
                    className="font-mono text-[7px] truncate w-full"
                    style={{ color: n.color, opacity: isActive ? 0.9 : 0.5 }}
                  >
                    {n.sublabel}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Detail panel */}
      <div className="shrink-0 px-3 pt-2 pb-4">
        <AnimatePresence mode="wait">
          {activeNode ? (
            <motion.div
              key={activeNode.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.18 }}
              className="rounded-xl border p-3 flex flex-col gap-1.5"
              style={{
                backgroundColor: `${activeNode.color}0d`,
                borderColor: `${activeNode.color}35`,
              }}
            >
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: activeNode.color }} />
                <span className="font-syne font-bold text-xs text-white">{activeNode.label}</span>
              </div>
              <p className="text-[10px] text-[var(--muted)] leading-relaxed">{activeNode.desc}</p>
              <div className="flex flex-wrap gap-1">
                {activeNode.techs.map((t) => (
                  <span
                    key={t}
                    className="px-1.5 py-0.5 rounded text-[9px] font-mono border"
                    style={{
                      color: activeNode.color,
                      borderColor: `${activeNode.color}35`,
                      background: `${activeNode.color}10`,
                    }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center gap-1.5 font-mono text-[9px] text-[var(--muted)] opacity-40 py-1"
            >
              <ChevronRight className="w-2.5 h-2.5" />
              Drag nodes · Click to inspect
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}