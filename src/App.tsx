import React, { useState, useEffect } from 'react';
import { ZetaStore } from './components/ZetaStore';
import { XMPlatform } from './components/XMPlatform';

export default function App() {
  // Support quick preview of previous ZetaTrade broker via ?view=broker
  const [view, setView] = useState<'store' | 'broker'>(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      return params.get('view') === 'broker' ? 'broker' : 'store';
    } catch {
      return 'store';
    }
  });

  useEffect(() => {
    const handlePop = () => {
      const params = new URLSearchParams(window.location.search);
      setView(params.get('view') === 'broker' ? 'broker' : 'store');
    };
    window.addEventListener('popstate', handlePop);
    return () => window.removeEventListener('popstate', handlePop);
  }, []);

  if (view === 'broker') {
    return (
      <div>
        <div className="bg-amber-500/10 border-b border-amber-500/30 px-4 py-2 text-xs text-amber-300 flex items-center justify-between">
          <span>Modo Vista Previa: ZetaTrade Broker</span>
          <button 
            onClick={() => {
              window.history.pushState({}, '', window.location.pathname);
              setView('store');
            }}
            className="underline font-bold hover:text-white"
          >
            ← Volver a ZetaMall Tienda
          </button>
        </div>
        <XMPlatform />
      </div>
    );
  }

  return <ZetaStore />;
}

