import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  ChevronDown, 
  Maximize2, 
  Minimize2,
  BarChart2, 
  TrendingUp, 
  TrendingDown,
  Layers, 
  X,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Ruler,
  Brush,
  Eye,
  EyeOff,
  Trash2,
  Sliders,
  Settings2,
  Check,
  Percent,
  Clock,
  Calendar,
  Square,
  Minus
} from 'lucide-react';
import { XmDrawingToolsSheet, ChartToolType } from './XmDrawingToolsSheet';
import { XmIntervalSheet } from './XmIntervalSheet';

export interface MarkedOrder {
  id: string;
  candleIndex: number;
  price: number;
  x: number;
  y: number;
  type: 'buy' | 'sell';
  time: string;
}

export interface ChartDrawingItem {
  id: string;
  type: ChartToolType;
  points: Array<{ x: number; y: number; price: number; candleIndex: number }>;
  color?: string;
  label?: string;
  rrRatio?: number;
}

export interface XmTradingViewProps {
  assetSymbol: string;
  assetName: string;
  currentPrice: number;
  onOpenAssetPicker: () => void;
  onOpenOrderModal: (type: 'buy' | 'sell') => void;
  activePositionsCount: number;
}

export const XmTradingView: React.FC<XmTradingViewProps> = ({
  assetSymbol,
  assetName,
  currentPrice,
  onOpenAssetPicker,
  onOpenOrderModal,
  activePositionsCount
}) => {
  // Timeframe and interval state
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>('1H');
  const [currentRange, setCurrentRange] = useState<string>('1D');
  const [isIntervalSheetOpen, setIsIntervalSheetOpen] = useState(false);

  // Drawing tools modal state
  const [isDrawingSheetOpen, setIsDrawingSheetOpen] = useState(false);
  const [activeTool, setActiveTool] = useState<ChartToolType>('cursor');
  const [drawings, setDrawings] = useState<ChartDrawingItem[]>([]);
  const [isDrawingsHidden, setIsDrawingsHidden] = useState(false);
  const [isDrawingsLocked, setIsDrawingsLocked] = useState(false);
  const [tempDrawingPoints, setTempDrawingPoints] = useState<Array<{ x: number; y: number; price: number; candleIndex: number }>>([]);

  // Technical indicators toggles
  const [showEMA, setShowEMA] = useState(true);
  const [showBollinger, setShowBollinger] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Zoom and Pan states
  const [visibleCandlesCount, setVisibleCandlesCount] = useState<number>(38); // Zoom level
  const [panIndex, setPanIndex] = useState<number>(0); // Horizontal pan offset

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Candles data
  const [candles, setCandles] = useState<Array<{ open: number; high: number; low: number; close: number; time?: string }>>([]);

  // Marked points on candles by long-press
  const [activeCrosshair, setActiveCrosshair] = useState<{ x: number; y: number; price: number; candleIndex: number } | null>(null);
  const [markedOrders, setMarkedOrders] = useState<MarkedOrder[]>([]);
  const [showOrderPopup, setShowOrderPopup] = useState<boolean>(false);

  // Long press & touch tracking refs
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const touchStartPos = useRef<{ x: number; y: number } | null>(null);
  const pinchStartDist = useRef<number | null>(null);
  const isDraggingPan = useRef<boolean>(false);
  const lastPanTouchX = useRef<number | null>(null);

  // Generate realistic candles based on asset and interval
  useEffect(() => {
    const list = [];
    let base = currentPrice - 9.0;
    const count = 120; // Generate 120 historical candles for deep zooming & panning!
    for (let i = 0; i < count; i++) {
      const open = base;
      const change = (Math.random() - 0.492) * 2.8;
      const close = open + change;
      const high = Math.max(open, close) + Math.random() * 2.2;
      const low = Math.min(open, close) - Math.random() * 2.2;
      list.push({ open, high, low, close });
      base = close;
    }
    setCandles(list);
    setPanIndex(0);
    setActiveCrosshair(null);
  }, [assetSymbol, selectedTimeframe]);

  // Realtime tick updating latest candle
  useEffect(() => {
    if (candles.length === 0) return;
    setCandles(prev => {
      if (prev.length === 0) return prev;
      const copy = [...prev];
      const last = { ...copy[copy.length - 1] };
      last.close = currentPrice;
      if (currentPrice > last.high) last.high = currentPrice;
      if (currentPrice < last.low) last.low = currentPrice;
      copy[copy.length - 1] = last;
      return copy;
    });
  }, [currentPrice]);

  // Zoom controls
  const handleZoomIn = () => {
    setVisibleCandlesCount(prev => Math.max(12, prev - 6));
  };

  const handleZoomOut = () => {
    setVisibleCandlesCount(prev => Math.min(95, prev + 6));
  };

  const handleResetZoom = () => {
    setVisibleCandlesCount(38);
    setPanIndex(0);
  };

  // Canvas drawing effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || candles.length === 0) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;

    ctx.clearRect(0, 0, w, h);

    // Compute visible slice based on zoom and pan
    const totalCount = candles.length;
    const endIndex = Math.min(totalCount, totalCount - panIndex);
    const startIndex = Math.max(0, endIndex - visibleCandlesCount);
    const visibleCandles = candles.slice(startIndex, endIndex);

    if (visibleCandles.length === 0) return;

    // Grid lines
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 1;
    for (let y = 20; y < h; y += 40) {
      ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
    }
    for (let x = 40; x < w; x += 65) {
      ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
    }

    // Min and Max prices in visible range
    let minP = Infinity;
    let maxP = -Infinity;
    visibleCandles.forEach(c => {
      if (c.low < minP) minP = c.low;
      if (c.high > maxP) maxP = c.high;
    });
    markedOrders.forEach(m => {
      if (m.price < minP) minP = m.price;
      if (m.price > maxP) maxP = m.price;
    });
    drawings.forEach(d => {
      d.points.forEach(p => {
        if (p.price < minP) minP = p.price;
        if (p.price > maxP) maxP = p.price;
      });
    });

    const pad = (maxP - minP) * 0.12 || 1;
    minP -= pad;
    maxP += pad;

    const getY = (val: number) => h - ((val - minP) / (maxP - minP)) * (h - 35) - 20;
    const candleWidth = Math.max(3, Math.floor((w - 70) / visibleCandles.length - 2));
    const stepX = (w - 70) / visibleCandles.length;

    // Optional: Draw Technical Indicators (EMA 20 & EMA 50)
    if (showEMA) {
      // EMA 20
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      visibleCandles.forEach((c, i) => {
        const x = i * stepX + 8 + candleWidth / 2;
        const avg = (c.open + c.close + c.high + c.low) / 4;
        const y = getY(avg);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();

      // EMA 50
      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      visibleCandles.forEach((c, i) => {
        const x = i * stepX + 8 + candleWidth / 2;
        const avg50 = ((c.open + c.close) / 2) - 0.45;
        const y = getY(avg50);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
    }

    // Optional: Bollinger Bands
    if (showBollinger) {
      ctx.strokeStyle = 'rgba(168, 85, 247, 0.4)';
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 2]);
      ctx.beginPath();
      visibleCandles.forEach((c, i) => {
        const x = i * stepX + 8 + candleWidth / 2;
        const y = getY(c.high + 1.2);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
      ctx.beginPath();
      visibleCandles.forEach((c, i) => {
        const x = i * stepX + 8 + candleWidth / 2;
        const y = getY(c.low - 1.2);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      });
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Draw Candlesticks
    visibleCandles.forEach((c, i) => {
      const x = i * stepX + 8;
      const isUp = c.close >= c.open;
      const color = isUp ? '#10b981' : '#f43f5e';

      // Wick
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(x + candleWidth / 2, getY(c.high));
      ctx.lineTo(x + candleWidth / 2, getY(c.low));
      ctx.stroke();

      // Body
      const top = getY(Math.max(c.open, c.close));
      const bot = getY(Math.min(c.open, c.close));
      const bodyH = Math.max(2, bot - top);
      ctx.fillStyle = color;
      ctx.fillRect(x, top, candleWidth, bodyH);
    });

    // Draw Drawings (if not hidden)
    if (!isDrawingsHidden) {
      drawings.forEach(d => {
        if (d.type === 'horizontal_line') {
          const p = d.points[0];
          if (!p) return;
          const lineY = getY(p.price);
          ctx.strokeStyle = d.color || '#38bdf8';
          ctx.lineWidth = 2;
          ctx.setLineDash([5, 3]);
          ctx.beginPath(); ctx.moveTo(0, lineY); ctx.lineTo(w - 70, lineY); ctx.stroke();
          ctx.setLineDash([]);
          // Tag
          ctx.fillStyle = '#0284c7';
          ctx.fillRect(w - 72, lineY - 10, 70, 20);
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 10px monospace';
          ctx.fillText(`$${p.price.toFixed(2)}`, w - 68, lineY + 4);
        }

        else if (d.type === 'trendline' || d.type === 'ray') {
          if (d.points.length >= 2) {
            const p1 = d.points[0];
            const p2 = d.points[1];
            const y1 = getY(p1.price);
            const y2 = getY(p2.price);
            const x1 = (p1.candleIndex - startIndex) * stepX + 8 + candleWidth / 2;
            const x2 = (p2.candleIndex - startIndex) * stepX + 8 + candleWidth / 2;

            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(d.type === 'ray' ? w - 70 : x2, d.type === 'ray' ? y2 + (y2 - y1) : y2);
            ctx.stroke();

            // End circles
            ctx.fillStyle = '#38bdf8';
            ctx.beginPath(); ctx.arc(x1, y1, 4, 0, Math.PI * 2); ctx.fill();
            ctx.beginPath(); ctx.arc(x2, y2, 4, 0, Math.PI * 2); ctx.fill();
          }
        }

        else if (d.type === 'rectangle') {
          if (d.points.length >= 2) {
            const p1 = d.points[0];
            const p2 = d.points[1];
            const yTop = getY(Math.max(p1.price, p2.price));
            const yBot = getY(Math.min(p1.price, p2.price));
            const x1 = Math.min(p1.x, p2.x);
            const x2 = Math.max(p1.x, p2.x);

            ctx.fillStyle = 'rgba(245, 158, 11, 0.15)';
            ctx.fillRect(x1, yTop, x2 - x1, yBot - yTop);
            ctx.strokeStyle = '#f59e0b';
            ctx.lineWidth = 1.5;
            ctx.strokeRect(x1, yTop, x2 - x1, yBot - yTop);

            ctx.fillStyle = '#fbbf24';
            ctx.font = 'bold 9px sans-serif';
            ctx.fillText('ZONA OFERTA/DEMANDA', x1 + 5, yTop + 12);
          }
        }

        else if (d.type === 'long_position' || d.type === 'short_position') {
          const isLong = d.type === 'long_position';
          const p = d.points[0];
          if (!p) return;
          const entryY = getY(p.price);
          const tpPrice = isLong ? p.price + 4.5 : p.price - 4.5;
          const slPrice = isLong ? p.price - 2.0 : p.price + 2.0;
          const tpY = getY(tpPrice);
          const slY = getY(slPrice);

          const boxX = Math.max(10, p.x - 30);
          const boxW = 120;

          // Green Target Zone (Profit)
          ctx.fillStyle = 'rgba(16, 185, 129, 0.22)';
          ctx.fillRect(boxX, Math.min(entryY, tpY), boxW, Math.abs(tpY - entryY));
          ctx.strokeStyle = '#10b981';
          ctx.strokeRect(boxX, Math.min(entryY, tpY), boxW, Math.abs(tpY - entryY));

          // Red Stop Zone (Loss)
          ctx.fillStyle = 'rgba(244, 63, 94, 0.22)';
          ctx.fillRect(boxX, Math.min(entryY, slY), boxW, Math.abs(slY - entryY));
          ctx.strokeStyle = '#f43f5e';
          ctx.strokeRect(boxX, Math.min(entryY, slY), boxW, Math.abs(slY - entryY));

          // Entry line
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1.5;
          ctx.beginPath(); ctx.moveTo(boxX, entryY); ctx.lineTo(boxX + boxW, entryY); ctx.stroke();

          // Ratio badge
          ctx.fillStyle = isLong ? '#10b981' : '#f43f5e';
          ctx.fillRect(boxX + 5, entryY - 9, 65, 18);
          ctx.fillStyle = '#060a12';
          ctx.font = 'bold 9px monospace';
          ctx.fillText(`R:R 2.25 ${isLong ? 'LONG' : 'SHORT'}`, boxX + 8, entryY + 3);
        }

        else if (d.type === 'fibonacci') {
          if (d.points.length >= 2) {
            const highP = Math.max(d.points[0].price, d.points[1].price);
            const lowP = Math.min(d.points[0].price, d.points[1].price);
            const diff = highP - lowP;
            const levels = [
              { lvl: 0.0, color: '#64748b' },
              { lvl: 0.236, color: '#f43f5e' },
              { lvl: 0.382, color: '#fb923c' },
              { lvl: 0.5, color: '#10b981' },
              { lvl: 0.618, color: '#f59e0b' }, // Golden Ratio
              { lvl: 0.786, color: '#38bdf8' },
              { lvl: 1.0, color: '#64748b' }
            ];

            levels.forEach(lv => {
              const price = lowP + diff * lv.lvl;
              const y = getY(price);
              ctx.strokeStyle = lv.color;
              ctx.lineWidth = lv.lvl === 0.618 ? 2 : 1;
              ctx.setLineDash(lv.lvl === 0.618 ? [] : [3, 2]);
              ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w - 70, y); ctx.stroke();
              ctx.setLineDash([]);

              ctx.fillStyle = lv.color;
              ctx.font = 'bold 9px monospace';
              ctx.fillText(`${lv.lvl} ($${price.toFixed(2)})`, 10, y - 3);
            });
          }
        }

        else if (d.type === 'arrow_up' || d.type === 'arrow_down') {
          const p = d.points[0];
          if (!p) return;
          const y = getY(p.price);
          const x = (p.candleIndex - startIndex) * stepX + 8 + candleWidth / 2;
          ctx.fillStyle = d.type === 'arrow_up' ? '#10b981' : '#f43f5e';
          ctx.beginPath();
          if (d.type === 'arrow_up') {
            ctx.moveTo(x, y - 18);
            ctx.lineTo(x - 8, y - 6);
            ctx.lineTo(x + 8, y - 6);
          } else {
            ctx.moveTo(x, y + 18);
            ctx.lineTo(x - 8, y + 6);
            ctx.lineTo(x + 8, y + 6);
          }
          ctx.fill();
        }

        else if (d.type === 'measure') {
          if (d.points.length >= 2) {
            const p1 = d.points[0];
            const p2 = d.points[1];
            const y1 = getY(p1.price);
            const y2 = getY(p2.price);
            const pips = Math.abs(p2.price - p1.price) * 10;
            const pct = ((p2.price - p1.price) / p1.price) * 100;

            ctx.fillStyle = 'rgba(56, 189, 248, 0.15)';
            ctx.fillRect(Math.min(p1.x, p2.x), Math.min(y1, y2), Math.abs(p2.x - p1.x), Math.abs(y2 - y1));
            ctx.strokeStyle = '#38bdf8';
            ctx.strokeRect(Math.min(p1.x, p2.x), Math.min(y1, y2), Math.abs(p2.x - p1.x), Math.abs(y2 - y1));

            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 10px monospace';
            ctx.fillText(`${pips.toFixed(1)} Pips (${pct >= 0 ? '+' : ''}${pct.toFixed(2)}%)`, Math.min(p1.x, p2.x) + 5, Math.min(y1, y2) + 14);
          }
        }

        else if (d.type === 'brush') {
          if (d.points.length > 1) {
            ctx.strokeStyle = '#38bdf8';
            ctx.lineWidth = 2.5;
            ctx.lineCap = 'round';
            ctx.beginPath();
            d.points.forEach((pt, idx) => {
              if (idx === 0) ctx.moveTo(pt.x, pt.y);
              else ctx.lineTo(pt.x, pt.y);
            });
            ctx.stroke();
          }
        }
      });
    }

    // Draw Marked Orders lines placed by the user
    markedOrders.forEach(order => {
      const lineY = getY(order.price);
      const isBuy = order.type === 'buy';
      const orderColor = isBuy ? '#10b981' : '#f43f5e';

      ctx.strokeStyle = orderColor;
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.beginPath(); ctx.moveTo(0, lineY); ctx.lineTo(w - 70, lineY); ctx.stroke();
      ctx.setLineDash([]);

      const candleCenterX = (order.candleIndex - startIndex) * stepX + 8 + candleWidth / 2;
      ctx.fillStyle = orderColor;
      ctx.beginPath(); ctx.arc(candleCenterX, lineY, 5, 0, Math.PI * 2); ctx.fill();

      ctx.fillRect(candleCenterX - 35, lineY - 24, 70, 18);
      ctx.fillStyle = '#060a12';
      ctx.font = 'bold 9px monospace';
      ctx.fillText(`${isBuy ? '▲ COMPRA' : '▼ VENTA'}`, candleCenterX - 30, lineY - 12);

      ctx.fillStyle = orderColor;
      ctx.fillRect(w - 72, lineY - 10, 70, 20);
      ctx.fillStyle = '#060a12';
      ctx.font = 'bold 10px monospace';
      ctx.fillText(`$${order.price.toFixed(2)}`, w - 68, lineY + 4);
    });

    // Crosshair
    if (activeCrosshair) {
      const chY = activeCrosshair.y;
      const chX = activeCrosshair.x;

      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1;
      ctx.setLineDash([2, 2]);

      ctx.beginPath(); ctx.moveTo(0, chY); ctx.lineTo(w - 70, chY); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(chX, 0); ctx.lineTo(chX, h); ctx.stroke();
      ctx.setLineDash([]);

      ctx.fillStyle = '#38bdf8';
      ctx.beginPath(); ctx.arc(chX, chY, 4, 0, Math.PI * 2); ctx.fill();

      ctx.fillStyle = '#0284c7';
      ctx.fillRect(w - 72, chY - 10, 70, 20);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 10px monospace';
      ctx.fillText(`$${activeCrosshair.price.toFixed(2)}`, w - 68, chY + 4);
    }

    // Beacon Line for currentPrice
    const currentY = getY(currentPrice);
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 3]);
    ctx.beginPath(); ctx.moveTo(0, currentY); ctx.lineTo(w - 70, currentY); ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle = '#10b981';
    ctx.fillRect(w - 72, currentY - 11, 70, 22);
    ctx.fillStyle = '#060b13';
    ctx.font = 'bold 11px monospace';
    ctx.fillText(`$${currentPrice.toFixed(2)}`, w - 68, currentY + 4);

    // Right axis price ticks
    ctx.fillStyle = '#64748b';
    ctx.font = '10px monospace';
    const numTicks = 5;
    for (let i = 0; i <= numTicks; i++) {
      const p = minP + (maxP - minP) * (i / numTicks);
      const y = getY(p);
      ctx.fillText(`$${p.toFixed(0)}`, w - 65, y + 3);
    }
  }, [
    candles, 
    currentPrice, 
    markedOrders, 
    activeCrosshair, 
    visibleCandlesCount, 
    panIndex, 
    drawings, 
    isDrawingsHidden, 
    showEMA, 
    showBollinger
  ]);

  // Touch handlers on canvas
  const handleTouchStart = (e: React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();

    // Two finger pinch to zoom
    if (e.touches.length === 2) {
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      pinchStartDist.current = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
      return;
    }

    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;

    touchStartPos.current = { x, y };
    lastPanTouchX.current = touch.clientX;

    // IF A DRAWING TOOL IS SELECTED:
    if (activeTool !== 'cursor') {
      handleCanvasClickToDraw(x, y, rect.width, rect.height);
      return;
    }

    // ELSE CURSOR MODE: Long press detector
    if (longPressTimer.current) clearTimeout(longPressTimer.current);
    longPressTimer.current = setTimeout(() => {
      calculateAndShowPoint(x, y, rect.width, rect.height);
    }, 280);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLCanvasElement>) => {
    // Two-finger pinch zoom
    if (e.touches.length === 2 && pinchStartDist.current !== null) {
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      const currentDist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
      const diff = currentDist - pinchStartDist.current;
      if (Math.abs(diff) > 15) {
        if (diff > 0) handleZoomIn();
        else handleZoomOut();
        pinchStartDist.current = currentDist;
      }
      return;
    }

    if (!touchStartPos.current) return;
    const touch = e.touches[0];
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const curX = touch.clientX - rect.left;
    const curY = touch.clientY - rect.top;

    // If active tool is brush: draw stroke!
    if (activeTool === 'brush') {
      const price = calculatePriceFromY(curY, rect.height);
      setDrawings(prev => {
        if (prev.length === 0) return prev;
        const copy = [...prev];
        const last = copy[copy.length - 1];
        if (last && last.type === 'brush') {
          last.points.push({ x: curX, y: curY, price, candleIndex: 0 });
        }
        return copy;
      });
      return;
    }

    const dist = Math.hypot(curX - touchStartPos.current.x, curY - touchStartPos.current.y);
    if (dist > 8 && !showOrderPopup) {
      // Cancel long press if finger moved
      if (longPressTimer.current) {
        clearTimeout(longPressTimer.current);
        longPressTimer.current = null;
      }

      // Smooth horizontal panning through chart history!
      if (lastPanTouchX.current !== null && activeTool === 'cursor') {
        const dx = touch.clientX - lastPanTouchX.current;
        if (Math.abs(dx) > 4) {
          const shift = dx > 0 ? 1 : -1;
          setPanIndex(p => Math.max(0, Math.min(candles.length - visibleCandlesCount, p + shift)));
          lastPanTouchX.current = touch.clientX;
        }
      }
    } else if (showOrderPopup) {
      calculateAndShowPoint(curX, curY, rect.width, rect.height);
    }
  };

  const handleTouchEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
    touchStartPos.current = null;
    pinchStartDist.current = null;
    lastPanTouchX.current = null;
  };

  // Mouse wheel zoom
  const handleWheel = (e: React.WheelEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (e.deltaY < 0) handleZoomIn();
    else handleZoomOut();
  };

  // Mouse click handler
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (activeTool !== 'cursor') {
      handleCanvasClickToDraw(x, y, rect.width, rect.height);
    } else {
      calculateAndShowPoint(x, y, rect.width, rect.height);
    }
  };

  // Price helper
  const calculatePriceFromY = (y: number, h: number) => {
    const totalCount = candles.length;
    const endIndex = Math.min(totalCount, totalCount - panIndex);
    const startIndex = Math.max(0, endIndex - visibleCandlesCount);
    const visibleCandles = candles.slice(startIndex, endIndex);

    let minP = Infinity, maxP = -Infinity;
    visibleCandles.forEach(c => {
      if (c.low < minP) minP = c.low;
      if (c.high > maxP) maxP = c.high;
    });
    const pad = (maxP - minP) * 0.12 || 1;
    minP -= pad; maxP += pad;

    return Math.round((minP + ((h - 20 - y) / (h - 35)) * (maxP - minP)) * 100) / 100;
  };

  // Handle drawing on canvas
  const handleCanvasClickToDraw = (x: number, y: number, w: number, h: number) => {
    const price = calculatePriceFromY(y, h);
    const totalCount = candles.length;
    const endIndex = Math.min(totalCount, totalCount - panIndex);
    const startIndex = Math.max(0, endIndex - visibleCandlesCount);
    const stepX = (w - 70) / visibleCandlesCount;
    const localIndex = Math.max(0, Math.min(visibleCandlesCount - 1, Math.floor((x - 8) / stepX)));
    const candleIndex = startIndex + localIndex;

    const point = { x, y, price, candleIndex };

    // 1-point tools
    if (activeTool === 'horizontal_line' || activeTool === 'arrow_up' || activeTool === 'arrow_down' || activeTool === 'long_position' || activeTool === 'short_position') {
      const newD: ChartDrawingItem = {
        id: `draw_${Date.now()}`,
        type: activeTool,
        points: [point]
      };
      setDrawings(prev => [newD, ...prev]);
      setActiveTool('cursor'); // Reset to cursor after placing
      return;
    }

    if (activeTool === 'brush') {
      const newD: ChartDrawingItem = {
        id: `draw_${Date.now()}`,
        type: 'brush',
        points: [point]
      };
      setDrawings(prev => [newD, ...prev]);
      return;
    }

    // 2-point tools (trendline, rectangle, measure, fibonacci)
    if (tempDrawingPoints.length === 0) {
      setTempDrawingPoints([point]);
    } else {
      const p1 = tempDrawingPoints[0];
      const newD: ChartDrawingItem = {
        id: `draw_${Date.now()}`,
        type: activeTool,
        points: [p1, point]
      };
      setDrawings(prev => [newD, ...prev]);
      setTempDrawingPoints([]);
      setActiveTool('cursor');
    }
  };

  const calculateAndShowPoint = (x: number, y: number, w: number, h: number) => {
    if (candles.length === 0) return;
    const price = calculatePriceFromY(y, h);
    const stepX = (w - 70) / visibleCandlesCount;
    const localIndex = Math.max(0, Math.min(visibleCandlesCount - 1, Math.floor((x - 8) / stepX)));
    const candleCenterX = localIndex * stepX + 8 + ((w - 70) / visibleCandlesCount - 2) / 2;

    try { if (typeof navigator !== 'undefined' && navigator.vibrate) navigator.vibrate(35); } catch {}

    const totalCount = candles.length;
    const endIndex = Math.min(totalCount, totalCount - panIndex);
    const startIndex = Math.max(0, endIndex - visibleCandlesCount);

    setActiveCrosshair({
      x: candleCenterX,
      y: y,
      price,
      candleIndex: startIndex + localIndex
    });
    setShowOrderPopup(true);
  };

  // Confirm marked order on candle
  const handleMarkOrder = (type: 'buy' | 'sell') => {
    if (!activeCrosshair) return;
    const newMarked: MarkedOrder = {
      id: `m_${Date.now()}`,
      candleIndex: activeCrosshair.candleIndex,
      price: activeCrosshair.price,
      x: activeCrosshair.x,
      y: activeCrosshair.y,
      type,
      time: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
    };

    setMarkedOrders(prev => [newMarked, ...prev]);
    setShowOrderPopup(false);
    setActiveCrosshair(null);
    onOpenOrderModal(type);
  };

  const spread = 0.55;
  const sellPrice = currentPrice - (spread / 2);
  const buyPrice = currentPrice + (spread / 2);

  return (
    <div className={`flex-1 flex flex-col bg-[#070c17] text-slate-100 overflow-y-auto ${isFullscreen ? 'fixed inset-0 z-50 p-2 bg-[#070c17]' : 'pb-20'}`}>
      
      {/* Top Header of Chart */}
      <div className="px-3 sm:px-4 py-2.5 flex items-center justify-between border-b border-slate-800/80 bg-[#090f1e]/90 sticky top-0 z-10 backdrop-blur-md">
        <button
          onClick={onOpenAssetPicker}
          className="flex items-center gap-2 group cursor-pointer"
        >
          <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-sm shadow-sm">
            🥇
          </div>
          <div className="flex flex-col text-left">
            <div className="flex items-center gap-1.5">
              <span className="font-black text-sm text-white group-hover:text-amber-400 transition-colors">
                {assetSymbol}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <div className="flex items-center gap-1 text-[11px] font-mono">
              <span className="text-emerald-400 font-bold">+0.96</span>
              <span className="text-emerald-400 font-bold">0.02%</span>
              <span className="text-slate-500">• {selectedTimeframe}</span>
            </div>
          </div>
        </button>

        {/* Quick actions top bar */}
        <div className="flex items-center gap-1.5">
          {/* Zoom Buttons */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-0.5">
            <button 
              onClick={handleZoomIn} 
              title="Aumentar zoom (+)"
              className="w-7 h-7 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 flex items-center justify-center cursor-pointer active:scale-90"
            >
              <ZoomIn className="w-4 h-4" />
            </button>
            <button 
              onClick={handleZoomOut} 
              title="Alejar zoom (-)"
              className="w-7 h-7 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 flex items-center justify-center cursor-pointer active:scale-90"
            >
              <ZoomOut className="w-4 h-4" />
            </button>
          </div>

          {/* Trigger Herramientas de Dibujo */}
          <button 
            onClick={() => setIsDrawingSheetOpen(true)}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer shadow-md ${
              activeTool !== 'cursor'
                ? 'bg-cyan-500 text-slate-950 border-cyan-400 animate-pulse'
                : 'bg-slate-900 border-slate-800 text-cyan-400 hover:bg-slate-800'
            }`}
          >
            <Brush className="w-3.5 h-3.5" />
            <span className="text-[11px] font-black hidden sm:inline">Dibujos</span>
          </button>

          {/* Toggle Fullscreen */}
          <button 
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Floating Active Tool Notification Banner */}
      {activeTool !== 'cursor' && (
        <div className="bg-cyan-500/10 border-b border-cyan-500/30 px-3 py-1.5 flex items-center justify-between text-xs text-cyan-300">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span>Herramienta activa: <strong>{activeTool.replace('_', ' ').toUpperCase()}</strong> — Toca en el gráfico para colocarla</span>
          </div>
          <button 
            onClick={() => { setActiveTool('cursor'); setTempDrawingPoints([]); }}
            className="text-slate-400 hover:text-white font-bold px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px]"
          >
            Cancelar
          </button>
        </div>
      )}

      {/* MAIN CHART CONTAINER */}
      <div className={`relative w-full ${isFullscreen ? 'flex-1 min-h-[450px]' : 'h-[360px] sm:h-[420px]'} bg-[#060a12] border-b border-slate-800/80 touch-none`}>
        <canvas
          ref={canvasRef}
          onWheel={handleWheel}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          className="w-full h-full block cursor-crosshair"
        />

        {/* Floating Quick Drawing Bar on Left of Chart (TradingView style) */}
        <div className="absolute top-3 left-3 z-20 flex flex-col gap-1.5 bg-[#090f1e]/90 backdrop-blur-md p-1 rounded-2xl border border-slate-800 shadow-xl">
          <button 
            onClick={() => setIsDrawingSheetOpen(true)}
            title="Abrir menú de herramientas y dibujos"
            className="w-7 h-7 rounded-xl bg-slate-900 hover:bg-slate-800 text-cyan-400 flex items-center justify-center cursor-pointer"
          >
            <Brush className="w-3.5 h-3.5" />
          </button>
          <button 
            onClick={() => { setActiveTool('horizontal_line'); }}
            title="Línea Horizontal (Soporte/Resistencia)"
            className={`w-7 h-7 rounded-xl flex items-center justify-center cursor-pointer transition-colors ${
              activeTool === 'horizontal_line' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Minus className="w-3.5 h-3.5 stroke-[3]" />
          </button>
          <button 
            onClick={() => { setActiveTool('trendline'); }}
            title="Línea de tendencia"
            className={`w-7 h-7 rounded-xl flex items-center justify-center cursor-pointer transition-colors ${
              activeTool === 'trendline' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
          </button>
          <button 
            onClick={() => { setActiveTool('long_position'); }}
            title="Posición larga (TP/SL Ratio)"
            className={`w-7 h-7 rounded-xl flex items-center justify-center cursor-pointer transition-colors text-[9px] font-black ${
              activeTool === 'long_position' ? 'bg-emerald-500 text-slate-950' : 'text-emerald-400 hover:text-white'
            }`}
          >
            R:R
          </button>
          <button 
            onClick={() => setIsDrawingsHidden(!isDrawingsHidden)}
            title={isDrawingsHidden ? "Mostrar dibujos" : "Ocultar dibujos"}
            className="w-7 h-7 rounded-xl text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
          >
            {isDrawingsHidden ? <EyeOff className="w-3.5 h-3.5 text-amber-400" /> : <Eye className="w-3.5 h-3.5" />}
          </button>
          {drawings.length > 0 && (
            <button 
              onClick={() => { if (confirm('¿Borrar todos los dibujos?')) setDrawings([]); }}
              title="Borrar todos los dibujos"
              className="w-7 h-7 rounded-xl text-rose-400 hover:bg-rose-500/20 flex items-center justify-center cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Floating Zoom & Pan Pill at Bottom Right */}
        <div className="absolute bottom-3 right-3 z-20 flex items-center gap-1 bg-[#090f1e]/90 backdrop-blur-md px-2 py-1 rounded-xl border border-slate-800 text-xs font-mono">
          <button 
            onClick={handleZoomIn} 
            className="p-1 hover:text-cyan-400 cursor-pointer"
            title="Aumentar zoom (+)"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <span className="text-[10px] text-slate-400 px-1 font-bold">{visibleCandlesCount}V</span>
          <button 
            onClick={handleZoomOut} 
            className="p-1 hover:text-cyan-400 cursor-pointer"
            title="Alejar zoom (-)"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button 
            onClick={handleResetZoom} 
            className="p-1 text-slate-500 hover:text-white cursor-pointer ml-0.5 border-l border-slate-800 pl-1"
            title="Restablecer"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        </div>

        {/* TV branding badge */}
        <div className="absolute bottom-3 left-12 text-[10px] font-black text-slate-500 flex items-center gap-1 pointer-events-none">
          <span className="bg-slate-800 px-1 py-0.2 rounded font-mono text-[9px]">TV</span>
          <span>TradingView</span>
        </div>

        {/* Floating quick buy/sell order popup when long-pressing a candle */}
        {showOrderPopup && activeCrosshair && (
          <div 
            className="absolute z-30 flex flex-col gap-1.5 p-2 bg-[#090f1e]/95 backdrop-blur-md border border-cyan-500/80 rounded-2xl shadow-2xl shadow-cyan-500/20 animate-in fade-in zoom-in-95"
            style={{
              left: `${Math.max(10, Math.min(200, activeCrosshair.x - 70))}px`,
              top: `${Math.max(10, Math.min(220, activeCrosshair.y - 65))}px`
            }}
          >
            <div className="flex items-center justify-between gap-2 px-1 text-[11px] text-slate-300 font-mono">
              <span className="font-bold text-amber-400">Vela #{activeCrosshair.candleIndex + 1}</span>
              <span className="font-black text-white">${activeCrosshair.price.toFixed(2)}</span>
              <button 
                onClick={() => { setShowOrderPopup(false); setActiveCrosshair(null); }}
                className="text-slate-500 hover:text-white p-0.5"
              >
                ✕
              </button>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => handleMarkOrder('buy')}
                className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center gap-1 shadow-md cursor-pointer active:scale-95 transition-transform"
              >
                ▲ COMPRA
              </button>
              <button
                onClick={() => handleMarkOrder('sell')}
                className="px-3 py-1.5 rounded-xl bg-rose-500 hover:bg-rose-400 text-white font-black text-xs flex items-center gap-1 shadow-md cursor-pointer active:scale-95 transition-transform"
              >
                ▼ VENTA
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Timeframes Bar with full Interval Drawer trigger */}
      <div className="px-3 sm:px-4 py-2 border-b border-slate-800/80 bg-[#080e1b] flex items-center justify-between">
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800/80 text-xs font-mono font-bold">
          {['1H', '1D', '1W', '1M', '3M', '1Y'].map(tf => (
            <button
              key={tf}
              onClick={() => setSelectedTimeframe(tf)}
              className={`px-2.5 sm:px-3 py-1 rounded-lg transition-all cursor-pointer ${
                selectedTimeframe === tf ? 'bg-slate-800 text-white font-black shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1">
          {/* Open full interval sheet */}
          <button 
            onClick={() => setIsIntervalSheetOpen(true)}
            className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-800 text-xs font-bold text-slate-300 hover:text-white cursor-pointer"
            title="Todos los intervalos (Ticks, Segundos, Minutos)"
          >
            <Clock className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[11px]">Intervalos</span>
          </button>

          {/* Toggle Indicators */}
          <button 
            onClick={() => setShowEMA(!showEMA)}
            title="Alternar Medias Móviles EMA 20 / 50"
            className={`w-7 h-7 rounded-xl border flex items-center justify-center text-xs font-bold cursor-pointer ${
              showEMA ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300' : 'bg-slate-900 border-slate-800 text-slate-500'
            }`}
          >
            EMA
          </button>
        </div>
      </div>

      {/* Primary Execution Buttons (VENTA / SPREAD / COMPRA) */}
      <div className="p-3 bg-[#0a1122] border-b border-slate-800/80">
        <div className="flex items-stretch gap-2 max-w-lg mx-auto">
          {/* SELL */}
          <button
            onClick={() => onOpenOrderModal('sell')}
            className="flex-1 bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 text-white rounded-2xl p-3 flex flex-col items-center justify-center shadow-lg shadow-rose-500/20 active:scale-[0.98] transition-all cursor-pointer group"
          >
            <span className="text-[11px] font-bold tracking-wider uppercase opacity-90 group-hover:opacity-100">
              VENTA
            </span>
            <span className="text-xl sm:text-2xl font-black font-mono tracking-tight mt-0.5">
              {sellPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </button>

          {/* SPREAD PILL */}
          <div className="flex items-center justify-center px-1">
            <span className="bg-slate-900 border border-slate-800 text-slate-300 font-mono text-xs font-bold px-2 py-1 rounded-full shadow-inner">
              {spread.toFixed(2)}
            </span>
          </div>

          {/* BUY */}
          <button
            onClick={() => onOpenOrderModal('buy')}
            className="flex-1 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 text-white rounded-2xl p-3 flex flex-col items-center justify-center shadow-lg shadow-emerald-500/20 active:scale-[0.98] transition-all cursor-pointer group"
          >
            <span className="text-[11px] font-bold tracking-wider uppercase opacity-90 group-hover:opacity-100">
              COMPRA
            </span>
            <span className="text-xl sm:text-2xl font-black font-mono tracking-tight mt-0.5">
              {buyPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
          </button>
        </div>
      </div>

      {/* Drawing Tools Sheet Modal */}
      <XmDrawingToolsSheet
        isOpen={isDrawingSheetOpen}
        onClose={() => setIsDrawingSheetOpen(false)}
        activeTool={activeTool}
        onSelectTool={(tool) => setActiveTool(tool)}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onResetZoom={handleResetZoom}
        onClearAllDrawings={() => setDrawings([])}
        isDrawingsHidden={isDrawingsHidden}
        onToggleHideDrawings={() => setIsDrawingsHidden(!isDrawingsHidden)}
        isDrawingsLocked={isDrawingsLocked}
        onToggleLockDrawings={() => setIsDrawingsLocked(!isDrawingsLocked)}
        drawingsCount={drawings.length}
      />

      {/* Interval / Timeframes Sheet Modal */}
      <XmIntervalSheet
        isOpen={isIntervalSheetOpen}
        onClose={() => setIsIntervalSheetOpen(false)}
        currentInterval={selectedTimeframe}
        onSelectInterval={(tf) => setSelectedTimeframe(tf)}
        currentRange={currentRange}
        onSelectRange={(r) => setCurrentRange(r)}
      />

    </div>
  );
};
