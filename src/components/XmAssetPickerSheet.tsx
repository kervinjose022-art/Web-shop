import React from 'react';
import { XM_MARKET_ASSETS, MarketAsset } from './XmMarketsView';

interface XmAssetPickerSheetProps {
  isOpen: boolean;
  onClose: () => void;
  selectedSymbol: string;
  onSelectAsset: (asset: MarketAsset) => void;
}

export const XmAssetPickerSheet: React.FC<XmAssetPickerSheetProps> = ({
  isOpen,
  onClose,
  selectedSymbol,
  onSelectAsset
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg bg-[#0e1628] border-t border-slate-800 rounded-t-3xl shadow-2xl flex flex-col max-h-[60vh] text-white">
        {/* Top Handlebar & Actions: Cancelar / Done */}
        <div className="px-5 py-3 border-b border-slate-800 flex items-center justify-between">
          <button
            onClick={onClose}
            className="text-xs font-bold text-slate-400 hover:text-white cursor-pointer"
          >
            Cancelar
          </button>
          <span className="font-bold text-sm text-slate-200">Seleccionar Instrumento</span>
          <button
            onClick={onClose}
            className="text-xs font-bold text-amber-400 hover:text-amber-300 cursor-pointer"
          >
            Done
          </button>
        </div>

        {/* Wheel / Scrollable List of Assets */}
        <div className="flex-1 overflow-y-auto py-2 divide-y divide-slate-800/40">
          {XM_MARKET_ASSETS.map(asset => {
            const isSelected = asset.symbol === selectedSymbol;
            return (
              <button
                key={asset.symbol}
                onClick={() => {
                  onSelectAsset(asset);
                  onClose();
                }}
                className={`w-full py-3.5 px-6 flex items-center justify-between text-left transition-colors cursor-pointer ${
                  isSelected ? 'bg-amber-500/10 text-amber-400 font-black' : 'hover:bg-slate-900/60 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-7 h-7 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center font-mono font-bold text-xs text-slate-300">
                    {asset.iconLetter}
                  </div>
                  <div>
                    <span className="font-mono text-sm tracking-wide">{asset.symbol}</span>
                    <span className="text-[11px] text-slate-500 block">{asset.name}</span>
                  </div>
                </div>

                <div className="text-right font-mono">
                  <div className="font-bold text-xs text-white">${asset.price.toFixed(asset.price > 100 ? 2 : 4)}</div>
                  <span className={`text-[10px] ${asset.change24h >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {asset.change24h >= 0 ? '+' : ''}{asset.change24h}%
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
