import React, { useState } from 'react';
import { X, TrendingUp, TrendingDown, ShieldCheck, Check } from 'lucide-react';

interface XmOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'buy' | 'sell';
  assetSymbol: string;
  assetName: string;
  currentPrice: number;
  userBalance: number;
  isDemo: boolean;
  onConfirmOrder: (order: {
    type: 'buy' | 'sell';
    lots: number;
    entryPrice: number;
    takeProfit?: number;
    stopLoss?: number;
  }) => void;
}

export const XmOrderModal: React.FC<XmOrderModalProps> = ({
  isOpen,
  onClose,
  type,
  assetSymbol,
  assetName,
  currentPrice,
  userBalance,
  isDemo,
  onConfirmOrder
}) => {
  const [lots, setLots] = useState<number>(0.05);
  const [takeProfit, setTakeProfit] = useState<string>('');
  const [stopLoss, setStopLoss] = useState<string>('');
  const [useTP, setUseTP] = useState<boolean>(false);
  const [useSL, setUseSL] = useState<boolean>(false);

  if (!isOpen) return null;

  // Margin requirement calculation: 0.01 lot ≈ $20 margin on gold
  const estimatedMargin = Math.round(lots * 2000 * 100) / 100;
  const isBuy = type === 'buy';

  const handleAdjustLots = (delta: number) => {
    setLots(prev => Math.max(0.01, Math.min(prev + delta, 10.00)));
  };

  const handleConfirm = () => {
    onConfirmOrder({
      type,
      lots: Math.round(lots * 100) / 100,
      entryPrice: currentPrice,
      takeProfit: useTP && takeProfit ? Number(takeProfit) : undefined,
      stopLoss: useSL && stopLoss ? Number(stopLoss) : undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg bg-[#0d1527] border-t sm:border border-slate-800 rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl text-white">
        {/* Modal Handlebar on Mobile */}
        <div className="w-12 h-1 bg-slate-700 rounded-full mx-auto mb-3 sm:hidden" />

        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm ${
              isBuy ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
            }`}>
              {isBuy ? '▲' : '▼'}
            </div>
            <div>
              <h3 className="font-black text-sm sm:text-base flex items-center gap-1.5">
                <span>{isBuy ? 'Orden de COMPRA (Long)' : 'Orden de VENTA (Short)'}</span>
                <span className="text-xs text-amber-400 font-mono">[{assetSymbol}]</span>
              </h3>
              <p className="text-[11px] text-slate-400 font-mono">
                Precio de Ejecución: <span className="font-bold text-white">${currentPrice.toFixed(2)}</span>
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Lots Volume Controller */}
        <div className="mt-4 space-y-2">
          <div className="flex justify-between text-xs text-slate-400 font-semibold">
            <span>Volumen (Lotes)</span>
            <span className="text-amber-400 font-mono">Margen requerido: ~${estimatedMargin.toFixed(2)}</span>
          </div>

          <div className="flex items-center bg-slate-950 border border-slate-800 rounded-2xl p-1">
            <button
              onClick={() => handleAdjustLots(-0.01)}
              className="w-10 h-10 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold text-lg flex items-center justify-center cursor-pointer"
            >
              -
            </button>
            <input
              type="number"
              step="0.01"
              min="0.01"
              max="10.00"
              value={lots}
              onChange={e => setLots(Math.max(0.01, Number(e.target.value) || 0.01))}
              className="flex-1 bg-transparent text-center font-mono font-black text-xl text-white focus:outline-none"
            />
            <button
              onClick={() => handleAdjustLots(0.01)}
              className="w-10 h-10 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold text-lg flex items-center justify-center cursor-pointer"
            >
              +
            </button>
          </div>

          {/* Quick preset lot buttons */}
          <div className="grid grid-cols-4 gap-1.5 pt-1">
            {[0.01, 0.05, 0.10, 0.50].map(val => (
              <button
                key={val}
                onClick={() => setLots(val)}
                className={`py-1 rounded-lg text-xs font-mono font-bold border transition-colors cursor-pointer ${
                  lots === val 
                    ? 'border-amber-400 bg-amber-400/20 text-amber-300' 
                    : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:text-white'
                }`}
              >
                {val} lotes
              </button>
            ))}
          </div>
        </div>

        {/* TP & SL toggles */}
        <div className="mt-4 space-y-3 pt-3 border-t border-slate-800">
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={useTP}
                onChange={e => setUseTP(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-500 accent-emerald-500 cursor-pointer"
              />
              <span>Take Profit (Tomar Ganancia)</span>
            </label>
            {useTP && (
              <input
                type="number"
                step="0.1"
                placeholder={isBuy ? (currentPrice + 10).toFixed(2) : (currentPrice - 10).toFixed(2)}
                value={takeProfit}
                onChange={e => setTakeProfit(e.target.value)}
                className="w-28 bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-xs font-mono font-bold text-emerald-400 focus:outline-none focus:border-emerald-500"
              />
            )}
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-xs font-semibold text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={useSL}
                onChange={e => setUseSL(e.target.checked)}
                className="w-4 h-4 rounded text-rose-500 accent-rose-500 cursor-pointer"
              />
              <span>Stop Loss (Límite de Pérdida)</span>
            </label>
            {useSL && (
              <input
                type="number"
                step="0.1"
                placeholder={isBuy ? (currentPrice - 10).toFixed(2) : (currentPrice + 10).toFixed(2)}
                value={stopLoss}
                onChange={e => setStopLoss(e.target.value)}
                className="w-28 bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-xs font-mono font-bold text-rose-400 focus:outline-none focus:border-rose-500"
              />
            )}
          </div>
        </div>

        {/* Action Button */}
        <button
          onClick={handleConfirm}
          className={`w-full mt-5 py-3.5 rounded-2xl font-black text-sm uppercase tracking-wider transition-all cursor-pointer shadow-xl ${
            isBuy 
              ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20' 
              : 'bg-rose-500 hover:bg-rose-400 text-white shadow-rose-500/20'
          }`}
        >
          {isBuy ? `Confirmar Compra ${lots} lotes a $${currentPrice.toFixed(2)}` : `Confirmar Venta ${lots} lotes a $${currentPrice.toFixed(2)}`}
        </button>
      </div>
    </div>
  );
};
