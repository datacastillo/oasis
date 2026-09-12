'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Droplets, ShieldAlert, Sparkles, Scissors, RefreshCw, Zap } from 'lucide-react';
import dynamic from 'next/dynamic';

// 1. IMPORTACIÓN DEL WIDGET DE NESSIE (Añadido)
import { BiomaWidget } from '@/components/BiomaWidget';

// Importación dinámica para evitar el error de SSR en Next.js
const BiomaScene = dynamic(() => import('../components/3d/BiomaScene'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[450px] rounded-3xl bg-slate-900 border border-emerald-500/20 flex items-center justify-center shadow-inner">
      <span className="text-emerald-400 font-bold animate-pulse">Cargando motor 3D...</span>
    </div>
  )
});

export default function Home() {
  const [bioma, setBioma] = useState<any>({
    hydration: 75,
    soilHealth: 60,
    weedCount: 2,
    weather: 'rainy',
    score: 68,
    activeLeaks: [
      { id: 'tx_1', merchant: 'Suscripción Streaming', amount: 15.99, category: 'Entertainment' },
      { id: 'tx_2', merchant: 'Gimnasio Inactivo', amount: 45.00, category: 'Health' }
    ]
  });

  const [aiMessage, setAiMessage] = useState<string>('Analizando la salud de tu cuenta bancaria Nessie...');
  const [loading, setLoading] = useState<boolean>(false);
  const [pruning, setPruning] = useState<boolean>(false);

  const runAgentDiagnostic = async () => {
    setLoading(true);
    setTimeout(() => {
      setBioma({
        hydration: 75,
        soilHealth: 60,
        weedCount: 2,
        weather: 'rainy',
        score: 68,
        activeLeaks: [
          { id: 'tx_1', merchant: 'Suscripción Streaming', amount: 15.99, category: 'Entertainment' },
          { id: 'tx_2', merchant: 'Gimnasio Inactivo', amount: 45.00, category: 'Health' }
        ]
      });
      setAiMessage('[Jardinero IA]: Detecté 2 malezas activas (gastos hormiga). ¿Podamos estas fugas para sanar el ecosistema?');
      setLoading(false);
    }, 800);
  };

  useEffect(() => {
    runAgentDiagnostic();
  }, []);

  const handlePrune = async () => {
    setPruning(true);
    const totalPrunedAmount = bioma.activeLeaks.reduce((acc: number, l: any) => acc + l.amount, 0);

    setTimeout(() => {
      setBioma((prev: any) => ({
        ...prev,
        hydration: Math.min(prev.hydration + 20, 100),
        soilHealth: 95,
        weedCount: 0,
        weather: 'sunny',
        score: 92,
        activeLeaks: []
      }));

      setAiMessage(`¡Jardín podado con éxito! Se salvaron $${totalPrunedAmount.toFixed(2)} USD. Tu bioma financiero está floreciendo nuevamente.`);
      setPruning(false);
    }, 1200);
  };

  const injectLeakDemo = () => {
    setBioma((prev: any) => ({
      ...prev,
      soilHealth: Math.max(prev.soilHealth - 20, 10),
      weedCount: prev.weedCount + 1,
      weather: 'storm',
      score: Math.max(prev.score - 15, 0),
      activeLeaks: [
        ...prev.activeLeaks,
        { id: `leak_${Date.now()}`, merchant: 'Cargo Duplicado App', amount: 9.99, category: 'Software' }
      ]
    }));
    setAiMessage('[Jardinero IA]: ¡Alerta! Se acaba de registrar una nueva fuga de dinero. Una nueva maleza apareció en el bioma que está drenando tus recursos.');
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 flex flex-col justify-between max-w-6xl mx-auto font-sans">
      <header className="flex justify-between items-center mb-6 bg-slate-900/60 backdrop-blur-md p-4 rounded-2xl border border-white/10 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center shadow-md shadow-emerald-500/20">
            <Sparkles className="w-5 h-5 text-slate-950" />
          </div>
          <div>
            <h1 className="font-bold text-lg leading-none tracking-wide text-emerald-400">Oasis AI</h1>
            <p className="text-xs text-slate-400 mt-0.5">Ecosistema Financiero Cognitivo • Capital One Nessie API</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="text-xs text-slate-400 block">Salud Global</span>
            <span className="text-xl font-black text-emerald-400">{bioma.score}/100</span>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Columna Izquierda: Escena 3D y Stats */}
        <div className="lg:col-span-2 space-y-4">
          
          <BiomaScene bioma={bioma} />
          
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-900/40 border border-white/5 p-3.5 rounded-2xl flex items-center gap-3">
              <Droplets className="w-5 h-5 text-sky-400" />
              <div>
                <span className="text-xs text-slate-400 block">Hidratación</span>
                <span className="font-semibold text-sm">{bioma.hydration}%</span>
              </div>
            </div>
            <div className="bg-slate-900/40 border border-white/5 p-3.5 rounded-2xl flex items-center gap-3">
              <ShieldAlert className="w-5 h-5 text-amber-400" />
              <div>
                <span className="text-xs text-slate-400 block">Salud Suelo</span>
                <span className="font-semibold text-sm">{bioma.soilHealth}%</span>
              </div>
            </div>
            <div className="bg-slate-900/40 border border-white/5 p-3.5 rounded-2xl flex items-center gap-3">
              <Scissors className="w-5 h-5 text-rose-400" />
              <div>
                <span className="text-xs text-slate-400 block">Malezas Activas</span>
                <span className="font-semibold text-sm">{bioma.weedCount} detectadas</span>
              </div>
            </div>
          </div>
        </div>

        {/* Columna Derecha: Widgets y Controles IA */}
        <div className="space-y-4">
          
          {/* 2. INSTANCIA DEL WIDGET CONECTADO A LA API (Añadido) */}
          <BiomaWidget accountId="60d21b46c7e43908355fa000" />

          {/* Tarjeta del Jardinero IA */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-900/80 backdrop-blur-xl border border-emerald-500/30 p-5 rounded-3xl shadow-xl space-y-4"
          >
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Jardinero IA Activo
              </span>
              <button onClick={runAgentDiagnostic} disabled={loading} className="text-slate-400 hover:text-white transition-colors">
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
            
            <p className="text-sm text-slate-200 leading-relaxed font-medium">
              {aiMessage}
            </p>
            
            {bioma.activeLeaks.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-white/5">
                <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold block">
                  Fugas Detectadas (A Podar)
                </span>
                {bioma.activeLeaks.map((leak: any) => (
                  <div key={leak.id} className="flex justify-between items-center bg-rose-950/20 border border-rose-500/20 px-3 py-2 rounded-xl text-xs">
                    <span className="text-rose-200 font-medium">{leak.merchant}</span>
                    <span className="text-rose-400 font-bold">-${leak.amount.toFixed(2)} USD</span>
                  </div>
                ))}
              </div>
            )}
            
            {bioma.weedCount > 0 && (
              <button
                onClick={handlePrune}
                disabled={pruning}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/25 hover:brightness-110 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
              >
                {pruning ? <RefreshCw className="w-4 h-4 animate-spin" /> : <><Scissors className="w-4 h-4" />Podar maleza y recuperar fondos</>}
              </button>
            )}
          </motion.div>

          {/* Controles de demo */}
          <div className="bg-slate-900/30 border border-white/5 p-4 rounded-2xl space-y-2">
            <span className="text-xs text-slate-400 block font-semibold">Controles de Demostración</span>
            <div className="flex gap-2">
              <button onClick={injectLeakDemo} className="flex-1 text-xs py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-white/10 flex items-center justify-center gap-1.5 transition-colors">
                <Zap className="w-3.5 h-3.5 text-amber-400" /> Simular Fuga
              </button>
              <button onClick={runAgentDiagnostic} className="flex-1 text-xs py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-white/10 flex items-center justify-center gap-1.5 transition-colors">
                <RefreshCw className="w-3.5 h-3.5 text-emerald-400" /> Restaurar
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}