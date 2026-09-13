'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  AlertTriangle, 
  ShieldCheck, 
  Droplets, 
  Sun, 
  CloudRain, 
  CloudLightning,
  TrendingUp, 
  Info, 
  Eye,
  Zap,
  DollarSign
} from 'lucide-react';

// ==========================================
// 1. INTERFACES Y TIPOS
// ==========================================
export interface FruitNode {
  id: string;
  cx: number;
  cy: number;
  r: number;
  label: string;
  amount: number;
  category: string;
}

export interface BiomaSceneProps {
  weedCount?: number;
  weather?: 'sunny' | 'rainy' | 'storm';
  cameraView?: 'overview' | 'canopy' | 'roots';
  healthScore?: number;
  onSelectFruit?: (label: string, amount: number) => void;
  onPruneAll?: () => void;
  className?: string;
}

// Nodos de frutas por defecto (Cosecha de ahorro Capital One)
const DEFAULT_FRUITS: FruitNode[] = [
  { id: 'f1', cx: 250, cy: 65, r: 9, label: 'Rendimiento 4.25% APY', amount: 145.20, category: 'Interés Compuesto' },
  { id: 'f2', cx: 185, cy: 105, r: 10, label: 'Auto-Ahorro 360 Checking', amount: 82.50, category: 'Resguardo' },
  { id: 'f3', cx: 315, cy: 98, r: 10, label: 'Bono Poda de Suscripciones', amount: 210.00, category: 'Fuga Detenida' },
  { id: 'f4', cx: 145, cy: 165, r: 8, label: 'Dividendos de Ahorro', amount: 45.10, category: 'Recompensa' },
  { id: 'f5', cx: 350, cy: 145, r: 8, label: 'Fondo de Emergencia Oasis', amount: 320.00, category: 'Patrimonio' },
];

