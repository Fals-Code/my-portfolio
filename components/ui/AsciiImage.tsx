"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import NextImage from "next/image";

interface AsciiImageProps {
  src: string;
  alt: string;
  className?: string;
  chars?: string;
  resolution?: number;
}

export default function AsciiImage({ 
  src, 
  alt, 
  className = "", 
  chars = " 01#%*+=-:. ", // Density string (light to dark)
  resolution = 60 // Number of characters across the width
}: AsciiImageProps) {
  const [ascii, setAscii] = useState<string>("");
  const [isHovered, setIsHovered] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return;

      // Calculate dimensions
      const w = resolution;
      // Adjust height to account for font aspect ratio (characters are taller than they are wide)
      // Usually, a monospace character is about 2 times taller than its width.
      const h = Math.floor((img.height / img.width) * w * 0.55);
      
      canvas.width = w;
      canvas.height = h;

      // Draw image to canvas
      ctx.drawImage(img, 0, 0, w, h);

      // Get pixel data
      const imageData = ctx.getImageData(0, 0, w, h);
      const pixels = imageData.data;

      let asciiStr = "";
      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const offset = (y * w + x) * 4;
          const r = pixels[offset];
          const g = pixels[offset + 1];
          const b = pixels[offset + 2];
          const a = pixels[offset + 3];

          if (a === 0) {
            asciiStr += " ";
            continue;
          }

          // Calculate brightness (0-255)
          const brightness = (0.299 * r + 0.587 * g + 0.114 * b);
          
          // Map brightness to character array index
          // Higher brightness = lighter char (end of string)
          const charIndex = Math.floor((brightness / 255) * (chars.length - 1));
          asciiStr += chars[charIndex];
        }
        asciiStr += "\n";
      }

      setAscii(asciiStr);
    };
  }, [src, chars, resolution]);

  return (
    <div 
      className={`relative w-full h-full overflow-hidden group cursor-crosshair bg-[var(--bg-card)] ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => setIsHovered(!isHovered)}
    >
      <canvas ref={canvasRef} className="hidden" />
      
      {/* Real Image — Revealed on hover, optimized via next/image */}
      <motion.div
        className="absolute inset-0 w-full h-full z-10 rounded-[inherit] overflow-hidden"
        initial={{ opacity: 0, filter: "grayscale(100%) contrast(150%)" }}
        animate={{ 
          opacity: isHovered ? 1 : 0,
          filter: isHovered ? "grayscale(0%) contrast(100%)" : "grayscale(100%) contrast(150%)"
        }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      >
        <NextImage
          ref={imageRef as any}
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 768px) 256px, 288px"
          className="object-cover"
          priority={false}
        />
      </motion.div>

      {/* ASCII Art Overlay */}
      <motion.div 
        className="absolute inset-0 z-0 flex items-center justify-center p-1 bg-[#050508]"
        initial={{ opacity: 1 }}
        animate={{ opacity: isHovered ? 0 : 1 }}
        transition={{ duration: 0.4 }}
      >
        <pre className="font-mono text-[var(--get)] text-[6px] md:text-[8px] leading-[6px] md:leading-[8px] tracking-tighter whitespace-pre flex items-center justify-center select-none" style={{ textShadow: '0 0 5px var(--get)' }}>
          {ascii || "LOADING_MATRIX..."}
        </pre>
      </motion.div>

      {/* Cyberpunk Scanlines */}
      <div className="absolute inset-0 z-20 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] pointer-events-none opacity-30 mix-blend-overlay" />
    </div>
  );
}
