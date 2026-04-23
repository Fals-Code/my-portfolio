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
      
      {/* Track */}
      <div className="h-1.5 w-full bg-[var(--bg-card2)] rounded-full overflow-hidden">
        {/* Fill */}
        <div 
          className="h-full rounded-full transition-all duration-1000 ease-out"
          style={{ 
            width: `${percentage}%`,
            backgroundColor: color,
            boxShadow: `0 0 10px ${color}80`
          }}
        />
      </div>
    </div>
  );
}
