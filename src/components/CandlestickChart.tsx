import React, { useState, useEffect, useMemo, useRef } from 'react';
import { TrendingUp, BarChart2, Eye, Activity, Maximize2 } from 'lucide-react';

export interface Candle {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

interface CandlestickChartProps {
  currentPrice: number;
  onPriceTick?: (price: number) => void;
}

export const CandlestickChart: React.FC<CandlestickChartProps> = ({ currentPrice, onPriceTick }) => {
  const [timeframe, setTimeframe] = useState<'1m' | '5m' | '15m' | '1h'>('1m');
  const [showEMA20, setShowEMA20] = useState(true);
  const [showEMA50, setShowEMA50] = useState(true);
  const [showLevels, setShowLevels] = useState(true);
  const [showVolume, setShowVolume] = useState(true);
  const [useTradingView, setUseTradingView] = useState(false);
  const [hoveredCandle, setHoveredCandle] = useState<Candle | null>(null);

  // Generate initial historical candles based on currentPrice (~3890 USD range)
  const [candles, setCandles] = useState<Candle[]>(() => {
    const list: Candle[] = [];
    const count = 35;
    let base = currentPrice || 3892.38;
    const now = Date.now();

    for (let i = count; i >= 0; i--) {
      const d = new Date(now - i * 60 * 1000);
      const timeStr = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const change = (Math.random() - 0.48) * 3.5;
      const open = base;
      const close = Math.round((open + change) * 100) / 100;
      const high = Math.round((Math.max(open, close) + Math.random() * 2.2) * 100) / 100;
      const low = Math.round((Math.min(open, close) - Math.random() * 2.2) * 100) / 100;
      const volume = Math.floor(Math.random() * 80) + 20;

      list.push({ time: timeStr, open, high, low, close, volume });
      base = close;
    }
    return list;
  });

  // Live simulation tick every 2 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCandles(prev => {
        if (!prev.length) return prev;
        const last = { ...prev[prev.length - 1] };
        const tickDelta = (Math.random() - 0.49) * 0.45;
        const newClose = Math.round((last.close + tickDelta) * 100) / 100;
        const newHigh = Math.max(last.high, newClose);
        const newLow = Math.min(last.low, newClose);
        const newVol = last.volume + 1;

        if (onPriceTick) {
          onPriceTick(newClose);
        }

        // Keep last 35 candles
        const updated = [...prev.slice(0, -1), { ...last, high: newHigh, low: newLow, close: newClose, volume: newVol }];
        return updated;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [onPriceTick]);

  // Chart dimensions & scaling
  const chartHeight = 280;
  const volumeHeight = 50;
  const totalSvgHeight = 350;
  const paddingY = 25;

  const { minPrice, maxPrice, priceRange } = useMemo(() => {
    let min = Infinity;
    let max = -Infinity;
    candles.forEach(c => {
      if (c.low < min) min = c.low;
      if (c.high > max) max = c.high;
    });
    // Add margin
    const margin = (max - min) * 0.1 || 5;
    return {
      minPrice: Math.floor(min - margin),
      maxPrice: Math.ceil(max + margin),
      priceRange: (max + margin) - (min - margin) || 1,
    };
  }, [candles]);

  const maxVolume = useMemo(() => {
    return Math.max(...candles.map(c => c.volume), 100);
  }, [candles]);

  const getY = (val: number) => {
    const norm = (val - minPrice) / priceRange;
    return chartHeight - paddingY - norm * (chartHeight - paddingY * 2);
  };

  // EMA Calculations
  const ema20Points = useMemo(() => {
    const k = 2 / (20 + 1);
    let ema = candles[0]?.close || 0;
    return candles.map((c, i) => {
      ema = c.close * k + ema * (1 - k);
      return { x: i, y: getY(ema) };
    });
  }, [candles, minPrice, priceRange]);

  const ema50Points = useMemo(() => {
    const k = 2 / (50 + 1);
    let ema = candles[0]?.close || 0;
    return candles.map((c, i) => {
      ema = c.close * k + ema * (1 - k);
      return { x: i, y: getY(ema) };
    });
  }, [candles, minPrice, priceRange]);

  const lastCandle = candles[candles.length - 1] || { open: 0, high: 0, low: 0, close: 0, volume: 0, time: '' };
  const displayCandle = hoveredCandle || lastCandle;
  const isBullish = displayCandle.close >= displayCandle.open;

  // Support and resistance fixed levels around current range
  const supportLevel = 3875.00;
  const resistanceLevel = 3971.00;

