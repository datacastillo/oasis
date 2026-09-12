'use client';

import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';

function Tree({ score }: { score: number }) {
  const group = useRef<THREE.Group>(null);
  const scale = Math.max(0.2, score / 100); 
  
  useFrame(({ clock }) => {
    if (group.current) {
      group.current.position.y = Math.sin(clock.getElapsedTime()) * 0.05;
    }
  });

  return (
    <group ref={group} scale={[scale, scale, scale]} position={[0, 0, 0]}>
      <mesh position={[0, 1, 0]} castShadow>
        <cylinderGeometry args={[0.2, 0.4, 2, 8]} />
        <meshStandardMaterial color="#8B4513" roughness={0.9} />
      </mesh>
      <mesh position={[0, 2.5, 0]} castShadow>
        <dodecahedronGeometry args={[1.5, 1]} />
        <meshStandardMaterial color={score > 50 ? "#10b981" : "#84cc16"} roughness={0.5} />
      </mesh>
    </group>
  );
}

function Weeds({ count }: { count: number }) {
  return (
    <group>
      {Array.from({ length: count }).map((_, i) => {
        const angle = (i / count) * Math.PI * 2;
        const radius = 2 + Math.random();
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        return (
          <mesh key={i} position={[x, 0.2, z]} castShadow>
            <coneGeometry args={[0.3, 0.8, 4]} />
            <meshStandardMaterial color="#ef4444" roughness={0.7} emissive="#ef4444" emissiveIntensity={0.2} />
          </mesh>
        );
      })}
    </group>
  );
}

export default function BiomaScene({ bioma }: { bioma: any }) {
  const groundColor = bioma.soilHealth > 50 ? "#064e3b" : "#713f12"; 

  return (
    <div className="w-full h-[450px] rounded-3xl bg-slate-900 border border-emerald-500/20 overflow-hidden relative shadow-inner">
      <div className="absolute top-4 left-4 z-10 bg-slate-950/60 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10">
        <span className="text-emerald-400 font-bold block text-sm">Ecosistema 3D Activo</span>
      </div>

      <Canvas shadows camera={{ position: [0, 4, 8], fov: 45 }}>
        {/* Luces de reemplazo para evitar usar el CDN de Environment */}
        <ambientLight intensity={0.8} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} castShadow />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />
        
        <Tree score={bioma.score} />
        <Weeds count={bioma.weedCount} />
        
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
          <planeGeometry args={[20, 20]} />
          <meshStandardMaterial color={groundColor} roughness={1} />
        </mesh>

        <ContactShadows position={[0, 0.01, 0]} opacity={0.4} scale={10} blur={2} far={4} />
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} maxPolarAngle={Math.PI / 2 - 0.05} />
      </Canvas>
    </div>
  );
}