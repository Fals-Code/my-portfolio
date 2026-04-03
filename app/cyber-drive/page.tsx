"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import Link from "next/link";
import { ArrowLeft, RotateCcw, Zap, Target } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { usePerformance } from "@/hooks/usePerformance";
import MobileGating from "@/components/global/MobileGating";

/**
 * Cyberpunk Synth-Drive
 * An extreme realism 3D driving experience built with Three.js.
 * Features: Procedural neon city, Advanced Rain (3D + Overlay), First-Person Cockpit.
 */
export default function CyberDrivePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState<"start" | "playing" | "gameover">("start");
  const [highScore, setHighScore] = useState(0);
  const { isLow } = usePerformance();

  useEffect(() => {
    if (!containerRef.current || gameState !== "playing" || isLow) return;

    // --- Audio Support ---
    const bgm = new Audio("https://assets.mixkit.co/music/preview/mixkit-serene-night-1761.mp3");
    bgm.loop = true; bgm.volume = 0.5;
    const sfxRain = new Audio("https://assets.mixkit.co/sfx/preview/mixkit-ambient-rain-1014.mp3");
    sfxRain.loop = true; sfxRain.volume = 0.3;

    // --- Scene Setup ---
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x020617); // Deepest Midnight
    scene.fog = new THREE.FogExp2(0x020617, 0.012); // Thick Atmosphere

    const camera = new THREE.PerspectiveCamera(85, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.VSMShadowMap;
    renderer.toneMapping = THREE.ReinhardToneMapping;
    renderer.toneMappingExposure = 1.6;
    if (containerRef.current) containerRef.current.appendChild(renderer.domElement);

    // --- Atmospheric Lighting ---
    const ambient = new THREE.AmbientLight(0x1e293b, 0.4);
    scene.add(ambient);

    // Moonlight / Distant Neon Bloom
    const moonlight = new THREE.DirectionalLight(0x7dd3fc, 0.6);
    moonlight.position.set(-50, 80, -100);
    scene.add(moonlight);

    // --- Premium Materials ---
    const matRoad = new THREE.MeshStandardMaterial({ 
      color: 0x0a0a0a, 
      roughness: 0.05, 
      metalness: 1, 
      envMapIntensity: 2 
    });
    
    const matBuilding = new THREE.MeshStandardMaterial({ color: 0x111827, roughness: 0.1, metalness: 0.6 });
    const matWindow = new THREE.MeshStandardMaterial({ 
      emissive: 0x22d3ee, 
      emissiveIntensity: 5, 
      color: 0x000000 
    });
    const matNeonBase = (color: number) => new THREE.MeshStandardMaterial({
        emissive: color,
        emissiveIntensity: 12,
        color: 0x000000
    });

    // --- Environment Generation ---
    const road = new THREE.Mesh(new THREE.PlaneGeometry(12, 1000), matRoad);
    road.rotation.x = -Math.PI / 2;
    road.receiveShadow = true;
    scene.add(road);

    const skyscrapers: THREE.Group[] = [];
    const createSkyscraper = (z: number, left: boolean) => {
        const h = 25 + Math.random() * 60;
        const w = 15 + Math.random()*15;
        const g = new THREE.Group();
        const b = new THREE.Mesh(new THREE.BoxGeometry(w, h, 15), matBuilding);
        b.position.y = h/2;
        g.add(b);

        // Windows
        const winCount = 20;
        for(let i=0; i<winCount; i++) {
            const win = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), matWindow);
            const rY = 5 + Math.random()*(h-10);
            const rX = (Math.random()-0.5)*(w-4);
            win.position.set(left ? w/2 + 0.1 : -w/2 - 0.1, rY, (Math.random()-0.5)*12);
            win.rotation.y = left ? Math.PI/2 : -Math.PI/2;
            g.add(win);
        }

        // Billboard/Neon
        if(Math.random() > 0.6) {
            const neonCol = [0xe8533a, 0x22d3ee, 0xfacc15][Math.floor(Math.random()*3)];
            const neon = new THREE.Mesh(new THREE.BoxGeometry(0.2, 8, 4), matNeonBase(neonCol));
            neon.position.set(left ? w/2 + 0.2 : -w/2 - 0.2, h*0.7, 0);
            const pLight = new THREE.PointLight(neonCol, 15, 25);
            pLight.position.copy(neon.position);
            g.add(neon, pLight);
        }

        g.position.set(left ? -w/2 - 8 : w/2 + 8, 0, z);
        scene.add(g);
        skyscrapers.push(g);
    };

    for(let i=0; i<20; i++) {
        createSkyscraper(-i * 50, true);
        createSkyscraper(-i * 50, false);
    }

    // --- Advanced Rain 3.0 ---
    const rainCount = 6000;
    const rainGeo = new THREE.BufferGeometry();
    const rainPos = new Float32Array(rainCount * 3);
    for(let i=0; i<rainCount; i++) {
        rainPos[i*3] = (Math.random()-0.5)*50;
        rainPos[i*3+1] = Math.random()*50;
        rainPos[i*3+2] = -Math.random()*250;
    }
    rainGeo.setAttribute("position", new THREE.BufferAttribute(rainPos, 3));
    const rainMat = new THREE.PointsMaterial({ color: 0x888888, size: 0.1, transparent: true, opacity: 0.4 });
    const rain = new THREE.Points(rainGeo, rainMat);
    scene.add(rain);

    // --- First-Person Cockpit ---
    const cockpit = new THREE.Group();
    // Glass/HUD Panel
    const hud = new THREE.Mesh(
        new THREE.PlaneGeometry(2, 0.8),
        new THREE.MeshStandardMaterial({ color: 0x0ea5e9, transparent: true, opacity: 0.05, metalness: 1, roughness: 0 })
    );
    hud.position.set(0, 0.85, -1);
    
    // Steering Wheel / Control Base
    const base = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.6, 1), matBuilding);
    base.position.set(0, 0.5, 0);
    
    const wheel = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.04, 16, 32), matNeonBase(0x22d3ee));
    wheel.position.set(0, 0.8, -0.4);
    wheel.rotation.x = -Math.PI/4;

    cockpit.add(hud, base, wheel);
    scene.add(cockpit);

    // --- State & Motion ---
    let speed = 1.0, currentXPosition = 0, targetX = 0, isKeyLeft = false, isKeyRight = false;

    const handleKey = (e: KeyboardEvent) => {
        if(e.key === "ArrowLeft") isKeyLeft = true;
        if(e.key === "ArrowRight") isKeyRight = true;
    };
    const handleUp = (e: KeyboardEvent) => {
        if(e.key === "ArrowLeft") isKeyLeft = false;
        if(e.key === "ArrowRight") isKeyRight = false;
    };
    window.addEventListener("keydown", handleKey);
    window.addEventListener("keyup", handleUp);
    
    bgm.play().catch(()=>{});
    sfxRain.play().catch(()=>{});

    let frameId: number;
    const animate = () => {
        frameId = requestAnimationFrame(animate);

        // Movement Logic
        if(isKeyLeft && targetX > -4) targetX -= 0.15;
        if(isKeyRight && targetX < 4) targetX += 0.15;
        
        cockpit.position.x += (targetX - cockpit.position.x) * 0.1;
        cockpit.rotation.z = (targetX - cockpit.position.x) * -0.05;
        camera.position.set(cockpit.position.x, 1.4, 0.5);
        camera.lookAt(cockpit.position.x * 0.4, 1.2, -50);

        // Env Animation
        skyscrapers.forEach(s => {
            s.position.z += speed;
            if(s.position.z > 50) s.position.z = -950;
        });
        
        // Rain Animation
        const pArr = rainGeo.attributes.position.array as Float32Array;
        for(let i=0; i<rainCount; i++) {
            pArr[i*3+1] -= 2 + Math.random()*2;
            if(pArr[i*3+1] < 0) pArr[i*3+1] = 50;
        }
        rainGeo.attributes.position.needsUpdate = true;
        rain.position.x = cockpit.position.x;

        // Score
        setScore(prev => prev + 1);
        speed += 0.0002;

        renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", onResize);

    return () => {
        window.removeEventListener("keydown", handleKey);
        window.removeEventListener("keyup", handleUp);
        window.removeEventListener("resize", onResize);
        bgm.pause(); sfxRain.pause();
        cancelAnimationFrame(frameId);
        if(containerRef.current) containerRef.current.removeChild(renderer.domElement);
    };
  }, [gameState, isLow]);

  useEffect(() => { if(score > highScore) setHighScore(score); }, [score, highScore]);

  if (isLow) {
    return <MobileGating />;
  }

  return (
    <div className="relative w-full h-screen bg-slate-950 overflow-hidden font-syne">
      {/* UI Elements */}
      <div className="absolute top-8 left-8 z-30 flex items-center gap-6">
        <Link href="/" className="flex items-center gap-2 text-white/50 hover:text-cyan-400 transition-all font-bold uppercase tracking-widest text-[10px]">
          <ArrowLeft className="w-4 h-4" /> Disconnect
        </Link>
      </div>

      <div className="absolute top-8 right-8 z-30 text-right">
        <div className="flex items-end gap-3 justify-end">
            <div className="text-cyan-400 text-6xl font-black italic tracking-tighter drop-shadow-[0_0_20px_rgba(34,211,238,0.5)]">{score}</div>
            <div className="pb-1 text-white/20 text-xs font-bold uppercase tracking-widest">km/h</div>
        </div>
        <div className="text-white/40 text-[9px] font-bold uppercase tracking-[0.6em] mt-1 mr-1">Data Stream Rate</div>
      </div>

      <AnimatePresence>
        {gameState === "start" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-40 flex items-center justify-center bg-slate-950/80 backdrop-blur-3xl">
            <div className="text-center space-y-12 max-w-xl px-12">
              <div className="space-y-4">
                <h1 className="text-8xl font-black text-white italic tracking-tighter leading-none">
                    SYNTH <br /> 
                    <span className="text-cyan-400 drop-shadow-[0_0_30px_rgba(34,211,238,0.6)]">DRIVE</span>
                </h1>
                <p className="text-white/40 font-bold uppercase tracking-[0.4em] text-xs">High Fidelity Reality Simulation</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-6 rounded-3xl bg-white/5 border border-white/10 text-left space-y-3">
                    <Target className="w-5 h-5 text-cyan-400" />
                    <p className="text-white/60 text-xs font-medium leading-relaxed">Navigate the data stream using your <b>Arrow Keys</b> to maintain sync.</p>
                </div>
                <div className="p-6 rounded-3xl bg-white/5 border border-white/10 text-left space-y-3">
                    <Zap className="w-5 h-5 text-orange-400" />
                    <p className="text-white/60 text-xs font-medium leading-relaxed">Avoid collisions with corrupted memory blocks (Buildings).</p>
                </div>
              </div>

              <button 
                onClick={() => setGameState("playing")} 
                className="group relative w-full overflow-hidden bg-cyan-500 text-slate-950 py-7 rounded-2xl text-[11px] font-black uppercase tracking-[0.8em] hover:bg-white transition-all shadow-[0_20px_50px_rgba(34,211,238,0.3)]"
              >
                Enter Simulation
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3D Container */}
      <div ref={containerRef} className="absolute inset-0 z-10" />

      {/* Realistic Cinematic Post-Processing */}
      <div className="absolute inset-0 z-20 pointer-events-none">
          {/* Heavy Film Vignette */}
          <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_30%,rgba(2,6,23,0.9)_120%)]" />
          
          {/* Dashboard Reflection Glow */}
          <div className="absolute bottom-0 left-0 w-full h-[40vh] bg-gradient-to-t from-cyan-950/30 to-transparent mix-blend-screen" />

          {/* Rain on Windshield Simulation */}
          <div className="absolute inset-0 opacity-[0.08] mix-blend-overlay bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />

          {/* CRT / Scanline Effect */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]" />

          {/* Color Grade - Deep Cyan/Teal Shift */}
          <div className="absolute inset-0 bg-cyan-500/5 mix-blend-color" />
      </div>
    </div>
  );
}
