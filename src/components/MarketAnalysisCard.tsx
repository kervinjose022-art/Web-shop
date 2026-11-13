import React, { useState } from 'react';
import { Lock, Unlock, ShieldAlert, CheckCircle2, TrendingUp, AlertTriangle, ArrowUpRight } from 'lucide-react';

interface MarketAnalysisCardProps {
  onUnlockClick: () => void;
  isUnlocked?: boolean;
}

export const MarketAnalysisCard: React.FC<MarketAnalysisCardProps> = ({
  onUnlockClick,
  isUnlocked = false
}) => {
  const [demoUnlocked, setDemoUnlocked] = useState(isUnlocked);

  const activeUnlocked = isUnlocked || demoUnlocked;

  return (
    <div className="bg-[#0b1220] border border-slate-800 rounded-2xl p-5 shadow-2xl relative overflow-hidden space-y-4">
      {/* Glow highlight */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
            {activeUnlocked ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
          </div>
          <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
            Análisis del mercado
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full border ${
              activeUnlocked
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                : 'bg-red-500/20 text-red-300 border-red-500/30 animate-pulse'
            }`}
          >
            {activeUnlocked ? 'Acceso Desbloqueado' : 'Bloqueado'}
          </span>
          <button
            onClick={() => setDemoUnlocked(!demoUnlocked)}
            className="text-[10px] text-slate-500 hover:text-slate-300 underline cursor-pointer"
            title="Alternar vista previa desbloqueada"
          >
            {activeUnlocked ? 'Ver modo candado' : 'Vista demo'}
          </button>
        </div>
      </div>

      {/* Content */}
      {!activeUnlocked ? (
        <div className="space-y-4 text-center py-2">
          {/* Centered Lock Icon */}
          <div className="mx-auto w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-lg shadow-amber-500/10">
            <Lock className="w-6 h-6 animate-bounce" />
          </div>

          <div className="max-w-md mx-auto space-y-1.5">
            <h4 className="text-sm font-black text-white">Análisis y Señales Bloqueados</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              El mapa técnico, zonas de Buy/Sell con Take Profit y señales operativas se desbloquean exclusivamente tras la confirmación del pago de tu plan en USDT (BEP-20).
            </p>
          </div>

          {/* Technical parameters preview */}
          <div className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3.5 max-w-lg mx-auto grid grid-cols-2 sm:grid-cols-3 gap-3 text-left font-mono text-xs">
            <div>
              <span className="text-[10px] text-slate-500 block uppercase">RSI(14)</span>
              <span className="text-slate-300 font-bold">58.7 <span className="text-[10px] text-slate-500">(NEUTRO)</span></span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block uppercase">Dirección</span>
              <span className="text-emerald-400 font-bold">FUERTE</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block uppercase">Soporte Clave</span>
              <span className="text-slate-200 font-bold">$3,875.00</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block uppercase">Resistencia</span>
              <span className="text-red-400 font-bold">$3,971.00</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block uppercase">Confirmación</span>
              <span className="text-amber-400 font-bold">88%</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 block uppercase">Señal Operativa</span>
              <span className="text-red-400 font-bold">[BLOQUEADO]</span>
            </div>
          </div>

          {/* Action button */}
          <button
            onClick={onUnlockClick}
            className="w-full max-w-md mx-auto bg-[#facc15] hover:bg-[#eab308] active:scale-[0.98] text-slate-950 font-black py-3 rounded-xl text-xs sm:text-sm tracking-wide uppercase transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Lock className="w-4 h-4" />
            <span>DESBLOQUEAR ACCESO • PAGAR USDT-BEP-20</span>
          </button>
        </div>
      ) : (
        /* Unlocked Signals view */
        <div className="space-y-4 py-1">
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <div>
                <span className="text-xs font-bold text-white block">Señal Activa en Tiempo Real</span>
                <span className="text-[10px] text-emerald-300">Patrón confirmado en temporalidad 15M / 1H</span>
              </div>
            </div>
            <span className="bg-emerald-500 text-slate-950 font-black text-xs px-3 py-1 rounded-lg flex items-center gap-1 shadow">
              <ArrowUpRight className="w-4 h-4" />
              COMPRA (BUY)
            </span>
          </div>

          {/* Targets */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-mono text-xs">
            <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 block">ZONA DE ENTRADA</span>
              <span className="text-white font-bold text-sm">$3,888.50 - $3,892.00</span>
            </div>
            <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
              <span className="text-[10px] text-emerald-400 block">TAKE PROFIT 1</span>
              <span className="text-emerald-300 font-bold text-sm">$3,920.00</span>
            </div>
            <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
              <span className="text-[10px] text-emerald-400 block">TAKE PROFIT 2</span>
              <span className="text-emerald-300 font-bold text-sm">$3,950.00</span>
            </div>
            <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800">
              <span className="text-[10px] text-red-400 block">STOP LOSS</span>
              <span className="text-red-300 font-bold text-sm">$3,865.00</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
