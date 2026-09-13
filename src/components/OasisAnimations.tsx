'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Zap, Lock, Sparkles, TrendingUp, Search, CheckCircle2 } from 'lucide-react';

// ============================================================================
// 1. COMPONENTE: RADAR DE ESCANEO DE FUGAS (OASIS SCANNER)
// ============================================================================
export interface EscaneoEstadoProps {
  escaneando: boolean;
  onCompletado?: () => void;
}

export function RadarEscaneoOasis({ escaneando, onCompletado }: EscaneoEstadoProps) {
  const [pasoActual, setPasoActual] = useState(0);

  const pasos = [
    'Verificando transacciones de Capital One 360...',
    'Analizando patrones de facturación recurrente...',
    'Cruzando ubicación con actividad en comercios...',
    'Identificando cobros duplicados y membresías inactivas...',
    'Escaneo de seguridad finalizado con éxito.'
  ];

  useEffect(() => {
    if (!escaneando) return;

    const interval = setInterval(() => {
      setPasoActual((prev) => {
        if (prev < pasos.length - 1) {
          return prev + 1;
        } else {
          clearInterval(interval);
          if (onCompletado) onCompletado();
          return prev;
        }
      });
    }, 1200);

    return () => clearInterval(interval);
  }, [escaneando, onCompletado, pasos.length]);

  return (
    <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-6 relative overflow-hidden backdrop-blur-md">
      {/* Luz ambiental */}
      <div className="absolute -top-10 -left-10 w-40 h-40 bg-[#004B87]/20 rounded-full blur-2xl pointer-events-none" />

      <div className="flex flex-col md:flex-row items-center gap-6 relative z-10">
        
        {/* Radar Gráfico Vectorial */}
        <div className="relative w-28 h-28 shrink-0 flex items-center justify-center">
          {/* Círculos concéntricos */}
          <div className="absolute inset-0 rounded-full border border-slate-800" />
          <div className="absolute inset-2 rounded-full border border-cyan-900/40" />
          <div className="absolute inset-6 rounded-full border border-cyan-500/20" />
          
          {/* Cruz del Radar */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-full h-[1px] bg-slate-800/60" />
            <div className="h-full w-[1px] bg-slate-800/60 absolute" />
          </div>

          {/* Barrido giratorio */}
          {escaneando && (
            <motion.div
              className="absolute inset-0 rounded-full bg-conic-gradient from-cyan-500/30 via-transparent to-transparent"
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 2.5, ease: 'linear' }}
              style={{
                background: 'conic-gradient(from 0deg, rgba(6, 182, 212, 0.35) 0deg, transparent 90deg, transparent 360deg)'
              }}
            />
          )}

          {/* Icono Central */}
          <div className="relative z-10 p-2.5 bg-slate-900 border border-cyan-500/30 rounded-xl text-cyan-400">
            <Search className={`w-5 h-5 ${escaneando ? 'animate-pulse' : ''}`} />
          </div>
        </div>

        {/* Texto de Estado del Escaneo */}
        <div className="space-y-2 text-center md:text-left flex-1">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold">
              Motor Oasis AI • Monitoreo en Vivo
            </span>
          </div>

          <h3 className="text-base font-bold text-white">
            {escaneando ? 'Analizando comportamiento de gasto' : 'Escaneo de seguridad al día'}
          </h3>

          <p className="text-xs text-slate-400 font-mono h-5">
            {escaneando ? pasos[pasoActual] : '3 cuentas Capital One verificadas. Protección activa.'}
          </p>
        </div>

      </div>
    </div>
  );
}

// ============================================================================
// 2. COMPONENTE: VISUALIZADOR DE RANGO DE AHORRO E INTERÉS
// ============================================================================
export interface VisualizadorCrecimientoProps {
  montoAhorradoMensual: number;
}

