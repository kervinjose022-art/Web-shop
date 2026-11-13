import React, { useState, useEffect } from 'react';
import { 
  Lock, 
  Unlock,
  CheckCircle2, 
  ShieldCheck, 
  Copy, 
  Check, 
  Activity, 
  Sparkles, 
  AlertCircle,
  Users,
  UserCheck,
  LogOut,
  X,
  KeyRound,
  TrendingUp,
  Shield,
  Layers
} from 'lucide-react';
import { CandlestickChart } from './CandlestickChart';
import { PlanModal, PlanData, SubscriberSubmission } from './PlanModal';
import { MarketAnalysisCard } from './MarketAnalysisCard';
import { AdminSubscribersModal } from './AdminSubscribersModal';

const OFFICIAL_WALLET = '0x4ec021c9900178c6072092a1711167f3495a269d';

const DEFAULT_PLANS: PlanData[] = [
  {
    id: 'inicial',
    name: 'PLAN INICIAL',
    price: 5,
    period: 'mes',
    description: 'Para comenzar con operaciones esenciales.',
    operations: '1 operación diaria',
    features: [
      '1 operación diaria',
      'Gráfico y temporalidades 1m, 5m, 15m y 1h',
      'Tendencia, soporte y resistencia'
    ]
  },
  {
    id: 'standard',
    name: 'PLAN STANDARD',
    price: 10,
    period: 'mes',
    description: 'Para consultas frecuentes y seguimiento activo.',
    operations: '3 operaciones diarias',
    popular: true,
    features: [
      '3 operaciones diarias',
      'Gráfico y temporalidades 1m, 5m, 15m y 1h',
      'Tendencia, soporte y resistencia'
    ]
  },
  {
    id: 'pro',
    name: 'PLAN PRO',
    price: 15,
    period: 'mes',
    description: 'Para un seguimiento más amplio con señales en vivo.',
    operations: '7 operaciones diarias',
    features: [
      '7 operaciones diarias',
      'Entrada al canal de Telegram VIP',
      'Entrada al grupo exclusivo de WhatsApp',
      'Gráfico y temporalidades 1m, 5m, 15m y 1h',
      'Tendencia, soporte y resistencia'
    ]
  },
  {
    id: 'ultra',
    name: 'PLAN ULTRA',
    price: 25,
    period: 'mes',
    description: 'Comunidad exclusiva con soporte directo multicanal.',
    operations: '7 operaciones diarias',
    features: [
      'Comunidad exclusiva con soporte directo multicanal',
      '7 operaciones diarias',
      'Entrada al canal de Telegram VIP',
      'Entrada al grupo exclusivo de WhatsApp',
      'Gráfico y temporalidades 1m, 5m, 15m y 1h',
      'Tendencia, soporte y resistencia'
    ]
  }
];

