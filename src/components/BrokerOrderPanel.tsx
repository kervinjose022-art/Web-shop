import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Clock, DollarSign, Plus, Minus, Zap } from 'lucide-react';

interface BrokerOrderPanelProps {
  currentPrice: number;
  payoutPct: number;
  userBalance: number;
  isDemoAccount: boolean;
  onExecuteTrade: (type: 'call' | 'put', amount: number, durationSec: number) => void;
  onOpenDeposit: () => void;
}

export const BrokerOrderPanel: React.FC<BrokerOrderPanelProps> = ({
  currentPrice,
  payoutPct,
  userBalance,
  isDemoAccount,
  onExecuteTrade,
  onOpenDeposit
}) => {
  const [amount, setAmount] = useState<number>(25);
  const [durationSec, setDurationSec] = useState<number>(30);

  const potentialProfit = Math.round((amount * (payoutPct / 100)) * 100) / 100;
  const totalReturn = Math.round((amount + potentialProfit) * 100) / 100;

  const handleAdjustAmount = (delta: number) => {
    setAmount(prev => Math.max(1, Math.min(prev + delta, 5000)));
  };

  const handleMultiply = (mult: number) => {
    setAmount(prev => Math.max(1, Math.min(Math.round(prev * mult), 5000)));
  };

  const handleCall = () => {
    if (amount > userBalance) {
      onOpenDeposit();
      return;
    }
    onExecuteTrade('call', amount, durationSec);
  };

  const handlePut = () => {
    if (amount > userBalance) {
      onOpenDeposit();
      return;
    }
    onExecuteTrade('put', amount, durationSec);
  };

  return (
    <div className="w-full lg:w-72 bg-[#090f1d] border border-slate-800 rounded-2xl p-4 flex flex-col justify-between gap-4 shadow-2xl">
      {/* Expiration Time Selector */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1.5 font-bold">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            Tiempo de Expiración
          </span>
          <span className="font-mono text-amber-400 font-bold">{durationSec}s</span>
        </div>

        <div className="grid grid-cols-4 gap-1.5">
          {[
            { label: '30s', sec: 30 },
            { label: '1m', sec: 60 },
            { label: '2m', sec: 120 },
            { label: '5m', sec: 300 }
          ].map(item => (
            <button
              key={item.sec}
              onClick={() => setDurationSec(item.sec)}
              className={`py-1.5 rounded-lg text-xs font-bold font-mono transition-all cursor-pointer ${
                durationSec === item.sec
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Amount Investment Input */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1.5 font-bold">
            <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
            Inversión
          </span>
          <span className="text-[11px] text-slate-400 font-mono">
            Disp: <strong className="text-white">${userBalance.toFixed(2)}</strong>
          </span>
        </div>

        {/* Input with Plus / Minus */}
        <div className="flex items-center bg-slate-950 border border-slate-700/80 rounded-xl overflow-hidden p-1">
          <button
            onClick={() => handleAdjustAmount(-5)}
            className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold flex items-center justify-center transition-colors cursor-pointer"
          >
            <Minus className="w-4 h-4" />
          </button>
          <div className="flex-1 text-center font-mono font-black text-lg text-white">
            ${amount}
          </div>
          <button
            onClick={() => handleAdjustAmount(5)}
            className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 font-bold flex items-center justify-center transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Amount Pills */}
        <div className="grid grid-cols-4 gap-1.5 pt-1">
          {[5, 10, 25, 50].map(val => (
            <button
              key={val}
              onClick={() => setAmount(val)}
              className={`py-1 rounded-md text-[11px] font-bold font-mono transition-all cursor-pointer border ${
                amount === val
                  ? 'bg-slate-800 text-amber-300 border-amber-500/50'
                  : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              ${val}
            </button>
          ))}
        </div>
      </div>

      {/* Payout & Profit Summary Box */}
      <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 space-y-1 text-xs">
        <div className="flex items-center justify-between text-slate-400">
          <span>Rendimiento del Par:</span>
          <span className="font-mono font-bold text-emerald-400">+{payoutPct}%</span>
        </div>
        <div className="flex items-center justify-between text-slate-300">
          <span>Beneficio Neto:</span>
          <span className="font-mono font-black text-amber-400 text-sm">+${potentialProfit.toFixed(2)}</span>
        </div>
        <div className="flex items-center justify-between text-slate-400 text-[11px] border-t border-slate-800/80 pt-1">
          <span>Retorno Total:</span>
          <span className="font-mono text-white font-bold">${totalReturn.toFixed(2)}</span>
        </div>
      </div>

      {/* Large Tactile CALL & PUT Buttons (Like Quotex / Pocket Option) */}
      <div className="space-y-2.5">
        {/* SUBE / CALL (Verde) */}
        <button
          onClick={handleCall}
          className="w-full bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white p-3.5 rounded-xl font-black transition-all shadow-lg shadow-emerald-900/30 flex items-center justify-between cursor-pointer group"
        >
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-700/60 flex items-center justify-center group-hover:scale-110 transition-transform">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <span className="text-base font-black tracking-wide block leading-none">SUBE</span>
              <span className="text-[10px] text-emerald-200 block font-normal leading-tight mt-0.5">COMPRA / CALL</span>
            </div>
          </div>
          <div className="text-right font-mono">
            <span className="text-sm font-black block">+{payoutPct}%</span>
            <span className="text-[10px] text-emerald-200 block">+$ {potentialProfit.toFixed(2)}</span>
          </div>
        </button>

        {/* BAJA / PUT (Rojo) */}
        <button
          onClick={handlePut}
          className="w-full bg-rose-600 hover:bg-rose-500 active:scale-[0.98] text-white p-3.5 rounded-xl font-black transition-all shadow-lg shadow-rose-900/30 flex items-center justify-between cursor-pointer group"
        >
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-rose-700/60 flex items-center justify-center group-hover:scale-110 transition-transform">
              <TrendingDown className="w-5 h-5 text-white" />
            </div>
            <div className="text-left">
              <span className="text-base font-black tracking-wide block leading-none">BAJA</span>
              <span className="text-[10px] text-rose-200 block font-normal leading-tight mt-0.5">VENTA / PUT</span>
            </div>
          </div>
          <div className="text-right font-mono">
            <span className="text-sm font-black block">+{payoutPct}%</span>
            <span className="text-[10px] text-rose-200 block">+$ {potentialProfit.toFixed(2)}</span>
          </div>
        </button>
      </div>

      {/* Account Type Warning */}
      <div className="text-center pt-1">
        {userBalance < amount ? (
          <button
            onClick={onOpenDeposit}
            className="text-xs text-amber-400 hover:underline font-bold flex items-center justify-center gap-1 mx-auto"
          >
            <Zap className="w-3.5 h-3.5" />
            Saldo insuficiente. Toca para recargar
          </button>
        ) : (
          <span className="text-[10px] text-slate-500 font-mono">
            {isDemoAccount ? 'Operando con Saldo Demo' : 'Operando en Cuenta Real'}
          </span>
        )}
      </div>
    </div>
  );
};
