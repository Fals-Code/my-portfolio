"use client";

import React, { useRef, useMemo, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Text, Float, TrackballControls, Sphere } from "@react-three/drei";
import * as THREE from "three";

function Word({ children, ...props }: { children: string } & any) {
  const color = new THREE.Color();
  const fontProps = { font: '/fonts/Inter-Bold.woff', fontSize: 0.25, letterSpacing: -0.05, lineHeight: 1, 'material-toneMapped': false };
  const ref = useRef<any>(null);
  const [hovered, setHovered] = React.useState(false);
  
  const over = (e: any) => (e.stopPropagation(), setHovered(true));
  const out = () => setHovered(false);

  useFrame(() => {
    if (ref.current) {
      ref.current.quaternion.copy(props.camera.quaternion);
      ref.current.material.color.lerp(color.set(hovered ? "#e8533a" : "white"), 0.1);
    }
  });

  return (
    <Text ref={ref} onPointerOver={over} onPointerOut={out} {...props} {...fontProps} children={children} />
  );
}

function Cloud({ count = 8, radius = 5 }) {
  const words = useMemo(() => {
    const temp = [];
    const skills = [
      "Laravel", "MySQL", "PHP", 
      "Docker", "Git", "TypeScript", 
      "React", "Node.js", "Redis", 
      "PostgreSQL", "Inertia", "API"
    ];
    
    const spherical = new THREE.Spherical();
    const phiSpan = Math.PI / (count + 1);
    const thetaSpan = (Math.PI * 2) / count;
    
    for (let i = 0; i < skills.length; i++) {
        const phi = Math.acos(-1 + (2 * i) / skills.length);
        const theta = Math.sqrt(skills.length * Math.PI) * phi;
        const pos = new THREE.Vector3().setFromSphericalCoords(radius, phi, theta);
        temp.push([pos, skills[i % skills.length]]);
    }
    return temp;
  }, [count, radius]);

  const cloudRef = useRef<THREE.Group>(null!);
  useFrame((state) => {
    if (cloudRef.current) {
      cloudRef.current.rotation.y += 0.005;
      cloudRef.current.rotation.z += 0.002;
    }
  });

  return (
    <group ref={cloudRef}>
      {words.map(([pos, word], index) => (
        <Word key={index} position={pos} camera={null} children={word} />
      ))}
    </group>
  );
}

export default function SkillsOrbit() {
  return (
    <div className="w-full h-[300px] cursor-grab active:cursor-grabbing">
      <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 10], fov: 60 }}>
        <Suspense fallback={null}>
          <Cloud count={12} radius={6} />
          <TrackballControls noPan noZoom rotateSpeed={2} />
        </Suspense>
      </Canvas>
    </div>
  );
}
