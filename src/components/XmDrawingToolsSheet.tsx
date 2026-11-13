import React, { useState } from 'react';
import { 
  X, 
  Search, 
  Ruler, 
  Eraser, 
  Eye, 
  EyeOff, 
  Lock, 
  Unlock, 
  Trash2, 
  ZoomIn, 
  ZoomOut, 
  Maximize2,
  TrendingUp, 
  Minus, 
  ArrowUpRight, 
  Square, 
  Brush, 
  ArrowUp, 
  ArrowDown, 
  Percent, 
  Layers, 
  Activity,
  GitCommit,
  RotateCcw,
  Sliders,
  Sparkles
} from 'lucide-react';

export type ChartToolType = 
  | 'cursor'
  | 'measure'
  | 'eraser'
  | 'trendline'
  | 'horizontal_line'
  | 'ray'
  | 'rectangle'
  | 'brush'
  | 'arrow_up'
  | 'arrow_down'
  | 'long_position'
  | 'short_position'
  | 'fibonacci'
  | 'price_range';

interface XmDrawingToolsSheetProps {
  isOpen: boolean;
  onClose: () => void;
  activeTool: ChartToolType;
  onSelectTool: (tool: ChartToolType) => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetZoom: () => void;
  onClearAllDrawings: () => void;
  isDrawingsHidden: boolean;
  onToggleHideDrawings: () => void;
  isDrawingsLocked: boolean;
  onToggleLockDrawings: () => void;
  drawingsCount: number;
}

