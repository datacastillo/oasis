'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface BiomaProps {
  bioma: {
    hydration: number;
    soilHealth: number;
    weedCount: number;
    weather: 'sunny' | 'rainy' | 'storm';
    score: number;
    activeLeaks: any[];
  };
}

export default function BiomaScene({ bioma }: BiomaProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 450;

    // 1. ESCENA, CÁMARA Y RENDERIZADOR HI-TECH
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x030712, 0.03);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 6, 12);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.5;

    container.appendChild(renderer.domElement);

    // 2. SISTEMA DE ILUMINACIÓN NEÓN REACTIVO
    const ambientLight = new THREE.AmbientLight(0x0f172a, 2.5);
    scene.add(ambientLight);

    const coreLight = new THREE.PointLight(
      bioma.weedCount > 0 ? 0xf43f5e : 0x10b981,
      bioma.weedCount > 0 ? 12 : 8,
      15
    );
    coreLight.position.set(0, 2.5, 0);
    scene.add(coreLight);

    const rimLight1 = new THREE.DirectionalLight(0x06b6d4, 3);
    rimLight1.position.set(-6, 10, -4);
    scene.add(rimLight1);

    const rimLight2 = new THREE.DirectionalLight(0x8b5cf6, 2);
    rimLight2.position.set(6, -5, 5);
    scene.add(rimLight2);

    // 3. BASE HEXAGONA CYBERNETICA (3 NIVELES)
    const baseGroup = new THREE.Group();

    // Nivel 1: Chasis Inferior
    const chassisGeo = new THREE.CylinderGeometry(4.0, 2.8, 0.8, 6);
    const chassisMat = new THREE.MeshStandardMaterial({
      color: 0x030712,
      roughness: 0.2,
      metalness: 0.9,
      wireframe: false,
    });
    const chassisMesh = new THREE.Mesh(chassisGeo, chassisMat);
    chassisMesh.position.y = -0.8;
    baseGroup.add(chassisMesh);

    // Nivel 2: Plataforma Neón Intermedia
    const midGeo = new THREE.CylinderGeometry(3.8, 3.8, 0.2, 6);
    const midMat = new THREE.MeshStandardMaterial({
      color: bioma.weedCount > 0 ? 0x881337 : 0x047857,
      emissive: bioma.weedCount > 0 ? 0xe11d48 : 0x10b981,
      emissiveIntensity: bioma.weedCount > 0 ? 0.8 : 0.4,
      roughness: 0.3,
    });
    const midMesh = new THREE.Mesh(midGeo, midMat);
    midMesh.position.y = -0.3;
    baseGroup.add(midMesh);

    // Nivel 3: Superficie Principal Hexagonal
    const topGeo = new THREE.CylinderGeometry(3.6, 3.6, 0.4, 6);
    const topMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.4,
      metalness: 0.6,
    });
    const topMesh = new THREE.Mesh(topGeo, topMat);
    topMesh.position.y = 0.0;
    baseGroup.add(topMesh);

    scene.add(baseGroup);

    // 4. RECTÁNGULO DE GRID Y REJILLA DE ENERGÍA
    const gridHelper = new THREE.PolarGridHelper(3.5, 6, 4, 24, bioma.weedCount > 0 ? 0xf43f5e : 0x34d399, 0x1e293b);
    gridHelper.position.y = 0.21;
    scene.add(gridHelper);

    // 5. ESCUDO DE FUERZA DE ENERGÍA GEODÉSICA
    const shieldGeo = new THREE.IcosahedronGeometry(4.5, 2);
    const shieldMat = new THREE.MeshPhysicalMaterial({
      color: bioma.weedCount > 0 ? 0xf43f5e : 0x38bdf8,
      emissive: bioma.weedCount > 0 ? 0x9f1239 : 0x0284c7,
      emissiveIntensity: bioma.weedCount > 0 ? 0.8 : 0.2,
      wireframe: true,
      transparent: true,
      opacity: bioma.weedCount > 0 ? 0.4 : 0.15,
    });
    const shieldMesh = new THREE.Mesh(shieldGeo, shieldMat);
    shieldMesh.position.y = 0.8;
    scene.add(shieldMesh);

    // 6. NÚCLEO CUÁNTICO CENTRAL CON ANILLOS GIROSCÓPICOS
    const coreGroup = new THREE.Group();
    coreGroup.position.set(0, 2.2, 0);

    // Cristales Centrales Superpuestos
    const coreGeo = new THREE.OctahedronGeometry(0.85, 0);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      emissive: bioma.weedCount > 0 ? 0xf43f5e : 0x10b981,
      emissiveIntensity: 1.5,
      roughness: 0.1,
      metalness: 0.9,
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    coreGroup.add(coreMesh);

    // Anillo Giroscópico Exterior 1
    const ring1Geo = new THREE.TorusGeometry(1.4, 0.03, 16, 50);
    const ringMat1 = new THREE.MeshStandardMaterial({
      color: bioma.weedCount > 0 ? 0xf43f5e : 0x38bdf8,
      emissive: bioma.weedCount > 0 ? 0xe11d48 : 0x0284c7,
      emissiveIntensity: 1.2,
      metalness: 0.9,
    });
    const ring1 = new THREE.Mesh(ring1Geo, ringMat1);
    coreGroup.add(ring1);

    // Anillo Giroscópico Exterior 2
    const ring2Geo = new THREE.TorusGeometry(1.8, 0.03, 16, 50);
    const ringMat2 = new THREE.MeshStandardMaterial({
      color: bioma.weedCount > 0 ? 0xfb7185 : 0x34d399,
      emissive: bioma.weedCount > 0 ? 0x9f1239 : 0x059669,
      emissiveIntensity: 1.0,
      metalness: 0.9,
    });
    const ring2 = new THREE.Mesh(ring2Geo, ringMat2);
    coreGroup.add(ring2);

    scene.add(coreGroup);

    // 7. ORBES DE SALUD ORBITALES O ESPINAS DE INFEC-CIÓN (MALEZAS)
    const floraGroup = new THREE.Group();
    const radius = 2.2;

    if (bioma.weedCount > 0) {
      // MODO AMENAZA: Espinas de Cristal Invasivas
      const count = Math.min(bioma.weedCount * 3, 9);
      for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2;
        const x = Math.cos(angle) * (radius * 0.8);
        const z = Math.sin(angle) * (radius * 0.8);

        const spikeGeo = new THREE.ConeGeometry(0.25, 1.4, 5);
        const spikeMat = new THREE.MeshStandardMaterial({
          color: 0xf43f5e,
          emissive: 0x9f1239,
          emissiveIntensity: 1.2,
          roughness: 0.2,
        });
        const spike = new THREE.Mesh(spikeGeo, spikeMat);
        spike.position.set(x, 0.7, z);
        spike.rotation.x = (Math.random() - 0.5) * 0.5;
        spike.rotation.z = (Math.random() - 0.5) * 0.5;
        floraGroup.add(spike);
      }
    } else {
      // MODO ÓPTIMO: Orbes Cilíndricos Neón Orbitantes
      for (let i = 0; i < 5; i++) {
        const angle = (i / 5) * Math.PI * 2;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;

        const orbGeo = new THREE.IcosahedronGeometry(0.25, 1);
        const orbMat = new THREE.MeshStandardMaterial({
          color: 0x34d399,
          emissive: 0x10b981,
          emissiveIntensity: 1.5,
          roughness: 0.1,
        });
        const orb = new THREE.Mesh(orbGeo, orbMat);
        orb.position.set(x, 0.5, z);
        floraGroup.add(orb);
      }
    }
    scene.add(floraGroup);

    // 8. VÓRTICE DE PARTÍCULAS NEÓN
    const particleCount = 350;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);
    const angles = new Float32Array(particleCount);
    const radii = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      angles[i] = Math.random() * Math.PI * 2;
      radii[i] = 1.0 + Math.random() * 3.5;

      particlePos[i * 3] = Math.cos(angles[i]) * radii[i];
      particlePos[i * 3 + 1] = Math.random() * 6;
      particlePos[i * 3 + 2] = Math.sin(angles[i]) * radii[i];
    }

    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));

    const particleMat = new THREE.PointsMaterial({
      size: bioma.weedCount > 0 ? 0.08 : 0.06,
      color: bioma.weedCount > 0 ? 0xf43f5e : 0x38bdf8,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
    });

    const particleSystem = new THREE.Points(particleGeo, particleMat);
    scene.add(particleSystem);

    // 9. INTERACTIVIDAD DE MOUSE (PARALLAX TILT)
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouseY = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // 10. BUCLE DE ANIMACIÓN CINEMÁTICA
    const clock = new THREE.Clock();
    let animId: number;

    const animate = () => {
      const t = clock.getElapsedTime();

      // Suavizado de movimiento de cámara con el mouse
      targetX += (mouseX * 3 - targetX) * 0.05;
      targetY += (mouseY * 2 - targetY) * 0.05;

      camera.position.x = Math.sin(t * 0.15) * 11 + targetX;
      camera.position.z = Math.cos(t * 0.15) * 11;
      camera.position.y = 6 + targetY;
      camera.lookAt(0, 1.2, 0);

      // Flotación y rotación de base e isla
      baseGroup.position.y = Math.sin(t * 0.8) * 0.1;
      shieldMesh.position.y = 0.8 + Math.sin(t * 0.8) * 0.1;
      shieldMesh.rotation.y = t * 0.08;

      // Rotación opuesta de anillos giroscópicos
      coreMesh.rotation.y = t * 1.2;
      coreMesh.rotation.x = Math.sin(t) * 0.4;

      ring1.rotation.x = t * 1.8;
      ring1.rotation.y = t * 0.9;

      ring2.rotation.y = -t * 1.5;
      ring2.rotation.z = t * 1.1;

      coreGroup.position.y = 2.2 + Math.sin(t * 1.8) * 0.15;

      // Animación de malezas / espinas
      if (bioma.weedCount > 0) {
        coreLight.intensity = 10 + Math.sin(t * 14) * 6; // Pulso de alarma frenético
        floraGroup.children.forEach((spike, idx) => {
          spike.scale.y = 1 + Math.sin(t * 8 + idx) * 0.25;
        });
      } else {
        coreLight.intensity = 8 + Math.sin(t * 2) * 2;
        floraGroup.rotation.y = t * 0.5; // Los orbes saludables rotan en órbita
      }

      // Animación del Vórtice de Partículas
      const posArr = particleSystem.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < particleCount; i++) {
        angles[i] += (bioma.weedCount > 0 ? 0.03 : 0.015);
        let y = posArr[i * 3 + 1];
        y += bioma.weedCount > 0 ? -0.05 : 0.025;
        if (y > 6) y = 0;
        if (y < 0) y = 6;

        posArr[i * 3] = Math.cos(angles[i]) * radii[i];
        posArr[i * 3 + 1] = y;
        posArr[i * 3 + 2] = Math.sin(angles[i]) * radii[i];
      }
      particleSystem.geometry.attributes.position.needsUpdate = true;

      renderer.render(scene, camera);
      animId = requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth || 600;
      const h = container.clientHeight || 450;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [bioma]);

  return (
    <div className="relative w-full h-[450px] cursor-grab active:cursor-grabbing">
      <div ref={mountRef} className="w-full h-full" />
    </div>
  );
}