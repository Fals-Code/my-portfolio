"use client";

import { useState, useEffect } from "react";
import { GitHubStats, GitHubLanguage } from "@/types";

// User specific constants
// User specific constants
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Module-level cache to persist data during session
let memoryCache: { stats: GitHubStats; languages: GitHubLanguage[]; timestamp: number } | null = null;

export function useGitHub() {
  const [data, setData] = useState<{ stats: GitHubStats; languages: GitHubLanguage[] } | null>(memoryCache ? { stats: memoryCache.stats, languages: memoryCache.languages } : null);
  const [isLoading, setIsLoading] = useState(!memoryCache || Date.now() - memoryCache.timestamp > CACHE_DURATION);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      // Check cache validity
      if (memoryCache && Date.now() - memoryCache.timestamp < CACHE_DURATION) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const res = await fetch("/api/github");
        if (!res.ok) throw new Error("Failed to fetch Github data");
        const json = await res.json();
        
        const result = { stats: json.stats, languages: json.languages, timestamp: Date.now() };
        memoryCache = result;
        setData({ stats: result.stats, languages: result.languages });
        setError(null);
      } catch (err) {
        console.error("GitHub Fetch Error:", err);
        setError("Error syncing with GitHub API");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return { 
    stats: data?.stats || { repositories: 0, followers: 0, stars: 0 }, 
    languages: data?.languages || [], 
    isLoading, 
    error 
  };
}
