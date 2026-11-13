import React, { useState } from 'react';
import { X, Search, TrendingUp, Sparkles } from 'lucide-react';

export interface TradingAsset {
  symbol: string;
  name: string;
  category: 'commodities' | 'crypto' | 'forex';
  price: number;
  payoutPct: number;
  change24h: number;
}

export const ASSET_LIST: TradingAsset[] = [
  { symbol: 'XAU/USD', name: 'Oro / Dólar Americano', category: 'commodities', price: 3892.38, payoutPct: 95, change24h: -2.66 },
  { symbol: 'BTC/USDT', name: 'Bitcoin / Tether USD', category: 'crypto', price: 91450.00, payoutPct: 92, change24h: 3.42 },
  { symbol: 'ETH/USDT', name: 'Ethereum / Tether USD', category: 'crypto', price: 3240.50, payoutPct: 90, change24h: 2.15 },
  { symbol: 'EUR/USD', name: 'Euro / Dólar Americano', category: 'forex', price: 1.0845, payoutPct: 88, change24h: 0.12 },
  { symbol: 'GBP/USD', name: 'Libra Esterlina / Dólar', category: 'forex', price: 1.2980, payoutPct: 87, change24h: -0.34 },
  { symbol: 'USD/JPY', name: 'Dólar Americano / Yen', category: 'forex', price: 153.20, payoutPct: 85, change24h: 0.55 },
  { symbol: 'SOL/USDT', name: 'Solana / Tether USD', category: 'crypto', price: 184.20, payoutPct: 89, change24h: 4.80 },
];

interface BrokerAssetModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSymbol: string;
  onSelectAsset: (asset: TradingAsset) => void;
}

export const BrokerAssetModal: React.FC<BrokerAssetModalProps> = ({
  isOpen,
  onClose,
  selectedSymbol,
  onSelectAsset
}) => {
  const [search, setSearch] = useState('');
  const [activeCat, setActiveCat] = useState<'all' | 'commodities' | 'crypto' | 'forex'>('all');

  if (!isOpen) return null;

  const filtered = ASSET_LIST.filter(a => {
    const matchCat = activeCat === 'all' || a.category === activeCat;
    const matchSearch = a.symbol.toLowerCase().includes(search.toLowerCase()) || a.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-[#0e172a] border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-amber-400" />
              Seleccionar Instrumento de Trading
            </h3>
            <p className="text-xs text-slate-400">
              Operaciones de alta frecuencia con pagos de hasta el 95%
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Categories */}
        <div className="p-4 border-b border-slate-800 space-y-3 bg-slate-950/60">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Buscar activo (ej. Oro, Bitcoin, EUR/USD)..."
              className="inpt pl-9 text-xs"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
            {[
              { id: 'all', label: 'Todos' },
              { id: 'commodities', label: 'Materias Primas (Oro)' },
              { id: 'crypto', label: 'Criptomonedas' },
              { id: 'forex', label: 'Divisas Forex' }
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCat(cat.id as any)}
                className={`px-3 py-1 text-xs font-bold rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                  activeCat === cat.id
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Asset list */}
        <div className="p-3 overflow-y-auto space-y-2 flex-1 scrollbar-thin">
          {filtered.map(asset => {
            const isSelected = asset.symbol === selectedSymbol;
            return (
              <button
                key={asset.symbol}
                onClick={() => {
                  onSelectAsset(asset);
                  onClose();
                }}
                className={`w-full p-3 rounded-xl border flex items-center justify-between text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-slate-800/90 border-amber-500/50 shadow-md'
                    : 'bg-slate-900/60 hover:bg-slate-800/50 border-slate-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-amber-400 text-xs font-mono">
                    {asset.symbol.split('/')[0].slice(0, 3)}
                  </div>
                  <div>
                    <span className="font-bold text-white text-sm block font-mono">
                      {asset.symbol}
                    </span>
                    <span className="text-xs text-slate-400 block">{asset.name}</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="bg-emerald-500/20 text-emerald-400 font-mono font-black text-xs px-2 py-0.5 rounded-lg block">
                    +{asset.payoutPct}%
                  </span>
                  <span className="text-xs font-mono text-slate-300 block mt-0.5 font-bold">
                    ${asset.price.toLocaleString()}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
