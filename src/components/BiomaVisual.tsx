'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { soundFx } from '@/lib/audio';

interface BiomaProps {
  bioma: {
    hydration: number;
    soilHealth: number;
    weedCount: number;
    weather: 'sunny' | 'rainy' | 'storm';
    score: number;
    activeLeaks: any[];
  };
  cameraView?: 'overview' | 'canopy' | 'roots';
  onSelectFruit?: (fruitId: string, amount: number) => void;
}

export default function BiomaVisual({ bioma, cameraView = 'overview', onSelectFruit }: BiomaProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const isCorrupted = bioma.weedCount > 0;

  // Fondo de Polen Bioluminiscente en Brisa Natural
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 700);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 480);

    const particles = Array.from({ length: 55 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2 + 0.8,
      vx: (Math.random() - 0.5) * 0.4,
      vy: bioma.weather === 'rainy' ? Math.random() * 2.5 + 1.5 : -0.2 - Math.random() * 0.4,
      alpha: Math.random() * 0.6 + 0.2,
    }));

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mousePos.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    };

    canvas.parentElement?.addEventListener('mousemove', handleMouseMove);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        const dx = mousePos.current.x - p.x;
        const dy = mousePos.current.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 80) {
          p.x -= (dx / dist) * 1.2;
          p.y -= (dy / dist) * 1.2;
        }

        p.y += p.vy;
        p.x += Math.sin(p.y * 0.015) * 0.35;

        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        if (bioma.weather === 'rainy') {
          ctx.strokeStyle = `rgba(45, 212, 191, ${p.alpha})`;
          ctx.lineWidth = 1;
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x, p.y + 8);
          ctx.stroke();
        } else {
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          // Polen dorado suave / verde naturaleza
          ctx.fillStyle = isCorrupted
            ? `rgba(217, 119, 6, ${p.alpha})`
            : `rgba(52, 211, 153, ${p.alpha})`;
          ctx.shadowBlur = 8;
          ctx.shadowColor = isCorrupted ? '#d97706' : '#34d399';
          ctx.fill();
        }
      });

      animId = requestAnimationFrame(render);
    };

    render();

    const handleResize = () => {
      if (!canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      canvas.parentElement?.removeEventListener('mousemove', handleMouseMove);
    };
  }, [isCorrupted, bioma.weather]);

  const getViewTransform = () => {
    switch (cameraView) {
      case 'canopy':
        return { scale: 1.45, translateY: 120 };
      case 'roots':
        return { scale: 1.45, translateY: -110 };
      default:
        return { scale: 1.0, translateY: 0 };
    }
  };

  const transform = getViewTransform();

  const fruits = [
    { id: 'f1', cx: 250, cy: 65, r: 8.5, label: 'Cosecha de Rendimiento', val: 145.20 },
    { id: 'f2', cx: 185, cy: 100, r: 9.5, label: 'Fruto de Micro-Ahorro', val: 82.50 },
    { id: 'f3', cx: 315, cy: 95, r: 9.5, label: 'Cosecha de Poda Activa', val: 210.00 },
    { id: 'f4', cx: 145, cy: 165, r: 7.5, label: 'Brote de Dividendos', val: 45.10 },
    { id: 'f5', cx: 350, cy: 145, r: 7.5, label: 'Reserva de Emergencia', val: 320.00 },
  ];

  return (
    <div className="relative w-full h-[480px] bg-[#070f0e] rounded-3xl overflow-hidden border border-emerald-950/40 flex items-center justify-center select-none shadow-2xl">
      
      {/* Canvas Polinizador */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

      {/* Luz Ambiental Botánica */}
      <div 
        className="absolute w-[450px] h-[450px] rounded-full blur-[130px] pointer-events-none transition-all duration-700"
        style={{
          background: isCorrupted 
            ? 'radial-gradient(circle, rgba(180,83,9,0.18) 0%, rgba(120,53,15,0.05) 70%, transparent 100%)'
            : 'radial-gradient(circle, rgba(16,185,129,0.18) 0%, rgba(45,212,191,0.06) 70%, transparent 100%)'
        }}
      />

      {/* ÁRBOL VECTORIAL ORGÁNICO */}
      <motion.div
        animate={{
          scale: transform.scale,
          y: transform.translateY,
        }}
        transition={{ type: 'spring', stiffness: 85, damping: 20 }}
        className="relative z-10 w-full max-w-[520px] h-[420px] flex items-center justify-center"
      >
        <svg
          viewBox="0 0 500 450"
          className="w-full h-full overflow-visible"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Gradientes de Madera Orgánica */}
            <linearGradient id="barkGrad" x1="250" y1="360" x2="250" y2="130" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#1c1917" />
              <stop offset="45%" stopColor="#44403c" />
              <stop offset="100%" stopColor={isCorrupted ? '#b45309' : '#059669'} />
            </linearGradient>

            {/* Gradiente de Arroyo */}
            <linearGradient id="waterGrad" x1="100" y1="350" x2="400" y2="350" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#0d9488" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#2dd4bf" stopOpacity="1" />
              <stop offset="100%" stopColor="#0d9488" stopOpacity="0.8" />
            </linearGradient>

            {/* Follaje Suave */}
            <radialGradient id="foliageGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={isCorrupted ? '#d97706' : '#10b981'} stopOpacity="0.45" />
              <stop offset="100%" stopColor="#047857" stopOpacity="0" />
            </radialGradient>

            <filter id="naturalSoftGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* ISLA FLOTANTE DE TIERRA Y MUSGO */}
          <g transform="translate(0, 15)">
            <ellipse cx="250" cy="385" rx="145" ry="24" fill="#020617" opacity="0.7" filter="blur(10px)" />
            
            {/* Base de Tierra de Roble */}
            <path
              d="M 110 350 Q 250 430 390 350 L 335 388 Q 250 440 165 388 Z"
              fill="#0f172a"
              stroke="#1e293b"
              strokeWidth="1.5"
            />
            
            {/* Capa de Musgo Vivo */}
            <ellipse cx="250" cy="350" rx="135" ry="22" fill="#064e3b" stroke="#10b981" strokeWidth="0.8" opacity="0.9" />
            
            {/* Arroyo de Liquidez Natural */}
            <ellipse
              cx="250"
              cy="350"
              rx="120"
              ry="18"
              fill="none"
              stroke="url(#waterGrad)"
              strokeWidth="3.5"
              strokeDasharray="10 6"
              filter="url(#naturalSoftGlow)"
              className="animate-[spin_25s_linear_infinite]"
            />
          </g>

          {/* RAÍCES QUE ABSORBEN NUTRIENTES */}
          <g filter="url(#naturalSoftGlow)">
            <path d="M 235 360 Q 190 380 155 365" stroke="#0d9488" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M 250 360 Q 250 392 240 405" stroke={isCorrupted ? '#b45309' : '#10b981'} strokeWidth="2" strokeLinecap="round" />
            <path d="M 265 360 Q 310 380 345 365" stroke="#0d9488" strokeWidth="2.5" strokeLinecap="round" />
          </g>

          {/* TRONCO CURVO REALISTA */}
          <path
            d="M 240 360 C 240 295 215 240 245 180 C 253 160 255 145 250 125"
            stroke="url(#barkGrad)"
            strokeWidth="16"
            strokeLinecap="round"
          />
          <path
            d="M 240 360 C 240 295 215 240 245 180 C 253 160 255 145 250 125"
            stroke={isCorrupted ? '#f59e0b' : '#34d399'}
            strokeWidth="1.8"
            strokeLinecap="round"
            opacity="0.6"
            filter="url(#naturalSoftGlow)"
          />

          {/* RAMAS SECUNDARIAS */}
          <g stroke="url(#barkGrad)" strokeLinecap="round">
            <path d="M 242 225 C 205 195 165 190 135 175" strokeWidth="6.5" />
            <path d="M 248 195 C 285 170 325 165 355 150" strokeWidth="6.5" />
            <path d="M 246 165 C 218 135 185 125 170 105" strokeWidth="4" />
            <path d="M 250 145 C 272 120 315 115 330 95" strokeWidth="4" />
          </g>

          {/* NUBES DE FOLLAJE ORGÁNICO EN CAPAS */}
          <g filter="url(#naturalSoftGlow)">
            <circle cx="250" cy="115" r="115" fill="url(#foliageGlow)" />

            {/* Clusters de hojas en verdes bosque y salvia */}
            <circle cx="250" cy="105" r="50" fill={isCorrupted ? '#b45309' : '#059669'} opacity="0.35" />
            <circle cx="195" cy="125" r="42" fill={isCorrupted ? '#d97706' : '#10b981'} opacity="0.3" />
            <circle cx="305" cy="120" r="44" fill={isCorrupted ? '#9a3412' : '#047857'} opacity="0.3" />
            <circle cx="250" cy="70" r="38" fill={isCorrupted ? '#f59e0b' : '#34d399'} opacity="0.35" />
            <circle cx="155" cy="170" r="28" fill="#059669" opacity="0.25" />
            <circle cx="345" cy="150" r="30" fill="#10b981" opacity="0.25" />
          </g>

          {/* FRUTOS DORADOS CÁLIDOS (MIEL DE ABEDA & ÁMBAR) */}
          <g filter="url(#naturalSoftGlow)">
            {fruits.map((fruit) => {
              const isHovered = selectedNode === fruit.id;
              return (
                <g 
                  key={fruit.id} 
                  className="cursor-pointer transition-transform duration-300 hover:scale-125"
                  onClick={() => {
                    soundFx.playClick();
                    setSelectedNode(fruit.id);
                    if (onSelectFruit) onSelectFruit(fruit.label, fruit.val);
                  }}
                  onMouseEnter={() => soundFx.playClick()}
                >
                  <circle cx={fruit.cx} cy={fruit.cy} r={fruit.r + (isHovered ? 5 : 2.5)} fill="#fbbf24" opacity="0.4" />
                  <circle cx={fruit.cx} cy={fruit.cy} r={fruit.r} fill={isHovered ? '#fff' : '#f59e0b'} />
                  <circle cx={fruit.cx - 2} cy={fruit.cy - 2} r={fruit.r * 0.35} fill="#fef3c7" />
                </g>
              );
            })}
          </g>

          {/* MALEZA / ESPINAS OTOÑALES (FUGAS) */}
          {isCorrupted && (
            <g filter="url(#naturalSoftGlow)">
              {[
                { x: 160, y: 345, angle: -25 },
                { x: 340, y: 345, angle: 25 },
                { x: 250, y: 360, angle: 0 },
              ].map((thorn, idx) => (
                <g key={idx} transform={`translate(${thorn.x}, ${thorn.y}) rotate(${thorn.angle})`}>
                  <path d="M 0 0 L -8 -32 L 0 -26 L 8 -32 Z" fill="#b45309" />
                  <circle cx="0" cy="-32" r="3" fill="#dc2626" className="animate-ping" />
                </g>
              ))}
            </g>
          )}
        </svg>
      </motion.div>

      {/* Tooltip Detalle de Fruto Clickeado */}
      <AnimatePresence>
        {selectedNode && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            className="absolute top-6 bg-stone-900/95 border border-emerald-500/40 p-3.5 rounded-2xl backdrop-blur-xl shadow-2xl z-20 flex items-center gap-3 text-xs"
          >
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 border border-amber-500/50 flex items-center justify-center text-amber-400 font-black">
              $
            </div>
            <div>
              <div className="text-stone-200 font-bold">
                {fruits.find(f => f.id === selectedNode)?.label}
              </div>
              <div className="text-emerald-400 font-mono font-black text-sm">
                +${fruits.find(f => f.id === selectedNode)?.val.toFixed(2)} USD
              </div>
            </div>
            <button 
              onClick={() => setSelectedNode(null)}
              className="text-stone-400 hover:text-white ml-2 font-bold px-1.5"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Badge de Clima */}
      <div className="absolute bottom-4 left-4 bg-stone-900/90 border border-white/10 px-3.5 py-1.5 rounded-2xl flex items-center gap-2.5 backdrop-blur-md">
        <span className={`w-2.5 h-2.5 rounded-full ${isCorrupted ? 'bg-amber-500 animate-ping' : 'bg-emerald-400 animate-pulse'}`} />
        <span className="text-[11px] font-mono text-stone-300">
          Clima: <strong className="text-white uppercase">{bioma.weather}</strong> • {isCorrupted ? 'Maleza Drenando' : 'Fotosíntesis Óptima'}
        </span>
      </div>
    </div>
  );
}