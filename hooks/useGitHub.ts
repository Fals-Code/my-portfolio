"use client";

import { useState, useEffect, useCallback } from "react";
import { GitHubStats, GitHubLanguage } from "@/types";

interface GitHubProject {
  id: string;
  title: string;
  description: string;
  tech: string[];
  stars: number;
  forks: number;
  language: string;
  github: string;
  homepage: string | null;
  updatedAt: string;
}

interface GitHubData {
  stats: GitHubStats;
  languages: GitHubLanguage[];
  projects: GitHubProject[];
  lastPushAt: string | null;
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 menit
const REFRESH_INTERVAL = 5 * 60 * 1000; // auto-refresh setiap 5 menit

let memoryCache: (GitHubData & { timestamp: number }) | null = null;

export function useGitHub(autoRefresh = false) {
  const [data, setData] = useState<GitHubData | null>(
    memoryCache ? {
      stats: memoryCache.stats,
      languages: memoryCache.languages,
      projects: memoryCache.projects,
      lastPushAt: memoryCache.lastPushAt,
    } : null
  );
  const [isLoading, setIsLoading] = useState(
    !memoryCache || Date.now() - memoryCache.timestamp > CACHE_DURATION
  );
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (force = false) => {
    if (!force && memoryCache && Date.now() - memoryCache.timestamp < CACHE_DURATION) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("/api/github", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch GitHub data");
      const json: GitHubData = await res.json();

      const result = { ...json, timestamp: Date.now() };
      memoryCache = result;
      setData(json);
      setError(null);
    } catch (err) {
      console.error("GitHub Fetch Error:", err);
      setError("Error syncing with GitHub API");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Auto-refresh polling
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => fetchData(true), REFRESH_INTERVAL);
    return () => clearInterval(interval);
  }, [autoRefresh, fetchData]);

  // Refresh ketika tab kembali aktif
  useEffect(() => {
    if (!autoRefresh) return;
    const handleVisibility = () => {
      if (document.visibilityState === "visible") fetchData();
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () =>
      document.removeEventListener("visibilitychange", handleVisibility);
  }, [autoRefresh, fetchData]);

  return {
    stats: data?.stats || { repositories: 0, followers: 0, stars: 0 },
    languages: data?.languages || [],
    projects: data?.projects || [],
    lastPushAt: data?.lastPushAt || null,
    isLoading,
    error,
    refresh: () => fetchData(true),
  };
}