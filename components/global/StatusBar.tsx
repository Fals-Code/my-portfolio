import React from "react";

export default function StatusBar() {
  return (
    <div className="fixed bottom-0 left-0 w-full bg-[var(--bg)]/90 backdrop-blur-md border-t border-[var(--border)] z-50 px-4 py-2 flex items-center justify-between text-[0.65rem] sm:text-xs font-mono text-[var(--muted)]">
      <div className="flex items-center gap-3 sm:gap-6 overflow-x-auto whitespace-nowrap hide-scrollbar">
        <div className="flex items-center gap-2 text-[var(--get)]">
          <span className="w-2 h-2 rounded-full bg-[var(--get)] animate-pulse" />
          <span className="font-bold">HTTP 200 OK</span>
        </div>
        <div className="hidden sm:block w-px h-3 bg-[var(--border)]" />
        <div className="flex items-center gap-2">
          <span>ENV:</span>
          <span className="text-[var(--text)]">production</span>
        </div>
        <div className="w-px h-3 bg-[var(--border)]" />
        <div className="flex items-center gap-2">
          <span>VERSION:</span>
          <span className="text-[var(--text)]">v3.0.0</span>
        </div>
        <div className="hidden md:block w-px h-3 bg-[var(--border)]" />
        <div className="hidden md:flex items-center gap-2">
          <span>STACK:</span>
          <span className="text-[var(--text)]">Laravel · MySQL · Next.js</span>
        </div>
      </div>
      <div className="pl-4 border-l border-[var(--border)] whitespace-nowrap">
        © 2026 falah.dev
      </div>
    </div>
  );
}
