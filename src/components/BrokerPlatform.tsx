import React, { useState, useEffect, useRef } from 'react';
import { 
  ShieldCheck, 
  Wallet, 
  ChevronDown, 
  RotateCcw, 
  Bell, 
  Volume2, 
  VolumeX, 
  User, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight,
  Maximize2,
  DollarSign,
  Award,
  Zap,
  HelpCircle
} from 'lucide-react';
import { BrokerChart, ActiveTrade } from './BrokerChart';
import { BrokerOrderPanel } from './BrokerOrderPanel';
import { BrokerTradesList } from './BrokerTradesList';
import { BrokerAssetModal, TradingAsset, ASSET_LIST } from './BrokerAssetModal';
import { BrokerDepositModal } from './BrokerDepositModal';
import { BrokerAuthModal, BrokerUser } from './BrokerAuthModal';
import { BrokerAdminModal } from './BrokerAdminModal';

// Audio synthesis helper for realistic broker sounds without external assets
class BrokerAudio {
  private ctx: AudioContext | null = null;
  private enabled: boolean = true;

  constructor() {
    // Lazy init
  }

  public setEnabled(val: boolean) {
    this.enabled = val;
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  private initCtx() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public playClick() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(400, this.ctx.currentTime + 0.05);
      gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch {
      // Audio context error ignore
    }
  }

  public playOrderPlaced() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(520, this.ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(780, this.ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.12);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.12);
    } catch {
      // Audio context error ignore
    }
  }

  public playWin() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + i * 0.08);
        gain.gain.setValueAtTime(0.2, now + i * 0.08);
        gain.gain.linearRampToValueAtTime(0, now + i * 0.08 + 0.15);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + i * 0.08);
        osc.stop(now + i * 0.08 + 0.18);
      });
    } catch {
      // Audio context error ignore
    }
  }

  public playLoss() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;
      [350, 280, 220].forEach((freq, i) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, now + i * 0.1);
        gain.gain.setValueAtTime(0.12, now + i * 0.1);
        gain.gain.linearRampToValueAtTime(0, now + i * 0.1 + 0.14);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + i * 0.1);
        osc.stop(now + i * 0.1 + 0.15);
      });
    } catch {
      // Audio context error ignore
    }
  }
}

const brokerSound = new BrokerAudio();

const INITIAL_USERS: BrokerUser[] = [
  {
    id: 'usr_admin',
    name: 'Kervin José (Admin)',
    email: 'kervinjose022@gmail.com',
    password: '1910',
    realBalance: 5000.00,
    demoBalance: 50000.00,
    role: 'admin',
    status: 'active',
    createdAt: '01 Nov 2026',
    tradesCount: 42,
    wonTradesCount: 38
  },
  {
    id: 'usr_carlos',
    name: 'Carlos Trader',
    email: 'carlos.trader@gmail.com',
    password: '123',
    realBalance: 1250.00,
    demoBalance: 10000.00,
    role: 'vip',
    status: 'active',
    createdAt: '02 Nov 2026',
    tradesCount: 28,
    wonTradesCount: 21
  },
  {
    id: 'usr_maria',
    name: 'María Inversora',
    email: 'maria.inversora@hotmail.com',
    password: '123',
    realBalance: 450.00,
    demoBalance: 10000.00,
    role: 'user',
    status: 'active',
    createdAt: '04 Nov 2026',
    tradesCount: 14,
    wonTradesCount: 9
  }
];

