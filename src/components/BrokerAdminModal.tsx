import React, { useState } from 'react';
import { 
  X, 
  ShieldAlert, 
  ShieldCheck, 
  Users, 
  DollarSign, 
  Lock, 
  Mail, 
  Trash2, 
  UserPlus, 
  PlusCircle, 
  MinusCircle, 
  Search, 
  TrendingUp,
  RefreshCw,
  LogOut,
  Sliders
} from 'lucide-react';
import { BrokerUser } from './BrokerAuthModal';

interface BrokerAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: BrokerUser[];
  onUpdateUserBalance: (userId: string, newRealBalance: number) => void;
  onToggleUserStatus: (userId: string) => void;
  onDeleteUser: (userId: string) => void;
  onAddUser: (user: BrokerUser) => void;
}

export const BrokerAdminModal: React.FC<BrokerAdminModalProps> = ({
  isOpen,
  onClose,
  users,
  onUpdateUserBalance,
  onToggleUserStatus,
  onDeleteUser,
  onAddUser
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Balance adjust modal
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [adjustAmount, setAdjustAmount] = useState<number>(100);

  // New user form state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newInitialBalance, setNewInitialBalance] = useState<number>(100);

  if (!isOpen) return null;

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Admin credentials check: kervinjose022@gmail.com / 1910
    if (emailInput.trim().toLowerCase() === 'kervinjose022@gmail.com' && passwordInput === '1910') {
      setIsAuthenticated(true);
      setErrorMsg('');
    } else {
      setErrorMsg('Credenciales de Administrador incorrectas.');
    }
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalRealCapital = users.reduce((acc, u) => acc + (u.realBalance || 0), 0);
  const totalDemoCapital = users.reduce((acc, u) => acc + (u.demoBalance || 0), 0);

  const handleCreateUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newEmail.trim()) return;

    const newUser: BrokerUser = {
      id: `usr_adm_${Date.now()}`,
      name: newName.trim(),
      email: newEmail.trim().toLowerCase(),
      password: newPassword.trim() || '123456',
      realBalance: newInitialBalance,
      demoBalance: 10000,
      role: 'user',
      status: 'active',
      createdAt: new Date().toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }),
      tradesCount: 0,
      wonTradesCount: 0
    };

    onAddUser(newUser);
    setShowAddForm(false);
    setNewName('');
    setNewEmail('');
    setNewPassword('');
    setNewInitialBalance(100);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-5xl bg-[#090f1e] border border-amber-500/40 rounded-3xl p-5 md:p-7 shadow-2xl text-white max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-black">
              🛡️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-lg text-white">Panel de Control de Administrador</h3>
                <span className="bg-red-500/20 text-red-400 border border-red-500/40 px-2 py-0.5 rounded text-[10px] font-mono font-black">
                  SUPER ADMIN
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Gestión de usuarios registrados, balances y control general del Broker
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <button
                onClick={() => setIsAuthenticated(false)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Cerrar Sesión Admin</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Not Authenticated State */}
        {!isAuthenticated ? (
          <div className="py-8 max-w-md mx-auto w-full">
            <div className="bg-slate-950/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="text-center space-y-1">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto mb-2">
                  <Lock className="w-6 h-6" />
                </div>
                <h4 className="font-black text-base text-white">Acceso Restringido al Sistema</h4>
                <p className="text-xs text-slate-400">Introduce tus credenciales de Administrador para desbloquear el panel.</p>
              </div>

              <form onSubmit={handleAdminLogin} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Correo de Administrador</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                    <input
                      type="email"
                      required
                      placeholder="kervinjose022@gmail.com"
                      value={emailInput}
                      onChange={e => setEmailInput(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1">Contraseña de Acceso</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                    <input
                      type="password"
                      required
                      placeholder="••••"
                      value={passwordInput}
                      onChange={e => setPasswordInput(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                {errorMsg && (
                  <div className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 p-2.5 rounded-xl">
                    {errorMsg}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl font-black text-sm uppercase bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
                >
                  Desbloquear Panel
                </button>
              </form>
            </div>
          </div>
        ) : (
          /* Authenticated Admin Dashboard */
          <div className="mt-4 flex-1 flex flex-col gap-4 overflow-hidden">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Total Usuarios</span>
                  <Users className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-2xl font-black text-white font-mono mt-1">{users.length}</div>
                <div className="text-[10px] text-emerald-400 font-bold mt-0.5">100% Cuentas Verificadas</div>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Capital Real Global</span>
                  <DollarSign className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl font-black text-emerald-400 font-mono mt-1">${totalRealCapital.toFixed(2)}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Fondos Reales en Custodia</div>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Balance Demo Global</span>
                  <TrendingUp className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-2xl font-black text-amber-400 font-mono mt-1">${totalDemoCapital.toFixed(2)}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">Créditos de Práctica</div>
              </div>

              <div className="bg-slate-950 p-3.5 rounded-2xl border border-slate-800">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Servidor Broker</span>
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl font-black text-white font-mono mt-1">ONLINE</div>
                <div className="text-[10px] text-emerald-400 font-bold mt-0.5">Latencia 12ms • Cero Slippage</div>
              </div>
            </div>

            {/* Actions Bar & Search */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1">
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Buscar por nombre o correo..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-md shadow-emerald-500/20"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>{showAddForm ? 'Cancelar' : 'Nuevo Usuario'}</span>
                </button>
              </div>
            </div>

            {/* Create User Form Drawer */}
            {showAddForm && (
              <form onSubmit={handleCreateUser} className="bg-slate-950 p-4 rounded-2xl border border-emerald-500/40 grid grid-cols-1 sm:grid-cols-4 gap-3 animate-fade-in text-xs">
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Nombre Completo</label>
                  <input
                    type="text"
                    required
                    placeholder="Ej. Juan Pérez"
                    value={newName}
                    onChange={e => setNewName(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Correo</label>
                  <input
                    type="email"
                    required
                    placeholder="juan@gmail.com"
                    value={newEmail}
                    onChange={e => setNewEmail(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1 font-semibold">Saldo Real Inicial ($)</label>
                  <input
                    type="number"
                    min="0"
                    value={newInitialBalance}
                    onChange={e => setNewInitialBalance(Number(e.target.value))}
                    className="w-full bg-slate-900 border border-slate-800 rounded-lg p-2 text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div className="flex items-end">
                  <button
                    type="submit"
                    className="w-full py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-lg transition-all cursor-pointer"
                  >
                    Guardar Usuario
                  </button>
                </div>
              </form>
            )}

            {/* Users Table */}
            <div className="flex-1 overflow-y-auto border border-slate-800 rounded-2xl bg-slate-950/60">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#0b1222] text-slate-400 border-b border-slate-800 sticky top-0 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-3">Usuario / Correo</th>
                    <th className="p-3">Saldo Real (USD)</th>
                    <th className="p-3">Saldo Demo</th>
                    <th className="p-3">Estado</th>
                    <th className="p-3">Fecha Reg.</th>
                    <th className="p-3 text-right">Acciones Admin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-slate-500">
                        No se encontraron usuarios registrados.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map(user => (
                      <tr key={user.id} className="hover:bg-slate-900/60 transition-colors">
                        <td className="p-3">
                          <div className="font-bold text-white flex items-center gap-1.5">
                            <span>{user.name}</span>
                            {user.role === 'admin' && (
                              <span className="bg-amber-500/20 text-amber-400 px-1.5 py-0.2 rounded text-[9px] font-mono font-black">
                                ADMIN
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400 font-mono">{user.email}</div>
                        </td>

                        <td className="p-3">
                          <span className="font-mono font-black text-emerald-400 text-sm">
                            ${(user.realBalance || 0).toFixed(2)}
                          </span>
                        </td>

                        <td className="p-3">
                          <span className="font-mono font-bold text-slate-300">
                            ${(user.demoBalance || 0).toFixed(2)}
                          </span>
                        </td>

                        <td className="p-3">
                          <button
                            onClick={() => onToggleUserStatus(user.id)}
                            className={`px-2 py-0.5 rounded text-[10px] font-black cursor-pointer transition-colors ${
                              user.status === 'active'
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            }`}
                          >
                            {user.status === 'active' ? 'ACTIVO' : 'SUSPENDIDO'}
                          </button>
                        </td>

                        <td className="p-3 text-slate-400 font-mono text-[11px]">
                          {user.createdAt}
                        </td>

                        <td className="p-3 text-right space-x-1.5">
                          {/* Add Funds Button */}
                          <button
                            onClick={() => {
                              const amt = prompt(`¿Cuánto saldo real deseas agregar a ${user.name}?`, '100');
                              if (amt && !isNaN(Number(amt))) {
                                onUpdateUserBalance(user.id, (user.realBalance || 0) + Number(amt));
                              }
                            }}
                            title="Recargar Saldo Real"
                            className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500 hover:text-slate-950 transition-colors cursor-pointer"
                          >
                            <PlusCircle className="w-4 h-4" />
                          </button>

                          {/* Deduct Funds Button */}
                          <button
                            onClick={() => {
                              const amt = prompt(`¿Cuánto saldo real deseas retirar de ${user.name}?`, '50');
                              if (amt && !isNaN(Number(amt))) {
                                onUpdateUserBalance(user.id, Math.max(0, (user.realBalance || 0) - Number(amt)));
                              }
                            }}
                            title="Restar Saldo Real"
                            className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 hover:bg-amber-500 hover:text-slate-950 transition-colors cursor-pointer"
                          >
                            <MinusCircle className="w-4 h-4" />
                          </button>

                          {/* Delete User */}
                          {user.email !== 'kervinjose022@gmail.com' && (
                            <button
                              onClick={() => {
                                if (confirm(`¿Estás seguro de eliminar al usuario ${user.name} (${user.email})?`)) {
                                  onDeleteUser(user.id);
                                }
                              }}
                              title="Eliminar Usuario"
                              className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
