import React, { useState, useEffect, useRef } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  SlidersHorizontal, 
  Maximize2, 
  Activity, 
  Clock, 
  Volume2, 
  VolumeX, 
  Compass,
  Layers,
  ChevronDown
} from 'lucide-react';

export interface ActiveTrade {
  id: string;
  asset: string;
  type: 'call' | 'put';
  entryPrice: number;
  amount: number;
  payoutPct: number;
  durationSec: number;
  startTime: number;
  endTime: number;
  status: 'active' | 'won' | 'lost';
  profit: number;
}

export interface ChartCandle {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface BrokerChartProps {
  assetSymbol: string;
  assetName: string;
  currentPrice: number;
  payoutPct: number;
  activeTrades: ActiveTrade[];
  onPriceTick: (newPrice: number) => void;
  onOpenAssetPicker: () => void;
}

export const BrokerChart: React.FC<BrokerChartProps> = ({
  assetSymbol,
  assetName,
  currentPrice,
  payoutPct,
  activeTrades,
  onPriceTick,
  onOpenAssetPicker
}) => {
  const [chartType, setChartType] = useState<'candles' | 'area'>('candles');
  const [timeframe, setTimeframe] = useState<'5s' | '15s' | '1m' | '5m'>('5s');
  const [showIndicators, setShowIndicators] = useState(true);
  const [showSMA, setShowSMA] = useState(true);
  const [showBollinger, setShowBollinger] = useState(true);

  // Candles history buffer
  const [candles, setCandles] = useState<ChartCandle[]>(() => {
    const list: ChartCandle[] = [];
    const count = 45;
    let base = currentPrice;
    const now = Date.now();
    const step = 5000;

    for (let i = count; i >= 0; i--) {
      const t = now - i * step;
      const delta = (Math.random() - 0.49) * 0.45;
      const open = base;
      const close = Math.round((open + delta) * 100) / 100;
      const high = Math.round((Math.max(open, close) + Math.random() * 0.3) * 100) / 100;
      const low = Math.round((Math.min(open, close) - Math.random() * 0.3) * 100) / 100;
      const volume = Math.floor(Math.random() * 100) + 20;
      list.push({ time: t, open, high, low, close, volume });
      base = close;
    }
    return list;
  });

  // High-frequency live tick generator (every 800ms)
  useEffect(() => {
    const interval = setInterval(() => {
      setCandles(prev => {
        if (!prev.length) return prev;
        const last = { ...prev[prev.length - 1] };
        const now = Date.now();
        const duration = timeframe === '5s' ? 5000 : timeframe === '15s' ? 15000 : timeframe === '1m' ? 60000 : 300000;
        
        // Realistic micro fluctuation
        const tick = (Math.random() - 0.495) * 0.22;
        const newClose = Math.round((last.close + tick) * 100) / 100;
        const newHigh = Math.max(last.high, newClose);
        const newLow = Math.min(last.low, newClose);

        onPriceTick(newClose);

        // Check if candle period expired -> start new candle
        if (now - last.time > duration) {
          const newCandle: ChartCandle = {
            time: now,
            open: newClose,
            high: newClose,
            low: newClose,
            close: newClose,
            volume: 1
          };
          return [...prev.slice(1), newCandle];
        } else {
          const updatedLast = {
            ...last,
            high: newHigh,
            low: newLow,
            close: newClose,
            volume: last.volume + 1
          };
          return [...prev.slice(0, -1), updatedLast];
        }
      });
    }, 850);

    return () => clearInterval(interval);
  }, [timeframe, onPriceTick]);

  // Chart coordinate calculations
  const chartHeight = 420;
  const paddingY = 35;

  let minP = Infinity;
  let maxP = -Infinity;
  candles.forEach(c => {
    if (c.low < minP) minP = c.low;
    if (c.high > maxP) maxP = c.high;
  });
  // Include active trades in range so they don't clip
  activeTrades.forEach(t => {
    if (t.entryPrice < minP) minP = t.entryPrice;
    if (t.entryPrice > maxP) maxP = t.entryPrice;
  });
  const margin = (maxP - minP) * 0.15 || 1.5;
  const minPrice = minP - margin;
  const maxPrice = maxP + margin;
  const priceRange = maxPrice - minPrice || 1;

  const getY = (price: number) => {
    const norm = (price - minPrice) / priceRange;
    return chartHeight - paddingY - norm * (chartHeight - paddingY * 2);
  };

  const candleWidth = 600 / Math.max(candles.length, 1);
  const lastCandle = candles[candles.length - 1] || { close: currentPrice, open: currentPrice };
  const currentY = getY(currentPrice);
  const isRising = lastCandle.close >= lastCandle.open;

  // Simple Moving Average (SMA 14)
  const smaPoints = candles.map((c, i) => {
    const period = 14;
    const slice = candles.slice(Math.max(0, i - period + 1), i + 1);
    const avg = slice.reduce((acc, curr) => acc + curr.close, 0) / slice.length;
    return `${i * candleWidth + candleWidth / 2},${getY(avg)}`;
  }).join(' ');

  // Sentiment ratio
  const buyerPercent = Math.min(Math.max(Math.round((lastCandle.close / (maxPrice || 1)) * 100 - 30), 45), 82);
  const sellerPercent = 100 - buyerPercent;

  return (
    <div className="flex-1 flex flex-col bg-[#070b14] border border-slate-800/80 rounded-2xl overflow-hidden shadow-2xl relative select-none">
      {/* Top Chart Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 bg-[#0a101f] border-b border-slate-800/80 z-10">
        {/* Asset Selector Dropdown Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenAssetPicker}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-white font-bold text-xs sm:text-sm transition-all cursor-pointer shadow-md group"
          >
            <div className="w-5 h-5 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-black text-[10px]">
              🪙
            </div>
            <div className="text-left">
              <span className="block font-black text-white leading-none font-mono">{assetSymbol}</span>
              <span className="text-[10px] text-slate-400 font-normal leading-none">{assetName}</span>
            </div>
            <div className="flex items-center gap-1.5 ml-1">
              <span className="bg-emerald-500/20 text-emerald-400 font-mono font-black text-xs px-1.5 py-0.5 rounded">
                +{payoutPct}%
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-transform" />
            </div>
          </button>

          {/* Current Live Price Display */}
          <div className="hidden sm:flex items-baseline gap-2 font-mono pl-2">
            <span className={`text-base sm:text-lg font-black tracking-tight ${isRising ? 'text-emerald-400' : 'text-rose-400'}`}>
              ${currentPrice.toFixed(2)}
            </span>
            <span className="text-[11px] text-slate-400">
              {isRising ? '▲' : '▼'}
            </span>
          </div>
        </div>

        {/* Chart View Toggles & Timeframe Controls */}
        <div className="flex items-center gap-2">
          {/* Chart Type */}
          <div className="flex items-center bg-slate-900/90 p-0.5 rounded-lg border border-slate-800">
            <button
              onClick={() => setChartType('candles')}
              className={`px-2 py-1 text-xs font-bold rounded-md transition-all ${
                chartType === 'candles' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
              title="Velas Japonesas"
            >
              Velas
            </button>
            <button
              onClick={() => setChartType('area')}
              className={`px-2 py-1 text-xs font-bold rounded-md transition-all ${
                chartType === 'area' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
              }`}
              title="Gráfico de Área"
            >
              Área
            </button>
          </div>

          {/* Timeframe */}
          <div className="flex items-center bg-slate-900/90 p-0.5 rounded-lg border border-slate-800">
            {(['5s', '15s', '1m', '5m'] as const).map(tf => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-2 py-1 text-xs font-bold rounded-md transition-all ${
                  timeframe === tf ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          {/* Indicators Toggle */}
          <button
            onClick={() => setShowSMA(!showSMA)}
            className={`px-2.5 py-1 text-xs font-bold rounded-lg border transition-all flex items-center gap-1 ${
              showSMA
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">SMA 14</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Chart Area */}
      <div className="relative flex-1 w-full min-h-[380px] bg-[#060a12] overflow-hidden">
        {/* Horizontal Price Grid Lines */}
        <div className="absolute inset-0 pointer-events-none flex flex-col justify-between py-6 px-3 text-[10px] font-mono text-slate-600">
          {[0, 1, 2, 3, 4].map(idx => {
            const p = maxPrice - (idx * (maxPrice - minPrice)) / 4;
            return (
              <div key={idx} className="flex justify-between items-center border-b border-slate-800/30 w-full pb-0.5">
                <span className="text-slate-600/80 font-mono">${p.toFixed(2)}</span>
                <span className="text-slate-700/30">--------------------------------</span>
              </div>
            );
          })}
        </div>

        {/* Live Sentiment Gauge on Left Margin */}
        <div className="absolute left-3 top-4 z-10 hidden sm:flex flex-col items-center gap-1 bg-slate-950/80 p-2 rounded-xl border border-slate-800/80 backdrop-blur-sm text-[10px] font-mono">
          <span className="text-emerald-400 font-bold">{buyerPercent}%</span>
          <div className="w-1.5 h-20 bg-slate-800 rounded-full overflow-hidden flex flex-col justify-end">
            <div 
              className="w-full bg-emerald-500 transition-all duration-500" 
              style={{ height: `${buyerPercent}%` }}
            />
          </div>
          <span className="text-rose-400 font-bold">{sellerPercent}%</span>
          <span className="text-[8px] text-slate-500 uppercase mt-0.5">Sentimiento</span>
        </div>

        {/* SVG Render for Candles, Area, SMA, and Active Trade Markers */}
        <svg
          viewBox={`0 0 ${600} ${chartHeight}`}
          preserveAspectRatio="none"
          className="w-full h-full"
        >
          {/* Gradient definitions */}
          <defs>
            <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="greenGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Area Mode Plot */}
          {chartType === 'area' && (
            <g>
              <polygon
                fill="url(#areaGrad)"
                points={`0,${chartHeight} ${candles.map((c, i) => `${i * candleWidth + candleWidth / 2},${getY(c.close)}`).join(' ')} ${600},${chartHeight}`}
              />
              <polyline
                fill="none"
                stroke="#f59e0b"
                strokeWidth="2"
                points={candles.map((c, i) => `${i * candleWidth + candleWidth / 2},${getY(c.close)}`).join(' ')}
              />
            </g>
          )}

          {/* SMA 14 Line */}
          {showSMA && (
            <polyline
              fill="none"
              stroke="#38bdf8"
              strokeWidth="1.5"
              strokeDasharray="4 2"
              opacity="0.8"
              points={smaPoints}
            />
          )}

          {/* Candles Plot */}
          {chartType === 'candles' && candles.map((c, i) => {
            const x = i * candleWidth + candleWidth / 2;
            const openY = getY(c.open);
            const closeY = getY(c.close);
            const highY = getY(c.high);
            const lowY = getY(c.low);
            const green = c.close >= c.open;
            const color = green ? '#10b981' : '#f43f5e';
            const bodyY = Math.min(openY, closeY);
            const bodyH = Math.max(Math.abs(openY - closeY), 2);
            const w = Math.max(candleWidth * 0.7, 3);

            return (
              <g key={i}>
                {/* Wick */}
                <line
                  x1={x}
                  y1={highY}
                  x2={x}
                  y2={lowY}
                  stroke={color}
                  strokeWidth="1.2"
                />
                {/* Body */}
                <rect
                  x={x - w / 2}
                  y={bodyY}
                  width={w}
                  height={bodyH}
                  fill={color}
                  rx="1"
                />
              </g>
            );
          })}

          {/* ACTIVE TRADES RENDERED ON CHART */}
          {activeTrades.map(trade => {
            const tradeY = getY(trade.entryPrice);
            const isCall = trade.type === 'call';
            const winning = isCall ? currentPrice >= trade.entryPrice : currentPrice <= trade.entryPrice;

            return (
              <g key={trade.id}>
                {/* Dotted horizontal entry line */}
                <line
                  x1="0"
                  y1={tradeY}
                  x2="600"
                  y2={tradeY}
                  stroke={isCall ? '#10b981' : '#f43f5e'}
                  strokeWidth="1.5"
                  strokeDasharray="5 3"
                />
                {/* Badge on left/center */}
                <rect
                  x="80"
                  y={tradeY - 12}
                  width="110"
                  height="22"
                  rx="6"
                  fill={isCall ? '#064e3b' : '#881337'}
                  stroke={isCall ? '#10b981' : '#f43f5e'}
                  strokeWidth="1"
                />
                <text
                  x="135"
                  y={tradeY + 3}
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize="10"
                  fontWeight="bold"
                  fontFamily="monospace"
                >
                  {isCall ? '▲ CALL' : '▼ PUT'} ${trade.amount}
                </text>
              </g>
            );
          })}

          {/* Current Live Laser Price Line */}
          <line
            x1="0"
            y1={currentY}
            x2="600"
            y2={currentY}
            stroke={isRising ? '#10b981' : '#f43f5e'}
            strokeWidth="1.2"
            strokeDasharray="3 3"
            opacity="0.9"
          />

          {/* Pulsing Live Dot at the latest point */}
          <circle
            cx={600 - candleWidth / 2}
            cy={currentY}
            r="4"
            fill={isRising ? '#10b981' : '#f43f5e'}
            className="animate-pulse"
          />
        </svg>

        {/* Live Floating Price Beacon Tag on Right Edge */}
        <div
          className={`absolute right-1 text-xs font-black font-mono px-2 py-0.5 rounded-lg shadow-xl pointer-events-none transition-all duration-200 border flex items-center gap-1 ${
            isRising
              ? 'bg-emerald-500 text-slate-950 border-emerald-300'
              : 'bg-rose-600 text-white border-rose-400'
          }`}
          style={{
            top: `${Math.min(Math.max(currentY - 12, 10), chartHeight - 35)}px`,
          }}
        >
          <span>${currentPrice.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};
