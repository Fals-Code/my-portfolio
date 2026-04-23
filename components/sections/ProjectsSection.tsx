"use client";

import React from "react";
import Link from "next/link";
import { projects } from "@/data/projects";
import HttpBadge from "../ui/HttpBadge";

function ProjectCard({ proj }: { proj: any }) {
  const isFeatured = proj.badge?.toLowerCase() === "featured";
  const isWIP = proj.badge?.toLowerCase() === "wip";
  
  const method = isWIP ? "PATCH" : (isFeatured ? "GET" : "POST");
  const status = isWIP ? "202 Accepted" : "200 OK";
  
  // Create a slug from title if not provided
  const slug = proj.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");

  return (
    <div 
      className={`group flex flex-col bg-[var(--bg-card)] border rounded-lg overflow-hidden interactive-hover transition-all duration-300 ${
        isFeatured 
          ? "border-[var(--get)]/50 hover:border-[var(--get)] hover:shadow-[0_0_20px_rgba(0,229,160,0.1)]" 
          : "border-[var(--border)] hover:border-[var(--muted)]"
      }`}
    >
      {/* Endpoint Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--border)] bg-[var(--bg-card2)] font-mono text-xs">
        <div className="flex items-center gap-3">
          <span className={`font-bold ${isWIP ? "text-[var(--patch)]" : (isFeatured ? "text-[var(--get)]" : "text-[var(--post)]")}`}>
            [{isWIP ? "WIP" : method}]
          </span>
          <span className="text-[var(--text)]">/api/projects/{slug}</span>
        </div>
        <div className={`font-bold ${isWIP ? "text-[var(--patch)]" : "text-[var(--get)]"}`}>
          {status}
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col flex-1 p-6 gap-4 relative">
        <h3 className="font-syne text-2xl font-bold text-[var(--text)] group-hover:text-[var(--get)] transition-colors">
          {proj.title}
        </h3>
        
        <p className="text-[var(--muted)] font-mono text-sm leading-relaxed flex-1">
          {proj.description}
        </p>

        {/* Tech Stack Tags */}
        <div className="flex flex-wrap gap-2 mt-2">
          {proj.tech?.map((t: string) => (
            <span key={t} className="font-mono text-[0.7rem] px-2 py-1 bg-[var(--bg-card2)] border border-[var(--border)] rounded text-[var(--text)]">
              [{t}]
            </span>
          ))}
        </div>

        {/* Footer KPI & CTA */}
        <div className="mt-6 pt-4 border-t border-[var(--border)] flex items-center justify-between font-mono text-xs">
          <div className="flex items-center gap-4 text-[var(--muted)]">
            {proj.kpi && <span>{proj.kpi}</span>}
            {!proj.kpi && <span>100% RELIABLE</span>}
          </div>
          
          <Link 
            href={proj.demo || proj.github || "#"} 
            className="flex items-center gap-2 text-[var(--text)] hover:text-[var(--get)] transition-colors group/link"
          >
            <span>→ STUDY</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function ProjectsSection() {
  // Taking only first 4 projects for the homepage
  const displayProjects = projects.slice(0, 4);

  return (
    <section id="projects" className="py-20 border-t border-[var(--border)]">
      <div className="max-w-7xl mx-auto px-6 md:px-10 scroll-reveal">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 mb-12">
          <div>
            <div className="font-mono text-xs text-[var(--get)] mb-2">/* recent endpoints */</div>
            <h2 className="text-4xl md:text-5xl">Available Projects</h2>
          </div>
          
          <HttpBadge method="GET" endpoint="/projects/all" href="/projects" className="text-sm" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {displayProjects.map((proj) => (
            <ProjectCard key={proj.id} proj={proj} />
          ))}
        </div>

      </div>
    </section>
  );
}
