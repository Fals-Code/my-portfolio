"use client";

import React, { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sphere, Environment } from "@react-three/drei";
import { usePerformance } from "@/hooks/usePerformance";
import * as THREE from "three";

function Scene({ tier }: { tier: string }) {
  const { viewport, invalidate } = useThree();
  const meshRef = useRef<THREE.Mesh>(null!);
  const mouse = useRef({ x: 0, y: 0 });

  // Geometry segments based on performance tier - Reduced more for performance
  const segments = useMemo(() => {
    switch (tier) {
      case "high": return [1, 80, 160];
      case "medium": return [1, 32, 64];
      default: return [1, 12, 24];
    }
  }, [tier]);

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
      invalidate(); // Trigger a single frame render
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [invalidate]);

  useFrame((state) => {
    if (!meshRef.current) return;
    const { x, y } = mouse.current;
    
    // Smooth interpolation
    meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, x * (viewport.width / 4), 0.05);
    meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, y * (viewport.height / 4), 0.05);
    meshRef.current.rotation.x += 0.005;
    meshRef.current.rotation.y += 0.005;
  });

  return (
    <>
      <ambientLight intensity={1.5} />
      <directionalLight position={[10, 10, 5]} intensity={2} />
      <pointLight position={[-10, -10, -5]} intensity={1} color="#e8533a" />
      
      <Float speed={tier === "high" ? 1.5 : 0.8} rotationIntensity={0.5} floatIntensity={0.5}>
        <Sphere ref={meshRef} args={segments as any} scale={1.8}>
          <MeshDistortMaterial
            color="#e8533a"
            speed={tier === "high" ? 3 : 1.5}
            distort={0.4}
            radius={1}
            roughness={0.2}
            metalness={0.8}
            opacity={0.15}
            transparent
          />
        </Sphere>
      </Float>
      
      {tier === "high" && (
        <Float speed={2} rotationIntensity={1} floatIntensity={1} position={[3, -2, -2]}>
          <mesh scale={0.5}>
            <octahedronGeometry />
            <meshStandardMaterial color="#e8533a" opacity={0.05} transparent wireframe />
          </mesh>
        </Float>
      )}
    </>
  );
}

export default function ThreeBackground() {
  const { tier, isLow } = usePerformance();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Only render on HIGH tier desktop machines
  if (!mounted || tier !== "high") return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-0 opacity-15 dark:opacity-20 translate-z-0">
      <Canvas
        frameloop="demand" // Only renders on request
        camera={{ position: [0, 0, 5], fov: 75 }}
        gl={{ 
          antialias: tier === "high", 
          alpha: true,
          powerPreference: "high-performance",
          stencil: false,
          depth: true
        }}
        dpr={tier === "high" ? [1, 2] : [1, 1.5]}
      >
        <Suspense fallback={null}>
          <Scene tier={tier} />
        </Suspense>
      </Canvas>
    </div>
  );
}
