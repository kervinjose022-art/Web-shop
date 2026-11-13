import React, { useState } from 'react';
import { Search, Star, TrendingUp, TrendingDown } from 'lucide-react';

export interface MarketAsset {
  symbol: string;
  name: string;
  category: 'popular' | 'forex' | 'cfd' | 'crypto' | 'commodities';
  price: number;
  change24h: number;
  iconLetter: string;
}

export const XM_MARKET_ASSETS: MarketAsset[] = [
  { symbol: 'GOLD', name: 'GOLD Spot / USD', category: 'popular', price: 4066.44, change24h: -0.55, iconLetter: 'G' },
  { symbol: 'BTCUSD', name: 'Bitcoin vs US Dollar', category: 'crypto', price: 76151.75, change24h: 0.42, iconLetter: 'B' },
  { symbol: 'JP225Cash', name: 'Japan 225 Index Cash', category: 'cfd', price: 58260.00, change24h: 2.18, iconLetter: 'J' },
  { symbol: 'USDJPY', name: 'US Dollar vs Japanese Yen', category: 'forex', price: 158.278, change24h: 0.39, iconLetter: 'U' },
  { symbol: 'US100Cash', name: 'US 100 Index Cash (Nasdaq)', category: 'cfd', price: 27089.90, change24h: 2.26, iconLetter: 'U' },
  { symbol: 'EURUSD', name: 'Euro vs US Dollar', category: 'forex', price: 1.11767, change24h: -0.36, iconLetter: 'E' },
  { symbol: 'OILCash', name: 'WTI Oil Cash', category: 'commodities', price: 91.55, change24h: -0.45, iconLetter: 'O' },
  { symbol: 'SILVER', name: 'Silver Spot / USD', category: 'commodities', price: 52.086, change24h: 0.86, iconLetter: 'S' },
  { symbol: 'GBPUSD', name: 'Great Britain Pound vs US Dollar', category: 'forex', price: 1.33994, change24h: -0.20, iconLetter: 'G' },
  { symbol: 'US30Cash', name: 'Wall Street 30 Index Cash', category: 'cfd', price: 51043.50, change24h: -0.42, iconLetter: 'U' },
  { symbol: 'GBPJPY', name: 'Great Britain Pound vs Japanese Yen', category: 'forex', price: 212.103, change24h: +0.03, iconLetter: 'G' },
  { symbol: 'BRENTCash', name: 'Brent Crude Oil Cash', category: 'commodities', price: 101.87, change24h: -0.69, iconLetter: 'B' },
  { symbol: 'GER40Cash', name: 'Germany 40 Index Cash', category: 'cfd', price: 25699.81, change24h: -1.56, iconLetter: 'G' },
  { symbol: 'US500Cash', name: 'US 500 Index Cash', category: 'cfd', price: 7380.43, change24h: +0.73, iconLetter: 'U' },
  { symbol: 'XAUEUR', name: 'Gold vs Euro', category: 'commodities', price: 3637.37, change24h: -0.19, iconLetter: 'X' },
  { symbol: 'AUDCAD', name: 'Australian Dollar vs Canadian Dollar', category: 'forex', price: 0.96651, change24h: -0.48, iconLetter: 'A' },
  { symbol: 'AUDUSD', name: 'Australian Dollar vs US Dollar', category: 'forex', price: 0.68736, change24h: -0.80, iconLetter: 'A' },
  { symbol: 'CHFJPY', name: 'Swiss Franc vs Japanese Yen', category: 'forex', price: 193.483, change24h: +0.21, iconLetter: 'C' },
  { symbol: 'EURCAD', name: 'Euro vs Canadian Dollar', category: 'forex', price: 1.57155, change24h: -0.05, iconLetter: 'E' },
  { symbol: 'CADJPY', name: 'Canadian Dollar vs Japanese Yen', category: 'forex', price: 112.553, change24h: -0.12, iconLetter: 'C' },
  { symbol: 'NZDCAD', name: 'New Zealand Dollar vs Canadian Dollar', category: 'forex', price: 0.77933, change24h: +0.12, iconLetter: 'N' },
  { symbol: 'NZDJPY', name: 'New Zealand Dollar vs Japanese Yen', category: 'forex', price: 87.740, change24h: -0.49, iconLetter: 'N' },
  { symbol: 'BTCJPY', name: 'Bitcoin vs Japanese Yen', category: 'crypto', price: 12052141.00, change24h: +0.80, iconLetter: 'B' },
  { symbol: 'XRPUSD', name: 'Ripple vs US Dollar', category: 'crypto', price: 1.19412, change24h: -1.96, iconLetter: 'X' },
  { symbol: 'EURNZD', name: 'Euro vs New Zealand Dollar', category: 'forex', price: 2.01584, change24h: +0.54, iconLetter: 'E' },
  { symbol: 'GOLD24-7', name: 'Gold 24-7 Continuous', category: 'commodities', price: 4065.26, change24h: -0.56, iconLetter: 'G' },
  { symbol: 'GBPCAD', name: 'Great Britain Pound vs Canadian Dollar', category: 'forex', price: 1.88402, change24h: -0.05, iconLetter: 'G' }
];

