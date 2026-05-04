import React from "react";

interface SkillBarProps {
  techName: string;
  icon?: string;
  percentage: number;
  level: string;
  colorMethod: "GET" | "POST" | "PATCH" | "DELETE" | "PUT";
}

const colorMap = {
  GET: "var(--get)",
  POST: "var(--post)",
  PATCH: "var(--patch)",
  DELETE: "var(--delete)",
  PUT: "var(--put)",
};

export default function SkillBar({
  techName,
  icon,
  percentage,
  level,
  colorMethod,
}: SkillBarProps) {
  const color = colorMap[colorMethod];
  
  // Calculate ASCII blocks
  const totalBlocks = 15;
  const filledCount = Math.round((percentage / 100) * totalBlocks);
  const emptyCount = totalBlocks - filledCount;
  
  const filledStr = "█".repeat(filledCount);
  const emptyStr = "░".repeat(emptyCount);

  return (
    <div className="w-full flex flex-col gap-2 group">
      <div className="flex items-center justify-between font-mono text-sm">
        <div className="flex items-center gap-2">
          {icon && <span>{icon}</span>}
          <span className="text-[var(--text)] font-bold">{techName}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-[var(--muted)]">{level}</span>
          <span style={{ color }} className="font-bold">
            {percentage}%
          </span>
        </div>
      </div>
      
      {/* ASCII Track */}
      <div className="font-mono text-xs mt-1 w-full flex items-center justify-between">
        <span className="text-[var(--muted)] opacity-50">[</span>
        <div className="flex-1 px-1 flex items-center tracking-widest relative overflow-hidden">
          <span 
            style={{ 
              color: color, 
              textShadow: `0 0 8px ${color}80` 
            }}
          >
            {filledStr}
          </span>
          <span className="text-[var(--muted)] opacity-30">
            {emptyStr}
          </span>
        </div>
        <span className="text-[var(--muted)] opacity-50">]</span>
      </div>
    </div>
  );
}
