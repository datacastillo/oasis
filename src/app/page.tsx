'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Droplets, ShieldAlert, Sparkles, Scissors, RefreshCw, Zap, TrendingUp, AlertTriangle } from 'lucide-react';
import dynamic from 'next/dynamic';

// Importación dinámica del motor 3D/Bioma con un loading state elegante
const BiomaScene = dynamic(() => import('@/components/3d/BiomaScene'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[520px] rounded-3xl bg-slate-900/50 border border-emerald-500/20 flex flex-col items-center justify-center shadow-inner relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 to-transparent z-0" />
      <Sparkles className="w-8 h-8 text-emerald-500/50 animate-pulse mb-3 z-10" />
      <span className="text-emerald-400 font-medium tracking-widest text-sm uppercase animate-pulse z-10">Generando Ecosistema...</span>
    </div>
  )
});

export default function Home() {
  // Estado principal del Bioma
  const [bioma, setBioma] = useState({
    hydration: 75,
    soilHealth: 60,
    weedCount: 2,
    weather: 'rainy' as 'sunny' | 'rainy' | 'storm',
    score: 68,
    activeLeaks: [
      { id: 'tx_1', merchant: 'Suscripción Streaming X', amount: 15.99, category: 'Entertainment' },
      { id: 'tx_2', merchant: 'Gimnasio Inactivo', amount: 45.00, category: 'Health' }
    ]
  });

  const [aiMessage, setAiMessage] = useState<string>('Iniciando escaneo neural de tu cuenta Capital One Nessie...');
  const [loading, setLoading] = useState<boolean>(false);
  const [pruning, setPruning] = useState<boolean>(false);

  // Diagnóstico Inicial Simulado
  const runAgentDiagnostic = async () => {
    setLoading(true);
    setAiMessage('Analizando patrones de gasto y salud del ecosistema...');
    
    setTimeout(() => {
      setBioma({
        hydration: 75,
        soilHealth: 60,
        weedCount: 2,
        weather: 'rainy',
        score: 68,
        activeLeaks: [
          { id: 'tx_1', merchant: 'Suscripción Streaming X', amount: 15.99, category: 'Entertainment' },
          { id: 'tx_2', merchant: 'Gimnasio Inactivo', amount: 45.00, category: 'Health' }
        ]
      });
      setAiMessage('[Jardinero IA]: He detectado 2 malezas activas (fugas de capital). ¿Quieres que las pode para redirigir esos nutrientes a tus ahorros?');
      setLoading(false);
    }, 1500);
  };

  useEffect(() => {
    runAgentDiagnostic();
  }, []);

  // Acción: Podar Maleza (Ahorro)
  const handlePrune = async () => {
    setPruning(true);
    setAiMessage('Aplicando poda algorítmica y asegurando fondos...');
    
    const totalPrunedAmount = bioma.activeLeaks.reduce((acc, l) => acc + l.amount, 0);

    setTimeout(() => {
      setBioma(prev => ({
        ...prev,
        hydration: Math.min(prev.hydration + 25, 100),
        soilHealth: 98,
        weedCount: 0,
        weather: 'sunny',
        score: 95,
        activeLeaks: []
      }));

      setAiMessage(`¡Ecosistema purificado! Redirigimos $${totalPrunedAmount.toFixed(2)} USD a tu bóveda de ahorro de alto rendimiento. Tu bioma está floreciendo.`);
      setPruning(false);
    }, 2000);
  };

  // Acción: Simular nueva fuga
  const injectLeakDemo = () => {
    setBioma(prev => ({
      ...prev,
      soilHealth: Math.max(prev.soilHealth - 20, 10),
      weedCount: prev.weedCount + 1,
      weather: 'storm',
      score: Math.max(prev.score - 18, 0),
      activeLeaks: [
        ...prev.activeLeaks,
        { id: `leak_${Date.now()}`, merchant: 'Renovación Automática App', amount: 9.99, category: 'Software' }
      ]
    }));
    setAiMessage('[ALERTA ROJA]: Detectamos una nueva fuga de nutrientes. Una suscripción no planificada está drenando tu ecosistema.');
  };

  // Handler para interactuar con los frutos en la escena 3D
  const handleSelectFruit = (label: string, amount: number) => {
    setAiMessage(`Has examinado: ${label}. Este fruto aporta $${amount.toFixed(2)} a tu ecosistema gracias al interés compuesto.`);
  };

  return (
    <main className="min-h-screen bg-[#020611] text-slate-100 p-4 md:p-6 lg:p-8 flex flex-col items-center font-sans relative overflow-x-hidden">
      
      {/* Fondo Ambiental Suave */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-900/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-teal-900/10 blur-[120px] rounded-full" />
      </div>

      <div className="w-full max-w-7xl relative z-10 flex flex-col gap-6">
        
        {/* --- HEADER --- */}
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900/40 backdrop-blur-xl p-5 rounded-3xl border border-slate-800/60 shadow-2xl"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20 relative overflow-hidden group">
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              <Sparkles className="w-6 h-6 text-slate-950 relative z-10" />
            </div>
            <div>
              <h1 className="font-black text-2xl leading-none tracking-tight text-white flex items-center gap-2">
                Oasis AI
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] uppercase tracking-widest font-bold">Beta</span>
              </h1>
              <p className="text-sm text-slate-400 mt-1 font-medium">Ecosistema Financiero Cognitivo <span className="text-slate-600">|</span> Powered by Capital One Nessie</p>
            </div>
          </div>

          {/* Salud Global Score */}
          <div className="flex items-center gap-4 bg-slate-950/50 px-5 py-2.5 rounded-2xl border border-slate-800/80">
            <div className="text-right">
              <span className="text-[10px] text-slate-400 uppercase tracking-widest font-bold block mb-0.5">Vitalidad Global</span>
              <div className="flex items-end gap-1">
                <span className={`text-3xl font-black leading-none ${
                  bioma.score > 80 ? 'text-emerald-400' : bioma.score > 50 ? 'text-amber-400' : 'text-rose-400'
                }`}>
                  {bioma.score}
                </span>
                <span className="text-sm text-slate-500 font-bold mb-0.5">/100</span>
              </div>
            </div>
            {/* Mini gráfico visual de estado */}
            <div className="h-10 w-10 relative">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="20" cy="20" r="16" fill="none" stroke="#1E293B" strokeWidth="4" />
                <circle 
                  cx="20" cy="20" r="16" fill="none" 
                  stroke={bioma.score > 80 ? '#34D399' : bioma.score > 50 ? '#FBBF24' : '#FB7185'} 
                  strokeWidth="4" 
                  strokeDasharray={`${(bioma.score / 100) * 100} 100`} 
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
            </div>
          </div>
        </motion.header>

        {/* --- MAIN GRID --- */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
          
          {/* PANEL IZQUIERDO: VISUALIZADOR 3D Y MÉTRICAS (8 columnas) */}
          <div className="xl:col-span-8 flex flex-col gap-6">
            
            {/* Contenedor del Bioma */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="w-full relative group"
            >
              {/* Brillo de fondo sutil detrás del componente */}
              <div className={`absolute -inset-1 rounded-[2rem] blur-xl opacity-30 transition-colors duration-1000 ${
                bioma.weedCount > 0 ? 'bg-rose-600/40' : 'bg-emerald-500/40'
              }`} />
              
              <BiomaScene 
                weedCount={bioma.weedCount}
                weather={bioma.weather}
                healthScore={bioma.score}
                onSelectFruit={handleSelectFruit}
                onPruneAll={bioma.weedCount > 0 ? handlePrune : undefined}
                className="relative z-10 shadow-2xl ring-1 ring-white/5"
              />
            </motion.div>

            {/* Tarjetas de Métricas Inferiores */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-4"
            >
              {/* Hidratación */}
              <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/80 p-4 rounded-2xl flex items-center gap-4 hover:bg-slate-800/50 transition-colors">
                <div className="p-3 rounded-xl bg-sky-500/10 text-sky-400">
                  <Droplets className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs text-slate-400 uppercase tracking-wider font-bold block mb-1">Flujo de Caja</span>
                  <span className="font-black text-xl text-white">{bioma.hydration}%</span>
                </div>
              </div>
              
              {/* Salud Suelo */}
              <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/80 p-4 rounded-2xl flex items-center gap-4 hover:bg-slate-800/50 transition-colors">
                <div className="p-3 rounded-xl bg-amber-500/10 text-amber-400">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-xs text-slate-400 uppercase tracking-wider font-bold block mb-1">Solidez (Suelo)</span>
                  <span className="font-black text-xl text-white">{bioma.soilHealth}%</span>
                </div>
              </div>

              {/* Malezas (Fugas) */}
              <div className={`bg-slate-900/50 backdrop-blur-sm border p-4 rounded-2xl flex items-center gap-4 transition-colors ${
                bioma.weedCount > 0 ? 'border-rose-500/30 bg-rose-500/5' : 'border-slate-800/80 hover:bg-slate-800/50'
              }`}>
                <div className={`p-3 rounded-xl ${bioma.weedCount > 0 ? 'bg-rose-500/20 text-rose-400 animate-pulse' : 'bg-emerald-500/10 text-emerald-400'}`}>
                  {bioma.weedCount > 0 ? <AlertTriangle className="w-6 h-6" /> : <Scissors className="w-6 h-6" />}
                </div>
                <div>
                  <span className="text-xs text-slate-400 uppercase tracking-wider font-bold block mb-1">Fugas Activas</span>
                  <span className={`font-black text-xl ${bioma.weedCount > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {bioma.weedCount} {bioma.weedCount === 1 ? 'Detectada' : 'Detectadas'}
                  </span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* PANEL DERECHO: INTERFAZ DEL JARDINERO IA (4 columnas) */}
          <div className="xl:col-span-4 flex flex-col gap-6">
            
            {/* Módulo Principal IA */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-slate-900/60 backdrop-blur-xl border border-slate-700/50 p-6 rounded-[2rem] shadow-2xl flex flex-col h-full min-h-[400px]"
            >
              {/* Header IA */}
              <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-800">
                <div className="flex items-center gap-2.5">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                  </span>
                  <span className="text-sm font-bold text-white tracking-wide">Asistente Botánico AI</span>
                </div>
                <button 
                  onClick={runAgentDiagnostic} 
                  disabled={loading || pruning} 
                  className="p-2 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-all disabled:opacity-50"
                  title="Escanear nuevamente"
                >
                  <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                </button>
              </div>
              
              {/* Mensaje IA Animado */}
              <AnimatePresence mode="wait">
                <motion.div 
                  key={aiMessage}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800/60 mb-6"
                >
                  <p className="text-[15px] text-slate-200 leading-relaxed font-medium">
                    {aiMessage}
                  </p>
                </motion.div>
              </AnimatePresence>
              
              {/* Lista de Fugas (Si hay) */}
              <div className="flex-grow">
                {bioma.activeLeaks.length > 0 && (
                  <div className="space-y-3">
                    <span className="text-[11px] text-slate-400 uppercase tracking-widest font-bold flex items-center gap-2">
                      <TrendingUp className="w-3.5 h-3.5 text-rose-400" />
                      Fugas Detectadas (Para Poda)
                    </span>
                    <div className="space-y-2 max-h-[180px] overflow-y-auto pr-1 custom-scrollbar">
                      {bioma.activeLeaks.map((leak) => (
                        <motion.div 
                          key={leak.id} 
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex justify-between items-center bg-rose-950/20 border border-rose-500/20 px-4 py-3 rounded-xl"
                        >
                          <div>
                            <span className="text-sm text-rose-100 font-medium block">{leak.merchant}</span>
                            <span className="text-[10px] text-rose-400/70 uppercase tracking-wider">{leak.category}</span>
                          </div>
                          <span className="text-base text-rose-400 font-bold bg-rose-950/40 px-2.5 py-1 rounded-lg">
                            -${leak.amount.toFixed(2)}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
                {bioma.activeLeaks.length === 0 && !loading && (
                   <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500 space-y-3">
                     <ShieldAlert className="w-10 h-10 text-emerald-500/20" />
                     <p className="text-sm">Ecosistema limpio. No se detectan fugas de capital en este momento.</p>
                   </div>
                )}
              </div>
              
              {/* Botón de Acción Principal (Podar) */}
              {bioma.weedCount > 0 && (
                <div className="mt-6 pt-4 border-t border-slate-800">
                  <button
                    onClick={handlePrune}
                    disabled={pruning || loading}
                    className="w-full relative overflow-hidden group py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-black text-sm uppercase tracking-widest shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                  >
                    <div className="absolute inset-0 w-full h-full bg-white/20 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                    {pruning ? (
                      <>
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        Ejecutando Poda...
                      </>
                    ) : (
                      <>
                        <Scissors className="w-5 h-5" />
                        Podar Maleza y Ahorrar
                      </>
                    )}
                  </button>
                </div>
              )}
            </motion.div>

            {/* Controles de Demostración (Hackathon Controls) */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="bg-slate-900/30 border border-slate-800/80 p-5 rounded-2xl"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] text-slate-400 uppercase tracking-widest font-bold">Modo Demostración</span>
                <span className="px-2 py-0.5 rounded text-[9px] font-mono bg-slate-800 text-slate-400 border border-slate-700">DEV_TOOLS</span>
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={injectLeakDemo} 
                  disabled={pruning}
                  className="py-2.5 px-3 rounded-xl bg-slate-800/50 hover:bg-slate-700 text-slate-300 border border-slate-700 flex flex-col items-center justify-center gap-1.5 transition-all text-xs font-medium hover:border-amber-500/30 hover:text-amber-300 group disabled:opacity-50"
                >
                  <Zap className="w-4 h-4 text-slate-500 group-hover:text-amber-400 transition-colors" /> 
                  Simular Fuga
                </button>
                <button 
                  onClick={runAgentDiagnostic} 
                  disabled={loading || pruning}
                  className="py-2.5 px-3 rounded-xl bg-slate-800/50 hover:bg-slate-700 text-slate-300 border border-slate-700 flex flex-col items-center justify-center gap-1.5 transition-all text-xs font-medium hover:border-emerald-500/30 hover:text-emerald-300 group disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 text-slate-500 group-hover:text-emerald-400 transition-colors ${loading ? 'animate-spin text-emerald-400' : ''}`} /> 
                  Restaurar Bioma
                </button>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
      
      {/* Estilos globales para la animación shimmer (brillo en el botón) y scrollbar personalizada */}
      <style jsx global>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(15, 23, 42, 0.5);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(51, 65, 85, 0.8);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(71, 85, 105, 1);
        }
      `}</style>
    </main>
  );
}