export const XmDrawingToolsSheet: React.FC<XmDrawingToolsSheetProps> = ({
  isOpen,
  onClose,
  activeTool,
  onSelectTool,
  onZoomIn,
  onZoomOut,
  onResetZoom,
  onClearAllDrawings,
  isDrawingsHidden,
  onToggleHideDrawings,
  isDrawingsLocked,
  onToggleLockDrawings,
  drawingsCount
}) => {
  const [activeTab, setActiveTab] = useState<'herramientas' | 'tendencia' | 'figuras' | 'prevision' | 'fibonacci' | 'patrones'>('herramientas');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const handleSelect = (tool: ChartToolType) => {
    onSelectTool(tool);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end justify-center p-0 sm:p-4 animate-in fade-in">
      <div className="bg-[#0b1325] border border-slate-800 rounded-t-3xl sm:rounded-3xl w-full max-w-xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header con barra de arrastre y título */}
        <div className="p-4 pb-2 border-b border-slate-800/80">
          <div className="w-12 h-1 bg-slate-700 rounded-full mx-auto mb-3" />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-lg">🎨</span>
              <h3 className="font-black text-base text-white">Herramientas y Dibujos</h3>
              {drawingsCount > 0 && (
                <span className="bg-cyan-500/20 text-cyan-400 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border border-cyan-500/30">
                  {drawingsCount} activos
                </span>
              )}
            </div>
            <button 
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Search bar */}
          <div className="mt-3 relative">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
            <input 
              type="text" 
              placeholder="Buscar herramienta (ej. Línea, Fibonacci, Zoom)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/80"
            />
          </div>

          {/* Tabs horizontales estilo TradingView */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar mt-3 pt-1 text-xs font-bold">
            <button 
              onClick={() => setActiveTab('herramientas')}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap cursor-pointer transition-all ${
                activeTab === 'herramientas' ? 'bg-cyan-500 text-slate-950 font-black shadow-md' : 'bg-slate-900/80 text-slate-400 hover:text-white'
              }`}
            >
              Herramientas
            </button>
            <button 
              onClick={() => setActiveTab('tendencia')}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap cursor-pointer transition-all ${
                activeTab === 'tendencia' ? 'bg-cyan-500 text-slate-950 font-black shadow-md' : 'bg-slate-900/80 text-slate-400 hover:text-white'
              }`}
            >
              Tendencia
            </button>
            <button 
              onClick={() => setActiveTab('figuras')}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap cursor-pointer transition-all ${
                activeTab === 'figuras' ? 'bg-cyan-500 text-slate-950 font-black shadow-md' : 'bg-slate-900/80 text-slate-400 hover:text-white'
              }`}
            >
              Figuras
            </button>
            <button 
              onClick={() => setActiveTab('prevision')}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap cursor-pointer transition-all ${
                activeTab === 'prevision' ? 'bg-cyan-500 text-slate-950 font-black shadow-md' : 'bg-slate-900/80 text-slate-400 hover:text-white'
              }`}
            >
              Previsión y Medida
            </button>
            <button 
              onClick={() => setActiveTab('fibonacci')}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap cursor-pointer transition-all ${
                activeTab === 'fibonacci' ? 'bg-cyan-500 text-slate-950 font-black shadow-md' : 'bg-slate-900/80 text-slate-400 hover:text-white'
              }`}
            >
              Fibonacci
            </button>
            <button 
              onClick={() => setActiveTab('patrones')}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap cursor-pointer transition-all ${
                activeTab === 'patrones' ? 'bg-cyan-500 text-slate-950 font-black shadow-md' : 'bg-slate-900/80 text-slate-400 hover:text-white'
              }`}
            >
              Patrones
            </button>
          </div>
        </div>

        {/* Content Grid */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          
          {/* TAB: HERRAMIENTAS GENERALES (ZOOM, MEDIDA, BORRADOR) */}
          {activeTab === 'herramientas' && (
            <div className="space-y-3">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Acciones del Gráfico</div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                
                {/* Zoom In */}
                <button 
                  onClick={() => { onZoomIn(); }}
                  className="p-3 bg-slate-900/90 hover:bg-slate-800 border border-slate-800 rounded-2xl flex flex-col items-center gap-1.5 text-center cursor-pointer transition-all active:scale-95 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <ZoomIn className="w-5 h-5" />
                  </div>
                  <span className="font-bold text-xs text-white">Aumentar zoom</span>
                  <span className="text-[10px] text-slate-400">Ver velas de cerca</span>
                </button>

                {/* Zoom Out */}
                <button 
                  onClick={() => { onZoomOut(); }}
                  className="p-3 bg-slate-900/90 hover:bg-slate-800 border border-slate-800 rounded-2xl flex flex-col items-center gap-1.5 text-center cursor-pointer transition-all active:scale-95 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <ZoomOut className="w-5 h-5" />
                  </div>
                  <span className="font-bold text-xs text-white">Alejar zoom</span>
                  <span className="text-[10px] text-slate-400">Ver más historial</span>
                </button>

                {/* Reset Zoom */}
                <button 
                  onClick={() => { onResetZoom(); }}
                  className="p-3 bg-slate-900/90 hover:bg-slate-800 border border-slate-800 rounded-2xl flex flex-col items-center gap-1.5 text-center cursor-pointer transition-all active:scale-95 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-800 text-slate-300 border border-slate-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <RotateCcw className="w-5 h-5" />
                  </div>
                  <span className="font-bold text-xs text-white">Restablecer zoom</span>
                  <span className="text-[10px] text-slate-400">Escala normal</span>
                </button>

                {/* Medida (Ruler) */}
                <button 
                  onClick={() => handleSelect('measure')}
                  className={`p-3 border rounded-2xl flex flex-col items-center gap-1.5 text-center cursor-pointer transition-all active:scale-95 group ${
                    activeTool === 'measure' ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300' : 'bg-slate-900/90 hover:bg-slate-800 border-slate-800'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Ruler className="w-5 h-5" />
                  </div>
                  <span className="font-bold text-xs text-white">Medida (Regla)</span>
                  <span className="text-[10px] text-slate-400">Calcular pips y %</span>
                </button>

                {/* Ocultar / Mostrar Dibujos */}
                <button 
                  onClick={onToggleHideDrawings}
                  className={`p-3 border rounded-2xl flex flex-col items-center gap-1.5 text-center cursor-pointer transition-all active:scale-95 group ${
                    isDrawingsHidden ? 'bg-amber-500/20 border-amber-500/50 text-amber-300' : 'bg-slate-900/90 hover:bg-slate-800 border-slate-800'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                    {isDrawingsHidden ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </div>
                  <span className="font-bold text-xs text-white">{isDrawingsHidden ? 'Mostrar dibujos' : 'Ocultar dibujos'}</span>
                  <span className="text-[10px] text-slate-400">{isDrawingsHidden ? 'Ocultos actualmente' : 'Visibles en gráfico'}</span>
                </button>

                {/* Bloquear dibujos */}
                <button 
                  onClick={onToggleLockDrawings}
                  className={`p-3 border rounded-2xl flex flex-col items-center gap-1.5 text-center cursor-pointer transition-all active:scale-95 group ${
                    isDrawingsLocked ? 'bg-rose-500/20 border-rose-500/50 text-rose-300' : 'bg-slate-900/90 hover:bg-slate-800 border-slate-800'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                    {isDrawingsLocked ? <Lock className="w-5 h-5" /> : <Unlock className="w-5 h-5" />}
                  </div>
                  <span className="font-bold text-xs text-white">{isDrawingsLocked ? 'Desbloquear' : 'Bloquear dibujos'}</span>
                  <span className="text-[10px] text-slate-400">{isDrawingsLocked ? 'Bloqueados' : 'Permitir mover'}</span>
                </button>

                {/* Borrar todos los dibujos */}
                <button 
                  onClick={() => {
                    if (confirm('¿Deseas eliminar todos los dibujos del gráfico?')) {
                      onClearAllDrawings();
                      onClose();
                    }
                  }}
                  className="p-3 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 rounded-2xl flex flex-col items-center gap-1.5 text-center cursor-pointer transition-all active:scale-95 group col-span-2 sm:col-span-1"
                >
                  <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/40 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Trash2 className="w-5 h-5" />
                  </div>
                  <span className="font-bold text-xs text-rose-400">Eliminar dibujos</span>
                  <span className="text-[10px] text-rose-300/70">Limpiar el gráfico</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB: LÍNEAS DE TENDENCIA */}
          {activeTab === 'tendencia' && (
            <div className="space-y-3">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Líneas de Soporte y Tendencia</div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                
                {/* Línea Horizontal (Soporte / Resistencia) */}
                <button 
                  onClick={() => handleSelect('horizontal_line')}
                  className={`p-3 border rounded-2xl flex flex-col items-center gap-1.5 text-center cursor-pointer transition-all active:scale-95 group ${
                    activeTool === 'horizontal_line' ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300' : 'bg-slate-900/90 hover:bg-slate-800 border-slate-800'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Minus className="w-5 h-5 stroke-[3]" />
                  </div>
                  <span className="font-bold text-xs text-white">Línea horizontal</span>
                  <span className="text-[10px] text-slate-400">Soporte y resistencia</span>
                </button>

                {/* Línea de Tendencia */}
                <button 
                  onClick={() => handleSelect('trendline')}
                  className={`p-3 border rounded-2xl flex flex-col items-center gap-1.5 text-center cursor-pointer transition-all active:scale-95 group ${
                    activeTool === 'trendline' ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300' : 'bg-slate-900/90 hover:bg-slate-800 border-slate-800'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <span className="font-bold text-xs text-white">Línea de tendencia</span>
                  <span className="text-[10px] text-slate-400">Trazar dirección</span>
                </button>

                {/* Semirrecta / Ray */}
                <button 
                  onClick={() => handleSelect('ray')}
                  className={`p-3 border rounded-2xl flex flex-col items-center gap-1.5 text-center cursor-pointer transition-all active:scale-95 group ${
                    activeTool === 'ray' ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300' : 'bg-slate-900/90 hover:bg-slate-800 border-slate-800'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <ArrowUpRight className="w-5 h-5" />
                  </div>
                  <span className="font-bold text-xs text-white">Semirrecta</span>
                  <span className="text-[10px] text-slate-400">Rayo extendido</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB: FIGURAS GEOMÉTRICAS */}
          {activeTab === 'figuras' && (
            <div className="space-y-3">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Zonas y Dibujo Libre</div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                
                {/* Rectángulo (Zonas de Oferta / Demanda) */}
                <button 
                  onClick={() => handleSelect('rectangle')}
                  className={`p-3 border rounded-2xl flex flex-col items-center gap-1.5 text-center cursor-pointer transition-all active:scale-95 group ${
                    activeTool === 'rectangle' ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300' : 'bg-slate-900/90 hover:bg-slate-800 border-slate-800'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Square className="w-5 h-5" />
                  </div>
                  <span className="font-bold text-xs text-white">Rectángulo</span>
                  <span className="text-[10px] text-slate-400">Oferta y Demanda</span>
                </button>

                {/* Pincel Libre */}
                <button 
                  onClick={() => handleSelect('brush')}
                  className={`p-3 border rounded-2xl flex flex-col items-center gap-1.5 text-center cursor-pointer transition-all active:scale-95 group ${
                    activeTool === 'brush' ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300' : 'bg-slate-900/90 hover:bg-slate-800 border-slate-800'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Brush className="w-5 h-5" />
                  </div>
                  <span className="font-bold text-xs text-white">Pincel</span>
                  <span className="text-[10px] text-slate-400">Dibujo a mano libre</span>
                </button>

                {/* Flecha Alcista */}
                <button 
                  onClick={() => handleSelect('arrow_up')}
                  className={`p-3 border rounded-2xl flex flex-col items-center gap-1.5 text-center cursor-pointer transition-all active:scale-95 group ${
                    activeTool === 'arrow_up' ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300' : 'bg-slate-900/90 hover:bg-slate-800 border-slate-800'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <ArrowUp className="w-5 h-5" />
                  </div>
                  <span className="font-bold text-xs text-white">Flecha arriba</span>
                  <span className="text-[10px] text-slate-400">Señal de compra</span>
                </button>

                {/* Flecha Bajista */}
                <button 
                  onClick={() => handleSelect('arrow_down')}
                  className={`p-3 border rounded-2xl flex flex-col items-center gap-1.5 text-center cursor-pointer transition-all active:scale-95 group ${
                    activeTool === 'arrow_down' ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300' : 'bg-slate-900/90 hover:bg-slate-800 border-slate-800'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <ArrowDown className="w-5 h-5" />
                  </div>
                  <span className="font-bold text-xs text-white">Flecha abajo</span>
                  <span className="text-[10px] text-slate-400">Señal de venta</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB: PREVISIÓN Y MEDIDA (POSICIÓN LARGA / CORTA) */}
          {activeTab === 'prevision' && (
            <div className="space-y-3">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Gestión de Riesgo y Operación</div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                
                {/* Posición Larga (Long R:R) */}
                <button 
                  onClick={() => handleSelect('long_position')}
                  className={`p-3 border rounded-2xl flex flex-col items-center gap-1.5 text-center cursor-pointer transition-all active:scale-95 group ${
                    activeTool === 'long_position' ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300' : 'bg-slate-900/90 hover:bg-slate-800 border-slate-800'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center group-hover:scale-110 transition-transform font-black text-xs font-mono">
                    TP/SL
                  </div>
                  <span className="font-bold text-xs text-white">Posición larga</span>
                  <span className="text-[10px] text-emerald-400 font-semibold">Riesgo / Beneficio (Compra)</span>
                </button>

                {/* Posición Corta (Short R:R) */}
                <button 
                  onClick={() => handleSelect('short_position')}
                  className={`p-3 border rounded-2xl flex flex-col items-center gap-1.5 text-center cursor-pointer transition-all active:scale-95 group ${
                    activeTool === 'short_position' ? 'bg-rose-500/20 border-rose-400 text-rose-300' : 'bg-slate-900/90 hover:bg-slate-800 border-slate-800'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/40 flex items-center justify-center group-hover:scale-110 transition-transform font-black text-xs font-mono">
                    SL/TP
                  </div>
                  <span className="font-bold text-xs text-white">Posición corta</span>
                  <span className="text-[10px] text-rose-400 font-semibold">Riesgo / Beneficio (Venta)</span>
                </button>

                {/* Rango de Precios */}
                <button 
                  onClick={() => handleSelect('price_range')}
                  className={`p-3 border rounded-2xl flex flex-col items-center gap-1.5 text-center cursor-pointer transition-all active:scale-95 group ${
                    activeTool === 'price_range' ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300' : 'bg-slate-900/90 hover:bg-slate-800 border-slate-800'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Percent className="w-5 h-5" />
                  </div>
                  <span className="font-bold text-xs text-white">Rango de precios</span>
                  <span className="text-[10px] text-slate-400">Diferencial de precio</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB: FIBONACCI */}
          {activeTab === 'fibonacci' && (
            <div className="space-y-3">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Herramientas de Retroceso y Extensión</div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                
                {/* Retroceso de Fibonacci */}
                <button 
                  onClick={() => handleSelect('fibonacci')}
                  className={`p-3 border rounded-2xl flex flex-col items-center gap-1.5 text-center cursor-pointer transition-all active:scale-95 group ${
                    activeTool === 'fibonacci' ? 'bg-amber-500/20 border-amber-400 text-amber-300' : 'bg-slate-900/90 hover:bg-slate-800 border-slate-800'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center group-hover:scale-110 transition-transform font-black text-xs font-mono">
                    0.618
                  </div>
                  <span className="font-bold text-xs text-white">Retroceso de Fibonacci</span>
                  <span className="text-[10px] text-amber-400 font-semibold">Niveles áureos (0.5, 0.618)</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB: PATRONES */}
          {activeTab === 'patrones' && (
            <div className="space-y-3">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Patrones Armónicos y Chartistas</div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                <button 
                  onClick={() => handleSelect('trendline')}
                  className="p-3 bg-slate-900/90 hover:bg-slate-800 border border-slate-800 rounded-2xl flex flex-col items-center gap-1.5 text-center cursor-pointer transition-all active:scale-95 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Activity className="w-5 h-5" />
                  </div>
                  <span className="font-bold text-xs text-white">Cabeza y hombros</span>
                  <span className="text-[10px] text-slate-400">Patrón de reversión</span>
                </button>
                <button 
                  onClick={() => handleSelect('trendline')}
                  className="p-3 bg-slate-900/90 hover:bg-slate-800 border border-slate-800 rounded-2xl flex flex-col items-center gap-1.5 text-center cursor-pointer transition-all active:scale-95 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <GitCommit className="w-5 h-5" />
                  </div>
                  <span className="font-bold text-xs text-white">Ondas de Elliott (1-5)</span>
                  <span className="text-[10px] text-slate-400">Ciclos de impulso</span>
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Footer info bar */}
        <div className="p-3 bg-slate-950 border-t border-slate-800/80 flex items-center justify-between text-xs">
          <span className="text-slate-400">Toca cualquier herramienta para usarla en el gráfico</span>
          <button 
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold"
          >
            Cerrar
          </button>
        </div>

      </div>
    </div>
  );
};
