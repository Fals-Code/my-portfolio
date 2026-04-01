"use client";

import React, { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Float, MeshDistortMaterial, Sphere, Environment } from "@react-three/drei";
import { motion } from "framer-motion";
import * as THREE from "three";

function Scene() {
  const { viewport } = useThree();
  const meshRef = useRef<THREE.Mesh>(null!);
  
  // Track mouse movement
  const mouse = useRef({ x: 0, y: 0 });
  
  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useFrame((state) => {
    const { x, y } = mouse.current;
    
    // Smoothly interpolate position based on mouse
    if (meshRef.current) {
      meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, x * (viewport.width / 4), 0.05);
      meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, y * (viewport.height / 4), 0.05);
      meshRef.current.rotation.x += 0.005;
      meshRef.current.rotation.y += 0.005;
    }
  });

  return (
    <>
      <ambientLight intensity={1.5} />
      <directionalLight position={[10, 10, 5]} intensity={2} />
      <pointLight position={[-10, -10, -5]} intensity={1} color="#e8533a" />
      
      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
        <Sphere ref={meshRef} args={[1, 100, 200]} scale={1.8}>
          <MeshDistortMaterial
            color="#e8533a"
            speed={3}
            distort={0.4}
            radius={1}
            roughness={0.2}
            metalness={0.8}
            opacity={0.15}
            transparent
          />
        </Sphere>
      </Float>
      
      {/* Subtle extra shapes for depth */}
      <Float speed={2} rotationIntensity={1} floatIntensity={1} position={[3, -2, -2]}>
        <mesh scale={0.5}>
          <octahedronGeometry />
          <meshStandardMaterial color="#e8533a" opacity={0.05} transparent wireframe />
        </mesh>
      </Float>
    </>
  );
}

export default function ThreeBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 opacity-40 dark:opacity-30">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
}