interface XmMarketsViewProps {
  onSelectAsset: (asset: MarketAsset) => void;
}

export const XmMarketsView: React.FC<XmMarketsViewProps> = ({ onSelectAsset }) => {
  const [activeCategory, setActiveCategory] = useState<'popular' | 'forex' | 'cfd' | 'crypto' | 'commodities'>('popular');
  const [search, setSearch] = useState('');

  const filtered = XM_MARKET_ASSETS.filter(a => {
    const matchCat = activeCategory === 'popular' ? true : a.category === activeCategory;
    const matchSearch = a.symbol.toLowerCase().includes(search.toLowerCase()) || a.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="flex-1 flex flex-col bg-[#070c17] text-slate-100 overflow-y-auto pb-24 max-w-2xl mx-auto w-full">
      {/* Title & Search Bar */}
      <div className="p-4 pb-2 space-y-3 sticky top-0 bg-[#070c17]/90 backdrop-blur-md z-10 border-b border-slate-800/60">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-black text-white">Mercados</h2>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Buscar instrumentos, acciones, divisas..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-[#0b1325] border border-slate-800 rounded-2xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        {/* Categories Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {[
            { id: 'popular', label: 'Popular' },
            { id: 'forex', label: 'Forex' },
            { id: 'cfd', label: 'CFD de acciones' },
            { id: 'crypto', label: 'Cripto' },
            { id: 'commodities', label: 'Materias primas' }
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as any)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-white text-slate-950 font-black shadow-md'
                  : 'bg-[#0b1325] text-slate-400 hover:text-white border border-slate-800/80'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Asset List Rows */}
      <div className="divide-y divide-slate-800/60 px-2 sm:px-4">
        {filtered.map(asset => (
          <div
            key={asset.symbol}
            onClick={() => onSelectAsset(asset)}
            className="p-3.5 flex items-center justify-between hover:bg-slate-900/60 rounded-2xl transition-all cursor-pointer group"
          >
            {/* Left Info */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center font-bold text-xs text-amber-400 font-mono shadow-inner">
                {asset.iconLetter}
              </div>
              <div className="flex flex-col text-left">
                <span className="font-black text-sm text-white group-hover:text-amber-400 transition-colors">
                  {asset.symbol}
                </span>
                <span className="text-[11px] text-slate-400 truncate max-w-[160px] sm:max-w-xs">
                  {asset.name}
                </span>
              </div>
            </div>

            {/* Right Price & Delta */}
            <div className="flex flex-col text-right">
              <span className="font-mono font-black text-sm text-white">
                {asset.price > 1000 
                  ? asset.price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                  : asset.price.toFixed(asset.price < 5 ? 5 : 2)}
              </span>
              <span className={`text-[11px] font-mono font-bold ${
                asset.change24h >= 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}>
                {asset.change24h >= 0 ? '+' : ''}{asset.change24h.toFixed(2)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
