"use client";

import { useState, useEffect } from "react";

interface WakaTimeLanguage {
  name: string;
  percent: number;
  text: string;
}

interface WakaTimeProject {
  name: string;
  text: string;
  percent: number;
}

interface WakaTimeTodayStatus {
  isCoding: boolean;
  currentProject: string | null;
  currentLanguage: string | null;
  lastHeartbeatAt: string | null;
  todayTotal: string;
}

interface WakaTimeWeeklyStats {
  totalSeconds: number;
  dailyAvgSeconds: number;
  languages: WakaTimeLanguage[];
  editors: { name: string; percent: number; text: string }[];
  projects: WakaTimeProject[];
  categories: { name: string; text: string; percent: number }[];
}

interface WakaTimeData {
  weeklyStats: WakaTimeWeeklyStats | null;
  todayStatus: WakaTimeTodayStatus | null;
}

let wakatimeCache: (WakaTimeData & { timestamp: number }) | null = null;
const CACHE_DURATION = 5 * 60 * 1000; // 5 menit

function secondsToReadable(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  if (h === 0) return `${m} mins`;
  if (m === 0) return `${h} hrs`;
  return `${h} hrs ${m} mins`;
}

export function useWakaTime() {
  const [data, setData] = useState<WakaTimeData | null>(
    wakatimeCache ? {
      weeklyStats: wakatimeCache.weeklyStats,
      todayStatus: wakatimeCache.todayStatus,
    } : null
  );
  const [isLoading, setIsLoading] = useState(!wakatimeCache);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async (force = false) => {
    if (!force && wakatimeCache && Date.now() - wakatimeCache.timestamp < CACHE_DURATION) {
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch("/api/wakatime");
      if (!res.ok) throw new Error("WakaTime unavailable");
      const json: WakaTimeData = await res.json();
      wakatimeCache = { ...json, timestamp: Date.now() };
      setData(json);
    } catch (err) {
      setError("WakaTime data not available");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Smart refresh: only when tab is visible
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === "visible") fetchData();
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, []);

  return {
    weeklyStats: data?.weeklyStats || null,
    todayStatus: data?.todayStatus || null,
    weeklyTotal: data?.weeklyStats
      ? secondsToReadable(data.weeklyStats.totalSeconds)
      : "—",
    dailyAvg: data?.weeklyStats
      ? secondsToReadable(data.weeklyStats.dailyAvgSeconds)
      : "—",
    isCoding: data?.todayStatus?.isCoding || false,
    isLoading,
    error,
  };
}