"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { MonitorOff, ArrowLeft, Laptop } from "lucide-react";
import { Button } from "../ui/Primitives";

export default function MobileGating() {
  return (
    <div className="fixed inset-0 z-[200] bg-slate-950 flex items-center justify-center p-6 text-center overflow-hidden">
      {/* Background patterns */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--accent)_0%,_transparent_70%)] opacity-10" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/asphalt-dark.png')] opacity-20" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full space-y-8 relative z-10"
      >
        <div className="relative inline-block">
          <div className="w-24 h-24 rounded-[2rem] bg-accent/10 border border-accent/20 flex items-center justify-center mx-auto mb-2">
            <MonitorOff className="w-10 h-10 text-accent" />
          </div>
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full border-4 border-slate-950 flex items-center justify-center"
          >
            <div className="w-1.5 h-1.5 bg-white rounded-full" />
          </motion.div>
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl font-syne font-black text-white italic tracking-tighter">
            DESKTOP <span className="text-accent">REQUIRED</span>
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed font-medium">
            Pengalaman 3D ultra-realistik ini membutuhkan performa grafis tinggi dan kontrol keyboard yang tidak tersedia di perangkat mobile Anda.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white/5 border border-white/10 flex items-start gap-4 text-left">
            <Laptop className="w-6 h-6 text-cyan-400 shrink-0 mt-1" />
            <p className="text-xs text-slate-300 leading-relaxed">
                Silakan buka halaman ini melalui <b>Laptop</b> atau <b>Desktop</b> untuk menikmati simulasi secara penuh.
            </p>
        </div>

        <Button variant="outline" asChild className="w-full py-6 rounded-2xl border-white/10 text-white hover:bg-white hover:text-black">
          <Link href="/">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Portfolio
          </Link>
        </Button>
      </motion.div>
    </div>
  );
}
