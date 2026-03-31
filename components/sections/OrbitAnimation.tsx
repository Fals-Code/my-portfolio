"use client";

import React from "react";
import Image from "next/image";

/**
 * OrbitAnimation
 * Pure CSS rotation for tech icons.
 */
export default function OrbitAnimation() {
  return (
    <div className="relative w-full h-[300px] md:h-[450px] flex items-center justify-center">
      {/* Center Glow */}
      <div className="absolute inset-0 bg-blue-500/10 blur-[100px] rounded-full" />
      
      {/* Center Icon */}
      <div className="z-10 p-6 glass-panel rounded-full shadow-[0_0_30px_rgba(232,83,58,0.2)] border-accent/20">
        <Image 
          src="https://skillicons.dev/icons?i=laravel" 
          alt="Laravel" 
          width={64} 
          height={64} 
          className="w-12 h-12 md:w-16 md:h-16"
        />
      </div>

      {/* Ring 1 - Slow */}
      <div className="absolute border border-border/40 rounded-full w-[160px] h-[160px] md:w-[240px] md:h-[240px] animate-spin-slow">
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 p-2 glass-panel rounded-lg">
          <Image src="https://skillicons.dev/icons?i=php" alt="PHP" width={24} height={24} />
        </div>
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 p-2 glass-panel rounded-lg">
          <Image src="https://skillicons.dev/icons?i=mysql" alt="MySQL" width={24} height={24} />
        </div>
      </div>

      {/* Ring 2 - Medium (Reverse) */}
      <div className="absolute border border-dotted border-border/20 rounded-full w-[260px] h-[260px] md:w-[380px] md:h-[380px] animate-spin-reverse-medium">
        <div className="absolute top-1/2 -left-4 -translate-y-1/2 p-2 glass-panel rounded-lg">
          <Image src="https://skillicons.dev/icons?i=js" alt="JS" width={24} height={24} />
        </div>
        <div className="absolute top-1/2 -right-4 -translate-y-1/2 p-2 glass-panel rounded-lg">
          <Image src="https://skillicons.dev/icons?i=github" alt="GitHub" width={24} height={24} />
        </div>
      </div>

      <style jsx>{`
        .animate-spin-slow {
          animation: spin 15s linear infinite;
        }
        .animate-spin-reverse-medium {
          animation: spin-reverse 10s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spin-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
      `}</style>
    </div>
  );
}
