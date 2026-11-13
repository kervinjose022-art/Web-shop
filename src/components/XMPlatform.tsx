import React, { useState, useEffect } from 'react';
import { 
  Home, 
  BarChart2, 
  TrendingUp, 
  Briefcase, 
  Menu, 
  Bell, 
  Wallet, 
  ChevronDown, 
  Plus, 
  Check, 
  ShieldCheck, 
  Volume2, 
  VolumeX,
  User,
  Smartphone
} from 'lucide-react';
import { XmHomeView } from './XmHomeView';
import { XmMarketsView, MarketAsset, XM_MARKET_ASSETS } from './XmMarketsView';
import { XmTradingView } from './XmTradingView';
import { XmPortfolioView, ActivePosition, ClosedPosition } from './XmPortfolioView';
import { XmProfileView } from './XmProfileView';
import { XmOrderModal } from './XmOrderModal';
import { XmAssetPickerSheet } from './XmAssetPickerSheet';
import { BrokerDepositModal } from './BrokerDepositModal';
import { BrokerAuthModal, BrokerUser } from './BrokerAuthModal';
import { BrokerAdminModal } from './BrokerAdminModal';
import { XmApkModal } from './XmApkModal';

const INITIAL_USERS: BrokerUser[] = [
  {
    id: 'usr_kervin',
    name: 'Kervin José (Admin)',
    email: 'kervinjose022@gmail.com',
    password: '1910',
    realBalance: 5000.00,
    demoBalance: 10000.63,
    role: 'admin',
    status: 'active',
    createdAt: '01 Nov 2026',
    tradesCount: 42,
    wonTradesCount: 38
  },
  {
    id: 'usr_trader_1',
    name: 'Carlos Trader',
    email: 'carlos@trader.com',
    password: '123',
    realBalance: 1250.00,
    demoBalance: 10000.00,
    role: 'vip',
    status: 'active',
    createdAt: '02 Nov 2026',
    tradesCount: 28,
    wonTradesCount: 21
  }
];

