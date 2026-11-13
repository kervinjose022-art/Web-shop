import React from 'react';
import { X, Clock, Calendar, Check, Plus, Star } from 'lucide-react';

export type ChartInterval = 
  | '1T' | '10T' | '100T' | '1000T'
  | '1s' | '5s' | '10s' | '15s' | '30s'
  | '1m' | '3m' | '5m' | '15m' | '30m'
  | '1h' | '2h' | '4h'
  | '1D' | '1W' | '1M';

export type ChartDateRange = '1D' | '5D' | '1M' | '3M' | '6M' | '1A';

interface XmIntervalSheetProps {
  isOpen: boolean;
  onClose: () => void;
  currentInterval: string;
  onSelectInterval: (interval: string) => void;
  currentRange: string;
  onSelectRange: (range: string) => void;
}

export const XmIntervalSheet: React.FC<XmIntervalSheetProps> = ({
  isOpen,
  onClose,
  currentInterval,
  onSelectInterval,
  currentRange,
  onSelectRange
}) => {
  if (!isOpen) return null;

  const dateRanges: ChartDateRange[] = ['1D', '5D', '1M', '3M', '6M', '1A'];
  const ticks = ['1T', '10T', '100T', '1000T'];
  const seconds = ['1c', '5c', '10c', '15c', '30c'];
  const minutes = ['1m', '3m', '5m', '15m', '30m'];
  const hours = ['1h', '2h', '4h'];
  const days = ['1D', '1S', '1M'];

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end justify-center p-0 sm:p-4 animate-in fade-in">
      <div className="bg-[#0b1325] border border-slate-800 rounded-t-3xl sm:rounded-3xl w-full max-w-lg max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-4 pb-2 border-b border-slate-800/80">
          <div className="w-12 h-1 bg-slate-700 rounded-full mx-auto mb-3" />
          <div className="flex items-center justify-between">
            <h3 className="font-black text-base text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-cyan-400" />
              <span>Rango de fechas e Intervalo</span>
            </h3>
            <button 
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          
          {/* Rango de fechas */}
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Rango de fechas
            </label>
            <div className="grid grid-cols-6 gap-1.5 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
              {dateRanges.map((r) => (
                <button
                  key={r}
                  onClick={() => { onSelectRange(r); }}
                  className={`py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    currentRange === r 
                      ? 'bg-cyan-500 text-slate-950 shadow-md scale-105' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-900'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Banner favorito */}
          <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center gap-2.5 text-xs text-amber-300">
            <Star className="w-4 h-4 text-amber-400 shrink-0 fill-amber-400/30" />
            <span>Utilice la pulsación larga para agregar el intervalo a sus favoritos</span>
          </div>

          {/* Ticks */}
          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              TICKS (Velocidad de señal)
            </label>
            <div className="grid grid-cols-4 gap-2">
              {ticks.map((t) => (
                <button
                  key={t}
                  onClick={() => { onSelectInterval(t); onClose(); }}
                  className={`py-2.5 rounded-xl text-xs font-mono font-bold border transition-all cursor-pointer ${
                    currentInterval === t
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-black'
                      : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Segundos */}
          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              SEGUNDOS
            </label>
            <div className="grid grid-cols-5 gap-1.5">
              {seconds.map((s) => (
                <button
                  key={s}
                  onClick={() => { onSelectInterval(s); onClose(); }}
                  className={`py-2 rounded-xl text-xs font-mono font-bold border transition-all cursor-pointer ${
                    currentInterval === s
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-black'
                      : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Minutos */}
          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              MINUTOS
            </label>
            <div className="grid grid-cols-5 gap-1.5">
              {minutes.map((m) => (
                <button
                  key={m}
                  onClick={() => { onSelectInterval(m); onClose(); }}
                  className={`py-2.5 rounded-xl text-xs font-mono font-bold border transition-all cursor-pointer ${
                    currentInterval === m
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-black'
                      : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Horas */}
          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              HORAS
            </label>
            <div className="grid grid-cols-3 gap-2">
              {hours.map((h) => (
                <button
                  key={h}
                  onClick={() => { onSelectInterval(h); onClose(); }}
                  className={`py-2.5 rounded-xl text-xs font-mono font-bold border transition-all cursor-pointer ${
                    currentInterval === h
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-black'
                      : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {h}
                </button>
              ))}
            </div>
          </div>

          {/* Días y Semanas */}
          <div>
            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
              DÍAS / SEMANAS
            </label>
            <div className="grid grid-cols-3 gap-2">
              {days.map((d) => (
                <button
                  key={d}
                  onClick={() => { onSelectInterval(d); onClose(); }}
                  className={`py-2.5 rounded-xl text-xs font-mono font-bold border transition-all cursor-pointer ${
                    currentInterval === d
                      ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 font-black'
                      : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-950 border-t border-slate-800/80">
          <button 
            onClick={() => {
              const custom = prompt('Ingresa intervalo personalizado (ej. 45m, 8h, 2D):', '45m');
              if (custom) {
                onSelectInterval(custom);
                onClose();
              }
            }}
            className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4 text-cyan-400" />
            <span>Añadir intervalo personalizado</span>
          </button>
        </div>

      </div>
    </div>
  );
};