  return (
    <div className="bg-[#0b1220] border border-slate-800/80 rounded-2xl overflow-hidden shadow-2xl space-y-3 p-4">
      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/60 pb-3">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></div>
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4 text-amber-400" />
            Gráficos de velas
          </h3>
          <span className="text-[10px] text-slate-400 bg-slate-800/60 px-2 py-0.5 rounded-md font-mono">
            XAU/USD
          </span>
        </div>

        {/* View toggles & Timeframes */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-slate-900/90 p-0.5 rounded-lg border border-slate-800">
            {(['1m', '5m', '15m', '1h'] as const).map(tf => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-md transition-all ${
                  timeframe === tf
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          <button
            onClick={() => setUseTradingView(!useTradingView)}
            className={`px-2.5 py-1 text-[11px] font-bold rounded-lg border flex items-center gap-1 transition-all ${
              useTradingView
                ? 'bg-blue-600/20 text-blue-400 border-blue-500/30'
                : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
            }`}
            title="Alternar entre motor nativo y widget oficial TradingView"
          >
            <Activity className="w-3.5 h-3.5" />
            {useTradingView ? 'TradingView' : 'Velas Pro'}
          </button>
        </div>
      </div>

      {/* OHLC Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs font-mono bg-slate-950/60 p-2.5 rounded-xl border border-slate-800/60">
        <div className="flex flex-wrap items-center gap-4 text-slate-300">
          <span>O: <strong className="text-white">${displayCandle.open.toFixed(2)}</strong></span>
          <span>H: <strong className="text-emerald-400">${displayCandle.high.toFixed(2)}</strong></span>
          <span>L: <strong className="text-red-400">${displayCandle.low.toFixed(2)}</strong></span>
          <span>C: <strong className={isBullish ? 'text-emerald-400' : 'text-red-400'}>${displayCandle.close.toFixed(2)}</strong></span>
          <span>Vol: <strong className="text-slate-400">{displayCandle.volume}</strong></span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-slate-400">Precio Actual:</span>
          <span className={`px-2 py-0.5 rounded font-black text-xs ${
            isBullish ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-red-500/20 text-red-300 border border-red-500/30'
          }`}>
            ${displayCandle.close.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Main Chart Area */}
      {useTradingView ? (
        <div className="h-[360px] w-full rounded-xl overflow-hidden bg-black border border-slate-800">
          <iframe
            src="https://s.tradingview.com/widgetembed/?frameElementId=tradingview_widget&symbol=OANDA%3AXAUUSD&interval=60&hidesidetoolbar=0&symboledit=1&saveimage=1&toolbarbg=070c14&studies=%5B%5D&theme=dark&style=1&timezone=Etc%2FUTC&studies_overrides=%7B%7D&overrides=%7B%7D&enabled_features=%5B%5D&disabled_features=%5B%5D&locale=es"
            className="w-full h-full border-0"
            title="TradingView XAUUSD"
          />
        </div>
      ) : (
        <div className="relative w-full h-[350px] bg-[#070d19] rounded-xl overflow-hidden border border-slate-900 select-none">
          {/* Price scale grid lines */}
          <div className="absolute inset-0 pointer-events-none flex flex-col justify-between py-6 px-2 text-[10px] font-mono text-slate-600">
            {[0, 1, 2, 3, 4].map(idx => {
              const p = maxPrice - (idx * (maxPrice - minPrice)) / 4;
              return (
                <div key={idx} className="flex justify-between items-center border-b border-slate-800/40 w-full pb-1">
                  <span className="text-slate-500">${p.toFixed(2)}</span>
                  <span className="text-slate-700 opacity-40">--------------------------------</span>
                </div>
              );
            })}
          </div>

          {/* SVG Rendering Candlesticks & Technical Overlays */}
          <svg
            viewBox={`0 0 ${candles.length * 20} ${totalSvgHeight}`}
            preserveAspectRatio="none"
            className="w-full h-full cursor-crosshair"
          >
            {/* Resistance level */}
            {showLevels && resistanceLevel >= minPrice && resistanceLevel <= maxPrice && (
              <g>
                <line
                  x1="0"
                  y1={getY(resistanceLevel)}
                  x2={candles.length * 20}
                  y2={getY(resistanceLevel)}
                  stroke="#ef4444"
                  strokeWidth="1.2"
                  strokeDasharray="4 4"
                  opacity="0.8"
                />
                <text x="5" y={getY(resistanceLevel) - 4} fill="#ef4444" fontSize="9" fontFamily="monospace" fontWeight="bold">
                  RESISTENCIA ${resistanceLevel.toFixed(2)}
                </text>
              </g>
            )}

            {/* Support level */}
            {showLevels && supportLevel >= minPrice && supportLevel <= maxPrice && (
              <g>
                <line
                  x1="0"
                  y1={getY(supportLevel)}
                  x2={candles.length * 20}
                  y2={getY(supportLevel)}
                  stroke="#10b981"
                  strokeWidth="1.2"
                  strokeDasharray="4 4"
                  opacity="0.8"
                />
                <text x="5" y={getY(supportLevel) - 4} fill="#10b981" fontSize="9" fontFamily="monospace" fontWeight="bold">
                  SOPORTE CLAVE ${supportLevel.toFixed(2)}
                </text>
              </g>
            )}

            {/* EMA 50 line */}
            {showEMA50 && ema50Points.length > 1 && (
              <polyline
                fill="none"
                stroke="#38bdf8"
                strokeWidth="1.5"
                opacity="0.75"
                points={ema50Points.map(p => `${p.x * 20 + 10},${p.y}`).join(' ')}
              />
            )}

            {/* EMA 20 line */}
            {showEMA20 && ema20Points.length > 1 && (
              <polyline
                fill="none"
                stroke="#f59e0b"
                strokeWidth="1.8"
                opacity="0.9"
                points={ema20Points.map(p => `${p.x * 20 + 10},${p.y}`).join(' ')}
              />
            )}

            {/* Current Price horizontal marker */}
            <line
              x1="0"
              y1={getY(lastCandle.close)}
              x2={candles.length * 20}
              y2={getY(lastCandle.close)}
              stroke={isBullish ? '#10b981' : '#ef4444'}
              strokeWidth="1"
              strokeDasharray="3 3"
              opacity="0.85"
            />

            {/* Candles and Volumes */}
            {candles.map((c, i) => {
              const x = i * 20 + 10;
              const openY = getY(c.open);
              const closeY = getY(c.close);
              const highY = getY(c.high);
              const lowY = getY(c.low);
              const green = c.close >= c.open;
              const color = green ? '#10b981' : '#ef4444';
              const bodyTop = Math.min(openY, closeY);
              const bodyHeight = Math.max(Math.abs(openY - closeY), 2);

              // Volume bar at bottom
              const volBarH = (c.volume / maxVolume) * volumeHeight;
              const volY = totalSvgHeight - volBarH - 5;

              return (
                <g
                  key={i}
                  onMouseEnter={() => setHoveredCandle(c)}
                  onMouseLeave={() => setHoveredCandle(null)}
                  className="transition-opacity hover:opacity-80"
                >
                  {/* Volume bar */}
                  {showVolume && (
                    <rect
                      x={x - 4}
                      y={volY}
                      width="8"
                      height={volBarH}
                      fill={color}
                      opacity={green ? "0.35" : "0.25"}
                      rx="1"
                    />
                  )}

                  {/* Wick */}
                  <line
                    x1={x}
                    y1={highY}
                    x2={x}
                    y2={lowY}
                    stroke={color}
                    strokeWidth="1.2"
                  />

                  {/* Candle Body */}
                  <rect
                    x={x - 5.5}
                    y={bodyTop}
                    width="11"
                    height={bodyHeight}
                    fill={color}
                    rx="1"
                  />
                </g>
              );
            })}
          </svg>

          {/* Floating current price pill on right edge */}
          <div
            className={`absolute right-1 text-[10px] font-bold font-mono px-1.5 py-0.5 rounded shadow pointer-events-none transition-all ${
              isBullish ? 'bg-emerald-500 text-slate-950' : 'bg-red-500 text-white'
            }`}
            style={{
              top: `${Math.min(Math.max(getY(lastCandle.close) - 10, 10), 320)}px`,
            }}
          >
            ${lastCandle.close.toFixed(2)}
          </div>
        </div>
      )}

      {/* Chart Footer Indicator Toggles */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-400 pt-1 border-t border-slate-800/40">
        <div className="flex flex-wrap items-center gap-4">
          <label className="flex items-center gap-1.5 cursor-pointer hover:text-slate-200">
            <input
              type="checkbox"
              checked={showEMA20}
              onChange={e => setShowEMA20(e.target.checked)}
              className="accent-amber-500 rounded"
            />
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-0.5 bg-amber-500"></span>
              EMA 20
            </span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer hover:text-slate-200">
            <input
              type="checkbox"
              checked={showEMA50}
              onChange={e => setShowEMA50(e.target.checked)}
              className="accent-sky-400 rounded"
            />
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-0.5 bg-sky-400"></span>
              EMA 50
            </span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer hover:text-slate-200">
            <input
              type="checkbox"
              checked={showLevels}
              onChange={e => setShowLevels(e.target.checked)}
              className="accent-emerald-400 rounded"
            />
            <span>Soporte / Resistencia</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer hover:text-slate-200">
            <input
              type="checkbox"
              checked={showVolume}
              onChange={e => setShowVolume(e.target.checked)}
              className="accent-slate-400 rounded"
            />
            <span>Volumen</span>
          </label>
        </div>

        <div className="text-[10px] text-slate-500 flex items-center gap-1">
          <BarChart2 className="w-3 h-3 text-slate-400" />
          <span>Fuente: XAU/USD Tiempo Real</span>
        </div>
      </div>
    </div>
  );
};