export const XMPlatform: React.FC = () => {
  // Navigation tabs: 'inicio' | 'mercados' | 'trading' | 'cartera' | 'mas'
  const [activeTab, setActiveTab] = useState<'inicio' | 'mercados' | 'trading' | 'cartera' | 'mas'>('trading');

  // Active trading asset
  const [selectedAsset, setSelectedAsset] = useState<MarketAsset>(XM_MARKET_ASSETS[0]);
  const [currentPrice, setCurrentPrice] = useState<number>(XM_MARKET_ASSETS[0].price);

  // Accounts & Balances
  const [isDemo, setIsDemo] = useState<boolean>(true);
  const [demoBalance, setDemoBalance] = useState<number>(10000.63);
  const [realBalance, setRealBalance] = useState<number>(0.00);

  // Users & Auth
  const [registeredUsers, setRegisteredUsers] = useState<BrokerUser[]>(() => {
    try {
      const s = localStorage.getItem('xm_registered_users');
      return s ? JSON.parse(s) : INITIAL_USERS;
    } catch {
      return INITIAL_USERS;
    }
  });

  const [currentUser, setCurrentUser] = useState<BrokerUser | null>(() => {
    try {
      const s = localStorage.getItem('xm_current_user');
      return s ? JSON.parse(s) : INITIAL_USERS[0]; // Auto-login Kervin as default
    } catch {
      return INITIAL_USERS[0];
    }
  });

  // Positions (CFD/Forex style)
  const [activePositions, setActivePositions] = useState<ActivePosition[]>([]);
  const [closedPositions, setClosedPositions] = useState<ClosedPosition[]>([
    {
      id: 'cp_1',
      assetSymbol: 'GOLD',
      type: 'buy',
      lots: 0.05,
      entryPrice: 4055.20,
      closePrice: 4066.44,
      pnl: 56.20,
      closeTime: '06 Nov 07:15'
    }
  ]);

  // Modals state
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [orderModalType, setOrderModalType] = useState<'buy' | 'sell'>('buy');
  const [isAssetPickerOpen, setIsAssetPickerOpen] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isApkModalOpen, setIsApkModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const activeBalance = isDemo ? demoBalance : realBalance;

  // Listen for PWA beforeinstallprompt event on Android Chrome
  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      (window as unknown as { deferredPwaPrompt?: unknown }).deferredPwaPrompt = e;
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  // Real-time market tick simulator
  useEffect(() => {
    const timer = setInterval(() => {
      const vol = currentPrice * 0.0002;
      const delta = (Math.random() - 0.498) * vol;
      setCurrentPrice(prev => Math.round((prev + delta) * 100) / 100);
    }, 600);
    return () => clearInterval(timer);
  }, [currentPrice]);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('xm_registered_users', JSON.stringify(registeredUsers));
    } catch {}
  }, [registeredUsers]);

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('xm_current_user', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('xm_current_user');
      }
    } catch {}
  }, [currentUser]);

  // Handle open order modal
  const handleOpenOrder = (type: 'buy' | 'sell') => {
    setOrderModalType(type);
    setIsOrderModalOpen(true);
  };

  // Confirm order execution
  const handleConfirmOrder = (order: {
    type: 'buy' | 'sell';
    lots: number;
    entryPrice: number;
    takeProfit?: number;
    stopLoss?: number;
  }) => {
    const marginReq = Math.round(order.lots * 2000 * 100) / 100;
    if (marginReq > activeBalance) {
      setIsDepositModalOpen(true);
      return;
    }

    // Deduct margin
    if (isDemo) setDemoBalance(b => Math.round((b - marginReq) * 100) / 100);
    else setRealBalance(b => Math.round((b - marginReq) * 100) / 100);

    const newPos: ActivePosition = {
      id: `pos_${Date.now()}`,
      assetSymbol: selectedAsset.symbol,
      type: order.type,
      lots: order.lots,
      entryPrice: order.entryPrice,
      openTime: Date.now(),
      takeProfit: order.takeProfit,
      stopLoss: order.stopLoss
    };

    setActivePositions(prev => [newPos, ...prev]);
    setToastMessage(`¡Orden de ${order.type === 'buy' ? 'COMPRA' : 'VENTA'} ejecutada con éxito!`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Close position
  const handleClosePosition = (posId: string) => {
    const target = activePositions.find(p => p.id === posId);
    if (!target) return;

    const diff = target.type === 'buy' ? currentPrice - target.entryPrice : target.entryPrice - currentPrice;
    const pnl = Math.round(diff * target.lots * 100 * 100) / 100;
    const marginReturned = Math.round(target.lots * 2000 * 100) / 100;
    const netReturn = marginReturned + pnl;

    if (isDemo) setDemoBalance(b => Math.round((b + netReturn) * 100) / 100);
    else setRealBalance(b => Math.round((b + netReturn) * 100) / 100);

    setActivePositions(prev => prev.filter(p => p.id !== posId));
    setClosedPositions(prev => [
      {
        id: `cp_${Date.now()}`,
        assetSymbol: target.assetSymbol,
        type: target.type,
        lots: target.lots,
        entryPrice: target.entryPrice,
        closePrice: currentPrice,
        pnl,
        closeTime: 'Ahora'
      },
      ...prev
    ]);

    setToastMessage(`Posición cerrada: ${pnl >= 0 ? `+$${pnl.toFixed(2)} USD` : `-$${Math.abs(pnl).toFixed(2)} USD`}`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Select asset from Markets or Sheet
  const handleSelectAsset = (asset: MarketAsset) => {
    setSelectedAsset(asset);
    setCurrentPrice(asset.price);
    setActiveTab('trading');
  };

  return (
    <div className="min-h-screen bg-[#070c17] text-slate-100 flex flex-col font-sans select-none overflow-x-hidden">
      {/* Top Header (Persistent on all views) */}
      <header className="h-14 bg-[#090f1e] border-b border-slate-800/80 px-2 sm:px-4 flex items-center justify-between sticky top-0 z-30 shadow-md">
        {/* Brand & Account balance */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          <button 
            onClick={() => setActiveTab('inicio')} 
            className="flex items-center gap-1.5 cursor-pointer hover:opacity-90 transition-opacity"
            title="ZetaTrade"
          >
            <img 
              src="/zetatrade_logo.png" 
              alt="ZetaTrade" 
              className="w-8 h-8 rounded-xl object-cover border border-amber-500/40 shadow-sm shadow-amber-500/20" 
            />
            <span className="hidden sm:inline font-black text-sm tracking-tight text-white">
              Zeta<span className="text-amber-400">Trade</span>
            </span>
          </button>

          {/* Account balance chip button */}
          <button
            onClick={() => setIsAccountModalOpen(true)}
            className="flex items-center gap-1.5 sm:gap-2 bg-[#0c1427] hover:bg-slate-900 border border-slate-800 hover:border-slate-700 px-2.5 sm:px-3 py-1.5 rounded-2xl transition-all cursor-pointer group"
          >
            <span className={`w-5 h-5 rounded-full flex items-center justify-center font-black text-[10px] ${
              isDemo ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
            }`}>
              {isDemo ? 'D' : 'R'}
            </span>
            <span className="font-mono font-black text-xs sm:text-sm text-white group-hover:text-amber-400 transition-colors">
              ${activeBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-transform" />
          </button>
        </div>

        {/* Right Action Icons: Notifications, Wallet, Profile */}
        <div className="flex items-center gap-2">
          {/* Notifications */}
          <button 
            onClick={() => setToastMessage('No hay notificaciones nuevas en este momento.')}
            className="w-8 h-8 rounded-xl bg-[#0c1427] border border-slate-800 flex items-center justify-center text-slate-400 hover:text-white cursor-pointer"
          >
            <Bell className="w-4 h-4" />
          </button>

          {/* Wallet / Deposit */}
          <button 
            onClick={() => setIsDepositModalOpen(true)}
            className="w-8 h-8 rounded-xl bg-[#0c1427] border border-slate-800 flex items-center justify-center text-emerald-400 hover:bg-emerald-500/10 cursor-pointer"
            title="Depositar saldo"
          >
            <Wallet className="w-4 h-4" />
          </button>

          {/* Descargar / Instalar APK */}
          <button 
            onClick={() => setIsApkModalOpen(true)}
            className="flex items-center gap-1 bg-gradient-to-r from-cyan-600/30 to-blue-600/30 hover:from-cyan-600/50 hover:to-blue-600/50 border border-cyan-500/40 text-cyan-300 px-2 sm:px-2.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm shadow-cyan-500/10 active:scale-95"
            title="Descargar APK / Instalar App Móvil"
          >
            <Smartphone className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[10px] sm:text-[11px] font-black tracking-wide">APK</span>
          </button>

          {/* Profile Avatar & Camouflaged Super Admin trigger */}
          <div className="relative group">
            <button
              onClick={() => setActiveTab('mas')}
              className="w-8 h-8 rounded-xl bg-blue-600 text-white font-black text-xs flex items-center justify-center cursor-pointer shadow-md shadow-blue-500/20"
            >
              KP
            </button>
          </div>

          {/* Camouflaged Secret Admin Button (Discreet Shield) */}
          <button
            onClick={() => setIsAdminModalOpen(true)}
            title="Consola de Seguridad"
            className="p-1 text-slate-700 hover:text-amber-400 transition-colors cursor-pointer text-xs"
          >
            🛡️
          </button>
        </div>
      </header>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 bg-[#0d1629] border border-amber-500/50 text-white text-xs font-bold px-4 py-2 rounded-2xl shadow-2xl animate-bounce">
          {toastMessage}
        </div>
      )}

      {/* Active Tab Screen */}
      <main className="flex-1 flex flex-col min-h-0">
        {activeTab === 'inicio' && (
          <XmHomeView
            userBalance={activeBalance}
            isDemo={isDemo}
            onNavigateToTrading={() => setActiveTab('trading')}
            onOpenDeposit={() => setIsDepositModalOpen(true)}
            onSwitchAccountModal={() => setIsAccountModalOpen(true)}
            activePositionsCount={activePositions.length}
          />
        )}

        {activeTab === 'mercados' && (
          <XmMarketsView
            onSelectAsset={handleSelectAsset}
          />
        )}

        {activeTab === 'trading' && (
          <XmTradingView
            assetSymbol={selectedAsset.symbol}
            assetName={selectedAsset.name}
            currentPrice={currentPrice}
            onOpenAssetPicker={() => setIsAssetPickerOpen(true)}
            onOpenOrderModal={handleOpenOrder}
            activePositionsCount={activePositions.length}
          />
        )}

        {activeTab === 'cartera' && (
          <XmPortfolioView
            activePositions={activePositions}
            closedPositions={closedPositions}
            currentPrice={currentPrice}
            onClosePosition={handleClosePosition}
            onNavigateToTrading={() => setActiveTab('trading')}
          />
        )}

        {activeTab === 'mas' && (
          <XmProfileView
            currentUser={currentUser}
            onOpenAdmin={() => setIsAdminModalOpen(true)}
            onOpenAuth={() => setIsAuthModalOpen(true)}
            onOpenApkModal={() => setIsApkModalOpen(true)}
            onLogout={() => {
              setCurrentUser(null);
              setIsDemo(true);
            }}
          />
        )}
      </main>

      {/* EXACT XM STYLE BOTTOM NAVIGATION BAR (5 TABS) */}
      <nav className="fixed bottom-0 left-0 right-0 h-16 bg-[#080d1a] border-t border-slate-800/80 px-2 flex items-center justify-around z-40 backdrop-blur-md">
        {/* Inicio */}
        <button
          onClick={() => setActiveTab('inicio')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors cursor-pointer ${
            activeTab === 'inicio' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Inicio</span>
        </button>

        {/* Mercados */}
        <button
          onClick={() => setActiveTab('mercados')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors cursor-pointer ${
            activeTab === 'mercados' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <BarChart2 className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Mercados</span>
        </button>

        {/* Trading (Center Highlight) */}
        <button
          onClick={() => setActiveTab('trading')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors cursor-pointer ${
            activeTab === 'trading' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="relative">
            <TrendingUp className="w-5 h-5" />
            <div className={`w-1 h-1 rounded-full mx-auto mt-0.5 ${activeTab === 'trading' ? 'bg-emerald-400' : 'opacity-0'}`} />
          </div>
          <span className="text-[10px]">Trading</span>
        </button>

        {/* Cartera */}
        <button
          onClick={() => setActiveTab('cartera')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors cursor-pointer relative ${
            activeTab === 'cartera' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <div className="relative">
            <Briefcase className="w-5 h-5" />
            {activePositions.length > 0 && (
              <span className="absolute -top-1 -right-2 bg-emerald-500 text-slate-950 font-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
                {activePositions.length}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-0.5">Cartera</span>
        </button>

        {/* Más */}
        <button
          onClick={() => setActiveTab('mas')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors cursor-pointer ${
            activeTab === 'mas' ? 'text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Menu className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Más</span>
        </button>
      </nav>

      {/* Bottom Sheet for Account Switching (Standard Demo vs Standard Real) */}
      {isAccountModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-lg bg-[#0d1527] border-t border-slate-800 rounded-t-3xl p-5 shadow-2xl text-white">
            <div className="w-12 h-1 bg-slate-700 rounded-full mx-auto mb-3" />
            <h3 className="font-black text-center text-base mb-4">Seleccione cuenta</h3>

            <div className="space-y-2">
              {/* Demo Account Option */}
              <button
                onClick={() => {
                  setIsDemo(true);
                  setIsAccountModalOpen(false);
                }}
                className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between cursor-pointer transition-all ${
                  isDemo ? 'border-amber-500 bg-amber-500/10' : 'border-slate-800 bg-slate-900/60 hover:bg-slate-800'
                }`}
              >
                <div>
                  <div className="text-xs text-slate-400">Standard</div>
                  <div className="font-mono font-black text-lg text-white">${demoBalance.toFixed(2)}</div>
                  <div className="text-[10px] text-slate-500 font-mono">#108626489, Standard, MT5</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold px-2 py-0.5 rounded-full">
                    Demo
                  </span>
                  {isDemo && <Check className="w-5 h-5 text-amber-400" />}
                </div>
              </button>

              {/* Real Account Option */}
              <button
                onClick={() => {
                  setIsDemo(false);
                  setIsAccountModalOpen(false);
                }}
                className={`w-full p-4 rounded-2xl border text-left flex items-center justify-between cursor-pointer transition-all ${
                  !isDemo ? 'border-emerald-500 bg-emerald-500/10' : 'border-slate-800 bg-slate-900/60 hover:bg-slate-800'
                }`}
              >
                <div>
                  <div className="text-xs text-slate-400">Standard</div>
                  <div className="font-mono font-black text-lg text-white">${realBalance.toFixed(2)}</div>
                  <div className="text-[10px] text-slate-500 font-mono">#430726287, Standard, MT5</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold px-2 py-0.5 rounded-full">
                    Real
                  </span>
                  {!isDemo && <Check className="w-5 h-5 text-emerald-400" />}
                </div>
              </button>
            </div>

            <button
              onClick={() => {
                setIsAccountModalOpen(false);
                setIsDepositModalOpen(true);
              }}
              className="w-full mt-4 py-3 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase cursor-pointer"
            >
              + Crear nueva cuenta o Depositar
            </button>
          </div>
        </div>
      )}

      {/* Order Placement Modal */}
      <XmOrderModal
        isOpen={isOrderModalOpen}
        onClose={() => setIsOrderModalOpen(false)}
        type={orderModalType}
        assetSymbol={selectedAsset.symbol}
        assetName={selectedAsset.name}
        currentPrice={currentPrice}
        userBalance={activeBalance}
        isDemo={isDemo}
        onConfirmOrder={handleConfirmOrder}
      />

      {/* Asset Picker Sheet */}
      <XmAssetPickerSheet
        isOpen={isAssetPickerOpen}
        onClose={() => setIsAssetPickerOpen(false)}
        selectedSymbol={selectedAsset.symbol}
        onSelectAsset={handleSelectAsset}
      />

      {/* Cashier / Deposit Modal */}
      <BrokerDepositModal
        isOpen={isDepositModalOpen}
        onClose={() => setIsDepositModalOpen(false)}
        userBalance={realBalance}
        onDepositSuccess={(amt) => {
          setRealBalance(b => Math.round((b + amt) * 100) / 100);
          setToastMessage(`¡Depósito de $${amt.toFixed(2)} USD acreditado!`);
          setTimeout(() => setToastMessage(null), 3000);
        }}
        onWithdrawSuccess={(amt) => {
          setRealBalance(b => Math.round((b - amt) * 100) / 100);
          setToastMessage(`¡Retiro de $${amt.toFixed(2)} USD procesado!`);
          setTimeout(() => setToastMessage(null), 3000);
        }}
      />

      {/* Auth Modal */}
      <BrokerAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialTab="login"
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          setRealBalance(user.realBalance);
          setDemoBalance(user.demoBalance);
          if (user.role === 'admin') setIsAdminModalOpen(true);
        }}
        existingUsers={registeredUsers}
        onRegisterUser={(nu) => setRegisteredUsers(prev => [nu, ...prev])}
      />

      {/* Super Admin Panel Modal */}
      <BrokerAdminModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        users={registeredUsers}
        onUpdateUserBalance={(uid, amt) => {
          setRegisteredUsers(prev => prev.map(u => u.id === uid ? { ...u, realBalance: amt } : u));
          if (currentUser?.id === uid) setRealBalance(amt);
        }}
        onToggleUserStatus={(uid) => {
          setRegisteredUsers(prev => prev.map(u => u.id === uid ? { ...u, status: u.status === 'active' ? 'suspended' : 'active' } : u));
        }}
        onDeleteUser={(uid) => setRegisteredUsers(prev => prev.filter(u => u.id !== uid))}
        onAddUser={(nu) => setRegisteredUsers(prev => [nu, ...prev])}
      />

      {/* APK & App Installation Modal */}
      <XmApkModal
        isOpen={isApkModalOpen}
        onClose={() => setIsApkModalOpen(false)}
      />
    </div>
  );
};
