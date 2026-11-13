import React, { useState } from 'react';
import { 
  Eye, 
  EyeOff, 
  Plus, 
  Share2, 
  Gift, 
  Users, 
  Trophy, 
  TrendingUp, 
  TrendingDown, 
  Briefcase, 
  CheckCircle2, 
  ChevronRight,
  Sparkles,
  ArrowUpRight,
  ArrowDownRight,
  ExternalLink
} from 'lucide-react';

interface XmHomeViewProps {
  userBalance: number;
  isDemo: boolean;
  onNavigateToTrading: () => void;
  onOpenDeposit: () => void;
  onSwitchAccountModal: () => void;
  activePositionsCount: number;
}

export const XmHomeView: React.FC<XmHomeViewProps> = ({
  userBalance,
  isDemo,
  onNavigateToTrading,
  onOpenDeposit,
  onSwitchAccountModal,
  activePositionsCount
}) => {
  const [showBalance, setShowBalance] = useState(true);

  return (
    <div className="flex-1 flex flex-col bg-[#070c17] text-slate-100 overflow-y-auto pb-24 px-3 sm:px-4 pt-3 space-y-4 max-w-2xl mx-auto w-full">
      {/* Account Balance Card (Exact XM Design) */}
      <div className="bg-gradient-to-br from-[#0e1629] via-[#0b1222] to-[#070c17] border border-slate-800/80 rounded-3xl p-5 shadow-2xl relative overflow-hidden">
        {/* Subtle glowing ambient accent */}
        <div className={`absolute -right-12 -top-12 w-40 h-40 rounded-full blur-3xl opacity-20 pointer-events-none ${
          isDemo ? 'bg-amber-400' : 'bg-emerald-400'
        }`} />

        <div className="flex items-center justify-between pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-slate-400">Standard #108626489</span>
          </div>
          <button 
            onClick={onSwitchAccountModal}
            className="w-7 h-7 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-300 hover:text-white hover:border-slate-700 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Badges */}
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
            isDemo ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
          }`}>
            {isDemo ? 'Demo' : 'Real'}
          </span>
          <span className="text-[10px] font-mono text-slate-400 bg-slate-900 px-2 py-0.5 rounded-full border border-slate-800">
            ZetaTrade MT5
          </span>
        </div>

        {/* Big Balance */}
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-white">
            {showBalance ? `$${userBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '••••••••'}
          </span>
          <button 
            onClick={() => setShowBalance(!showBalance)}
            className="text-slate-500 hover:text-slate-300 p-1 cursor-pointer"
          >
            {showBalance ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          </button>
        </div>

        <div className="text-xs font-mono text-slate-400 mt-0.5">
          $0.00
        </div>

        {/* Card Buttons: Gestionar & Establecer Saldo / Depositar */}
        <div className="grid grid-cols-2 gap-2.5 mt-5">
          <button 
            onClick={onSwitchAccountModal}
            className="py-2.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 font-bold text-xs text-white flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <span>⚙️</span>
            <span>Gestionar</span>
          </button>

          <button 
            onClick={onOpenDeposit}
            className="py-2.5 rounded-2xl bg-white hover:bg-slate-200 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-lg shadow-white/10"
          >
            <span>💰</span>
            <span>{isDemo ? 'Establecer saldo' : 'Depositar'}</span>
          </button>
        </div>
      </div>

      {/* Quick Services Icons */}
      <div className="grid grid-cols-4 gap-2">
        <div className="bg-[#0b1325] border border-slate-800/80 rounded-2xl p-3 flex flex-col items-center justify-center text-center gap-1.5 cursor-pointer hover:border-slate-700 transition-all">
          <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center text-amber-400 text-lg">
            🎁
          </div>
          <span className="text-[11px] font-semibold text-slate-300">Recomendar</span>
        </div>

        <div className="bg-[#0b1325] border border-slate-800/80 rounded-2xl p-3 flex flex-col items-center justify-center text-center gap-1.5 cursor-pointer hover:border-slate-700 transition-all">
          <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center text-emerald-400 text-lg">
            ⭐
          </div>
          <span className="text-[11px] font-semibold text-slate-300">Bonos</span>
        </div>

        <div className="bg-[#0b1325] border border-slate-800/80 rounded-2xl p-3 flex flex-col items-center justify-center text-center gap-1.5 cursor-pointer hover:border-slate-700 transition-all">
          <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center text-blue-400 text-lg">
            👥
          </div>
          <span className="text-[11px] font-semibold text-slate-300">Copy trading</span>
        </div>

        <div className="bg-[#0b1325] border border-slate-800/80 rounded-2xl p-3 flex flex-col items-center justify-center text-center gap-1.5 cursor-pointer hover:border-slate-700 transition-all">
          <div className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center text-purple-400 text-lg">
            🏆
          </div>
          <span className="text-[11px] font-semibold text-slate-300">Competiciones</span>
        </div>
      </div>

      {/* Competitions Banner */}
      <div className="bg-gradient-to-r from-purple-950/70 via-slate-900 to-indigo-950/70 border border-purple-500/30 rounded-2xl p-4 flex items-center justify-between shadow-xl cursor-pointer">
        <div className="space-y-1">
          <div className="text-xs font-black text-purple-300 uppercase tracking-wider flex items-center gap-1">
            <span>🏆 Competiciones de Trading</span>
          </div>
          <h4 className="font-bold text-sm text-white">100 ganadores cada semana</h4>
          <p className="text-[11px] text-purple-200/80">25.000 $ en premios en efectivo garantizados.</p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center text-2xl">
          🥇
        </div>
      </div>

      {/* Cartera Preview */}
      <div className="bg-[#0b1325] border border-slate-800/80 rounded-2xl p-4 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="font-black text-base text-white">Cartera</h4>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </div>

        {activePositionsCount === 0 ? (
          <div className="py-5 flex flex-col items-center justify-center text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500 text-xl">
              💼
            </div>
            <p className="text-xs text-slate-400 max-w-xs">
              Todavía no tiene posiciones abiertas. Cuando abra una, aparecerá aquí.
            </p>
            <button
              onClick={onNavigateToTrading}
              className="mt-2 px-5 py-2 rounded-xl bg-white text-slate-950 font-black text-xs hover:bg-slate-200 transition-colors cursor-pointer shadow-md"
            >
              Operar ahora
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-800">
            <div>
              <span className="font-bold text-sm text-white">{activePositionsCount} posición(es) abierta(s)</span>
              <p className="text-xs text-emerald-400 font-mono font-bold">Generando rendimiento en vivo</p>
            </div>
            <button
              onClick={onNavigateToTrading}
              className="px-3 py-1.5 rounded-lg bg-emerald-500 text-slate-950 font-bold text-xs cursor-pointer"
            >
              Ver Cartera
            </button>
          </div>
        )}
      </div>

      {/* Verification Yellow Banner */}
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-3 flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
          <CheckCircle2 className="w-5 h-5" />
        </div>
        <div className="text-xs text-amber-200 leading-tight">
          <span className="font-bold">¡Su cuenta está verificada!</span> Deposite fondos para empezar a operar en vivo en los mercados internacionales.
        </div>
      </div>

      {/* Market Movers: Mejor / Peor Rendimiento */}
      <div className="space-y-3">
        <h4 className="font-black text-sm text-slate-300">Mejor rendimiento</h4>
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-[#0b1325] border border-slate-800/80 rounded-2xl p-3 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-black text-xs text-white">ARBUSDT</span>
              <span className="text-[10px] text-emerald-400 font-bold font-mono">+6.61%</span>
            </div>
            <div className="text-lg font-black text-white font-mono">$0.16730</div>
            <div className="text-[10px] text-slate-500">Arbitrum vs US Dollar</div>
          </div>

          <div className="bg-[#0b1325] border border-slate-800/80 rounded-2xl p-3 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-black text-xs text-white">Aixtron</span>
              <span className="text-[10px] text-emerald-400 font-bold font-mono">+6.61%</span>
            </div>
            <div className="text-lg font-black text-white font-mono">30.14</div>
            <div className="text-[10px] text-slate-500">Aixtron SE CFD</div>
          </div>
        </div>

        <h4 className="font-black text-sm text-slate-300 pt-1">Peor rendimiento</h4>
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-[#0b1325] border border-slate-800/80 rounded-2xl p-3 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-black text-xs text-white">Bpost</span>
              <span className="text-[10px] text-rose-400 font-bold font-mono">-22.42%</span>
            </div>
            <div className="text-lg font-black text-white font-mono">0.865</div>
            <div className="text-[10px] text-slate-500">Bpost SA</div>
          </div>

          <div className="bg-[#0b1325] border border-slate-800/80 rounded-2xl p-3 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-black text-xs text-white">Teleperf</span>
              <span className="text-[10px] text-rose-400 font-bold font-mono">-16.86%</span>
            </div>
            <div className="text-lg font-black text-white font-mono">66.390</div>
            <div className="text-[10px] text-slate-500">Teleperformance</div>
          </div>
        </div>
      </div>

      {/* Reuters News Articles */}
      <div className="bg-[#0b1325] border border-slate-800/80 rounded-2xl p-4 shadow-xl space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
          <h4 className="font-black text-sm text-white">Artículos destacados</h4>
          <span className="text-xs text-amber-400 font-bold">Ver todo</span>
        </div>

        <div className="space-y-3 divide-y divide-slate-800/60 text-xs">
          <div className="pt-2 space-y-1">
            <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
              <span className="font-bold text-amber-400">REUTERS</span>
              <span>• 06/11/26 07:18</span>
            </div>
            <p className="font-bold text-white leading-snug">
              India's 10-year bond posts best week in 7 years, leads emerging Asia as oil slides
            </p>
          </div>

          <div className="pt-3 space-y-1">
            <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
              <span className="font-bold text-amber-400">REUTERS</span>
              <span>• 06/11/26 07:14</span>
            </div>
            <p className="font-bold text-white leading-snug">
              Caution over midterms and AI cash burn drives surge in US money market fund inflows
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
