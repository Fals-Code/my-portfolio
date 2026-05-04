"use client";

import React from "react";
import Link from "next/link";
import { projects as staticProjects } from "@/data/projects";
import { useGitHub } from "@/hooks/useGitHub";
import HttpBadge from "../ui/HttpBadge";
import { Star, GitFork, RefreshCw } from "lucide-react";
import { motion } from "framer-motion";

// Mapping GitHub repo name → case study URL (untuk proyek custom)
const CASE_STUDY_MAP: Record<string, string> = {
  "Proyek_RSHPV1": "/projects/rshp",
  "Proyek_PBDV1": "/projects/warehouse",
  "Framework_koleksi_buku": "/projects/book-collection",
};

function ProjectCard({ proj }: { proj: any }) {
  const isFeatured = proj.badge?.toLowerCase() === "featured" || (proj.stars && proj.stars > 0);
  const isWIP = proj.badge?.toLowerCase() === "wip";
  const method = isWIP ? "PATCH" : isFeatured ? "GET" : "POST";
  const status = isWIP ? "202 Accepted" : "200 OK";
  const slug = proj.id || proj.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");

  return (
    <motion.div 
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className={`group flex flex-col bg-[var(--bg-card)] border rounded-lg overflow-hidden transition-all duration-300 ${
      isFeatured
        ? "border-[var(--get)]/30 hover:border-[var(--get)] hover:shadow-[0_0_20px_rgba(0,229,160,0.15)]"
        : "border-[var(--border)] hover:border-[var(--muted)] hover:shadow-lg hover:shadow-[var(--border)]/20"
    }`}>
      <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--border)] bg-[var(--bg-card2)] text-xs">
        <div className="flex items-center gap-3">
          <span className={`font-bold ${isWIP ? "text-[var(--patch)]" : isFeatured ? "text-[var(--get)]" : "text-[var(--post)]"}`}>
            [{isWIP ? "WIP" : method}]
          </span>
          <span className="text-[var(--muted)]">/api/projects/{slug}</span>
        </div>
        <div className="flex items-center gap-3">
          {proj.stars !== undefined && (
            <span className="flex items-center gap-1 text-[var(--patch)]">
              <Star className="w-3 h-3" /> {proj.stars}
            </span>
          )}
          <span className={`font-bold ${isWIP ? "text-[var(--patch)]" : "text-[var(--get)]"}`}>
            {status}
          </span>
        </div>
      </div>

      <div className="flex flex-col flex-1 p-6 gap-4">
        <div>
          <h3 className="font-syne text-2xl font-bold text-[var(--text)] group-hover:text-[var(--get)] transition-colors mb-2">
            {proj.title}
          </h3>
          <p className="text-[var(--muted)] text-sm leading-relaxed line-clamp-3">
            {proj.description}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mt-auto">
          {(proj.tech || []).slice(0, 4).map((t: string) => (
            <span key={t} className="font-mono text-[0.7rem] px-2 py-1 bg-[var(--bg-card2)] border border-[var(--border)] rounded text-[var(--text)]">
              [{t}]
            </span>
          ))}
        </div>

        <div className="mt-6 pt-4 border-t border-[var(--border)] flex items-center justify-between font-mono text-xs">
          <div className="flex items-center gap-4 text-[var(--muted)]">
            {proj.forks !== undefined && (
              <span className="flex items-center gap-1">
                <GitFork className="w-3 h-3" /> {proj.forks}
              </span>
            )}
            {proj.kpi && <span className="hidden sm:inline opacity-60 italic">{proj.kpi}</span>}
          </div>

          {/* Fix: Only render link if a valid URL exists — never use href="#" */}
          {(CASE_STUDY_MAP[proj.id] || proj.caseStudy || proj.homepage || proj.github) ? (
            <Link
              href={
                CASE_STUDY_MAP[proj.id] ||
                proj.caseStudy ||
                proj.homepage ||
                proj.github ||
                "/projects"
              }
              className="flex items-center gap-2 text-[var(--text)] group-hover:text-[var(--get)] font-bold transition-all"
            >
              <span>→ {CASE_STUDY_MAP[proj.id] ? "STUDY" : "VIEW"}</span>
            </Link>
          ) : (
            // TODO: Add a case study or GitHub link for this project
            <span className="flex items-center gap-2 text-[var(--muted)] font-bold opacity-40 cursor-not-allowed" title="No link available">
              → PENDING
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function ProjectsSection() {
  const { projects: githubProjects, isLoading, refresh } = useGitHub(true);

  const mergedProjects = React.useMemo(() => {
    const staticIds = new Set(staticProjects.map((p) => p.id));
    const newFromGitHub = githubProjects
      .filter((gp) => !staticIds.has(gp.id) && !staticIds.has(gp.id.toLowerCase()))
      .slice(0, 2);

    return [...staticProjects.slice(0, 4), ...newFromGitHub];
  }, [githubProjects]);

  const displayProjects = mergedProjects.slice(0, 6);

  return (
    <section id="projects" className="py-20 border-t border-[var(--border)]">
      <div className="max-w-7xl mx-auto px-6 md:px-10 scroll-reveal">
        <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 mb-12">
          <div>
            <div className="font-mono text-xs text-[var(--get)] mb-2">
              /* recent endpoints */
            </div>
            <h2 className="text-4xl md:text-5xl">Available Projects</h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={refresh}
              disabled={isLoading}
              className="p-2 rounded-md border border-[var(--border)] text-[var(--muted)] hover:text-[var(--get)] hover:border-[var(--get)] transition-all disabled:opacity-50"
              title="Refresh dari GitHub"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
            </button>
            <HttpBadge method="GET" endpoint="/projects/all" href="/projects" className="text-sm" />
          </div>
        </div>

        {isLoading && displayProjects.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-64 bg-[var(--bg-card)] border border-[var(--border)] rounded-lg animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {displayProjects.map((proj) => (
              <ProjectCard key={proj.id} proj={proj} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}