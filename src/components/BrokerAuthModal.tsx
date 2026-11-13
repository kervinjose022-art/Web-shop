import React, { useState } from 'react';
import { X, User, Mail, Lock, CheckCircle2, ArrowRight, ShieldCheck, LogIn, UserPlus } from 'lucide-react';

export interface BrokerUser {
  id: string;
  name: string;
  email: string;
  password?: string;
  realBalance: number;
  demoBalance: number;
  role: 'user' | 'vip' | 'admin';
  status: 'active' | 'suspended';
  createdAt: string;
  tradesCount: number;
  wonTradesCount: number;
}

interface BrokerAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'login' | 'register';
  onLoginSuccess: (user: BrokerUser) => void;
  existingUsers: BrokerUser[];
  onRegisterUser: (newUser: BrokerUser) => void;
}

export const BrokerAuthModal: React.FC<BrokerAuthModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'login',
  onLoginSuccess,
  existingUsers,
  onRegisterUser
}) => {
  const [tab, setTab] = useState<'login' | 'register'>(initialTab);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (tab === 'register') {
      if (!name.trim() || !email.trim() || !password.trim()) {
        setErrorMsg('Por favor completa todos los campos.');
        return;
      }
      if (password.length < 4) {
        setErrorMsg('La contraseña debe tener al menos 4 caracteres.');
        return;
      }

      // Check if user already exists
      const found = existingUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (found) {
        setErrorMsg('Ya existe una cuenta registrada con este correo electrónico.');
        return;
      }

      const newUser: BrokerUser = {
        id: `usr_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password: password,
        realBalance: 50.00, // Bono de bienvenida
        demoBalance: 10000.00,
        role: 'user',
        status: 'active',
        createdAt: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }),
        tradesCount: 0,
        wonTradesCount: 0
      };

      onRegisterUser(newUser);
      onLoginSuccess(newUser);
      setSuccessMsg('¡Cuenta creada con éxito! Bienvenido al broker.');
      setTimeout(() => {
        onClose();
      }, 1000);
    } else {
      // Login
      if (!email.trim() || !password.trim()) {
        setErrorMsg('Por favor ingresa tu correo y contraseña.');
        return;
      }

      // Special Admin Shortcut via regular login if email matches
      if (email.toLowerCase() === 'kervinjose022@gmail.com' && password === '1910') {
        const adminUser: BrokerUser = {
          id: 'admin_kervin',
          name: 'Kervin José (Admin)',
          email: 'kervinjose022@gmail.com',
          realBalance: 5000.00,
          demoBalance: 50000.00,
          role: 'admin',
          status: 'active',
          createdAt: '01 Nov 2026',
          tradesCount: 42,
          wonTradesCount: 38
        };
        onLoginSuccess(adminUser);
        setSuccessMsg('¡Bienvenido Administrador Kervin!');
        setTimeout(() => onClose(), 800);
        return;
      }

      const found = existingUsers.find(
        u => u.email.toLowerCase() === email.toLowerCase() && (u.password === password || !u.password)
      );

      if (!found) {
        setErrorMsg('Credenciales incorrectas. Si eres nuevo, regístrate en la pestaña "Crear Cuenta".');
        return;
      }

      if (found.status === 'suspended') {
        setErrorMsg('Esta cuenta se encuentra temporalmente suspendida por seguridad.');
        return;
      }

      onLoginSuccess(found);
      setSuccessMsg(`¡Bienvenido de nuevo, ${found.name}!`);
      setTimeout(() => onClose(), 800);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-[#0c1427] border border-slate-800 rounded-3xl p-6 shadow-2xl text-white">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold">
              {tab === 'login' ? <LogIn className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="font-black text-base text-white">
                {tab === 'login' ? 'Iniciar Sesión en el Broker' : 'Crear Cuenta de Trading'}
              </h3>
              <p className="text-[11px] text-slate-400">
                {tab === 'login' ? 'Ingresa a tu cuenta real o demo' : 'Comienza con $10,000 USD de práctica'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="grid grid-cols-2 gap-2 p-1 mt-4 bg-slate-950 rounded-2xl border border-slate-800">
          <button
            type="button"
            onClick={() => { setTab('login'); setErrorMsg(''); }}
            className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              tab === 'login'
                ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Iniciar Sesión
          </button>
          <button
            type="button"
            onClick={() => { setTab('register'); setErrorMsg(''); }}
            className={`py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
              tab === 'register'
                ? 'bg-emerald-500 text-slate-950 font-black shadow-md shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Crear Cuenta
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5">
          {tab === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">Nombre Completo o Alias</label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  required
                  placeholder="Ej. Kervin José"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Correo Electrónico</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
              <input
                type="email"
                required
                placeholder="tu@correo.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-1">Contraseña</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {errorMsg && (
            <div className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 p-2.5 rounded-xl">
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 p-2.5 rounded-xl flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>{successMsg}</span>
            </div>
          )}

          <button
            type="submit"
            className={`w-full py-3 rounded-xl font-black text-sm uppercase tracking-wider transition-all cursor-pointer shadow-lg ${
              tab === 'login'
                ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
                : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20'
            }`}
          >
            {tab === 'login' ? 'Acceder al Broker' : 'Registrar y Empezar'}
          </button>

          {/* Quick Demo Access */}
          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={() => {
                const guestUser: BrokerUser = {
                  id: `guest_${Date.now()}`,
                  name: 'Trader Invitado',
                  email: 'invitado@broker.com',
                  realBalance: 0,
                  demoBalance: 10000,
                  role: 'user',
                  status: 'active',
                  createdAt: 'Hoy',
                  tradesCount: 0,
                  wonTradesCount: 0
                };
                onLoginSuccess(guestUser);
                onClose();
              }}
              className="text-xs text-slate-500 hover:text-amber-400 transition-colors cursor-pointer"
            >
              Continuar como Invitado (Modo Demo Directo)
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
