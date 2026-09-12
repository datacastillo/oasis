'use client';

import { useState, useEffect } from 'react';
import { fetchAccountDetails, executeMicroSavings } from '@/lib/nessie';
import { NessieAccount } from '@/types/bioma';

interface BiomaWidgetProps {
  accountId: string;
}

export function BiomaWidget({ accountId }: BiomaWidgetProps) {
  const [account, setAccount] = useState<NessieAccount | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const data = await fetchAccountDetails(accountId);
      setAccount(data);
      setLoading(false);
    }
    loadData();
  }, [accountId]);

  const handleMicroSavings = async () => {
    setSaving(true);
    setFeedback(null);
    const amountToSave = 10.0; // Puntos o dinero a sanear

    const success = await executeMicroSavings(accountId, amountToSave);

    if (success) {
      setFeedback('¡Bioma saneada! +10 USD ahorrados');
      // Actualizamos el balance localmente para reflejar el cambio inmediato
      setAccount((prev) =>
        prev ? { ...prev, balance: prev.balance + amountToSave } : null
      );
    } else {
      setFeedback('No se pudo procesar el micro-ahorro.');
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <div className="p-6 bg-slate-900 text-white rounded-2xl animate-pulse border border-slate-800">
        Cargando estado de la Bioma...
      </div>
    );
  }

  if (!account) {
    return (
      <div className="p-6 bg-red-950/40 text-red-400 rounded-2xl border border-red-800">
        No se pudo cargar la información de la cuenta.
      </div>
    );
  }

  return (
    <div className="p-6 bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-2xl border border-slate-800 shadow-xl space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <span className="text-xs uppercase tracking-wider text-emerald-400 font-semibold">
            Estado de la Bioma
          </span>
          <h2 className="text-xl font-bold">{account.nickname}</h2>
        </div>
        <div className="bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full text-emerald-300 text-sm font-medium">
          🏆 {account.rewards} Pts Recompensa
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
          <p className="text-xs text-slate-400">Balance Disponible</p>
          <p className="text-2xl font-bold text-white">
            ${account.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </p>
        </div>
        <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
          <p className="text-xs text-slate-400">Tipo de Cuenta</p>
          <p className="text-lg font-semibold text-slate-200">{account.type}</p>
        </div>
      </div>

      <div className="space-y-2">
        <button
          onClick={handleMicroSavings}
          disabled={saving}
          className="w-[#100%] py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-xl transition duration-200 disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/30"
        >
          {saving ? 'Ejecutando Saneamiento...' : '🌱 Ejecutar Auto-Saneamiento ($10.00)'}
        </button>

        {feedback && (
          <p className="text-center text-xs text-emerald-400 font-medium animate-fade-in">
            {feedback}
          </p>
        )}
      </div>
    </div>
  );
}