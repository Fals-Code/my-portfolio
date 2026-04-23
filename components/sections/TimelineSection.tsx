import React from "react";

const timeline = [
  {
    id: "edu-unair",
    year: "2024 — Present",
    title: "D4 Teknik Informatika",
    place: "Universitas Airlangga",
    desc: "Focusing on software architecture, advanced data structures, and professional backend engineering practices."
  },
  {
    id: "proj-rshp",
    year: "2025",
    title: "Hospital Info System (RSHP)",
    place: "Academic Project",
    desc: "Developed a real-time queue management and doctor scheduling system using Laravel, ensuring zero schedule conflicts."
  },
  {
    id: "proj-warehouse",
    year: "2025",
    title: "Warehouse Inventory System",
    place: "Academic Project",
    desc: "Implemented a robust central database with ACID-compliant transactions for secure multi-table updates."
  }
];

export default function TimelineSection() {
  return (
    <div className="relative pl-6 space-y-12 before:absolute before:left-2 before:top-2 before:h-[calc(100%-1rem)] before:w-px before:bg-[var(--border)]">
      {timeline.map((item, i) => (
        <div key={item.id} className="relative group scroll-reveal" style={{ animationDelay: `${i * 0.15}s` }}>
          {/* Dot */}
          <div className="absolute -left-[1.35rem] top-1.5 w-3 h-3 rounded-full border border-[var(--get)] bg-[var(--bg)] group-hover:bg-[var(--get)] group-hover:shadow-[0_0_10px_rgba(0,229,160,0.5)] transition-all duration-300" />
          
          <div className="space-y-2">
            <div className="flex items-center gap-4 font-mono text-xs">
              <span className="text-[var(--get)] uppercase tracking-widest">{item.year}</span>
              <span className="text-[var(--border)]">|</span>
              <span className="text-[var(--post)] uppercase">{item.place}</span>
            </div>
            <h4 className="text-xl md:text-2xl font-syne font-bold text-[var(--text)] group-hover:text-[var(--get)] transition-colors duration-300">
              {item.title}
            </h4>
            <p className="text-sm text-[var(--muted)] font-mono leading-relaxed max-w-lg">
              {item.desc}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}