export function VisualizadorCrecimiento({ montoAhorradoMensual }: VisualizadorCrecimientoProps) {
  const [meses, setMeses] = useState(12);

  const ahorroAcumulado = montoAhorradoMensual * meses;
  const tasaAPY = 0.0425; // 4.25% Rendimiento Anual Capital One 360
  const interesGanado = ahorroAcumulado * (tasaAPY * (meses / 12));
  const totalConInteres = ahorroAcumulado + interesGanado;

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-6">
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-emerald-400" />
            Simulador de Crecimiento en Capital One 360
          </h3>
          <p className="text-xs text-slate-400">
            Ajusta el plazo para ver cuánto crecerá el dinero rescatado de suscripciones.
          </p>
        </div>

        <div className="text-right">
          <span className="text-[10px] text-slate-400 uppercase font-semibold">Tasa Estimada</span>
          <div className="text-xs font-bold text-emerald-400 font-mono">4.25% APY</div>
        </div>
      </div>

      {/* Control deslizante de meses */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs font-bold">
          <span className="text-slate-400">Horizonte de tiempo:</span>
          <span className="text-cyan-400 font-mono">{meses} {meses === 1 ? 'Mes' : 'Meses'} ({ (meses/12).toFixed(1) } años)</span>
        </div>

        <input 
          type="range" 
          min="1" 
          max="60" 
          value={meses} 
          onChange={(e) => setMeses(Number(e.target.value))}
          className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-[#D03027]"
        />
        <div className="flex justify-between text-[10px] text-slate-500 font-mono">
          <span>1 Mes</span>
          <span>12 Meses</span>
          <span>36 Meses</span>
          <span>60 Meses (5 Años)</span>
        </div>
      </div>

      {/* Tarjetas de Desglose de Rendimiento */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
          <span className="text-[10px] text-slate-400 uppercase font-bold block">Ahorro Directo</span>
          <div className="text-lg font-bold text-slate-200 font-mono mt-0.5">
            ${ahorroAcumulado.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>

        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
          <span className="text-[10px] text-emerald-400 uppercase font-bold block">Interés Generado</span>
          <div className="text-lg font-bold text-emerald-400 font-mono mt-0.5">
            +${interesGanado.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>

        <div className="bg-[#002845] p-4 rounded-xl border border-[#004B87]">
          <span className="text-[10px] text-cyan-300 uppercase font-bold block">Capital Total Resultante</span>
          <div className="text-lg font-extrabold text-white font-mono mt-0.5">
            ${totalConInteres.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 3. COMPONENTE: SELLO BANCARIO FDIC & SEGURIDAD
// ============================================================================
export function SelloSeguridadBancaria() {
  return (
    <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-slate-800 p-4 rounded-xl flex items-center justify-between text-xs text-slate-400">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div>
          <span className="font-bold text-slate-200 block">Garantía Capital One Banking</span>
          <span className="text-[11px] text-slate-400">Tus depósitos están asegurados por la FDIC hasta $250,000 USD.</span>
        </div>
      </div>

      <div className="hidden sm:flex items-center gap-2 font-mono text-[11px] text-slate-500">
        <Lock className="w-3.5 h-3.5 text-slate-400" />
        <span>256-BIT TLS 1.3</span>
      </div>
    </div>
  );
}

// ============================================================================
// 4. FONDO DE PARTÍCULAS FINANCIERAS (CANVAS AMBIENTAL)
// ============================================================================
export function FondoParticulasOasis() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Partículas azules y rojas suaves
    const particulas = Array.from({ length: 30 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: Math.random() * 1.8 + 0.5,
      dx: (Math.random() - 0.5) * 0.3,
      dy: (Math.random() - 0.5) * 0.3,
      color: Math.random() > 0.3 ? 'rgba(0, 75, 135, ' : 'rgba(208, 48, 39, '
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particulas.forEach((p) => {
        p.x += p.dx;
        p.y += p.dy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color} 0.4)`;
        ctx.fill();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="fixed inset-0 pointer-events-none z-0 opacity-40" 
    />
  );
}