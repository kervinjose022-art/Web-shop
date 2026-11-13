import React, { useState } from 'react';
import { 
  X, 
  User, 
  Mail, 
  Lock, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight,
  Sparkles,
  LogIn,
  UserPlus
} from 'lucide-react';
import { CustomerUser } from '../types/store';

interface ZetaAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: CustomerUser | null;
  onLogin: (user: CustomerUser) => void;
  onLogout: () => void;
  onRegister: (user: CustomerUser) => void;
  registeredUsers: CustomerUser[];
  onOpenAdminDirectly?: () => void;
}

export const ZetaAuthModal: React.FC<ZetaAuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLogin,
  onLogout,
  onRegister,
  registeredUsers,
  onOpenAdminDirectly
}) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Login form
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register form
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regAddress, setRegAddress] = useState('');
  const [regCity, setRegCity] = useState('');

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const cleanEmail = loginEmail.trim().toLowerCase();
    const cleanPass = loginPassword.trim();

    // Check for Super Admin credentials
    if (cleanEmail === 'kervinjose022@gmail.com' && cleanPass === '26304421') {
      const adminUser: CustomerUser = {
        id: 'admin_kervin',
        name: 'Kervin Pérez (Admin)',
        email: 'kervinjose022@gmail.com',
        phone: '04262139920',
        registeredAt: 'Admin Pro',
        role: 'admin'
      };
      onLogin(adminUser);
      setSuccessMsg('¡Bienvenido Administrador! Abriendo panel de control...');
      setTimeout(() => {
        onClose();
        if (onOpenAdminDirectly) onOpenAdminDirectly();
      }, 700);
      return;
    }

    // Check for registered customer
    const found = registeredUsers.find(u => u.email.toLowerCase() === cleanEmail && (!u.password || u.password === cleanPass));
    if (found) {
      onLogin(found);
      setSuccessMsg(`¡Bienvenido de nuevo, ${found.name}!`);
      setTimeout(() => {
        onClose();
      }, 700);
    } else {
      setErrorMsg('Correo o contraseña incorrectos. Si no tienes cuenta, toca "Crear Cuenta".');
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!regName.trim() || !regEmail.trim() || !regPhone.trim() || !regPassword.trim()) {
      setErrorMsg('Por favor completa todos los campos requeridos (*).');
      return;
    }

    const cleanEmail = regEmail.trim().toLowerCase();

    // Check if email already exists
    if (registeredUsers.some(u => u.email.toLowerCase() === cleanEmail)) {
      setErrorMsg('Ya existe una cuenta con este correo. Por favor inicia sesión.');
      return;
    }

    const newUser: CustomerUser = {
      id: `usr_${Date.now()}`,
      name: regName.trim(),
      email: cleanEmail,
      phone: regPhone.trim(),
      password: regPassword.trim(),
      address: regAddress.trim() || 'No especificada',
      city: regCity.trim() || 'Venezuela',
      registeredAt: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }),
      role: 'customer'
    };

    onRegister(newUser);
    onLogin(newUser);
    setSuccessMsg('¡Tu cuenta ha sido creada con éxito!');
    setTimeout(() => {
      onClose();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-[#0b1324] border border-slate-800 rounded-3xl w-full max-w-md flex flex-col shadow-2xl text-slate-100 overflow-hidden">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-[#080d19]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <User className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-white">
                {currentUser ? 'Mi Cuenta' : (mode === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta de Cliente')}
              </h3>
              <p className="text-[11px] text-slate-400">
                {currentUser ? 'Perfil de usuario activo' : 'Accede a tus pedidos, descuentos y favoritos'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body Content */}
        <div className="p-5 sm:p-6 space-y-4">
          
          {/* If already logged in */}
          {currentUser ? (
            <div className="space-y-4 py-2">
              <div className="p-4 rounded-2xl bg-[#080d19] border border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-white text-base">{currentUser.name}</div>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${currentUser.role === 'admin' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'}`}>
                    {currentUser.role === 'admin' ? 'Super Admin' : 'Cliente Registrado'}
                  </span>
                </div>
                <div className="text-xs text-slate-400 flex items-center gap-1.5 font-mono">
                  <Mail className="w-3.5 h-3.5 text-slate-500" />
                  <span>{currentUser.email}</span>
                </div>
                <div className="text-xs text-slate-400 flex items-center gap-1.5 font-mono">
                  <Phone className="w-3.5 h-3.5 text-slate-500" />
                  <span>{currentUser.phone}</span>
                </div>
                {currentUser.address && (
                  <div className="text-xs text-slate-400 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" />
                    <span>{currentUser.address}, {currentUser.city}</span>
                  </div>
                )}
              </div>

              {currentUser.role === 'admin' && onOpenAdminDirectly && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenAdminDirectly();
                  }}
                  className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer shadow-md transition-colors"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Abrir Panel de Control Admin</span>
                </button>
              )}

              <button
                onClick={() => {
                  onLogout();
                  setSuccessMsg('Has cerrado sesión correctamente.');
                  setTimeout(() => setSuccessMsg(''), 2000);
                }}
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 hover:text-rose-400 font-bold text-xs cursor-pointer transition-colors"
              >
                Cerrar Sesión
              </button>
            </div>
          ) : (
            <>
              {/* Tab Selector: Iniciar Sesión vs Registro */}
              <div className="grid grid-cols-2 p-1 bg-[#080d19] rounded-xl border border-slate-800 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setErrorMsg('');
                  }}
                  className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    mode === 'login'
                      ? 'bg-emerald-500 text-slate-950 font-black shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Iniciar Sesión</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode('register');
                    setErrorMsg('');
                  }}
                  className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                    mode === 'register'
                      ? 'bg-emerald-500 text-slate-950 font-black shadow-md'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Crear Cuenta</span>
                </button>
              </div>

              {/* Feedback Alerts */}
              {errorMsg && (
                <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium">
                  {errorMsg}
                </div>
              )}
              {successMsg && (
                <div className="p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-medium flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{successMsg}</span>
                </div>
              )}

              {/* FORM 1: LOGIN */}
              {mode === 'login' && (
                <form onSubmit={handleLoginSubmit} className="space-y-3 text-xs">
                  <div>
                    <label className="text-[11px] font-bold text-slate-400 block mb-1">Correo Electrónico *</label>
                    <div className="relative">
                      <input 
                        type="email" 
                        required
                        placeholder="tu@correo.com"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        className="w-full bg-[#080d19] border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-white outline-none focus:border-emerald-500 transition-colors"
                      />
                      <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-400 block mb-1">Contraseña *</label>
                    <div className="relative">
                      <input 
                        type="password" 
                        required
                        placeholder="••••••••"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        className="w-full bg-[#080d19] border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-white outline-none focus:border-emerald-500 transition-colors"
                      />
                      <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3 pointer-events-none" />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-2 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>Ingresar</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <div className="pt-2 text-center text-[11px] text-slate-400">
                    <span>¿No tienes cuenta? </span>
                    <button
                      type="button"
                      onClick={() => setMode('register')}
                      className="text-emerald-400 font-bold hover:underline cursor-pointer"
                    >
                      Regístrate gratis
                    </button>
                  </div>

                  {/* Subtle Admin hint for Kervin */}
                  <div className="pt-2 border-t border-slate-800/80 text-center text-[10px] text-slate-500">
                    <span className="flex items-center justify-center gap-1">
                      <ShieldCheck className="w-3 h-3 text-amber-400" />
                      <span>Acceso Administrador: ingresa con tus credenciales maestras.</span>
                    </span>
                  </div>
                </form>
              )}

              {/* FORM 2: REGISTER */}
              {mode === 'register' && (
                <form onSubmit={handleRegisterSubmit} className="space-y-3 text-xs">
                  <div>
                    <label className="text-[11px] font-bold text-slate-400 block mb-1">Nombre y Apellido *</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        required
                        placeholder="Nombre completo del comprador"
                        value={regName}
                        onChange={(e) => setRegName(e.target.value)}
                        className="w-full bg-[#080d19] border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-white outline-none focus:border-emerald-500 transition-colors"
                      />
                      <User className="w-4 h-4 text-slate-500 absolute left-3 top-2.5 pointer-events-none" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] font-bold text-slate-400 block mb-1">WhatsApp / Teléfono *</label>
                      <div className="relative">
                        <input 
                          type="tel" 
                          required
                          placeholder="Ej. 0426 2139920"
                          value={regPhone}
                          onChange={(e) => setRegPhone(e.target.value)}
                          className="w-full bg-[#080d19] border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-white outline-none focus:border-emerald-500 transition-colors"
                        />
                        <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-2.5 pointer-events-none" />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-bold text-slate-400 block mb-1">Correo Electrónico *</label>
                      <div className="relative">
                        <input 
                          type="email" 
                          required
                          placeholder="correo@ejemplo.com"
                          value={regEmail}
                          onChange={(e) => setRegEmail(e.target.value)}
                          className="w-full bg-[#080d19] border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-white outline-none focus:border-emerald-500 transition-colors"
                        />
                        <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-[11px] font-bold text-slate-400 block mb-1">Crear Contraseña *</label>
                    <div className="relative">
                      <input 
                        type="password" 
                        required
                        placeholder="Mínimo 6 caracteres"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        className="w-full bg-[#080d19] border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-white outline-none focus:border-emerald-500 transition-colors"
                      />
                      <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-2.5 pointer-events-none" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] font-bold text-slate-400 block mb-1">Dirección de Entrega</label>
                      <input 
                        type="text" 
                        placeholder="Calle, Edificio, Casa"
                        value={regAddress}
                        onChange={(e) => setRegAddress(e.target.value)}
                        className="w-full bg-[#080d19] border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-emerald-500 transition-colors"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-400 block mb-1">Ciudad / Estado</label>
                      <input 
                        type="text" 
                        placeholder="Ej. Caracas, Valencia"
                        value={regCity}
                        onChange={(e) => setRegCity(e.target.value)}
                        className="w-full bg-[#080d19] border border-slate-800 rounded-xl px-3 py-2 text-white outline-none focus:border-emerald-500 transition-colors"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full mt-2 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Crear Mi Cuenta</span>
                  </button>

                  <div className="pt-2 text-center text-[11px] text-slate-400">
                    <span>¿Ya tienes una cuenta creada? </span>
                    <button
                      type="button"
                      onClick={() => setMode('login')}
                      className="text-emerald-400 font-bold hover:underline cursor-pointer"
                    >
                      Inicia sesión aquí
                    </button>
                  </div>
                </form>
              )}
            </>
          )}

        </div>

      </div>
    </div>
  );
};
