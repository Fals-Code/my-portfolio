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
    scene.fog = new THREE.FogExp2(0x0a0a0a, 0.05);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    containerRef.current.appendChild(renderer.domElement);

    // --- Lights ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0xe8533a, 2, 50);
    scene.add(pointLight);

    // --- Player ---
    const playerGeometry = new THREE.BoxGeometry(1, 1, 1);
    const playerMaterial = new THREE.MeshStandardMaterial({ color: 0xe8533a, emissive: 0xe8533a, emissiveIntensity: 0.5 });
    const player = new THREE.Mesh(playerGeometry, playerMaterial);
    player.position.y = 0.5;
    scene.add(player);

    // --- Ground/Road ---
    const roadGeometry = new THREE.PlaneGeometry(10, 1000, 1, 1);
    const roadMaterial = new THREE.MeshStandardMaterial({ color: 0x111111 });
    const road = new THREE.Mesh(roadGeometry, roadMaterial);
    road.rotation.x = -Math.PI / 2;
    scene.add(road);

    // --- Obstacles ---
    const obstacles: THREE.Mesh[] = [];
    const spawnObstacle = () => {
      const geometry = new THREE.BoxGeometry(1, Math.random() * 2 + 1, 1);
      const material = new THREE.MeshStandardMaterial({ color: 0x3b82f6 });
      const obstacle = new THREE.Mesh(geometry, material);
      obstacle.position.x = Math.random() * 8 - 4;
      obstacle.position.z = -100;
      obstacle.position.y = geometry.parameters.height / 2;
      scene.add(obstacle);
      obstacles.push(obstacle);
    };

    // --- Movement Logic ---
    let playerX = 0;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") playerX -= 0.5;
      if (e.key === "ArrowRight") playerX += 0.5;
    };
    window.addEventListener("keydown", handleKeyDown);

    // --- Animation Loop ---
    let frameId: number;
    let speed = 0.5;
    let internalScore = 0;

    const animate = () => {
      frameId = requestAnimationFrame(animate);

      // Smooth move
      playerX = Math.max(-4.5, Math.min(4.5, playerX));
      player.position.x += (playerX - player.position.x) * 0.1;

      // Move obstacles
      obstacles.forEach((obs, index) => {
        obs.position.z += speed;
        
        // Collision
        if (Math.abs(obs.position.z - player.position.z) < 1 && Math.abs(obs.position.x - player.position.x) < 1) {
          setGameState("gameover");
          cancelAnimationFrame(frameId);
        }

        // Clean up
        if (obs.position.z > 10) {
          scene.remove(obs);
          obstacles.splice(index, 1);
          internalScore += 10;
          setScore(internalScore);
          speed += 0.001;
        }
      });

      // Spawn
      if (Math.random() < 0.03) spawnObstacle();

      // Camera follow
      camera.position.set(0, 5, 10);
      camera.lookAt(player.position);
      pointLight.position.copy(player.position).add(new THREE.Vector3(0, 2, 0));

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
                <h1 className="text-5xl font-syne font-extrabold text-white">Code Runner</h1>
                <p className="text-text-muted">Gunakan panah <span className="text-accent">Kiri & Kanan</span> untuk menghindari bug (kotak biru) dalam sistem.</p>
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
                <h2 className="text-5xl font-syne font-extrabold text-white">Bug Detected!</h2>
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