export const BrokerPlatform: React.FC = () => {
  // Registered Users & Auth
  const [registeredUsers, setRegisteredUsers] = useState<BrokerUser[]>(() => {
    try {
      const saved = localStorage.getItem('broker_registered_users');
      return saved ? JSON.parse(saved) : INITIAL_USERS;
    } catch {
      return INITIAL_USERS;
    }
  });

  const [currentUser, setCurrentUser] = useState<BrokerUser | null>(() => {
    try {
      const saved = localStorage.getItem('broker_current_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Current active asset
  const [selectedAsset, setSelectedAsset] = useState<TradingAsset>(ASSET_LIST[0]);
  const [currentPrice, setCurrentPrice] = useState<number>(ASSET_LIST[0].price);

  // Balances
  const [isDemoAccount, setIsDemoAccount] = useState<boolean>(true);
  const [demoBalance, setDemoBalance] = useState<number>(() => currentUser ? currentUser.demoBalance : 10000.00);
  const [realBalance, setRealBalance] = useState<number>(() => currentUser ? currentUser.realBalance : 350.00);

  // Sync user changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('broker_registered_users', JSON.stringify(registeredUsers));
    } catch {}
  }, [registeredUsers]);

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem('broker_current_user', JSON.stringify(currentUser));
        setRealBalance(currentUser.realBalance);
        setDemoBalance(currentUser.demoBalance);
      } else {
        localStorage.removeItem('broker_current_user');
      }
    } catch {}
  }, [currentUser]);

  // Trades
  const [activeTrades, setActiveTrades] = useState<ActiveTrade[]>([]);
  const [closedTrades, setClosedTrades] = useState<ActiveTrade[]>([
    {
      id: 'demo-init-1',
      asset: 'XAU/USD',
      type: 'call',
      entryPrice: 3889.40,
      amount: 50,
      payoutPct: 95,
      durationSec: 30,
      startTime: Date.now() - 120000,
      endTime: Date.now() - 90000,
      status: 'won',
      profit: 47.50
    },
    {
      id: 'demo-init-2',
      asset: 'BTC/USDT',
      type: 'put',
      entryPrice: 91600.00,
      amount: 25,
      payoutPct: 92,
      durationSec: 60,
      startTime: Date.now() - 300000,
      endTime: Date.now() - 240000,
      status: 'won',
      profit: 23.00
    }
  ]);

  // UI state
  const [isAssetModalOpen, setIsAssetModalOpen] = useState(false);
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authInitialTab, setAuthInitialTab] = useState<'login' | 'register'>('login');
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [winNotification, setWinNotification] = useState<{ amount: number; isWin: boolean } | null>(null);

  const activeBalance = isDemoAccount ? demoBalance : realBalance;

  // Real-time Trade Settlement Timer (Runs every second)
  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();

      setActiveTrades(prev => {
        const stillActive: ActiveTrade[] = [];
        const newlyClosed: ActiveTrade[] = [];

        prev.forEach(trade => {
          if (now >= trade.endTime) {
            // Settle trade
            const won = trade.type === 'call' 
              ? currentPrice > trade.entryPrice 
              : currentPrice < trade.entryPrice;

            const profit = won ? Math.round((trade.amount * (trade.payoutPct / 100)) * 100) / 100 : -trade.amount;
            const updatedTrade: ActiveTrade = {
              ...trade,
              status: won ? 'won' : 'lost',
              profit: profit
            };

            newlyClosed.push(updatedTrade);

            if (won) {
              brokerSound.playWin();
              setWinNotification({ amount: trade.amount + profit, isWin: true });
              if (isDemoAccount) {
                setDemoBalance(b => Math.round((b + trade.amount + profit) * 100) / 100);
              } else {
                setRealBalance(b => Math.round((b + trade.amount + profit) * 100) / 100);
              }
            } else {
              brokerSound.playLoss();
              setWinNotification({ amount: trade.amount, isWin: false });
            }
          } else {
            stillActive.push(trade);
          }
        });

        if (newlyClosed.length > 0) {
          setClosedTrades(c => [...newlyClosed, ...c]);
          setTimeout(() => setWinNotification(null), 3500);
        }

        return stillActive;
      });
    }, 500);

    return () => clearInterval(timer);
  }, [currentPrice, isDemoAccount]);

  // Execute trade (CALL or PUT)
  const handleExecuteTrade = (type: 'call' | 'put', amount: number, durationSec: number) => {
    if (amount > activeBalance) {
      setIsDepositModalOpen(true);
      return;
    }

    brokerSound.playOrderPlaced();

    // Deduct entry amount
    if (isDemoAccount) {
      setDemoBalance(b => Math.round((b - amount) * 100) / 100);
    } else {
      setRealBalance(b => Math.round((b - amount) * 100) / 100);
    }

    const newTrade: ActiveTrade = {
      id: `trade-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      asset: selectedAsset.symbol,
      type,
      entryPrice: currentPrice,
      amount,
      payoutPct: selectedAsset.payoutPct,
      durationSec,
      startTime: Date.now(),
      endTime: Date.now() + durationSec * 1000,
      status: 'active',
      profit: 0
    };

    setActiveTrades(prev => [newTrade, ...prev]);
  };

  // Reset demo balance
  const handleResetDemo = () => {
    brokerSound.playClick();
    setDemoBalance(10000.00);
    setIsAccountMenuOpen(false);
  };

  // Switch asset
  const handleSelectAsset = (asset: TradingAsset) => {
    brokerSound.playClick();
    setSelectedAsset(asset);
    setCurrentPrice(asset.price);
    setIsAssetModalOpen(false);
  };

  const handleRegisterUser = (newUser: BrokerUser) => {
    setRegisteredUsers(prev => [newUser, ...prev]);
    setCurrentUser(newUser);
    setRealBalance(newUser.realBalance);
    setDemoBalance(newUser.demoBalance);
  };

  const handleLoginSuccess = (user: BrokerUser) => {
    setCurrentUser(user);
    setRealBalance(user.realBalance);
    setDemoBalance(user.demoBalance);
    if (user.role === 'admin') {
      setIsAdminModalOpen(true);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setRealBalance(0);
    setDemoBalance(10000);
    setIsAccountMenuOpen(false);
  };

  const handleUpdateUserBalance = (userId: string, newRealBalance: number) => {
    setRegisteredUsers(prev => prev.map(u => u.id === userId ? { ...u, realBalance: newRealBalance } : u));
    if (currentUser?.id === userId) {
      setCurrentUser(curr => curr ? { ...curr, realBalance: newRealBalance } : null);
      setRealBalance(newRealBalance);
    }
  };

  const handleToggleUserStatus = (userId: string) => {
    setRegisteredUsers(prev => prev.map(u => u.id === userId ? { ...u, status: u.status === 'active' ? 'suspended' : 'active' } : u));
  };

  const handleDeleteUser = (userId: string) => {
    setRegisteredUsers(prev => prev.filter(u => u.id !== userId));
  };

  const handleAddUser = (user: BrokerUser) => {
    setRegisteredUsers(prev => [user, ...prev]);
  };

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    brokerSound.setEnabled(next);
    if (next) brokerSound.playClick();
  };

  return (
    <div className="min-h-screen bg-[#070b14] text-slate-100 flex flex-col font-sans select-none overflow-x-hidden">
      {/* Broker Navigation Bar */}
      <header className="h-14 bg-[#090f1e] border-b border-slate-800/80 px-3 md:px-5 flex items-center justify-between sticky top-0 z-30 shadow-md">
        {/* Left: Brand & Asset Switcher */}
        <div className="flex items-center gap-3">
          {/* Logo */}
          <div className="flex items-center gap-2 pr-3 border-r border-slate-800">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-500 to-amber-300 flex items-center justify-center shadow-lg shadow-amber-500/20">
              <TrendingUp className="w-5 h-5 text-slate-950 stroke-[2.5]" />
            </div>
            <div className="hidden sm:flex flex-col">
              <span className="font-black text-sm tracking-wide text-white flex items-center gap-1.5">
                GOLD BROKER
                <span className="text-[9px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-1 py-0.2 rounded font-mono font-bold">
                  PRO
                </span>
              </span>
              {/* Botón camuflado de administrador al tocar el texto de versión */}
              <button
                type="button"
                onClick={() => setIsAdminModalOpen(true)}
                title="Consola de Seguridad"
                className="text-[10px] text-slate-400 font-mono -mt-0.5 hover:text-amber-400 transition-colors text-left flex items-center gap-1 group cursor-pointer"
              >
                <span>TRADING ENGINE v2.4</span>
                <span className="opacity-0 group-hover:opacity-100 text-[9px] text-amber-400">🛡️</span>
              </button>
            </div>
          </div>

          {/* Asset Selector Button */}
          <button
            onClick={() => { brokerSound.playClick(); setIsAssetModalOpen(true); }}
            className="flex items-center gap-2.5 bg-slate-950/80 hover:bg-slate-900 border border-slate-800 hover:border-amber-500/50 px-3 py-1.5 rounded-xl transition-all cursor-pointer group"
          >
            <div className="flex flex-col text-left">
              <div className="flex items-center gap-2">
                <span className="font-black text-xs md:text-sm text-white group-hover:text-amber-400 transition-colors">
                  {selectedAsset.symbol}
                </span>
                <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-1.5 py-0.5 rounded text-[10px] font-mono font-black">
                  +{selectedAsset.payoutPct}%
                </span>
              </div>
              <span className="text-[10px] text-slate-400 hidden md:inline truncate max-w-[120px]">
                {selectedAsset.name}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-transform group-hover:translate-y-0.5" />
          </button>
        </div>

        {/* Center: Live Real-Time Ticker & Market Status */}
        <div className="hidden lg:flex items-center gap-3 bg-slate-950/60 border border-slate-800/80 px-3 py-1 rounded-full">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-[11px] font-bold text-slate-300">Mercado Spot Activo</span>
          </div>
          <span className="text-slate-700">|</span>
          <span className="font-mono text-xs font-black text-amber-400">
            ${currentPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
          </span>
          <span className={`text-[10px] font-bold flex items-center ${selectedAsset.change24h >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {selectedAsset.change24h >= 0 ? '+' : ''}{selectedAsset.change24h}%
          </span>
        </div>

        {/* Right: Auth Buttons, Account Switcher, Deposit Button, Controls */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Botones de Registro / Iniciar Sesión o Usuario Logueado */}
          {!currentUser ? (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => { setAuthInitialTab('login'); setIsAuthModalOpen(true); }}
                className="text-xs font-bold px-2.5 py-1.5 rounded-xl border border-slate-800 bg-slate-950 text-slate-300 hover:text-white hover:border-slate-700 transition-colors cursor-pointer"
              >
                Iniciar Sesión
              </button>
              <button
                onClick={() => { setAuthInitialTab('register'); setIsAuthModalOpen(true); }}
                className="text-xs font-black px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors cursor-pointer shadow-sm shadow-amber-500/20"
              >
                Registrarse
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 px-2 py-1 rounded-xl text-xs">
              <div className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-[10px]">
                {currentUser.name.charAt(0).toUpperCase()}
              </div>
              <span className="font-bold text-white text-[11px] hidden sm:inline max-w-[90px] truncate">{currentUser.name}</span>
              {currentUser.role === 'admin' && (
                <button
                  onClick={() => setIsAdminModalOpen(true)}
                  className="bg-amber-500/20 text-amber-300 text-[10px] font-mono font-black px-1.5 py-0.2 rounded border border-amber-500/40 cursor-pointer hover:bg-amber-500/30"
                >
                  ADMIN
                </button>
              )}
              <button
                onClick={handleLogout}
                title="Cerrar Sesión"
                className="text-slate-400 hover:text-rose-400 text-[10px] ml-1 cursor-pointer font-bold"
              >
                ✕
              </button>
            </div>
          )}

          {/* Account Balance Switcher */}
          <div className="relative">
            <button
              onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
              className="flex items-center gap-2 bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 px-3 py-1.5 rounded-xl transition-all cursor-pointer"
            >
              <div className="text-right">
                <div className="flex items-center justify-end gap-1.5">
                  <span className={`text-[9px] uppercase font-black px-1.5 py-0.2 rounded ${
                    isDemoAccount ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  }`}>
                    {isDemoAccount ? 'DEMO' : 'REAL'}
                  </span>
                  <span className="font-mono font-black text-xs md:text-sm text-white">
                    ${activeBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Account dropdown menu */}
            {isAccountMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-[#0c1427] border border-slate-800 rounded-2xl p-2 shadow-2xl z-50 animate-fade-in">
                <div className="text-[10px] font-bold text-slate-400 px-3 py-1">Seleccionar Tipo de Cuenta</div>
                
                {/* Real option */}
                <button
                  onClick={() => { setIsDemoAccount(false); setIsAccountMenuOpen(false); brokerSound.playClick(); }}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-colors cursor-pointer ${
                    !isDemoAccount ? 'bg-emerald-500/10 border border-emerald-500/30 text-white' : 'hover:bg-slate-800/60 text-slate-300'
                  }`}
                >
                  <div>
                    <div className="font-bold text-xs flex items-center gap-1.5 text-emerald-400">
                      <span>Cuenta Real (En Vivo)</span>
                    </div>
                    <div className="font-mono font-black text-sm text-white">${realBalance.toFixed(2)} USD</div>
                  </div>
                  {!isDemoAccount && <ShieldCheck className="w-4 h-4 text-emerald-400" />}
                </button>

                {/* Demo option */}
                <button
                  onClick={() => { setIsDemoAccount(true); setIsAccountMenuOpen(false); brokerSound.playClick(); }}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-colors mt-1 cursor-pointer ${
                    isDemoAccount ? 'bg-amber-500/10 border border-amber-500/30 text-white' : 'hover:bg-slate-800/60 text-slate-300'
                  }`}
                >
                  <div>
                    <div className="font-bold text-xs flex items-center gap-1.5 text-amber-400">
                      <span>Cuenta Demo de Práctica</span>
                    </div>
                    <div className="font-mono font-black text-sm text-white">${demoBalance.toFixed(2)} USD</div>
                  </div>
                  {isDemoAccount && <ShieldCheck className="w-4 h-4 text-amber-400" />}
                </button>

                {/* Reset demo balance */}
                {isDemoAccount && (
                  <button
                    onClick={handleResetDemo}
                    className="w-full mt-2 pt-2 border-t border-slate-800 text-[11px] font-bold text-amber-400 hover:text-amber-300 flex items-center justify-center gap-1.5 p-1.5 rounded-lg hover:bg-amber-500/10 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Recargar Demo a $10,000 USD</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Quick Deposit Button */}
          <button
            onClick={() => { brokerSound.playClick(); setIsDepositModalOpen(true); }}
            className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs md:text-sm px-3 md:px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer active:scale-95"
          >
            <Wallet className="w-4 h-4" />
            <span>DEPOSITAR</span>
          </button>

          {/* Audio toggle */}
          <button
            onClick={toggleSound}
            title={soundEnabled ? 'Silenciar sonidos de trading' : 'Activar sonidos de trading'}
            className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-950 border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-amber-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
          </button>

          {/* Botón camuflado discreto de Admin */}
          <button
            onClick={() => setIsAdminModalOpen(true)}
            title="Consola de Seguridad"
            className="p-1 text-slate-600 hover:text-amber-400 transition-colors cursor-pointer text-xs"
          >
            🛡️
          </button>
        </div>
      </header>

      {/* Win / Loss Toast Banner */}
      {winNotification && (
        <div className={`fixed top-16 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-2xl shadow-2xl border flex items-center gap-3 animate-bounce ${
          winNotification.isWin 
            ? 'bg-emerald-950/90 border-emerald-500 text-emerald-200 shadow-emerald-500/30'
            : 'bg-rose-950/90 border-rose-500 text-rose-200 shadow-rose-500/30'
        }`}>
          {winNotification.isWin ? (
            <>
              <div className="w-7 h-7 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-black">✓</div>
              <div>
                <div className="text-xs font-black uppercase tracking-wider text-emerald-400">¡OPERACIÓN GANADA!</div>
                <div className="font-mono font-bold text-sm">+${winNotification.amount.toFixed(2)} USD acreditados</div>
              </div>
            </>
          ) : (
            <>
              <div className="w-7 h-7 rounded-full bg-rose-500 text-white flex items-center justify-center font-black">✕</div>
              <div>
                <div className="text-xs font-black uppercase tracking-wider text-rose-400">OPERACIÓN EXPIRADA</div>
                <div className="font-mono font-bold text-sm">-${winNotification.amount.toFixed(2)} USD</div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Main Broker Workspace */}
      <main className="flex-1 p-2 md:p-3 flex flex-col lg:flex-row gap-3 max-w-[1920px] mx-auto w-full">
        {/* Left Section: Interactive High-Speed Chart & Trades Table */}
        <div className="flex-1 flex flex-col gap-3 min-w-0">
          {/* Real-Time Trading Chart */}
          <div className="flex-1 min-h-[460px] md:min-h-[540px]">
            <BrokerChart
              assetSymbol={selectedAsset.symbol}
              assetName={selectedAsset.name}
              currentPrice={currentPrice}
              payoutPct={selectedAsset.payoutPct}
              activeTrades={activeTrades}
              onPriceTick={(newPrice) => setCurrentPrice(newPrice)}
              onOpenAssetPicker={() => setIsAssetModalOpen(true)}
            />
          </div>

          {/* Active & Closed Trades Component */}
          <div className="w-full">
            <BrokerTradesList
              activeTrades={activeTrades}
              closedTrades={closedTrades}
              currentPrice={currentPrice}
            />
          </div>
        </div>

        {/* Right Section: Tactile Binary Order Execution Panel */}
        <div className="w-full lg:w-80 flex flex-col gap-3">
          <BrokerOrderPanel
            currentPrice={currentPrice}
            payoutPct={selectedAsset.payoutPct}
            userBalance={activeBalance}
            isDemoAccount={isDemoAccount}
            onExecuteTrade={handleExecuteTrade}
            onOpenDeposit={() => setIsDepositModalOpen(true)}
          />

          {/* Market Sentiment & Trading Signals Info Widget */}
          <div className="bg-[#090f1d] border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-bold flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                Señal del Algoritmo Pro
              </span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-mono font-bold">
                98.4% FIABILIDAD
              </span>
            </div>

            <div className="p-3 bg-slate-950/70 rounded-xl border border-slate-800/80 flex items-center justify-between">
              <div>
                <div className="text-[11px] text-slate-400">Tendencia {selectedAsset.symbol}</div>
                <div className="text-sm font-black text-emerald-400 flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" /> COMPRA FUERTE
                </div>
              </div>
              <div className="text-right font-mono text-xs text-slate-300">
                <div>RSI: <span className="text-amber-400">58.2</span></div>
                <div>MACD: <span className="text-emerald-400">Alcista</span></div>
              </div>
            </div>

            <div className="text-[11px] text-slate-500 leading-relaxed">
              Ejecución garantizada a cero slippage con cotización directa de liquidez interbancaria.
            </div>
          </div>
        </div>
      </main>

      {/* Asset Switcher Modal */}
      <BrokerAssetModal
        isOpen={isAssetModalOpen}
        onClose={() => setIsAssetModalOpen(false)}
        selectedSymbol={selectedAsset.symbol}
        onSelectAsset={handleSelectAsset}
      />

      {/* Deposit & Cashier Modal */}
      <BrokerDepositModal
        isOpen={isDepositModalOpen}
        onClose={() => setIsDepositModalOpen(false)}
        userBalance={realBalance}
        onDepositSuccess={(amt) => {
          brokerSound.playWin();
          setRealBalance(b => Math.round((b + amt) * 100) / 100);
        }}
        onWithdrawSuccess={(amt) => {
          brokerSound.playClick();
          setRealBalance(b => Math.round((b - amt) * 100) / 100);
        }}
      />

      {/* Auth Modal (Login / Registro) */}
      <BrokerAuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        initialTab={authInitialTab}
        onLoginSuccess={handleLoginSuccess}
        existingUsers={registeredUsers}
        onRegisterUser={handleRegisterUser}
      />

      {/* Panel de Control de Administrador Camuflado */}
      <BrokerAdminModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
        users={registeredUsers}
        onUpdateUserBalance={handleUpdateUserBalance}
        onToggleUserStatus={handleToggleUserStatus}
        onDeleteUser={handleDeleteUser}
        onAddUser={handleAddUser}
      />
    </div>
  );
};
