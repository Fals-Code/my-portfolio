"use client";

import { useState, useEffect } from "react";
import { GitHubStats, GitHubLanguage } from "@/types";

// User specific constants
const GITHUB_USERNAME = "Fals-Code";
const CACHE_KEY = "falah-github-cache";
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Module-level cache to persist data during session
let memoryCache: { stats: GitHubStats; languages: GitHubLanguage[]; timestamp: number } | null = null;

const LANGUAGE_COLORS: Record<string, string> = {
  PHP: "#4F5D95",
  JavaScript: "#f1e05a",
  Blade: "#f7523f",
  CSS: "#563d7c",
  HTML: "#e34c26",
  TypeScript: "#3178c6",
  Vue: "#41b883",
  React: "#61dafb",
  // Add more as needed
};

/**
 * Custom hook to fetch and aggregate GitHub profile and repository data.
 * Features:
 * - Total stars calculation from all repositories
 * - Language distribution by byte count
 * - 5-minute intelligent caching
 * 
 * @returns { stats, languages, isLoading, error }
 */
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
        // 1. Fetch user profile
        const userRes = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}`);
        if (!userRes.ok) throw new Error("Failed to fetch user data");
        const userData = await userRes.json();

        // 2. Fetch all repositories (up to 100)
        const reposRes = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100`);
        if (!reposRes.ok) throw new Error("Failed to fetch repositories");
        const reposData = await reposRes.json();

        // 3. Aggregate Stats
        let totalStars = 0;
        const languagesMap: Record<string, number> = {};
        
        reposData.forEach((repo: any) => {
          totalStars += repo.stargazers_count;
          
          if (repo.language) {
            // We use the primary language and total size as a proxy for language bytes 
            // since fetching full language breakdown per repo is rate-limited on large counts
            const lang = repo.language;
            const size = repo.size * 1024; // convert KB to Bytes
            languagesMap[lang] = (languagesMap[lang] || 0) + size;
          }
        });

        const stats: GitHubStats = {
          repositories: userData.public_repos,
          followers: userData.followers,
          stars: totalStars,
        };

        // 4. Calculate Language Distribution
        const totalBytes = Object.values(languagesMap).reduce((a, b) => a + b, 0);
        const languages: GitHubLanguage[] = Object.entries(languagesMap)
          .map(([name, bytes]) => ({
            name,
            color: LANGUAGE_COLORS[name] || "#888888",
            percentage: totalBytes > 0 ? (bytes / totalBytes) * 100 : 0,
            bytes,
          }))
          .sort((a, b) => b.bytes - a.bytes)
          .slice(0, 8); // Top 8

        const result = { stats, languages, timestamp: Date.now() };
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
