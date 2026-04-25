"use client";

import { useState, useEffect } from "react";

interface OnlineStatus {
  isOnline: boolean;
  isCoding: boolean;
  lastSeen: string | null;
  source: "wakatime" | "github";
}

let statusCache: (OnlineStatus & { timestamp: number }) | null = null;
const CACHE_DURATION = 60 * 1000; // 1 menit

export function useOnlineStatus() {
  const [status, setStatus] = useState<OnlineStatus>({
    isOnline: false,
    isCoding: false,
    lastSeen: null,
    source: "github",
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      if (statusCache && Date.now() - statusCache.timestamp < CACHE_DURATION) {
        setStatus({
          isOnline: statusCache.isOnline,
          isCoding: statusCache.isCoding,
          lastSeen: statusCache.lastSeen,
          source: statusCache.source,
        });
        setIsLoading(false);
        return;
      }
      try {
        const res = await fetch("/api/status");
        if (res.ok) {
          const data: OnlineStatus = await res.json();
          statusCache = { ...data, timestamp: Date.now() };
          setStatus(data);
        }
      } catch (e) {
        // silently fail
      } finally {
        setIsLoading(false);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return { ...status, isLoading };
}