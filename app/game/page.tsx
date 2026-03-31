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
    scene.fog = new THREE.Fog(0x87CEEB, 40, 250); 

    const camera = new THREE.PerspectiveCamera(82, window.innerWidth / window.innerHeight, 0.2, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    if (containerRef.current) containerRef.current.appendChild(renderer.domElement);

    // --- Hyper-Lighting ---
    const hemiLight = new THREE.HemisphereLight(0x87CEEB, 0x14532d, 0.6);
    scene.add(hemiLight);
    const sunLight = new THREE.DirectionalLight(0xffffff, 1.6);
    sunLight.position.set(20, 60, 20);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048; sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.left = -50; sunLight.shadow.camera.right = 50;
    sunLight.shadow.camera.top = 50; sunLight.shadow.camera.bottom = -50;
    scene.add(sunLight);

    // --- Materials & Assets ---
    const matYellow = new THREE.MeshStandardMaterial({ color: 0xf5c518, roughness: 0.3 });
    const matGold = new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 0.8, roughness: 0.2 });
    const matGlass = new THREE.MeshStandardMaterial({ color: 0x334155, transparent: true, opacity: 0.8 });
    const matLight = new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 2 });
    const matWheel = new THREE.MeshStandardMaterial({ color: 0x111111 });
    const matGrass = new THREE.MeshStandardMaterial({ color: 0x14532d, roughness: 1.0 });
    const matTrotoar = new THREE.MeshStandardMaterial({ color: 0x71717a, roughness: 0.8 });
    const matWood = new THREE.MeshStandardMaterial({ color: 0x78350f });
    const matOrange = new THREE.MeshStandardMaterial({ color: 0xe8533a });
    const matBlueBody = new THREE.MeshStandardMaterial({ color: 0x1e3a8a });
    const matPlayerBody = new THREE.MeshStandardMaterial({ color: 0x3b82f6 });
    const matSkin = new THREE.MeshStandardMaterial({ color: 0xffdbac });
    const matGrey = new THREE.MeshStandardMaterial({ color: 0x64748b });

    // --- Hyper-Detail Player ---
    const pGroup = new THREE.Group();
    // Body, Jacket & Straps
    const pBody = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.8, 0.4), matPlayerBody); pBody.position.y = 0.5; pBody.castShadow = true;
    const bp = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.62, 0.22), matGrey); bp.position.set(0, 0.55, 0.3); bp.castShadow = true;
    const strapL = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.6, 0.1), matGrey); strapL.position.set(-0.2, 0.55, -0.2);
    const strapR = strapL.clone(); strapR.position.x = 0.2;
    // Head ++ (Nose, Ears)
    const pHead = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.35, 0.35), matSkin); pHead.position.y = 1.15; pHead.castShadow = true;
    const nose = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.08, 0.05), matSkin); nose.position.set(0, 1.15, -0.19);
    const earL = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.1, 0.05), matSkin); earL.position.set(-0.18, 1.15, 0);
    const earR = earL.clone(); earR.position.x = 0.18;
    const hr = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.15, 0.38), matWheel); hr.position.y = 1.25;
    const eyL = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.05, 0.02), matWheel); eyL.position.set(-0.08, 1.17, -0.18);
    const eyR = eyL.clone(); eyR.position.x = 0.08;
    // Arms ++ (Forearms, Hands)
    const pLarm = new THREE.Group();
    const lArmM = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.5, 0.18), matPlayerBody); lArmM.position.y = -0.25; lArmM.castShadow = true;
    const lHnd = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, 0.12), matSkin); lHnd.position.y = -0.52;
    pLarm.add(lArmM, lHnd); pLarm.position.set(-0.35, 0.85, 0);
    const pRarm = pLarm.clone(); pRarm.position.x = 0.35;
    // Legs ++ (Shoes, Laces)
    const pLleg = new THREE.Group();
    const lLegM = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.5, 0.2), matPlayerBody); lLegM.position.y = -0.25; lLegM.castShadow = true;
    const lShoe = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.12, 0.32), matLight); lShoe.position.set(0, -0.45, -0.05);
    pLleg.add(lLegM, lShoe); pLleg.position.set(-0.16, 0.5, 0);
    const pRleg = pLleg.clone(); pRleg.position.x = 0.16;

    pGroup.add(pBody, bp, strapL, strapR, pHead, nose, earL, earR, hr, eyL, eyR, pLarm, pRarm, pLleg, pRleg);
    scene.add(pGroup);

    // --- Hyper-Detail Satpam ---
    const cGroup = new THREE.Group();
    const sBody = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.8, 0.4), matBlueBody); sBody.position.y = 0.5; sBody.castShadow = true;
    const sVest = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.5, 0.42), new THREE.MeshStandardMaterial({ color: 0xffff00, transparent: true, opacity: 0.5 })); sVest.position.y = 0.6;
    const sBadge = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, 0.02), matGold); sBadge.position.set(0.15, 0.72, -0.22);
    const sBuckle = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.08, 0.02), matLight); sBuckle.position.set(0, 0.32, -0.21);
    const sWalkie = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.2, 0.08), matWheel); sWalkie.position.set(-0.2, 0.4, 0.15);
    const sHead = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.35, 0.35), matSkin); sHead.position.y = 1.15; sHead.castShadow = true;
    const sEyes = eyL.clone(); const sEyeR = eyR.clone();
    const sHat = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.1), matBlueBody); sHat.position.y = 1.35;
    const sBrim = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.03, 0.3), matBlueBody); sBrim.position.set(0, 1.32, -0.15);
    const sLarm = pLarm.clone(); sLarm.children.forEach(c => (c as THREE.Mesh).material = (c===sLarm.children[0]?matBlueBody:matSkin));
    const sRarm = pRarm.clone(); sRarm.children.forEach(c => (c as THREE.Mesh).material = (c===sRarm.children[0]?matBlueBody:matSkin));
    const sLleg = pLleg.clone(); sLleg.children.forEach(c => (c as THREE.Mesh).material = (c===sLleg.children[0]?matBlueBody:matWheel));
    const sRleg = pRleg.clone(); sRleg.children.forEach(c => (c as THREE.Mesh).material = (c===sRleg.children[0]?matBlueBody:matWheel));
    sLarm.position.set(-0.35, 0.85, 0); sRarm.position.x = 0.35; sLleg.position.set(-0.16, 0.5, 0); sRleg.position.x = 0.16;

    const spot = new THREE.SpotLight(0xffffff, 8, 15, Math.PI / 6);
    spot.position.set(0, 1, -0.5); spot.target.position.set(0, 0, -5);
    const alert = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.4, 0.1), new THREE.MeshBasicMaterial({ color: 0xff0000 }));
    alert.position.y = 2.4; alert.visible = false;
    cGroup.add(sBody, sVest, sBadge, sBuckle, sWalkie, sHead, sEyes, sEyeR, sHat, sBrim, sLarm, sRarm, sLleg, sRleg, spot, spot.target, alert);
    scene.add(cGroup);

    // --- Hyper-Environment ---
    const LANES = [-3.5, 0, 3.5];
    const gr = new THREE.Mesh(new THREE.PlaneGeometry(14, 2000), new THREE.MeshStandardMaterial({ color: 0x27272a, roughness: 0.9 }));
    gr.rotation.x = -Math.PI / 2; gr.receiveShadow = true; scene.add(gr);
    
    const sidL = new THREE.Mesh(new THREE.BoxGeometry(5, 0.5, 2000), matTrotoar); sidL.position.set(-9.5, 0.25, 0); sidL.receiveShadow = true; scene.add(sidL);
    const sidR = sidL.clone(); sidR.position.x = 9.5; scene.add(sidR);

    // Curb detail (Kantil)
    for (let i = 0; i < 200; i++) {
        const cL = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.6, 5), i % 2 === 0 ? matLight : matWheel);
        cL.position.set(-7, 0.3, -i * 5); scene.add(cL);
        const cR = cL.clone(); cR.position.x = 7; scene.add(cR);
    }

    const marks: THREE.Mesh[] = [];
    for (let i = 0; i < 40; i++) {
        [-1.75, 1.75].forEach(x => {
            const m = new THREE.Mesh(new THREE.PlaneGeometry(0.15, 2.5), new THREE.MeshBasicMaterial({ color: 0xffffff }));
            m.rotation.x = -Math.PI / 2; m.position.set(x, 0.04, -i * 12); scene.add(m); marks.push(m);
        });
    }

    const decor: THREE.Object3D[] = [];
    const flgs: THREE.Group[] = [];
    const createDecoration = (z: number) => {
        // High-detail street lamps
        const lP = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.15, 6), matWheel);
        const lH = new THREE.Mesh(new THREE.SphereGeometry(0.3), matLight); lH.position.y = 3;
        const lamp = new THREE.Group(); lamp.add(lP, lH);
        lamp.position.set(-8, 0, z); scene.add(lamp); decor.push(lamp);
        // Flags
        const p = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 5), matWheel);
        const cl = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1, 0.05), Math.random() > 0.5 ? matOrange : matBlueBody); cl.position.set(0.75, 2, 0);
        const f = new THREE.Group(); f.add(p, cl);
        f.position.set(8.5, 0, z + 10); scene.add(f); flgs.push(f); decor.push(f);
    };

    const createSceneAt = (z: number) => {
        const type = Math.floor(Math.random() * 2);
        const grp = new THREE.Group();
        if (type === 0) { // Classical with balcony
            const b = new THREE.Mesh(new THREE.BoxGeometry(7, 14, 10), new THREE.MeshStandardMaterial({ color: 0xc8a87a })); b.position.y = 7; b.castShadow = true;
            const r = new THREE.Mesh(new THREE.BoxGeometry(7.5, 1, 10.5), new THREE.MeshStandardMaterial({ color: 0xa84a32 })); r.position.y = 14.5;
            const bal = new THREE.Mesh(new THREE.BoxGeometry(6, 0.5, 1.5), matWood); bal.position.set(0, 5, -5.5);
            grp.add(b, r, bal);
        } else { // Modern with AC units
            const b = new THREE.Mesh(new THREE.BoxGeometry(6, 22, 12), new THREE.MeshStandardMaterial({ color: 0x94a3b8 })); b.position.y = 11; b.castShadow = true;
            const ac = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.5, 0.4), matLight); ac.position.set(2, 6, -6.1);
            grp.add(b, ac);
        }
        const l = grp.clone(); l.position.set(-16, 0, z); scene.add(l); decor.push(l);
        const r = grp.clone(); r.position.set(16, 0, z); scene.add(r); decor.push(r);
        const grassL = new THREE.Mesh(new THREE.PlaneGeometry(6, 40), matGrass); grassL.rotation.x = -Math.PI / 2; grassL.position.set(-10, 0.21, z); grassL.receiveShadow = true; scene.add(grassL); decor.push(grassL);
        const grassR = grassL.clone(); grassR.position.x = 10; scene.add(grassR); decor.push(grassR);
        createDecoration(z - 15);
    };
    for (let i = 0; i < 15; i++) createSceneAt(-i * 45);

    // --- Hyper-Detail Bus & Obstacles ---
    const obst: THREE.Group[] = [];
    const cns: THREE.Mesh[] = [];
    const spawnBus = (lane: number) => {
        const g = new THREE.Group();
        // Body
        const b = new THREE.Mesh(new THREE.BoxGeometry(3.2, 4.2, 10), matYellow); b.position.y = 2.1; b.castShadow = true; b.receiveShadow = true;
        // Interior (Seats & Steering)
        const seatG = new THREE.BoxGeometry(0.6, 0.6, 0.6);
        for (let j = 0; j < 6; j++) {
            const sL = new THREE.Mesh(seatG, matBlueBody); sL.position.set(-1, 0.8, -3 + j*1.2);
            const sR = sL.clone(); sR.position.x = 1; g.add(sL, sR);
        }
        const wheel = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.05, 8, 16), matWheel); wheel.position.set(-0.8, 1.8, -4.5); wheel.rotation.x = -0.5;
        // Mirrors
        const mP = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.1, 0.6), matWheel); mP.position.set(-1.8, 2.5, -4.8);
        const mS = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.6, 0.1), matGlass); mS.position.set(-1.8, 2.5, -5.1);
        const mirrL = new THREE.Group(); mirrL.add(mP, mS);
        const mirrR = mirrL.clone(); mirrR.position.x = 3.6; mirrR.scale.z = -1;
        // Lights
        const glass = new THREE.Mesh(new THREE.BoxGeometry(3.1, 1.8, 1.5), matGlass); glass.position.set(0, 2.8, -4.1);
        const headL = new THREE.Mesh(new THREE.SphereGeometry(0.25), matLight); headL.position.set(-1.1, 1.2, -4.9);
        const headR = headL.clone(); headR.position.x = 1.1;
        // Tires
        const whG = new THREE.CylinderGeometry(0.45, 0.45, 0.5);
        [[-1.4, -3.5], [1.4, -3.5], [-1.4, 3.5], [1.4, 3.5]].forEach(p => {
            const w = new THREE.Mesh(whG, matWheel); w.rotation.z = Math.PI/2; w.position.set(p[0], 0.45, p[1]); g.add(w);
        });
        g.add(b, glass, headL, headR, wheel, mirrL, mirrR); g.position.set(LANES[lane], 0, -250); scene.add(g); obst.push(g);
    };
    const spawnHurdle = (lane: number) => {
        const g = new THREE.Group();
        const b = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.5, 0.5), matYellow); b.position.y = 0.85; b.castShadow = true;
        const l1 = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.85, 0.2), matWheel); l1.position.set(-1.5, 0.42, 0); const r1 = l1.clone(); r1.position.x = 1.5;
        g.add(b, l1, r1); g.position.set(LANES[lane], 0, -250); scene.add(g); obst.push(g);
    };
    const spawnCoin = (lane: number) => {
        const c = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.1, 32), new THREE.MeshStandardMaterial({ color: 0xfacc15, emissive: 0xfacc15, emissiveIntensity: 1 }));
        c.rotation.x = Math.PI/2; c.position.set(LANES[lane], 1.2, -250); scene.add(c); cns.push(c);
    };

    const dP: THREE.Mesh[] = []; const sP: THREE.Mesh[] = [];
    const spawnP = (spark: boolean) => {
        const p = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, 0.12), new THREE.MeshBasicMaterial({ color: spark ? 0xff6b00 : 0xcccccc, transparent: true, opacity: 0.8 }));
        p.position.set(pGroup.position.x + (Math.random()-0.5)*0.5, 0.1, 0.5);
        scene.add(p); if (spark) sP.push(p); else dP.push(p);
    };

    const clds: THREE.Mesh[] = [];
    for (let i = 0; i < 15; i++) {
        const cl = new THREE.Mesh(new THREE.BoxGeometry(12, 1.5, 15), new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.5 }));
        cl.position.set((Math.random()-0.5)*140, 30 + Math.random()*20, -Math.random()*600); scene.add(cl); clds.push(cl);
    }

    // --- State & Movement ---
    let curL = 1, tarX = LANES[1], isJ = false, jV = 0, jCount = 0, isS = false, sTime = 0, speed = 0.85, sTotal = 0, cDist = 7, isStum = false, stumTime = 0;

    const handleKey = (e: KeyboardEvent) => {
      if (gameState !== "playing") return;
      if (e.key === "ArrowLeft" && curL > 0) { curL--; tarX = LANES[curL]; }
      if (e.key === "ArrowRight" && curL < 2) { curL++; tarX = LANES[curL]; }
      if (e.key === "ArrowUp") {
          if (!isJ) { isJ = true; jV = 0.43; jCount = 1; sfxJump.currentTime = 0; sfxJump.play().catch(()=>{}); }
          else if (jCount < 2) { jV = 0.38; jCount = 2; sfxJump.currentTime = 0; sfxJump.play().catch(()=>{}); }
      }
      if (e.key === "ArrowDown" && !isJ && !isS) { isS = true; sTime = 65; }
    };
    window.addEventListener("keydown", handleKey);
    if (gameState === "playing") bgm.play().catch(()=>{});

    let fId: number;
    const anim = () => {
      fId = requestAnimationFrame(anim);

      pGroup.position.x += (tarX - pGroup.position.x) * 0.18;
      cGroup.position.x += (pGroup.position.x - cGroup.position.x) * 0.08;
      if (isStum) { cDist += (2.8 - cDist) * 0.1; stumTime--; if (stumTime <= 0) isStum = false; camera.position.x += (Math.random()-0.5)*0.2; camera.position.y += (Math.random()-0.5)*0.2; }
      else { cDist += (7 - cDist) * 0.02; }
      cGroup.position.z = pGroup.position.z + cDist; alert.visible = cDist < 4.5;

      camera.fov = 85 + (speed - 0.85) * 45; camera.updateProjectionMatrix(); camera.rotation.z = -(tarX - pGroup.position.x) * 0.035;

      const t = Date.now() * 0.012;
      if (!isJ && !isS) {
        pGroup.position.y = Math.abs(Math.sin(t)) * 0.12;
        pLleg.rotation.x = Math.sin(t) * 0.85; pRleg.rotation.x = -Math.sin(t) * 0.85;
        pLarm.rotation.x = -Math.sin(t) * 0.85; pRarm.rotation.x = Math.sin(t) * 0.85;
      }
      cGroup.position.y = Math.abs(Math.sin(t*1.5)) * 0.12;
      sLleg.rotation.x = Math.sin(t*1.5) * 0.95; sRleg.rotation.x = -Math.sin(t*1.5) * 0.95;
      sLarm.rotation.x = -Math.sin(t*1.5) * 0.95; sRarm.rotation.x = Math.sin(t*1.5) * 0.95;
      flgs.forEach((f, i) => { f.children[1].rotation.y = Math.sin(t * 0.5 + i) * 0.25; });

      if (isJ) { pGroup.position.y += jV; jV -= 0.015; if (pGroup.position.y <= 0) { pGroup.position.y = 0; isJ = false; jCount = 0; } }
      if (isS) { pGroup.scale.y = 0.18; sTime--; if (Math.random() < 0.7) spawnP(true); if (sTime <= 0) { pGroup.scale.y = 1; isS = false; } }

      marks.forEach(m => { m.position.z += speed; if (m.position.z > 15) m.position.z = -200; });
      decor.forEach(d => { d.position.z += speed; if (d.position.z > 50) d.position.z = -450; });
      clds.forEach(c => { c.position.z += speed*0.2; if (c.position.z > 50) c.position.z = -500; });

      obst.forEach((ob, i) => {
        ob.position.z += speed;
        ob.children.forEach(ch => {
            if (!(ch instanceof THREE.Mesh)) return;
            const wp = new THREE.Vector3(); ch.getWorldPosition(wp);
            const dx = Math.abs(wp.x - pGroup.position.x), dz = Math.abs(wp.z - pGroup.position.z), dy = Math.abs(wp.y - (pGroup.position.y + 0.6));
            const h = (ch.geometry as THREE.BoxGeometry).parameters.height;
            const isH = h < 0.6 && ch.position.y > 0.5;
            const bX = (ch.geometry as THREE.BoxGeometry).parameters.width/2 + 0.35, bZ = (ch.geometry as THREE.BoxGeometry).parameters.depth/2 + 0.35;
            const bY = h/2 + (isS && isH ? -0.45 : 0.65);
            if (dx < bX && dz < bZ && dy < bY) {
                if ((ch.geometry as THREE.BoxGeometry).parameters.depth > 5 || isStum) { sfxCrash.play().catch(()=>{}); setGameState("gameover"); cancelAnimationFrame(fId); }
                else { isStum = true; stumTime = 120; speed *= 0.7; scene.remove(ob); obst.splice(i, 1); }
            }
        });
        if (ob.position.z > 50) { scene.remove(ob); obst.splice(i, 1); sTotal += 20; setScore(sTotal); }
      });

      cns.forEach((c, i) => {
        c.position.z += speed; c.rotation.y += 0.08;
        if (Math.abs(c.position.x - pGroup.position.x) < 1.1 && Math.abs(c.position.z - pGroup.position.z) < 2) {
          sfxCoin.currentTime = 0; sfxCoin.play().catch(()=>{}); scene.remove(c); cns.splice(i, 1); sTotal += 100; setScore(sTotal);
        }
        if (c.position.z > 30) { scene.remove(c); cns.splice(i, 1); }
      });

      if (Math.random() < 0.015) { const ln = Math.floor(Math.random()*3); if (Math.random() < 0.5) spawnBus(ln); else spawnHurdle(ln); }
      if (Math.random() < 0.012) spawnCoin(Math.floor(Math.random()*3));
      if (Math.random() < 0.4) spawnP(false);
      [dP, sP].forEach(arr => arr.forEach((p, i) => { p.position.z += speed * 0.4; p.scale.multiplyScalar(0.96); // @ts-ignore
          p.material.opacity *= 0.96; if (p.scale.x < 0.01) { scene.remove(p); arr.splice(i, 1); } }));

      speed += 0.00018 + (sTotal / 900000);
      camera.position.set(0, 6.2, 13); camera.lookAt(new THREE.Vector3(pGroup.position.x * 0.4, 0.8, -25));
      renderer.render(scene, camera);
    };
    anim();

    const hRes = () => { camera.aspect = window.innerWidth / window.innerHeight; camera.updateProjectionMatrix(); renderer.setSize(window.innerWidth, window.innerHeight); };
    window.addEventListener("resize", hRes);

    return () => { window.removeEventListener("keydown", handleKey); window.removeEventListener("resize", hRes); bgm.pause(); bgm.src = ""; cancelAnimationFrame(fId); if (containerRef.current) containerRef.current.removeChild(renderer.domElement); };
  }, [gameState]);

  useEffect(() => { if (score > highScore) setHighScore(score); }, [score, highScore]);

  return (
    <div className="relative w-full h-screen bg-sky-400 overflow-hidden">
      {/* UI Elements */}
      <div className="absolute top-8 left-8 z-20">
        <Link href="/" className="flex items-center gap-2 text-white hover:text-accent transition-colors text-xs font-bold uppercase tracking-[0.3em] font-syne drop-shadow-lg">
          <ArrowLeft className="w-4 h-4" /> Exit University
        </Link>
      </div>
      <div className="absolute top-8 right-8 z-20 text-right drop-shadow-2xl">
        <div className="text-white text-6xl font-syne font-black italic tracking-tighter">{score}</div>
        <div className="text-white/40 text-[10px] font-bold uppercase tracking-[0.5em]">Class Credits</div>
      </div>

      <AnimatePresence>
        {gameState === "start" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 z-30 flex items-center justify-center bg-blue-950/50 backdrop-blur-xl">
            <div className="text-center space-y-12 max-w-2xl px-12">
              <div className="space-y-6">
                <h1 className="text-9xl font-syne font-black text-white italic tracking-tighter drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)]">UNAIR Runner</h1>
                <div className="bg-white/10 backdrop-blur-2xl p-10 rounded-[50px] border border-white/20 shadow-3xl text-white">
                  <div className="space-y-4 font-bold uppercase tracking-widest text-[11px]">
                    <p className="flex justify-between items-center gap-10"><span>⬅️ ➡️</span> <span className="text-accent">Slide Lanes</span></p>
                    <p className="flex justify-between items-center gap-10"><span>⬆️</span> <span className="text-accent">Double Jump (X2)</span></p>
                    <p className="flex justify-between items-center gap-10"><span>⬇️</span> <span className="text-accent">Turbo Slide</span></p>
                  </div>
                </div>
              </div>
              <button onClick={() => setGameState("playing")} className="group relative w-full bg-accent text-white py-8 rounded-[40px] text-sm font-black uppercase tracking-[0.7em] hover:scale-110 active:scale-95 transition-all shadow-[0_30px_60px_rgba(232,83,58,0.5)]">
                Launch to Class
              </button>
            </div>
          </motion.div>
        )}
        {gameState === "gameover" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute inset-0 z-30 flex items-center justify-center bg-red-950/95 backdrop-blur-3xl">
            <div className="text-center space-y-12 max-w-lg px-12 text-white">
              <h2 className="text-8xl font-syne font-black italic tracking-tighter underline decoration-accent underline-offset-8">DROPPED!</h2>
              <div className="grid grid-cols-2 gap-10 py-10 bg-white/5 rounded-[50px] border border-white/10">
                <div className="space-y-1">
                  <div className="text-5xl font-black font-syne">{score}</div>
                  <p className="text-[10px] uppercase opacity-40 font-bold">Credits</p>
                </div>
                <div className="space-y-1 border-l border-white/10">
                  <div className="text-5xl font-black font-syne text-accent">{highScore}</div>
                  <p className="text-[10px] uppercase opacity-40 font-bold">Dean's List</p>
                </div>
              </div>
              <div className="flex flex-col gap-6">
                <button onClick={() => { setScore(0); setGameState("playing"); }} className="w-full bg-white text-black py-8 rounded-[40px] text-sm font-black uppercase tracking-[0.5em] hover:bg-accent hover:text-white transition-all flex items-center justify-center gap-4 shadow-3xl"><RotateCcw className="w-6 h-6" /> Remedial Exam</button>
                <Link href="/" className="w-full bg-transparent text-white/50 py-8 rounded-[40px] text-[10px] font-bold uppercase tracking-[0.4em] border border-white/10 hover:bg-white hover:text-black transition-all">Back to Resume</Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div ref={containerRef} className="absolute inset-0 z-10" />
      
      {/* Cinematic Overlays */}
      <div className="absolute inset-0 z-15 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(circle,transparent_60%,rgba(0,0,0,0.7)_140%)]" />
          <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/asphalt-dark.png')]" />
          <div className="absolute top-0 left-0 w-full h-full opacity-30 shadow-[inset_0_0_150px_rgba(0,0,0,1)]" />
      </div>
    </div>
  );
}
