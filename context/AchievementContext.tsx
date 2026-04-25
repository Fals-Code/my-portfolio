"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { Trophy, Star, ShieldCheck, Zap, Ghost, Eye } from "lucide-react";

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  unlocked: boolean;
}

interface AchievementContextType {
  achievements: Achievement[];
  unlockAchievement: (id: string) => void;
  isUnlocked: (id: string) => boolean;
}

const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: "HELLO_WORLD",
    title: "Hello World",
    description: "Welcome to Falah's Digital Domain.",
    icon: <Star className="w-5 h-5 text-[var(--get)]" />,
    unlocked: false,
  },
  {
    id: "HACKER_MODE",
    title: "Terminal Access",
    description: "Found the hidden terminal interface.",
    icon: <Zap className="w-5 h-5 text-[var(--patch)]" />,
    unlocked: false,
  },
  {
    id: "EXPLORER",
    title: "Deep Explorer",
    description: "Visited 3 different system modules.",
    icon: <Eye className="w-5 h-5 text-[var(--post)]" />,
    unlocked: false,
  },
  {
    id: "THEME_MASTER",
    title: "Art Director",
    description: "Switched between light and dark dimensions.",
    icon: <ShieldCheck className="w-5 h-5 text-[var(--put)]" />,
    unlocked: false,
  },
  {
    id: "TIME_TRAVELER",
    title: "Deep Diver",
    description: "Stayed in the system for more than 5 minutes.",
    icon: <Ghost className="w-5 h-5 text-[var(--delete)]" />,
    unlocked: false,
  },
];

const AchievementContext = createContext<AchievementContextType | undefined>(undefined);

export function AchievementProvider({ children }: { children: React.ReactNode }) {
  const [achievements, setAchievements] = useState<Achievement[]>(INITIAL_ACHIEVEMENTS);
  const [visitedPages, setVisitedPages] = useState<Set<string>>(new Set());
  const triggeredToasts = React.useRef<Set<string>>(new Set());

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("falah-achievements");
    if (saved) {
      try {
        const unlockedIds = JSON.parse(saved) as string[];
        // Pre-fill triggered toasts so we don't notify for already unlocked ones from past sessions
        unlockedIds.forEach(id => triggeredToasts.current.add(id));
        
        setAchievements((prev) =>
          prev.map((a) => ({
            ...a,
            unlocked: unlockedIds.includes(a.id),
          }))
        );
      } catch (e) {
        console.error("Failed to load achievements", e);
      }
    }
  }, []);

  const unlockAchievement = useCallback((id: string) => {
    if (triggeredToasts.current.has(id)) return;

    setAchievements((prev) => {
      const achievement = prev.find((a) => a.id === id);
      if (achievement && !achievement.unlocked) {
        triggeredToasts.current.add(id);
        
        // Trigger toast
        toast.custom((t) => (
          <div className="bg-[#0c0c0f] border-2 border-[var(--get)] p-4 rounded-xl shadow-[0_0_20px_rgba(0,229,160,0.2)] flex items-center gap-4 animate-in slide-in-from-right-full duration-500">
            <div className="bg-[var(--get)]/10 p-2 rounded-lg border border-[var(--get)]/30">
              <Trophy className="w-6 h-6 text-[var(--get)]" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--get)] mb-0.5">Achievement Unlocked</p>
              <h4 className="font-syne font-bold text-white leading-tight">{achievement.title}</h4>
              <p className="text-xs text-[var(--muted)]">{achievement.description}</p>
            </div>
          </div>
        ), {
          duration: 5000,
          position: "bottom-right",
        });

        const newAchievements = prev.map((a) =>
          a.id === id ? { ...a, unlocked: true } : a
        );
        
        // Save to localStorage
        const unlockedIds = newAchievements.filter(a => a.unlocked).map(a => a.id);
        localStorage.setItem("falah-achievements", JSON.stringify(unlockedIds));
        
        return newAchievements;
      }
      return prev;
    });
  }, []);

  const isUnlocked = useCallback((id: string) => {
    return achievements.find(a => a.id === id)?.unlocked || false;
  }, [achievements]);

  // Handle "HELLO_WORLD" on first load
  useEffect(() => {
    const timer = setTimeout(() => unlockAchievement("HELLO_WORLD"), 2000);
    return () => clearTimeout(timer);
  }, [unlockAchievement]);

  // Handle "TIME_TRAVELER" (5 minutes)
  useEffect(() => {
    const timer = setTimeout(() => unlockAchievement("TIME_TRAVELER"), 5 * 60 * 1000);
    return () => clearTimeout(timer);
  }, [unlockAchievement]);

  return (
    <AchievementContext.Provider value={{ achievements, unlockAchievement, isUnlocked }}>
      {children}
    </AchievementContext.Provider>
  );
}

export function useAchievements() {
  const context = useContext(AchievementContext);
  if (context === undefined) {
    throw new Error("useAchievements must be used within an AchievementProvider");
  }
  return context;
}