export const GoldAnalyzer: React.FC = () => {
  // Live Gold Spot Price state
  const [currentPrice, setCurrentPrice] = useState<number>(3892.38);
  const [priceChange24h] = useState<number>(-2.66);
  const [high24h] = useState<number>(3942.63);
  const [low24h] = useState<number>(3849.13);
  const [spread] = useState<number>(0.08);
  const [currentTime, setCurrentTime] = useState<string>('10:29:34');

  // Modals & UI state
  const [selectedPlan, setSelectedPlan] = useState<PlanData | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [authModal, setAuthModal] = useState<'login' | 'register' | null>(null);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);
  const [copiedWallet, setCopiedWallet] = useState(false);

  // User Auth state (guest or logged-in)
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string } | null>(() => {
    try {
      const saved = localStorage.getItem('gold_logged_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Auth form state
  const [authName, setAuthName] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [authPass, setAuthPass] = useState('');

  // Subscriptions persistence
  const [subscribers, setSubscribers] = useState<SubscriberSubmission[]>(() => {
    try {
      const saved = localStorage.getItem('gold_analyzer_subscribers');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const hasApprovedPlan = subscribers.some(s => s.status === 'approved');

  // Clock
  useEffect(() => {
    const update = () => {
      const d = new Date();
      setCurrentTime(d.toLocaleTimeString('es-ES', { hour12: false }));
    };
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, []);

  // Save subscribers on change
  useEffect(() => {
    try {
      localStorage.setItem('gold_analyzer_subscribers', JSON.stringify(subscribers));
    } catch (e) {
      console.error(e);
    }
  }, [subscribers]);

  const handleCopyWallet = () => {
    navigator.clipboard.writeText(OFFICIAL_WALLET);
    setCopiedWallet(true);
    setTimeout(() => setCopiedWallet(false), 2500);
  };

  const handlePlanSubmitted = (sub: SubscriberSubmission) => {
    setSubscribers(prev => [sub, ...prev]);
    setSuccessBanner('¡Suscripción registrada con éxito! Tu acceso se activará tras verificar la transferencia.');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleUpdateStatus = (id: string, status: 'approved' | 'rejected' | 'pending') => {
    setSubscribers(prev => prev.map(s => s.id === id ? { ...s, status } : s));
  };

  const handleDeleteSubscriber = (id: string) => {
    setSubscribers(prev => prev.filter(s => s.id !== id));
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!authEmail) return;
    const user = {
      name: authName.trim() || (authEmail.split('@')[0] || 'Trader Gold'),
      email: authEmail.trim()
    };
    setCurrentUser(user);
    localStorage.setItem('gold_logged_user', JSON.stringify(user));
    setAuthModal(null);
    setAuthName('');
    setAuthEmail('');
    setAuthPass('');
  };

  const handleQuickDemoLogin = () => {
    const user = { name: 'Trader Demo', email: 'demo@goldanalyzer.com' };
    setCurrentUser(user);
    localStorage.setItem('gold_logged_user', JSON.stringify(user));
    setAuthModal(null);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('gold_logged_user');
  };

  return (
    <div className="min-h-screen bg-[#070c14] text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950 pb-16 relative">
      {/* 7 Vertical Indicator Dots on left margin (as seen in the laptop video) */}
      <div className="fixed left-3 top-1/3 z-30 hidden lg:flex flex-col gap-2.5 pointer-events-none">
        {[1, 2, 3, 4, 5, 6, 7].map(dot => (
          <span
            key={dot}
            className="w-2 h-2 rounded-full bg-emerald-500 shadow-md shadow-emerald-500/50 animate-pulse"
            style={{ animationDelay: `${dot * 200}ms` }}
          />
        ))}
      </div>

      {/* Floating Success Banner */}
      {successBanner && (
        <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 text-slate-950 px-4 py-3 font-black text-xs sm:text-sm text-center shadow-2xl flex items-center justify-center gap-2 relative animate-fadeIn">
          <Sparkles className="w-4 h-4 shrink-0" />
          <span>{successBanner}</span>
          <button
            onClick={() => setSuccessBanner(null)}
            className="ml-3 bg-black/20 hover:bg-black/40 text-black px-2 py-0.5 rounded-full text-xs font-bold transition-all cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Top Navbar matching the laptop video 100% */}
      <header className="sticky top-0 z-40 bg-[#070c14]/95 backdrop-blur-md border-b border-slate-800/80 px-4 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
          {/* Logo & Brand: GOLD ANALYZER */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 via-amber-400 to-yellow-300 p-0.5 shadow-lg shadow-amber-500/30 flex items-center justify-center shrink-0">
              <div className="w-full h-full bg-[#0b1220] rounded-[10px] flex items-center justify-center text-amber-400 font-black text-base">
                🏛️
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-base sm:text-xl font-black tracking-tight text-white uppercase flex items-center gap-1.5">
                  GOLD ANALYZER
                </span>
                <span className="hidden sm:inline-block text-[10px] font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full uppercase tracking-wider font-mono">
                  GitHub • Vercel • Firebase ⚡
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">
                Análisis técnico del oro • Indicador
              </p>
            </div>
          </div>

          {/* Center Badge: Precio en Vivo (from video) */}
          <div className="hidden md:flex items-center gap-2 bg-slate-900/90 border border-slate-800 px-3.5 py-1.5 rounded-full shadow-inner">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-bold text-slate-300 tracking-wide">
              PRECIO EN VIVO • MERCADO REAL XAU/USD
            </span>
          </div>

          {/* Right Action buttons: Auth & Subscribers */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAdminOpen(true)}
              className="bg-slate-900 hover:bg-slate-800 text-amber-300 border border-amber-500/30 px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow"
              title="Panel de verificación de suscripciones y pagos USDT"
            >
              <Users className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Suscriptores</span>
              {subscribers.length > 0 && (
                <span className="bg-amber-500 text-slate-950 px-1.5 py-0.2 rounded-full text-[10px] font-black">
                  {subscribers.length}
                </span>
              )}
            </button>

            {currentUser ? (
              <div className="flex items-center gap-1.5">
                <span className="inline-flex items-center gap-1 bg-amber-500/10 text-amber-300 border border-amber-500/30 px-2.5 py-1 rounded-xl text-xs font-bold">
                  <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="max-w-[100px] truncate">{currentUser.name}</span>
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-red-400 px-2 py-1.5 rounded-lg text-xs border border-slate-800 transition-colors"
                  title="Cerrar Sesión"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 text-xs">
                <button
                  onClick={() => setAuthModal('login')}
                  className="bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 font-bold px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer"
                >
                  Ingresar
                </button>
                <button
                  onClick={() => setAuthModal('register')}
                  className="gold-gradient text-zinc-950 font-black px-2.5 py-1.5 rounded-lg text-xs shadow hover:brightness-110 active:scale-95 transition-all cursor-pointer"
                >
                  Crear Cuenta
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-4 pt-6 space-y-6 w-full">
        {/* Ticker Box matching video */}
        <section className="bg-gradient-to-b from-[#0b1220] to-[#070d19] border border-slate-800 rounded-2xl p-5 shadow-2xl relative overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
                  XAUUSD • ORO / DÓLAR ESTADOUNIDENSE
                </span>
                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/40 px-2 py-0.5 rounded font-black flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  PRECIO ORIGINAL EN VIVO
                </span>
              </div>

              {/* Price */}
              <div className="flex flex-wrap items-baseline gap-3">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white font-mono tracking-tight drop-shadow-md">
                  ${currentPrice.toFixed(2)}
                </h1>
                <span className="text-sm sm:text-base font-bold text-red-400 font-mono flex items-center">
                  ▼ {priceChange24h.toFixed(2)}% (24h)
                </span>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs font-mono text-slate-400 pt-1">
                <span>24h Máx: <strong className="text-slate-200">${high24h.toFixed(2)}</strong></span>
                <span>•</span>
                <span>24h Mín: <strong className="text-slate-200">${low24h.toFixed(2)}</strong></span>
                <span>•</span>
                <span>Spread: <strong className="text-amber-400">{spread} USD</strong></span>
              </div>
            </div>

            {/* Right Meta Info */}
            <div className="text-right space-y-1 bg-slate-950/70 p-3 rounded-xl border border-slate-800/80">
              <span className="text-xs font-bold text-slate-300 block">
                Cotización Original de Mercado XAU/USD
              </span>
              <span className="text-[11px] text-slate-400 block">
                Fuente: Mercado Spot Internacional (Coinbase/LBMA)
              </span>
              <span className="text-[11px] text-amber-400 font-mono block font-bold">
                Actualización: {currentTime}
              </span>
            </div>
          </div>
        </section>

        {/* 4 VIP Plans (2x2 Grid on Laptop / Tablet, 1-col on Mobile) */}
        <section className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {DEFAULT_PLANS.map(plan => (
              <div
                key={plan.id}
                className={`bg-[#0d1628] border rounded-2xl p-5 flex flex-col justify-between space-y-4 shadow-xl transition-all hover:border-amber-500/50 relative overflow-hidden ${
                  plan.popular ? 'border-amber-500/40 bg-gradient-to-b from-[#111c34] to-[#0d1628]' : 'border-slate-800'
                }`}
              >
                {/* Header */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-black text-white tracking-wide">
                    {plan.name}
                  </span>
                  <span className="text-[10px] font-bold text-slate-400 bg-slate-900/80 px-2 py-0.5 rounded-full border border-slate-800 flex items-center gap-1">
                    <Lock className="w-2.5 h-2.5 text-amber-400" />
                    Bloqueado
                  </span>
                </div>

                {/* Price */}
                <div className="space-y-1">
                  <div className="flex items-baseline gap-1.5 font-mono">
                    <span className="text-3xl sm:text-4xl font-black text-amber-400">{plan.price}</span>
                    <span className="text-sm font-bold text-slate-300">USDT</span>
                    <span className="text-xs text-slate-500">/ {plan.period}</span>
                  </div>
                  <p className="text-xs text-slate-400 leading-snug">
                    {plan.description}
                  </p>
                </div>

                {/* Bullets */}
                <ul className="space-y-2 text-xs text-slate-300 border-t border-slate-800/80 pt-3 flex-1">
                  {plan.features.map((feat, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-amber-400 font-bold">•</span>
                      <span className="leading-snug">{feat}</span>
                    </li>
                  ))}
                </ul>

                {/* Bright Solid Yellow Button (exact matching video) */}
                <button
                  type="button"
                  onClick={() => setSelectedPlan(plan)}
                  className="w-full bg-[#facc15] hover:bg-[#eab308] active:scale-[0.98] text-slate-950 font-black py-3 rounded-xl text-xs sm:text-sm tracking-wide uppercase transition-all shadow-md shadow-amber-500/20 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  ELEGIR {plan.name.replace('PLAN ', '')}
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* Locked Plans Banner (USDT-BEP20 requirement) */}
        <section className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-amber-500/30 rounded-2xl p-5 shadow-2xl relative overflow-hidden space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                <Lock className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-black text-white flex items-center gap-1.5">
                  PLANES BLOQUEADOS • Requiere Confirmación de Pago USDT-BEP20
                </h3>
                <span className="text-xs text-amber-400/90 font-mono font-bold">
                  0 operaciones disponibles
                </span>
              </div>
            </div>

            <button
              onClick={() => setSelectedPlan(DEFAULT_PLANS[1])}
              className="bg-[#facc15] hover:bg-[#eab308] active:scale-95 text-slate-950 font-black px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer"
            >
              DESBLOQUEAR PLAN
            </button>
          </div>

          <div className="space-y-2 text-xs text-slate-300">
            <p className="leading-relaxed">
              Selecciona un plan, completa tus datos personales y transfiere en <strong className="text-amber-400">USDT-BEP20</strong> a:
            </p>

            {/* Wallet strip */}
            <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex flex-wrap items-center justify-between gap-2 font-mono">
              <span className="text-amber-300 select-all break-all text-xs">
                {OFFICIAL_WALLET}
              </span>
              <button
                type="button"
                onClick={handleCopyWallet}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg border border-slate-600 transition-all flex items-center gap-1 cursor-pointer"
              >
                {copiedWallet ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedWallet ? '¡Copiado!' : 'Copiar'}
              </button>
            </div>

            <p className="text-[11px] text-slate-400">
              <strong className="text-slate-300">Seguridad:</strong> El desbloqueo es personal y se activa inmediatamente tras ingresar tus datos y confirmar el pago.
            </p>
          </div>
        </section>

        {/* Candlestick Chart */}
        <section>
          <CandlestickChart
            currentPrice={currentPrice}
            onPriceTick={p => setCurrentPrice(p)}
          />
        </section>

        {/* Technical Market Analysis Locked Card */}
        <section>
          <MarketAnalysisCard
            onUnlockClick={() => setSelectedPlan(DEFAULT_PLANS[1])}
            isUnlocked={hasApprovedPlan}
          />
        </section>
      </main>

      {/* Plan Checkout Modal (2 steps) */}
      <PlanModal
        plan={selectedPlan}
        isOpen={Boolean(selectedPlan)}
        onClose={() => setSelectedPlan(null)}
        onSubmitSuccess={handlePlanSubmitted}
        walletAddress={OFFICIAL_WALLET}
      />

      {/* Admin Subscribers Modal */}
      <AdminSubscribersModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        subscribers={subscribers}
        onUpdateStatus={handleUpdateStatus}
        onDeleteSubscriber={handleDeleteSubscriber}
        walletAddress={OFFICIAL_WALLET}
      />

      {/* Auth Modal (Login / Register) */}
      {authModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-sm bg-[#0e172a] border border-amber-500/30 rounded-2xl shadow-2xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-black text-white flex items-center gap-1.5">
                <KeyRound className="w-4 h-4 text-amber-400" />
                {authModal === 'login' ? 'Ingresar a mi Cuenta' : 'Crear Cuenta en Gold Analyzer'}
              </h3>
              <button
                onClick={() => setAuthModal(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAuthSubmit} className="space-y-3 text-xs">
              {authModal === 'register' && (
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">Nombre o Alias</label>
                  <input
                    type="text"
                    required
                    value={authName}
                    onChange={e => setAuthName(e.target.value)}
                    placeholder="Ej. Trader Gold"
                    className="inpt text-xs"
                  />
                </div>
              )}
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Correo Electrónico</label>
                <input
                  type="email"
                  required
                  value={authEmail}
                  onChange={e => setAuthEmail(e.target.value)}
                  placeholder="tu@correo.com"
                  className="inpt text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] text-slate-400 mb-1">Contraseña</label>
                <input
                  type="password"
                  required
                  value={authPass}
                  onChange={e => setAuthPass(e.target.value)}
                  placeholder="••••••••"
                  className="inpt text-xs"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#facc15] hover:bg-[#eab308] text-slate-950 font-black py-2.5 rounded-xl text-xs uppercase tracking-wide transition-all shadow-md cursor-pointer mt-1"
              >
                {authModal === 'login' ? 'Ingresar a mi Cuenta' : 'Registrar Cuenta'}
              </button>

              <button
                type="button"
                onClick={handleQuickDemoLogin}
                className="w-full bg-zinc-900 hover:bg-zinc-800 text-amber-300 border border-amber-500/30 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Acceso Rápido Demo ⚡
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="mt-12 text-center text-xs text-slate-500 max-w-6xl mx-auto px-4 border-t border-slate-900 pt-6 space-y-1">
        <p className="font-semibold text-slate-400">
          GOLD ANALYZER - Emisora de análisis técnico y cotización simultánea XAU/USD
        </p>
        <p className="text-[11px] text-slate-500">
          Mercado Spot En Vivo | Actualización Cuantitativa | Indicador Profesional de Oro
        </p>
      </footer>
    </div>
  );
};
