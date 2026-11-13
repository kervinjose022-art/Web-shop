import React from 'react';
import { 
  ShieldCheck, 
  Settings, 
  FileText, 
  Headphones, 
  LogOut, 
  ChevronRight, 
  MessageSquarePlus, 
  Lock, 
  ShieldAlert,
  Award
} from 'lucide-react';
import { BrokerUser } from './BrokerAuthModal';

interface XmProfileViewProps {
  currentUser: BrokerUser | null;
  onOpenAdmin: () => void;
  onOpenAuth: () => void;
  onLogout: () => void;
  onOpenApkModal?: () => void;
}

export const XmProfileView: React.FC<XmProfileViewProps> = ({
  currentUser,
  onOpenAdmin,
  onOpenAuth,
  onLogout,
  onOpenApkModal
}) => {
  const userName = currentUser ? currentUser.name : 'Kervin';
  const userEmail = currentUser ? currentUser.email : 'kervinjose022@gmail.com';
  const isAdmin = currentUser?.role === 'admin' || userEmail === 'kervinjose022@gmail.com';

  return (
    <div className="flex-1 flex flex-col bg-[#070c17] text-slate-100 overflow-y-auto pb-24 max-w-2xl mx-auto w-full p-4 space-y-4">
      {/* Title */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-800/60">
        <h2 className="text-xl font-black text-white">Mi perfil</h2>
        <div className="flex items-center gap-3 text-slate-400">
          <Headphones className="w-5 h-5 cursor-pointer hover:text-white" />
        </div>
      </div>

      {/* User Header */}
      <div className="flex items-center gap-3 pt-1">
        <div className="w-14 h-14 rounded-full bg-blue-600 text-white font-black text-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
          KP
        </div>
        <div>
          <h3 className="font-black text-lg text-white">Hola, {userName}</h3>
          <p className="text-xs text-slate-400 font-mono">{userEmail}</p>
        </div>
      </div>

      {/* Level & Volume Card */}
      <div className="bg-[#0b1325] border border-slate-800/80 rounded-2xl p-4 shadow-xl space-y-2">
        <div className="flex items-center justify-between text-xs">
          <div>
            <span className="text-slate-400 text-[11px]">Nivel</span>
            <div className="font-black text-sm text-white flex items-center gap-1.5 mt-0.5">
              <span>🥉</span>
              <span>Bronce</span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-slate-400 text-[11px]">Volumen de trading</span>
            <div className="font-mono font-black text-xs text-white mt-0.5">
              $0 / $1,000,000
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden mt-1">
          <div className="h-full bg-amber-400 w-[5%]" />
        </div>
      </div>

      {/* Verification Card */}
      <div className="bg-[#0b1325] border border-slate-800/80 rounded-2xl p-4 shadow-xl flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold text-slate-200">Verificación</span>
        </div>

        <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
          Verificado
        </span>
      </div>

      {/* Descargar APK / App Móvil Card */}
      <div className="bg-gradient-to-r from-cyan-950/40 via-[#0b1325] to-blue-950/40 border border-cyan-500/40 rounded-2xl p-4 shadow-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 flex items-center justify-center text-lg">
            📱
          </div>
          <div>
            <h4 className="font-black text-sm text-white flex items-center gap-1.5">
              <span>Descargar APK / App Móvil</span>
              <span className="text-[9px] bg-cyan-500/20 text-cyan-400 px-1.5 py-0.2 rounded font-mono">NUEVA</span>
            </h4>
            <p className="text-[10px] text-cyan-300">Versión broker actualizada con trading en vivo</p>
          </div>
        </div>
        <button
          onClick={onOpenApkModal}
          className="px-3.5 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs rounded-xl shadow-md cursor-pointer active:scale-95 transition-all"
        >
          Descargar
        </button>
      </div>

      {/* Menu List */}
      <div className="bg-[#0b1325] border border-slate-800/80 rounded-2xl divide-y divide-slate-800/80 overflow-hidden shadow-xl text-xs font-semibold">
        {/* SUPER ADMIN PANEL ENTRY */}
        <button
          onClick={onOpenAdmin}
          className="w-full p-4 flex items-center justify-between hover:bg-slate-900/60 transition-colors text-left cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              🛡️
            </div>
            <div>
              <span className="text-amber-300 font-black">Panel de Control de Administrador</span>
              <p className="text-[10px] text-slate-400">Acceso seguro con contraseña de super admin</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 transition-colors" />
        </button>

        <button className="w-full p-4 flex items-center justify-between hover:bg-slate-900/60 transition-colors text-left cursor-pointer">
          <div className="flex items-center gap-3">
            <Settings className="w-4 h-4 text-slate-400" />
            <span className="text-slate-200">Ajustes</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500" />
        </button>

        <button className="w-full p-4 flex items-center justify-between hover:bg-slate-900/60 transition-colors text-left cursor-pointer">
          <div className="flex items-center gap-3">
            <FileText className="w-4 h-4 text-slate-400" />
            <span className="text-slate-200">Legal</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500" />
        </button>

        <button className="w-full p-4 flex items-center justify-between hover:bg-slate-900/60 transition-colors text-left cursor-pointer">
          <div className="flex items-center gap-3">
            <Headphones className="w-4 h-4 text-slate-400" />
            <span className="text-slate-200">Atención al cliente</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-500" />
        </button>

        <button
          onClick={onLogout}
          className="w-full p-4 flex items-center gap-3 text-rose-400 hover:bg-rose-500/10 transition-colors text-left cursor-pointer"
        >
          <LogOut className="w-4 h-4" />
          <span className="font-bold">Cerrar sesión</span>
        </button>
      </div>

      {/* Suggestion Card */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-950/40 to-slate-900 border border-purple-500/30 flex items-center justify-between cursor-pointer">
        <div className="flex items-center gap-2.5">
          <MessageSquarePlus className="w-4 h-4 text-purple-400" />
          <span className="text-xs text-purple-200 font-semibold">
            Sugiera nuevas funciones o comparta su opinión
          </span>
        </div>
        <ChevronRight className="w-4 h-4 text-purple-400" />
      </div>
    </div>
  );
};
