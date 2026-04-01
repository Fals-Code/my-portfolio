"use client";

import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full py-12 px-6 border-t border-black/10 dark:border-white/10 mt-auto relative z-10">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-sm text-text-muted">
          © {new Date().getFullYear()} Ahmad Mathlaul Falah. All rights reserved.
        </div>
        <div className="flex items-center gap-8 text-sm font-medium">
          <a href="https://github.com/Fals-Code" target="_blank" rel="noopener noreferrer" className="hover:text-accent transition-colors">Github</a>
          <Link href="/contact" className="hover:text-accent transition-colors">Contact</Link>
        </div>
      </div>
    </footer>
  );
}
