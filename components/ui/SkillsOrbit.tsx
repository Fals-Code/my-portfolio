"use client";

import React, { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Text, Float, TrackballControls, Sphere } from "@react-three/drei";
import { usePerformance } from "@/hooks/usePerformance";
import * as THREE from "three";

function Word({ children, tier, ...props }: { children: string; tier: string } & any) {
  const color = new THREE.Color();
  const fontProps = { 
    font: '/fonts/Inter-Bold.woff', 
    fontSize: tier === "high" ? 0.25 : 0.22, 
    letterSpacing: -0.05, 
    lineHeight: 1, 
    'material-toneMapped': false 
  };
  const ref = useRef<any>(null);
  const [hovered, setHovered] = React.useState(false);
  
  const over = (e: any) => (e.stopPropagation(), setHovered(true));
  const out = () => setHovered(false);

  useFrame((state) => {
    if (ref.current) {
      // Look at camera
      ref.current.quaternion.copy(state.camera.quaternion);
      
      // Color lerp
      const targetColor = hovered ? "#e8533a" : (tier === "low" ? "#aaaaaa" : "white");
      ref.current.material.color.lerp(color.set(targetColor), 0.1);
    }
  });

  return (
    <Text ref={ref} onPointerOver={over} onPointerOut={out} {...props} {...fontProps}>
      {children}
    </Text>
  );
}

function Cloud({ count = 8, radius = 5, tier }: { count?: number; radius?: number; tier: string }) {
  const words = useMemo(() => {
    const temp = [];
    const skills = [
      "Laravel", "MySQL", "PHP", 
      "Docker", "Git", "TypeScript", 
      "React", "Node.js", "Redis", 
      "PostgreSQL", "Inertia", "API"
    ];
    
    // Reduce skill count for mobile/low-end
    const displayCount = tier === "low" ? 8 : skills.length;
    const finalSkills = skills.slice(0, displayCount);

    for (let i = 0; i < finalSkills.length; i++) {
        const phi = Math.acos(-1 + (2 * i) / finalSkills.length);
        const theta = Math.sqrt(finalSkills.length * Math.PI) * phi;
        const pos = new THREE.Vector3().setFromSphericalCoords(radius, phi, theta);
        temp.push([pos, finalSkills[i]]);
    }
    return temp;
  }, [tier, radius]);

  const cloudRef = useRef<THREE.Group>(null!);
  useFrame((state) => {
    if (cloudRef.current) {
      cloudRef.current.rotation.y += tier === "low" ? 0.002 : 0.005;
      cloudRef.current.rotation.z += tier === "low" ? 0.001 : 0.002;
    }
  });

  return (
    <group ref={cloudRef}>
      {words.map(([pos, word], index) => (
        <Word key={index} position={pos} tier={tier} children={word} />
      ))}
    </group>
  );
}

export default function SkillsOrbit() {
  const { tier, isLow } = usePerformance();

  return (
    <div className="w-full h-[280px] md:h-[400px] cursor-grab active:cursor-grabbing transform-gpu">
      <Canvas 
        dpr={tier === "high" ? [1, 2] : [1, 1]} 
        camera={{ position: [0, 0, 10], fov: 60 }}
        performance={{ min: 0.5 }}
        gl={{ 
          antialias: tier === "high", 
          powerPreference: "high-performance",
          alpha: true,
          stencil: false,
          depth: true,
          preserveDrawingBuffer: false
        }}
      >
        <Suspense fallback={null}>
          <Cloud tier={tier} radius={isLow ? 5 : 6} />
          {tier !== "low" && <TrackballControls noPan noZoom rotateSpeed={2} />}
        </Suspense>
      </Canvas>
    </div>
  );
}
