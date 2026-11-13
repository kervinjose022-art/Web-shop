import React, { useState } from 'react';
import { Clock, CheckCircle2, XCircle, ArrowUpRight, ArrowDownRight, History, Layers } from 'lucide-react';
import { ActiveTrade } from './BrokerChart';

interface BrokerTradesListProps {
  activeTrades: ActiveTrade[];
  closedTrades: ActiveTrade[];
  currentPrice: number;
}

export const BrokerTradesList: React.FC<BrokerTradesListProps> = ({
  activeTrades,
  closedTrades,
  currentPrice
}) => {
  const [tab, setTab] = useState<'active' | 'closed'>('active');

  return (
    <div className="bg-[#090f1d] border border-slate-800 rounded-2xl p-4 shadow-xl flex flex-col space-y-3">
      {/* Tabs */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setTab('active')}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              tab === 'active'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Abiertas</span>
            {activeTrades.length > 0 && (
              <span className="bg-slate-950 text-amber-400 px-1.5 py-0.2 rounded-full text-[10px] font-black">
                {activeTrades.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setTab('closed')}
            className={`px-3 py-1 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
              tab === 'closed'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Historial ({closedTrades.length})</span>
          </button>
        </div>

        <span className="text-[10px] text-slate-500 font-mono">
          Terminal Trader v3.2
        </span>
      </div>

      {/* Tab 1: Active Trades */}
      {tab === 'active' && (
        <div className="space-y-2 max-h-56 overflow-y-auto scrollbar-thin">
          {activeTrades.length === 0 ? (
            <div className="text-center py-6 text-slate-500 space-y-1">
              <Layers className="w-6 h-6 mx-auto text-slate-600" />
              <p className="text-xs">No tienes operaciones abiertas en este momento.</p>
              <p className="text-[10px] text-slate-600">Presiona SUBE o BAJA para iniciar una orden.</p>
            </div>
          ) : (
            activeTrades.map(trade => {
              const isCall = trade.type === 'call';
              const winning = isCall ? currentPrice >= trade.entryPrice : currentPrice <= trade.entryPrice;
              const remainingSec = Math.max(0, Math.ceil((trade.endTime - Date.now()) / 1000));
              const potentialGain = Math.round(trade.amount * (trade.payoutPct / 100) * 100) / 100;

              return (
                <div
                  key={trade.id}
                  className={`p-3 rounded-xl border transition-all ${
                    winning
                      ? 'bg-emerald-950/20 border-emerald-500/40 text-emerald-300'
                      : 'bg-rose-950/20 border-rose-500/40 text-rose-300'
                  }`}
                >
                  <div className="flex items-center justify-between text-xs font-mono">
                    <div className="flex items-center gap-1.5 font-bold">
                      {isCall ? (
                        <ArrowUpRight className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <ArrowDownRight className="w-4 h-4 text-rose-400" />
                      )}
                      <span>{trade.asset}</span>
                      <span className="text-[10px] uppercase bg-slate-900 px-1.5 py-0.2 rounded text-slate-300">
                        {trade.type}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="bg-slate-900 text-amber-400 px-2 py-0.5 rounded text-[11px] font-bold">
                        ⏳ {remainingSec}s
                      </span>
                      <span className="font-bold text-white">${trade.amount}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-mono mt-2 pt-1 border-t border-slate-800/60">
                    <span className="text-slate-400">
                      Entrada: <strong className="text-white">${trade.entryPrice.toFixed(2)}</strong>
                    </span>
                    <span className="font-bold">
                      {winning ? (
                        <span className="text-emerald-400">+$ {potentialGain.toFixed(2)} (Ganando)</span>
                      ) : (
                        <span className="text-rose-400">-$ {trade.amount.toFixed(2)} (Perdiendo)</span>
                      )}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {/* Tab 2: Closed Trades History */}
      {tab === 'closed' && (
        <div className="space-y-2 max-h-56 overflow-y-auto scrollbar-thin">
          {closedTrades.length === 0 ? (
            <div className="text-center py-6 text-slate-500 text-xs">
              El historial de operaciones finalizadas aparecerá aquí.
            </div>
          ) : (
            closedTrades.map(trade => (
              <div
                key={trade.id}
                className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between text-xs font-mono"
              >
                <div className="flex items-center gap-2">
                  {trade.status === 'won' ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                  )}
                  <div>
                    <span className="font-bold text-white block leading-none">{trade.asset}</span>
                    <span className="text-[10px] text-slate-500 block mt-0.5 uppercase">
                      {trade.type} • Entrada: ${trade.entryPrice.toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`font-black text-xs block ${
                      trade.status === 'won' ? 'text-emerald-400' : 'text-slate-500'
                    }`}
                  >
                    {trade.status === 'won' ? `+$${trade.profit.toFixed(2)}` : `-$${trade.amount.toFixed(2)}`}
                  </span>
                  <span className="text-[9px] text-slate-500 uppercase block">
                    {trade.status === 'won' ? 'GANADA' : 'PERDIDA'}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