export function BiomaScene({
  weedCount = 3,
  weather,
  cameraView: externalCameraView,
  healthScore,
  onSelectFruit,
  onPruneAll,
  className = ''
}: BiomaSceneProps) {

  // Estado interno para la vista de cámara (si no se provee externamente)
  const [internalCameraView, setInternalCameraView] = useState<'overview' | 'canopy' | 'roots'>('overview');
  const activeCameraView = externalCameraView || internalCameraView;

  // Fruto seleccionado para detalle flotante
  const [selectedFruit, setSelectedFruit] = useState<FruitNode | null>(null);
  const [hoveredFruit, setHoveredFruit] = useState<string | null>(null);

  // Cálculo del estado del clima y bioma si no vienen por props
  const isCorrupted = weedCount > 0;
  
  const computedWeather = useMemo(() => {
    if (weather) return weather;
    if (weedCount >= 3) return 'storm';
    if (weedCount > 0) return 'rainy';
    return 'sunny';
  }, [weather, weedCount]);

  const computedHealth = useMemo(() => {
    if (healthScore !== undefined) return healthScore;
    if (weedCount === 0) return 98;
    if (weedCount === 1) return 82;
    if (weedCount === 2) return 70;
    return 54;
  }, [healthScore, weedCount]);

  // Animaciones de transformación según la cámara
  const getViewTransform = () => {
    switch (activeCameraView) {
      case 'canopy':
        return { scale: 1.5, translateY: 110, translateX: 0 };
      case 'roots':
        return { scale: 1.5, translateY: -120, translateX: 0 };
      default:
        return { scale: 1.0, translateY: 0, translateX: 0 };
    }
  };

  const cameraTransform = getViewTransform();

  return (
    <div className={`relative w-full h-[520px] bg-gradient-to-b from-[#030A14] via-[#07131F] to-[#020611] rounded-3xl overflow-hidden border border-emerald-900/30 flex flex-col items-center justify-between p-4 select-none shadow-2xl ${className}`}>
      
      {/* 1. LUZ AMBIENTAL DINÁMICA DE FONDO (AURA) */}
      <div 
        className="absolute w-[500px] h-[500px] rounded-full blur-[140px] pointer-events-none transition-all duration-1000"
        style={{ 
          background: isCorrupted 
            ? 'radial-gradient(circle, rgba(225,29,72,0.18) 0%, rgba(180,83,9,0.08) 60%, transparent 100%)'
            : 'radial-gradient(circle, rgba(16,185,129,0.22) 0%, rgba(45,212,191,0.08) 60%, transparent 100%)'
        }} 
      />

      {/* 2. BARRA DE HERRAMIENTAS SUPERIOR / HUD OVERLAY */}
      <div className="w-full flex items-center justify-between z-20 relative bg-slate-950/60 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-slate-800/80">
        
        {/* Indicador del Clima Financiero */}
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl flex items-center justify-center ${
            computedWeather === 'sunny' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30' :
            computedWeather === 'rainy' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30' :
            'bg-rose-500/10 text-rose-400 border border-rose-500/30'
          }`}>
            {computedWeather === 'sunny' && <Sun className="w-4 h-4 animate-[spin_12s_linear_infinite]" />}
            {computedWeather === 'rainy' && <CloudRain className="w-4 h-4 animate-bounce" />}
            {computedWeather === 'storm' && <CloudLightning className="w-4 h-4 animate-pulse" />}
          </div>
          <div>
            <span className="text-[10px] text-stone-400 font-bold uppercase block tracking-wider">Clima del Ecosistema</span>
            <span className="text-xs font-black text-white capitalize">
              {computedWeather === 'sunny' ? '☀️ Fotosíntesis Activa' : computedWeather === 'rainy' ? '🌧️ Lluvia de Nutrientes' : '⚡ Tormenta por Fugas'}
            </span>
          </div>
        </div>

        {/* Vital Score de Salud */}
        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <span className="text-[10px] text-stone-400 font-bold uppercase block tracking-wider">Salud Capital One</span>
            <span className={`text-xs font-bold ${computedHealth > 80 ? 'text-emerald-400' : 'text-amber-400'}`}>
              {computedHealth}% Vitalidad
            </span>
          </div>

          {/* Selector de Perspectiva (Cámara) */}
          <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
            {[
              { id: 'overview', label: 'General' },
              { id: 'canopy', label: 'Follaje' },
              { id: 'roots', label: 'Raíces' }
            ].map((cam) => (
              <button
                key={cam.id}
                onClick={() => setInternalCameraView(cam.id as any)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                  activeCameraView === cam.id
                    ? 'bg-emerald-500 text-slate-950 shadow-md font-extrabold'
                    : 'text-stone-400 hover:text-white'
                }`}
              >
                {cam.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. ESCENA VECTORIAL DEL ÁRBOL BIOMA 3D/ORGANICO */}
      <motion.div
        animate={{ 
          scale: cameraTransform.scale, 
          y: cameraTransform.translateY,
          x: cameraTransform.translateX
        }}
        transition={{ type: 'spring', stiffness: 90, damping: 22 }}
        className="relative z-10 w-full max-w-[540px] h-[380px] flex items-center justify-center my-auto"
      >
        <svg 
          viewBox="0 0 500 450" 
          className="w-full h-full filter drop-shadow-2xl overflow-visible" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Gradiente de Corteza */}
            <linearGradient id="trunkGrad" x1="250" y1="360" x2="250" y2="120" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#1C1917" />
              <stop offset="50%" stopColor="#332E2B" />
              <stop offset="100%" stopColor={isCorrupted ? '#B45309' : '#059669'} />
            </linearGradient>

            {/* Gradiente del Anillo de Agua/Raíces */}
            <linearGradient id="oasisWater" x1="100" y1="350" x2="400" y2="350" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#0D9488" stopOpacity="0.7" />
              <stop offset="50%" stopColor="#2DD4BF" stopOpacity="1" />
              <stop offset="100%" stopColor="#0D9488" stopOpacity="0.7" />
            </linearGradient>

            {/* Resplandor Follaje */}
            <radialGradient id="foliageGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={isCorrupted ? '#F59E0B' : '#10B981'} stopOpacity="0.45" />
              <stop offset="100%" stopColor="#047857" stopOpacity="0" />
            </radialGradient>

            {/* Filtro Suave de Glow Bioluminiscente */}
            <filter id="softGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* BASE ISLA FLOTANTE Y MUSGO */}
          <g transform="translate(0, 15)">
            <ellipse cx="250" cy="385" rx="150" ry="26" fill="#020617" opacity="0.8" filter="blur(12px)" />
            <path d="M 105 350 Q 250 435 395 350 L 340 390 Q 250 445 160 390 Z" fill="#091322" stroke="#1E293B" strokeWidth="1.5" />
            <ellipse cx="250" cy="350" rx="140" ry="24" fill="#042F2E" stroke="#10B981" strokeWidth="0.8" opacity="0.9" />
            <ellipse 
              cx="250" 
              cy="350" 
              rx="124" 
              ry="18" 
              fill="none" 
              stroke="url(#oasisWater)" 
              strokeWidth="3.5" 
              strokeDasharray="12 8" 
              filter="url(#softGlow)" 
              className="animate-[spin_28s_linear_infinite]" 
            />
          </g>

          {/* RED DE RAÍCES QUE CONECTAN A CAPITAL ONE */}
          <g filter="url(#softGlow)">
            <path d="M 235 360 Q 185 385 145 368" stroke="#0D9488" strokeWidth="3" strokeLinecap="round" />
            <path d="M 250 360 Q 250 398 238 412" stroke={isCorrupted ? '#D97706' : '#10B981'} strokeWidth="2.5" strokeLinecap="round" />
            <path d="M 265 360 Q 315 385 355 368" stroke="#0D9488" strokeWidth="3" strokeLinecap="round" />
          </g>

          {/* TRONCO ORGANICO */}
          <path 
            d="M 240 360 C 240 295 212 240 245 178 C 253 158 255 142 250 120" 
            stroke="url(#trunkGrad)" 
            strokeWidth="17" 
            strokeLinecap="round" 
          />
          <path 
            d="M 240 360 C 240 295 212 240 245 178 C 253 158 255 142 250 120" 
            stroke={isCorrupted ? '#F59E0B' : '#34D399'} 
            strokeWidth="2" 
            strokeLinecap="round" 
            opacity="0.6" 
            filter="url(#softGlow)" 
          />

          {/* RAMAS SECUNDARIAS */}
          <g stroke="url(#trunkGrad)" strokeLinecap="round">
            <path d="M 242 225 C 205 195 165 190 135 175" strokeWidth="7" />
            <path d="M 248 195 C 285 170 325 165 355 150" strokeWidth="7" />
            <path d="M 246 165 C 218 135 185 125 170 105" strokeWidth="4.5" />
            <path d="M 250 145 C 272 120 315 115 330 95" strokeWidth="4.5" />
          </g>

          {/* FOLLAJE ORGÁNICO EN CAPAS */}
          <g filter="url(#softGlow)">
            <circle cx="250" cy="115" r="120" fill="url(#foliageGlow)" />
            <circle cx="250" cy="105" r="54" fill={isCorrupted ? '#B45309' : '#059669'} opacity="0.38" />
            <circle cx="190" cy="125" r="45" fill={isCorrupted ? '#D97706' : '#10B981'} opacity="0.32" />
            <circle cx="310" cy="120" r="46" fill={isCorrupted ? '#9A3412' : '#047857'} opacity="0.32" />
            <circle cx="250" cy="68" r="40" fill={isCorrupted ? '#F59E0B' : '#34D399'} opacity="0.38" />
          </g>

          {/* FRUTOS DORADOS RECOMPENSA (INTERACTIVOS) */}
          <g filter="url(#softGlow)">
            {DEFAULT_FRUITS.map((fruit) => {
              const isSelected = selectedFruit?.id === fruit.id;
              const isHovered = hoveredFruit === fruit.id;

              return (
                <g 
                  key={fruit.id} 
                  className="cursor-pointer transition-transform duration-300"
                  onMouseEnter={() => setHoveredFruit(fruit.id)}
                  onMouseLeave={() => setHoveredFruit(null)}
                  onClick={() => {
                    setSelectedFruit(fruit);
                    if (onSelectFruit) onSelectFruit(fruit.label, fruit.amount);
                  }}
                >
                  {/* Aura brillante al interactuar */}
                  <circle 
                    cx={fruit.cx} 
                    cy={fruit.cy} 
                    r={fruit.r + (isHovered || isSelected ? 8 : 3)} 
                    fill="#FBBF24" 
                    opacity={isHovered || isSelected ? 0.6 : 0.3} 
                    className="animate-pulse"
                  />
                  {/* Fruto Principal */}
                  <circle 
                    cx={fruit.cx} 
                    cy={fruit.cy} 
                    r={fruit.r} 
                    fill={isHovered || isSelected ? '#FFFFFF' : '#F59E0B'} 
                  />
                  {/* Destello de brillo */}
                  <circle 
                    cx={fruit.cx - 2.5} 
                    cy={fruit.cy - 2.5} 
                    r={fruit.r * 0.35} 
                    fill="#FEF3C7" 
                  />
                </g>
              );
            })}
          </g>

          {/* MALEZA / ESPINAS AMENAZANTES (FUGAS DETECTADAS) */}
          {isCorrupted && (
            <g filter="url(#softGlow)">
              {[
                { x: 160, y: 345, angle: -25, label: 'Fuga Gym' },
                { x: 340, y: 345, angle: 25, label: 'Fuga Streaming' },
                { x: 250, y: 360, angle: 0, label: 'Fuga Cloud' }
              ].slice(0, weedCount).map((thorn, idx) => (
                <g key={idx} transform={`translate(${thorn.x}, ${thorn.y}) rotate(${thorn.angle})`}>
                  <path d="M 0 0 L -8 -34 L 0 -28 L 8 -34 Z" fill="#E11D48" />
                  <circle cx="0" cy="-34" r="3.5" fill="#FFF" className="animate-ping" />
                </g>
              ))}
            </g>
          )}
        </svg>
      </motion.div>

      {/* 4. MODAL / TOOLTIP POPUP DE FRUTO SELECCIONADO */}
      <AnimatePresence>
        {selectedFruit && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute bottom-16 left-1/2 -translate-x-1/2 z-30 bg-slate-900/95 border border-amber-500/40 p-4 rounded-2xl shadow-2xl backdrop-blur-xl max-w-xs w-full text-center space-y-2"
          >
            <div className="flex items-center justify-between text-xs text-amber-400 font-bold border-b border-slate-800 pb-1.5">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" /> {selectedFruit.category}
              </span>
              <button 
                onClick={() => setSelectedFruit(null)}
                className="text-stone-400 hover:text-white text-xs px-1"
              >
                ✕
              </button>
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">{selectedFruit.label}</h4>
              <div className="text-xl font-black text-amber-300 font-mono mt-0.5">
                +${selectedFruit.amount.toFixed(2)} USD
              </div>
            </div>
            <p className="text-[11px] text-stone-300">
              Fondo protegido depositado en tu <strong className="text-emerald-400">Capital One 360</strong>.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 5. FOOTER DEL BIOMA CON ACCIÓN RÁPIDA */}
      <div className="w-full flex items-center justify-between z-20 relative bg-slate-950/40 px-4 py-2 rounded-xl border border-slate-800/50 text-xs">
        <div className="flex items-center gap-2">
          {isCorrupted ? (
            <span className="flex items-center gap-1.5 text-rose-400 font-bold">
              <AlertTriangle className="w-4 h-4 animate-bounce" /> {weedCount} Fuga(s) Innecesaria(s) Drenando Nutrientes
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <ShieldCheck className="w-4 h-4" /> Ecosistema Protegido por Oasis AI
            </span>
          )}
        </div>

        {isCorrupted && onPruneAll && (
          <button
            onClick={onPruneAll}
            className="bg-rose-600 hover:bg-rose-500 text-white font-bold px-3 py-1 rounded-lg transition-all shadow-md text-[11px] flex items-center gap-1.5 active:scale-95"
          >
            <Zap className="w-3 h-3 fill-current" /> Podar Maleza
          </button>
        )}
      </div>

    </div>
  );
}

export default BiomaScene;