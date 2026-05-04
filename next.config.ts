import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // @ts-ignore - Mengatasi instruksi Next.js yang kontradiktif di terminal
  allowedDevOrigins: [
    "*.ngrok-free.app", 
    "*.ngrok.io", 
    "localhost:3000", 
    "192.168.1.2", 
    "192.168.1.8"
  ],
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
  logging: {
    fetches: {
      fullUrl: true,
    },
  },
  images: {
    // Serve images as AVIF first (50% smaller), then WebP (30% smaller), fallback PNG/JPEG
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 3600, // Cache optimized images for 1 hour
    remotePatterns: [
      { protocol: "https", hostname: "skillicons.dev" },
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "i.ytimg.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
  async headers() {
    return [
      {
        // Service Worker headers
        source: "/sw.js",
        headers: [
          { key: "Content-Type", value: "application/javascript" },
          { key: "Service-Worker-Allowed", value: "/" },
        ],
      },
      {
        // Security headers for all routes
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
      {
        // Long-cache for static assets
        source: "/assets/(.*)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
    ];
  },
};

export default nextConfig;