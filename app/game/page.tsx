"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import Link from "next/link";
import { ArrowLeft, Trophy, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * GamePage
 * A simple 3D Infinite Runner built with Three.js.
 */
export default function GamePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState<"start" | "playing" | "gameover">("start");
  const [highScore, setHighScore] = useState(0);

  useEffect(() => {
    if (!containerRef.current || gameState !== "playing") return;

    // --- Three.js Setup ---
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x050505, 10, 180); // Lighter Fog for much better visibility

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    if (containerRef.current) {
      containerRef.current.appendChild(renderer.domElement);
    }

    // --- Lights ---
    // Increase light intensity to make everything pop
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xe8533a, 4, 100);
    scene.add(pointLight);
    const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
    dirLight.position.set(10, 20, 10);
    scene.add(dirLight);

    // --- High-Fidelity Character (Hero) ---
    const playerGroup = new THREE.Group();
    const bodyGeo = new THREE.BoxGeometry(0.5, 0.8, 0.4);
    const headGeo = new THREE.BoxGeometry(0.35, 0.35, 0.35);
    const limbGeo = new THREE.BoxGeometry(0.2, 0.5, 0.2);
    const mainMat = new THREE.MeshStandardMaterial({ color: 0xe8533a, emissive: 0xe8533a, emissiveIntensity: 1.5 });
    
    const body = new THREE.Mesh(bodyGeo, mainMat);
    body.position.y = 0.5;
    const head = new THREE.Mesh(headGeo, mainMat);
    head.position.y = 1.15;
    const lLeg = new THREE.Mesh(limbGeo, mainMat); lLeg.position.set(-0.15, 0.25, 0);
    const rLeg = new THREE.Mesh(limbGeo, mainMat); rLeg.position.set(0.15, 0.25, 0);

    playerGroup.add(body, head, lLeg, rLeg);
    scene.add(playerGroup);

    // --- Detailed Subway Environment ---
    const LANES = [-3.5, 0, 3.5];
    const roadWidth = 14;
    const groundGeo = new THREE.PlaneGeometry(roadWidth, 2000);
    const groundMat = new THREE.MeshStandardMaterial({ color: 0x0a0a0a, roughness: 0.1, metalness: 0.9 });
    const ground = new THREE.Mesh(groundGeo, groundMat); ground.rotation.x = -Math.PI / 2;
    scene.add(ground);

    // Rails
    const railGeo = new THREE.BoxGeometry(0.1, 0.1, 2000);
    const railMat = new THREE.MeshStandardMaterial({ color: 0x444444, metalness: 1 });
    [-4, -3, -0.5, 0.5, 3, 4].forEach(x => {
        const rail = new THREE.Mesh(railGeo, railMat);
        rail.position.set(x, 0.05, 0);
        scene.add(rail);
    });

    // Sleepers (Moving track planks)
    const sleepers: THREE.Mesh[] = [];
    const sleeperGeo = new THREE.BoxGeometry(10, 0.1, 0.4);
    const sleeperMat = new THREE.MeshStandardMaterial({ color: 0x222222 });
    for (let i = 0; i < 40; i++) {
        const sleeper = new THREE.Mesh(sleeperGeo, sleeperMat);
        sleeper.position.set(0, 0, -i * 5);
        scene.add(sleeper);
        sleepers.push(sleeper);
    }

    // Tunnel Pillars (Side Walls Scenery)
    const scenery: THREE.Group[] = [];
    const spawnPillar = (z: number) => {
        const group = new THREE.Group();
        const pillarGeo = new THREE.BoxGeometry(0.5, 10, 0.5);
        const neonMat = new THREE.MeshStandardMaterial({ color: 0x3b82f6, emissive: 0x3b82f6, emissiveIntensity: 2 });
        const leftP = new THREE.Mesh(pillarGeo, neonMat); leftP.position.set(-8, 5, z);
        const rightP = new THREE.Mesh(pillarGeo, neonMat); rightP.position.set(8, 5, z);
        group.add(leftP, rightP);
        scene.add(group);
        scenery.push(group);
    };
    for (let i = 0; i < 15; i++) spawnPillar(-i * 15);

    // --- High-Fidelity Obstacles ---
    const obstacles: THREE.Group[] = [];
    const coins: THREE.Mesh[] = [];

    const spawnTrain = (lane: number) => {
      const group = new THREE.Group();
      // Main Body
      const bodyGeo = new THREE.BoxGeometry(2.8, 3.5, 12);
      const bodyMat = new THREE.MeshStandardMaterial({ color: 0xff5f56, emissive: 0xff5f56, emissiveIntensity: 0.1 });
      const train = new THREE.Mesh(bodyGeo, bodyMat);
      train.position.y = 1.75;
      // Windows / Lights
      const windowGeo = new THREE.BoxGeometry(3, 0.8, 1);
      const lightMat = new THREE.MeshStandardMaterial({ color: 0xffbd2e, emissive: 0xffbd2e, emissiveIntensity: 1 });
      const frontWin = new THREE.Mesh(windowGeo, lightMat);
      frontWin.position.set(0, 2.5, -5.6);
      group.add(train, frontWin);
      group.position.set(LANES[lane], 0, -200);
      scene.add(group);
      obstacles.push(group);
    };

    const spawnHurdle = (lane: number) => {
      const group = new THREE.Group();
      const barGeo = new THREE.BoxGeometry(3, 0.4, 0.4);
      const stripeMat = new THREE.MeshStandardMaterial({ color: 0xffbd2e });
      const bar = new THREE.Mesh(barGeo, stripeMat); bar.position.y = 0.8;
      const legGeo = new THREE.BoxGeometry(0.2, 0.8, 0.2);
      const lLeg = new THREE.Mesh(legGeo, stripeMat); lLeg.position.set(-1.4, 0.4, 0);
      const rLeg = new THREE.Mesh(legGeo, stripeMat); rLeg.position.set(1.4, 0.4, 0);
      group.add(bar, lLeg, rLeg);
      group.position.set(LANES[lane], 0, -200);
      scene.add(group);
      obstacles.push(group);
    };

    const spawnCoin = (lane: number) => {
      const geo = new THREE.CylinderGeometry(0.4, 0.4, 0.1, 32);
      const mat = new THREE.MeshStandardMaterial({ color: 0x27c93f, emissive: 0x27c93f, emissiveIntensity: 2 });
      const coin = new THREE.Mesh(geo, mat);
      coin.rotation.x = Math.PI / 2;
      coin.position.set(LANES[lane], 1.2, -200);
      scene.add(coin);
      coins.push(coin);
    };

    // --- State & Movement Logic ---
    let currentLane = 1;
    let targetX = LANES[1];
    let isJumping = false;
    let jumpVel = 0;
    const gravity = -0.015;
    let isSliding = false;
    let slideT = 0;
    let speed = 1.0;
    let internalS = 0;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== "playing") return;
      if (e.key === "ArrowLeft" && currentLane > 0) { currentLane--; targetX = LANES[currentLane]; }
      if (e.key === "ArrowRight" && currentLane < 2) { currentLane++; targetX = LANES[currentLane]; }
      if (e.key === "ArrowUp" && !isJumping && !isSliding) { isJumping = true; jumpVel = 0.38; }
      if (e.key === "ArrowDown" && !isJumping && !isSliding) { isSliding = true; slideT = 35; }
    };
    window.addEventListener("keydown", handleKeyDown);

    // --- Animation Loop ---
    let frameId: number;
    const animate = () => {
      frameId = requestAnimationFrame(animate);

      // Player Movement
      playerGroup.position.x += (targetX - playerGroup.position.x) * 0.15;
      
      // Running Body Bob
      if (!isJumping && !isSliding) {
        playerGroup.position.y = Math.abs(Math.sin(Date.now() * 0.01)) * 0.1;
        lLeg.rotation.x = Math.sin(Date.now() * 0.01) * 0.5;
        rLeg.rotation.x = -Math.sin(Date.now() * 0.01) * 0.5;
      }

      if (isJumping) {
        playerGroup.position.y += jumpVel;
        jumpVel += gravity;
        if (playerGroup.position.y <= 0) { playerGroup.position.y = 0; isJumping = false; }
      }

      if (isSliding) {
        playerGroup.scale.y = 0.4;
        slideT--;
        if (slideT <= 0) { playerGroup.scale.y = 1; isSliding = false; }
      }

      // Scrolling Scenery
      sleepers.forEach(s => {
          s.position.z += speed;
          if (s.position.z > 10) s.position.z = -180;
      });
      scenery.forEach(p => {
          p.position.z += speed;
          if (p.position.z > 10) p.position.z = -180;
      });

      // Move & Collect Coins
      coins.forEach((c, i) => {
        c.position.z += speed;
        c.rotation.y += 0.05;
        if (Math.abs(c.position.x - playerGroup.position.x) < 1 && 
            Math.abs(c.position.z - playerGroup.position.z) < 2 &&
            Math.abs(c.position.y - (playerGroup.position.y + 0.6)) < 2) {
          scene.remove(c); coins.splice(i, 1);
          internalS += 100; setScore(internalS);
        }
        if (c.position.z > 20) { scene.remove(c); coins.splice(i, 1); }
      });

      // Move & Collision Obstacles
      obstacles.forEach((obs, i) => {
        obs.position.z += speed;
        
        obs.children.forEach(child => {
            if (!(child instanceof THREE.Mesh)) return;
            const worldPos = new THREE.Vector3();
            child.getWorldPosition(worldPos);
            
            const dx = Math.abs(worldPos.x - playerGroup.position.x);
            const dz = Math.abs(worldPos.z - playerGroup.position.z);
            const dy = Math.abs(worldPos.y - (playerGroup.position.y+0.6));

            const bX = (child.geometry as THREE.BoxGeometry).parameters.width / 2 + 0.3;
            const bZ = (child.geometry as THREE.BoxGeometry).parameters.depth / 2 + 0.3;
            const bY = (child.geometry as THREE.BoxGeometry).parameters.height / 2 + (isSliding ? 0.3 : 0.6);

            if (dx < bX && dz < bZ && dy < bY) { setGameState("gameover"); cancelAnimationFrame(frameId); }
        });

        if (obs.position.z > 30) {
          scene.remove(obs);
          obstacles.splice(i, 1);
          internalS += 10; setScore(internalS);
        }
      });

      // Spawning
      if (Math.random() < 0.015) {
          const rand = Math.random();
          const lane = Math.floor(Math.random() * 3);
          if (rand < 0.4) spawnTrain(lane);
          else spawnHurdle(lane);
      }
      if (Math.random() < 0.01) spawnCoin(Math.floor(Math.random()*3));

      speed += 0.0001;
      camera.position.set(0, 5, 12);
      camera.lookAt(new THREE.Vector3(playerGroup.position.x * 0.3, 1, -15));
      pointLight.position.copy(playerGroup.position).add(new THREE.Vector3(0, 3, -2));

      renderer.render(scene, camera);
    };
    animate();

    // --- Resize ---
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(frameId);
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
    };
  }, [gameState]);

  useEffect(() => {
    if (score > highScore) setHighScore(score);
  }, [score, highScore]);

  return (
    <div className="relative w-full h-screen bg-[#0a0a0a] overflow-hidden">
      {/* UI Overlay */}
      <div className="absolute top-8 left-8 z-20">
        <Link href="/" className="flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest">
          <ArrowLeft className="w-4 h-4" /> Back Home
        </Link>
      </div>

      <div className="absolute top-8 right-8 z-20 text-right">
        <div className="text-accent text-3xl font-syne font-extrabold">{score}</div>
        <div className="text-white/30 text-[10px] font-bold uppercase tracking-widest">Score</div>
      </div>

      {/* Hero Content / Modals */}
      <AnimatePresence>
        {gameState === "start" && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-30 flex items-center justify-center bg-black/80 backdrop-blur-md"
          >
            <div className="text-center space-y-8 max-w-md px-6">
              <div className="space-y-4">
                <h1 className="text-5xl font-syne font-extrabold text-white">Subway Runner</h1>
                <p className="text-text-muted">
                  <span className="text-accent">Panah Kiri/Kanan</span> pindah jalur.<br />
                  <span className="text-accent">Panah Atas</span> Lompat rintangan rendah.<br />
                  <span className="text-accent">Panah Bawah</span> Sleding rintangan tinggi.
                </p>
              </div>
              <button 
                onClick={() => setGameState("playing")}
                className="w-full bg-accent text-white py-5 rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-accent-hover transition-all"
              >
                Launch System
              </button>
            </div>
          </motion.div>
        )}

        {gameState === "gameover" && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="absolute inset-0 z-30 flex items-center justify-center bg-red-950/90 backdrop-blur-xl"
          >
            <div className="text-center space-y-8 max-w-md px-6">
              <div className="space-y-4">
                <h2 className="text-5xl font-syne font-extrabold text-white">Kena Rintangan!</h2>
                <div className="flex items-center justify-center gap-8 py-4">
                  <div>
                    <div className="text-2xl font-bold text-white">{score}</div>
                    <div className="text-[10px] uppercase tracking-widest text-white/40">Your Score</div>
                  </div>
                  <div className="w-px h-8 bg-white/10" />
                  <div>
                    <div className="text-2xl font-bold text-accent">{highScore}</div>
                    <div className="text-[10px] uppercase tracking-widest text-white/40">High Score</div>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <button 
                  onClick={() => { setScore(0); setGameState("playing"); }}
                  className="w-full bg-white text-black py-5 rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" /> Try Again
                </button>
                <Link 
                  href="/"
                  className="block w-full border border-white/20 text-white py-5 rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-white/5 transition-all"
                >
                  Back to Portfolio
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Game Canvas Container */}
      <div ref={containerRef} className="absolute inset-0 z-10 cursor-none" />

      {/* Background Ambience */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-accent/5 pointer-events-none" />
    </div>
  );
}
