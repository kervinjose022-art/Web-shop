import React, { useState } from 'react';
import { Plus, Clock, ArrowUpRight, ArrowDownRight, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

export interface ActivePosition {
  id: string;
  assetSymbol: string;
  type: 'buy' | 'sell';
  lots: number;
  entryPrice: number;
  openTime: number;
  takeProfit?: number;
  stopLoss?: number;
}

export interface ClosedPosition {
  id: string;
  assetSymbol: string;
  type: 'buy' | 'sell';
  lots: number;
  entryPrice: number;
  closePrice: number;
  pnl: number;
  closeTime: string;
}

interface XmPortfolioViewProps {
  activePositions: ActivePosition[];
  closedPositions: ClosedPosition[];
  currentPrice: number;
  onClosePosition: (id: string) => void;
  onNavigateToTrading: () => void;
}

export const XmPortfolioView: React.FC<XmPortfolioViewProps> = ({
  activePositions,
  closedPositions,
  currentPrice,
  onClosePosition,
  onNavigateToTrading
}) => {
  const [activeTab, setActiveTab] = useState<'abiertas' | 'pendientes' | 'historial' | 'alertas'>('abiertas');

  return (
    <div className="flex-1 flex flex-col bg-[#070c17] text-slate-100 overflow-y-auto pb-24 max-w-2xl mx-auto w-full">
      {/* Header */}
      <div className="p-4 pb-2 space-y-3 sticky top-0 bg-[#070c17]/90 backdrop-blur-md z-10 border-b border-slate-800/60">
        <h2 className="text-xl font-black text-white">Operaciones</h2>

        {/* Tabs Bar: Posiciones abiertas | Órdenes pendientes | Historial | Alertas */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 text-xs">
          <button
            onClick={() => setActiveTab('abiertas')}
            className={`px-3 py-1.5 rounded-full font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'abiertas'
                ? 'bg-white text-slate-950 font-black shadow-md'
                : 'bg-[#0b1325] text-slate-400 hover:text-white border border-slate-800/80'
            }`}
          >
            Posiciones abiertas {activePositions.length > 0 && `(${activePositions.length})`}
          </button>

          <button
            onClick={() => setActiveTab('pendientes')}
            className={`px-3 py-1.5 rounded-full font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'pendientes'
                ? 'bg-white text-slate-950 font-black shadow-md'
                : 'bg-[#0b1325] text-slate-400 hover:text-white border border-slate-800/80'
            }`}
          >
            Órdenes pendientes
          </button>

          <button
            onClick={() => setActiveTab('historial')}
            className={`px-3 py-1.5 rounded-full font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'historial'
                ? 'bg-white text-slate-950 font-black shadow-md'
                : 'bg-[#0b1325] text-slate-400 hover:text-white border border-slate-800/80'
            }`}
          >
            Historial
          </button>

          <button
            onClick={() => setActiveTab('alertas')}
            className={`px-3 py-1.5 rounded-full font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'alertas'
                ? 'bg-white text-slate-950 font-black shadow-md'
                : 'bg-[#0b1325] text-slate-400 hover:text-white border border-slate-800/80'
            }`}
          >
            Alertas de precios
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {activeTab === 'abiertas' && (
          <div>
            {activePositions.length === 0 ? (
              <div className="py-20 flex flex-col items-center justify-center text-center space-y-3">
                <div className="w-20 h-20 rounded-full border border-slate-800 flex items-center justify-center text-slate-600 text-3xl">
                  <Plus className="w-10 h-10 stroke-[1.5]" />
                </div>
                <h4 className="text-base font-bold text-slate-300">Nada que mostrar.</h4>
                <button
                  onClick={onNavigateToTrading}
                  className="mt-2 px-6 py-2.5 rounded-2xl bg-white text-slate-950 font-black text-xs hover:bg-slate-200 transition-colors cursor-pointer shadow-lg shadow-white/10"
                >
                  Abrir una posición
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {activePositions.map(pos => {
                  const isBuy = pos.type === 'buy';
                  // Floating PnL calculation:
                  // For 1 lot gold: $1 price change = $100 profit/loss.
                  // For pos.lots: (currentPrice - entryPrice) * pos.lots * 100
                  const diff = isBuy ? currentPrice - pos.entryPrice : pos.entryPrice - currentPrice;
                  const pnl = Math.round(diff * pos.lots * 100 * 100) / 100;
                  const isPositive = pnl >= 0;

                  return (
                    <div
                      key={pos.id}
                      className="bg-[#0b1325] border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase font-mono ${
                            isBuy ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          }`}>
                            {isBuy ? 'COMPRA' : 'VENTA'} {pos.lots} L
                          </span>
                          <span className="font-black text-sm text-white">{pos.assetSymbol}</span>
                        </div>

                        <div className="text-right">
                          <span className={`font-mono font-black text-base ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {isPositive ? '+' : ''}${pnl.toFixed(2)} USD
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
                        <div>
                          <span>Entrada: </span>
                          <span className="text-slate-200 font-bold">${pos.entryPrice.toFixed(2)}</span>
                        </div>
                        <div>
                          <span>Actual: </span>
                          <span className="text-amber-400 font-bold">${currentPrice.toFixed(2)}</span>
                        </div>
                      </div>

                      <button
                        onClick={() => onClosePosition(pos.id)}
                        className="w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white transition-colors cursor-pointer"
                      >
                        Cerrar Posición ({isPositive ? `Tomar Ganancia +$${pnl.toFixed(2)}` : `Cerrar Pérdida -$${Math.abs(pnl).toFixed(2)}`})
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'pendientes' && (
          <div className="py-20 flex flex-col items-center justify-center text-center space-y-3">
            <div className="w-16 h-16 rounded-full border border-slate-800 flex items-center justify-center text-slate-600">
              <Clock className="w-8 h-8 stroke-[1.5]" />
            </div>
            <h4 className="text-base font-bold text-slate-300">No hay órdenes pendientes.</h4>
            <p className="text-xs text-slate-500 max-w-xs">
              Las órdenes limit y stop programadas aparecerán en esta sección.
            </p>
          </div>
        )}

        {activeTab === 'historial' && (
          <div className="space-y-2">
            {closedPositions.length === 0 ? (
              <div className="py-16 text-center text-xs text-slate-500">
                Aún no has cerrado operaciones en esta sesión.
              </div>
            ) : (
              closedPositions.map(c => (
                <div
                  key={c.id}
                  className="bg-[#0b1325] border border-slate-800/80 rounded-xl p-3 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2">
                    <span className={`font-bold ${c.pnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {c.pnl >= 0 ? '✓ GANANCIA' : '✕ PÉRDIDA'}
                    </span>
                    <span className="text-white font-black">{c.assetSymbol}</span>
                    <span className="text-slate-500 uppercase font-mono">{c.type} {c.lots}L</span>
                  </div>
                  <div className="text-right font-mono">
                    <span className={`font-bold text-sm ${c.pnl >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {c.pnl >= 0 ? '+' : ''}${c.pnl.toFixed(2)} USD
                    </span>
                    <div className="text-[10px] text-slate-500">{c.closeTime}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'alertas' && (
          <div className="py-20 flex flex-col items-center justify-center text-center space-y-3">
            <div className="w-16 h-16 rounded-full border border-slate-800 flex items-center justify-center text-slate-600">
              <Plus className="w-8 h-8 stroke-[1.5]" />
            </div>
            <h4 className="text-base font-bold text-slate-300">Nada que mostrar.</h4>
            <button className="px-5 py-2 rounded-xl bg-white text-slate-950 font-black text-xs hover:bg-slate-200 cursor-pointer">
              Añadir alerta de precio
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
