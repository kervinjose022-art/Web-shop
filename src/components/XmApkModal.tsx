import React, { useState } from 'react';
import { 
  X, 
  Download, 
  Copy, 
  Check, 
  Edit2, 
  Save, 
  ExternalLink 
} from 'lucide-react';

interface XmApkModalProps {
  isOpen: boolean;
  onClose: () => void;
  appUrl?: string;
}

const DEFAULT_APK_URL = 'https://www.webintoapp.com';

export const XmApkModal: React.FC<XmApkModalProps> = ({ isOpen, onClose }) => {
  const [apkUrl, setApkUrl] = useState<string>(() => {
    try {
      return localStorage.getItem('zetatrade_apk_url') || DEFAULT_APK_URL;
    } catch {
      return DEFAULT_APK_URL;
    }
  });

  const [isEditing, setIsEditing] = useState(false);
  const [tempUrl, setTempUrl] = useState(apkUrl);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleSaveUrl = () => {
    const trimmed = tempUrl.trim();
    if (trimmed) {
      setApkUrl(trimmed);
      try {
        localStorage.setItem('zetatrade_apk_url', trimmed);
      } catch {}
      setIsEditing(false);
    }
  };

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(apkUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    // If it's a valid download URL, open or trigger download directly
    if (apkUrl && apkUrl.startsWith('http')) {
      window.open(apkUrl, '_blank');
      onClose();
    } else {
      setIsEditing(true);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-[#0b1325] border border-cyan-500/40 rounded-3xl w-full max-w-xs p-5 shadow-2xl relative text-white">
        
        {/* Header Compacto */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <img 
              src="/zetatrade_logo.png" 
              alt="ZetaTrade" 
              className="w-8 h-8 rounded-xl object-cover border border-amber-500/40 shadow-sm"
            />
            <div>
              <h3 className="font-black text-sm text-white">Descargar APK</h3>
              <p className="text-[10px] text-cyan-300 font-medium">ZetaTrade Oficial</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="w-7 h-7 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Contenido: Solo el Link y el Botón de Descarga */}
        <div className="mt-4 space-y-3">
          
          {/* Campo del Link de la APK con opción de editar/pegar */}
          <div>
            <div className="flex items-center justify-between mb-1.5 text-[11px] font-bold text-slate-400">
              <span>Link de la APK:</span>
              <button 
                onClick={() => {
                  if (isEditing) handleSaveUrl();
                  else { setTempUrl(apkUrl); setIsEditing(true); }
                }}
                className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
              >
                {isEditing ? (
                  <>
                    <Save className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400 font-bold">Guardar</span>
                  </>
                ) : (
                  <>
                    <Edit2 className="w-3 h-3" />
                    <span>Cambiar</span>
                  </>
                )}
              </button>
            </div>

            {isEditing ? (
              <div className="space-y-1.5">
                <input 
                  type="url" 
                  value={tempUrl} 
                  onChange={(e) => setTempUrl(e.target.value)}
                  placeholder="Pega aquí el enlace de descarga de tu APK..."
                  className="w-full bg-slate-950 border border-cyan-500 rounded-xl p-2 text-xs text-white placeholder-slate-500 outline-none font-mono"
                  autoFocus
                />
                <button
                  onClick={handleSaveUrl}
                  className="w-full py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg text-xs font-bold cursor-pointer"
                >
                  Guardar enlace
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1 bg-slate-950 border border-slate-800 rounded-xl p-1.5">
                <input 
                  type="text" 
                  readOnly 
                  value={apkUrl} 
                  className="bg-transparent text-slate-300 flex-1 outline-none font-mono text-[11px] px-1.5 truncate"
                />
                <button
                  onClick={handleCopy}
                  className={`px-2.5 py-1 rounded-lg font-bold text-[11px] flex items-center gap-1 cursor-pointer transition-all active:scale-95 shrink-0 ${
                    copied 
                      ? 'bg-emerald-500 text-slate-950' 
                      : 'bg-slate-800 hover:bg-slate-700 text-white'
                  }`}
                >
                  {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Listo' : 'Copiar'}</span>
                </button>
              </div>
            )}
          </div>

          {/* Botón Principal: DESCARGAR APK DIRECTO */}
          <button
            onClick={handleDownload}
            className="w-full py-3 bg-gradient-to-r from-emerald-500 to-emerald-400 hover:from-emerald-400 text-slate-950 font-black text-xs rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all cursor-pointer"
          >
            <Download className="w-4 h-4 stroke-[2.5]" />
            <span>Descargar Archivo APK (.apk)</span>
          </button>

          {/* Pie de modal */}
          <div className="pt-0.5 text-center text-[10px] text-slate-500 font-mono">
            ZetaTrade v1.0 • Android
          </div>
        </div>

      </div>
    </div>
  );
};
