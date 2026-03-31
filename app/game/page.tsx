"use client";

import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import Link from "next/link";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function GamePage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState<"start" | "playing" | "gameover">("start");
  const [highScore, setHighScore] = useState(0);

  useEffect(() => {
    if (!containerRef.current || gameState !== "playing") return;

    // --- Audio Setup ---
    const bgm = new Audio("https://assets.mixkit.co/music/preview/mixkit-arcade-retro-changing-zaps-271.mp3");
    bgm.loop = true; bgm.volume = 0.4;
    const sfxJump = new Audio("https://assets.mixkit.co/sfx/preview/mixkit-small-hit-metal-in-a-pot-2155.mp3");
    const sfxCoin = new Audio("https://assets.mixkit.co/sfx/preview/mixkit-retro-arcade-casino-notification-211.mp3");
    const sfxCrash = new Audio("https://assets.mixkit.co/sfx/preview/mixkit-arcade-mechanical-hit-1104.mp3");

    // --- Three.js Setup ---
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87CEEB); 
    scene.fog = new THREE.Fog(0x87CEEB, 40, 220); 

    const camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    if (containerRef.current) containerRef.current.appendChild(renderer.domElement);

    // --- Lights ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8); scene.add(ambientLight);
    const sunLight = new THREE.DirectionalLight(0xffffff, 1.5); sunLight.position.set(20, 50, 20); scene.add(sunLight);

    // --- Materials ---
    const matYellow = new THREE.MeshStandardMaterial({ color: 0xf5c518, roughness: 0.3 });
    const matGlass = new THREE.MeshStandardMaterial({ color: 0x334155, transparent: true, opacity: 0.8 });
    const matLight = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 2 });
    const matWheel = new THREE.MeshStandardMaterial({ color: 0x111111 });
    const matShadow = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.2 });
    const matGrass = new THREE.MeshStandardMaterial({ color: 0x14532d, roughness: 1.0 });
    const matTrotoar = new THREE.MeshStandardMaterial({ color: 0x71717a, roughness: 0.8 });
    const matWood = new THREE.MeshStandardMaterial({ color: 0x78350f });
    const matOrange = new THREE.MeshStandardMaterial({ color: 0xe8533a });
    const matBlueBody = new THREE.MeshStandardMaterial({ color: 0x1e3a8a });

    // --- Character & Chaser ---
    const playerGroup = new THREE.Group();
    const playerMat = new THREE.MeshStandardMaterial({ color: 0x3b82f6 });
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.8, 0.4), playerMat); body.position.y = 0.5;
    const head = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.35, 0.35), playerMat); head.position.y = 1.15;
    const lLeg = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.5, 0.2), playerMat); lLeg.position.set(-0.15, 0.25, 0);
    const rLeg = lLeg.clone(); rLeg.position.x = 0.15;
    playerGroup.add(body, head, lLeg, rLeg); scene.add(playerGroup);

    const playerShadow = new THREE.Mesh(new THREE.CircleGeometry(0.4, 32), matShadow);
    playerShadow.rotation.x = -Math.PI / 2; playerShadow.position.y = 0.02; scene.add(playerShadow);

    const chaserGroup = new THREE.Group();
    const cBody = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.8, 0.4), matBlueBody); cBody.position.y = 0.5;
    const cHead = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.35, 0.35), new THREE.MeshStandardMaterial({ color: 0x111111 })); cHead.position.y = 1.15;
    const cLleg = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.5, 0.2), matBlueBody); cLleg.position.set(-0.15, 0.25, 0);
    const cRleg = cLleg.clone(); cRleg.position.x = 0.15;
    const flashlight = new THREE.SpotLight(0xffffff, 5, 10, Math.PI / 6);
    flashlight.position.set(0, 1, -0.5); flashlight.target.position.set(0, 0, -5);
    const alertSym = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.4, 0.1), new THREE.MeshBasicMaterial({ color: 0xff0000 }));
    alertSym.position.y = 1.8; alertSym.visible = false;
    chaserGroup.add(cBody, cHead, cLleg, cRleg, flashlight, flashlight.target, alertSym); scene.add(chaserGroup);

    // --- Environment Setup ---
    const LANES = [-3.5, 0, 3.5];
    const ground = new THREE.Mesh(new THREE.PlaneGeometry(14, 2000), new THREE.MeshStandardMaterial({ color: 0x27272a }));
    ground.rotation.x = -Math.PI / 2; scene.add(ground);
    
    const leftT = new THREE.Mesh(new THREE.BoxGeometry(4, 0.4, 2000), matTrotoar); leftT.position.set(-9, 0.2, 0);
    const rightT = new THREE.Mesh(new THREE.BoxGeometry(4, 0.4, 2000), matTrotoar); rightT.position.set(9, 0.2, 0);
    scene.add(leftT, rightT);

    const markings: THREE.Mesh[] = [];
    for (let i = 0; i < 30; i++) {
        [-1.75, 1.75].forEach(x => {
            const m = new THREE.Mesh(new THREE.PlaneGeometry(0.15, 2.5), new THREE.MeshBasicMaterial({ color: 0xffffff }));
            m.rotation.x = -Math.PI / 2; m.position.set(x, 0.03, -i * 12);
            scene.add(m); markings.push(m);
        });
    }

    const scenery: THREE.Object3D[] = [];
    const flags: THREE.Group[] = [];
    const createDecoration = (zPos: number) => {
        // Flags
        const flagPole = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 4), matWheel);
        const flagCloth = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.8, 0.05), Math.random() > 0.5 ? matOrange : matBlueBody);
        flagCloth.position.set(0.6, 1.6, 0);
        const flag = new THREE.Group(); flag.add(flagPole, flagCloth);
        flag.position.set(-7.5, 0, zPos + 15); scene.add(flag); flags.push(flag); scenery.push(flag);
        // Benches
        const bench = new THREE.Group();
        const seat = new THREE.Mesh(new THREE.BoxGeometry(2, 0.1, 0.7), matWood); seat.position.y = 0.5;
        const bLeg1 = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.5, 0.1), matWheel); bLeg1.position.set(-0.9, 0.25, 0.3);
        const bLeg2 = bLeg1.clone(); bLeg2.position.set(0.9, 0.25, 0.3);
        bench.add(seat, bLeg1, bLeg2); bench.position.set(8, 0.2, zPos + 10);
        scene.add(bench); scenery.push(bench);
        // Flowers
        for (let i = 0; i < 3; i++) {
            const f = new THREE.Mesh(new THREE.SphereGeometry(0.12), new THREE.MeshBasicMaterial({ color: 0xef4444 }));
            f.position.set(8.5 + (Math.random()-0.5)*1.5, 0.45, zPos + 5 + Math.random()*10);
            scene.add(f); scenery.push(f);
        }
    };

    const createSceneryAt = (zPos: number) => {
        const type = Math.floor(Math.random() * 2);
        const b = new THREE.Group();
        if (type === 0) {
            const w = new THREE.Mesh(new THREE.BoxGeometry(6, 12, 8), new THREE.MeshStandardMaterial({ color: 0xc8a87a })); w.position.y = 6;
            const r = new THREE.Mesh(new THREE.BoxGeometry(6.5, 1, 8.5), new THREE.MeshStandardMaterial({ color: 0xa84a32 })); r.position.y = 12.5;
            b.add(w, r);
        } else {
            const w = new THREE.Mesh(new THREE.BoxGeometry(5, 18, 10), new THREE.MeshStandardMaterial({ color: 0x94a3b8 })); w.position.y = 9;
            b.add(w);
        }
        const l = b.clone(); l.position.set(-14, 0, zPos);
        const r = b.clone(); r.position.set(14, 0, zPos);
        const gL = new THREE.Mesh(new THREE.PlaneGeometry(4, 30), matGrass); gL.rotation.x = -Math.PI / 2; gL.position.set(-9, 0.21, zPos);
        const gR = gL.clone(); gR.position.x = 9;
        scene.add(l, r, gL, gR); scenery.push(l, r, gL, gR);
        createDecoration(zPos - 10);
    };
    for (let i = 0; i < 15; i++) createSceneryAt(-i * 35);

    // --- Obstacles & Particles ---
    const obstacles: THREE.Group[] = [];
    const coins: THREE.Mesh[] = [];
    const spawnBus = (lane: number) => {
        const g = new THREE.Group();
        const b = new THREE.Mesh(new THREE.BoxGeometry(3.2, 4.2, 9), matYellow); b.position.y = 2.1;
        const w = new THREE.Mesh(new THREE.BoxGeometry(3.1, 1.8, 1.5), matGlass); w.position.set(0, 2.8, -3.8);
        const l = new THREE.Mesh(new THREE.SphereGeometry(0.25), matLight); l.position.set(-1.1, 1.2, -4.5);
        const r = l.clone(); r.position.x = 1.1;
        const whGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.4);
        const wh1 = new THREE.Mesh(whGeo, matWheel); wh1.rotation.z = Math.PI/2; wh1.position.set(-1.4, 0.4, -3);
        const wh2 = wh1.clone(); wh2.position.set(1.4, 0.4, -3);
        g.add(b, w, l, r, wh1, wh2); g.position.set(LANES[lane], 0, -220);
        scene.add(g); obstacles.push(g);
    };
    const spawnHurdle = (lane: number) => {
        const g = new THREE.Group();
        const b = new THREE.Mesh(new THREE.BoxGeometry(3, 0.4, 0.4), matYellow); b.position.y = 0.8;
        const l = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.8, 0.15), matWheel); l.position.set(-1.4, 0.4, 0);
        const r = l.clone(); r.position.x = 1.4;
        g.add(b, l, r); g.position.set(LANES[lane], 0, -220);
        scene.add(g); obstacles.push(g);
    };
    const spawnCoin = (lane: number) => {
        const c = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.1, 32), new THREE.MeshStandardMaterial({ color: 0xfacc15, emissive: 0xfacc15, emissiveIntensity: 1 }));
        c.rotation.x = Math.PI / 2; c.position.set(LANES[lane], 1.2, -220);
        scene.add(c); coins.push(c);
    };

    const dustP: THREE.Mesh[] = [];
    const sparkP: THREE.Mesh[] = [];
    const spawnParticle = (isSpark: boolean) => {
        const p = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, 0.1), new THREE.MeshBasicMaterial({ color: isSpark ? 0xff6b00 : 0xcccccc, transparent: true, opacity: 0.8 }));
        p.position.set(playerGroup.position.x + (Math.random()-0.5)*0.5, 0.1, 0.5);
        scene.add(p); if (isSpark) sparkP.push(p); else dustP.push(p);
    };

    const clouds: THREE.Mesh[] = [];
    for (let i = 0; i < 15; i++) {
        const c = new THREE.Mesh(new THREE.BoxGeometry(8, 1, 10), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.5 }));
        c.position.set((Math.random()-0.5)*100, 20 + Math.random()*10, -Math.random()*500);
        scene.add(c); clouds.push(c);
    }

    // --- State & Movement ---
    let currentLane = 1, targetX = LANES[1], isJumping = false, jumpVel = 0, jumpCount = 0;
    let isSliding = false, slideT = 0, speed = 0.8, internalS = 0;
    let chaserZ = 7, isStumbling = false, stumbleCooldown = 0;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState !== "playing") return;
      if (e.key === "ArrowLeft" && currentLane > 0) { currentLane--; targetX = LANES[currentLane]; }
      if (e.key === "ArrowRight" && currentLane < 2) { currentLane++; targetX = LANES[currentLane]; }
      if (e.key === "ArrowUp") {
          if (!isJumping) { isJumping = true; jumpVel = 0.38; jumpCount = 1; sfxJump.play().catch(()=>{}); }
          else if (jumpCount < 2) { jumpVel = 0.35; jumpCount = 2; sfxJump.play().catch(()=>{}); }
      }
      if (e.key === "ArrowDown" && !isJumping && !isSliding) { isSliding = true; slideT = 65; }
    };
    window.addEventListener("keydown", handleKeyDown);
    if (gameState === "playing") bgm.play().catch(()=>{});

    // --- Render Loop ---
    let frameId: number;
    const animate = () => {
      frameId = requestAnimationFrame(animate);

      playerGroup.position.x += (targetX - playerGroup.position.x) * 0.18;
      chaserGroup.position.x += (playerGroup.position.x - chaserGroup.position.x) * 0.08;
      if (isStumbling) {
          chaserZ += (2.8 - chaserZ) * 0.1; stumbleCooldown--; if (stumbleCooldown <= 0) isStumbling = false;
          camera.position.x += (Math.random()-0.5)*0.2; camera.position.y += (Math.random()-0.5)*0.2;
      } else { chaserZ += (7 - chaserZ) * 0.02; }
      chaserGroup.position.z = playerGroup.position.z + chaserZ; alertSym.visible = chaserZ < 4;

      camera.fov = 82 + (speed - 0.8) * 45; camera.updateProjectionMatrix();
      camera.rotation.z = -(targetX - playerGroup.position.x) * 0.04;
      playerShadow.position.copy(playerGroup.position); playerShadow.position.y = 0.02;

      const time = Date.now() * 0.012;
      if (!isJumping && !isSliding) {
        playerGroup.position.y = Math.abs(Math.sin(time)) * 0.12;
        lLeg.rotation.x = Math.sin(time)*0.6; rLeg.rotation.x = -Math.sin(time)*0.6;
      }
      chaserGroup.position.y = Math.abs(Math.sin(time*1.5))*0.1;
      cLleg.rotation.x = Math.sin(time*1.5)*0.7; cRleg.rotation.x = -Math.sin(time*1.5)*0.7;
      flags.forEach((f, i) => { f.children[1].rotation.y = Math.sin(time * 0.5 + i) * 0.2; });

      if (isJumping) { playerGroup.position.y += jumpVel; jumpVel += -0.015; if (playerGroup.position.y <= 0) { playerGroup.position.y = 0; isJumping = false; jumpCount = 0; } }
      if (isSliding) { playerGroup.scale.y = 0.2; slideT--; if (Math.random() < 0.6) spawnParticle(true); if (slideT <= 0) { playerGroup.scale.y = 1; isSliding = false; } }

      markings.forEach(m => { m.position.z += speed; if (m.position.z > 15) m.position.z = -200; });
      scenery.forEach(s => { s.position.z += speed; if (s.position.z > 50) s.position.z = -350; });
      clouds.forEach(c => { c.position.z += speed*0.2; if (c.position.z > 50) c.position.z = -500; });

      obstacles.forEach((obs, i) => {
        obs.position.z += speed;
        obs.children.forEach(child => {
            if (!(child instanceof THREE.Mesh)) return;
            const wp = new THREE.Vector3(); child.getWorldPosition(wp);
            const dx = Math.abs(wp.x - playerGroup.position.x), dz = Math.abs(wp.z - playerGroup.position.z), dy = Math.abs(wp.y - (playerGroup.position.y + 0.6));
            const bX = (child.geometry as THREE.BoxGeometry).parameters.width/2 + 0.3, bZ = (child.geometry as THREE.BoxGeometry).parameters.depth/2 + 0.3;
            // [SLIDING HITBOX FIX]
            const h = (child.geometry as THREE.BoxGeometry).parameters.height;
            const isHurdleBar = h < 0.5 && child.position.y > 0.5;
            const bY = h/2 + (isSliding && isHurdleBar ? -0.4 : 0.6);
            if (dx < bX && dz < bZ && dy < bY) {
                const isBus = (child.geometry as THREE.BoxGeometry).parameters.depth > 5;
                if (isBus || isStumbling) { sfxCrash.play().catch(()=>{}); setGameState("gameover"); cancelAnimationFrame(frameId); }
                else { isStumbling = true; stumbleCooldown = 120; speed *= 0.7; scene.remove(obs); obstacles.splice(i, 1); }
            }
        });
        if (obs.position.z > 50) { scene.remove(obs); obstacles.splice(i, 1); internalS += 20; setScore(internalS); }
      });

      coins.forEach((c, i) => {
        c.position.z += speed; c.rotation.y += 0.08;
        if (Math.abs(c.position.x - playerGroup.position.x) < 1 && Math.abs(c.position.z - playerGroup.position.z) < 2) {
          sfxCoin.currentTime = 0; sfxCoin.play().catch(()=>{}); scene.remove(c); coins.splice(i, 1); internalS += 100; setScore(internalS);
        }
        if (c.position.z > 30) { scene.remove(c); coins.splice(i, 1); }
      });

      if (Math.random() < 0.015) { const lane = Math.floor(Math.random()*3); if (Math.random() < 0.5) spawnBus(lane); else spawnHurdle(lane); }
      if (Math.random() < 0.01) spawnCoin(Math.floor(Math.random()*3));
      if (Math.random() < 0.3) spawnParticle(false);
      [dustP, sparkP].forEach(arr => arr.forEach((p, i) => {
          p.position.z += speed * 0.4; p.scale.multiplyScalar(0.96);
          // @ts-ignore
          p.material.opacity *= 0.96; if (p.scale.x < 0.01) { scene.remove(p); arr.splice(i, 1); }
      }));

      speed += 0.00015 + (internalS / 800000);
      camera.position.set(0, 6.2, 12); camera.lookAt(new THREE.Vector3(playerGroup.position.x * 0.4, 0.5, -20));
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => { camera.aspect = window.innerWidth / window.innerHeight; camera.updateProjectionMatrix(); renderer.setSize(window.innerWidth, window.innerHeight); };
    window.addEventListener("resize", handleResize);

    return () => { window.removeEventListener("keydown", handleKeyDown); window.removeEventListener("resize", handleResize); bgm.pause(); bgm.src = ""; cancelAnimationFrame(frameId); if (containerRef.current) containerRef.current.removeChild(renderer.domElement); };
  }, [gameState]);

  useEffect(() => { if (score > highScore) setHighScore(score); }, [score, highScore]);

  return (
    <div className="relative w-full h-screen bg-[#87CEEB] overflow-hidden">
      <div className="absolute top-8 left-8 z-20">
        <Link href="/" className="flex items-center gap-2 text-white/90 hover:text-white transition-colors text-xs font-bold uppercase tracking-[0.3em]">
          <ArrowLeft className="w-4 h-4" /> Back Home
        </Link>
      </div>
      <div className="absolute top-8 right-8 z-20 text-right">
        <div className="text-accent text-4xl font-syne font-extrabold drop-shadow-lg">{score}</div>
        <div className="text-white/60 text-[10px] font-bold uppercase tracking-[0.4em]">Current Class Credit</div>
      </div>
      <AnimatePresence>
        {gameState === "start" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-30 flex items-center justify-center bg-blue-950/40 backdrop-blur-md">
            <div className="text-center space-y-10 max-w-lg px-8">
              <div className="space-y-6">
                <h1 className="text-7xl font-syne font-extrabold text-white tracking-tighter italic transform -skew-x-6">UNAIR Runner</h1>
                <div className="space-y-2 text-white font-medium bg-black/20 p-6 rounded-3xl backdrop-blur-xl border border-white/10">
                  <p className="flex justify-between items-center gap-4 text-xs uppercase tracking-widest"><span>⬅️ ➡️</span> <span>Pindah Jalur</span></p>
                  <p className="flex justify-between items-center gap-4 text-xs uppercase tracking-widest"><span>⬆️</span> <span>Lompat Tinggi (Doble)</span></p>
                  <p className="flex justify-between items-center gap-4 text-xs uppercase tracking-widest"><span>⬇️</span> <span>Sleding Rintangan</span></p>
                </div>
              </div>
              <button onClick={() => setGameState("playing")} className="w-full bg-accent text-white py-6 rounded-3xl text-sm font-extrabold uppercase tracking-[0.5em] hover:bg-white hover:text-black transition-all transform hover:scale-105 shadow-2xl">Gas ke Kelas</button>
            </div>
          </motion.div>
        )}
        {gameState === "gameover" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 z-30 flex items-center justify-center bg-red-950/80 backdrop-blur-2xl">
            <div className="text-center space-y-10 max-w-md px-8">
              <div className="space-y-6">
                <h2 className="text-6xl font-syne font-extrabold text-white italic tracking-tighter">Kena Tangkap!</h2>
                <div className="flex items-center justify-center gap-12 py-6 bg-white/5 rounded-3xl border border-white/10">
                  <div>
                    <div className="text-3xl font-bold text-white">{score}</div>
                    <div className="text-[10px] uppercase tracking-widest text-white/30">Your Credits</div>
                  </div>
                  <div className="w-px h-12 bg-white/10" />
                  <div>
                    <div className="text-3xl font-bold text-accent">{highScore}</div>
                    <div className="text-[10px] uppercase tracking-widest text-white/30">Dean's List</div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <button onClick={() => { setScore(0); setGameState("playing"); }} className="w-full bg-white text-black py-6 rounded-3xl text-sm font-extrabold uppercase tracking-[0.5em] hover:bg-accent hover:text-white transition-all flex items-center justify-center gap-4 shadow-2xl"><RotateCcw className="w-5 h-5" /> Remedial</button>
                <Link href="/" className="w-full bg-black/40 text-white/70 py-6 rounded-3xl text-[10px] font-bold uppercase tracking-[0.3em] border border-white/10 hover:bg-white hover:text-black transition-all flex items-center justify-center gap-2">Back to Portfolio</Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div ref={containerRef} className="absolute inset-0 z-10" />
      <div className="absolute inset-0 z-15 pointer-events-none overflow-hidden">
          <div className="absolute inset-0 opacity-20"><div className="absolute top-0 left-0 w-full h-full bg-[repeating-linear-gradient(0deg,transparent,transparent_40px,rgba(255,255,255,0.1)_41px)]" /></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_50%,rgba(0,0,0,0.4)_120%)]" />
      </div>
    </div>
  );
}
