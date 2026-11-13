import React, { useState } from 'react';
import { X, ArrowDownCircle, ArrowUpCircle, CheckCircle2, Copy, Wallet, CreditCard, ShieldCheck } from 'lucide-react';

interface BrokerDepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  userBalance: number;
  onDepositSuccess: (amount: number) => void;
  onWithdrawSuccess: (amount: number) => void;
}

export const BrokerDepositModal: React.FC<BrokerDepositModalProps> = ({
  isOpen,
  onClose,
  userBalance,
  onDepositSuccess,
  onWithdrawSuccess,
}) => {
  const [tab, setTab] = useState<'deposit' | 'withdraw'>('deposit');
  const [amount, setAmount] = useState<number>(50);
  const [method, setMethod] = useState<'usdt' | 'binance' | 'pagomovil'>('usdt');
  const [txHash, setTxHash] = useState('');
  const [copied, setCopied] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const depositPresets = [10, 25, 50, 100, 250, 500];

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (tab === 'deposit') {
      if (amount < 10) {
        setErrorMsg('El depósito mínimo es de $10 USD');
        return;
      }
      onDepositSuccess(amount);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 1500);
    } else {
      if (amount < 10) {
        setErrorMsg('El retiro mínimo es de $10 USD');
        return;
      }
      if (amount > userBalance) {
        setErrorMsg('Saldo insuficiente para retirar esta cantidad');
        return;
      }
      onWithdrawSuccess(amount);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 1500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-[#0c1427] border border-slate-800 rounded-3xl p-6 shadow-2xl text-white">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-lg text-white">Cajero y Fondos</h3>
              <p className="text-xs text-slate-400">Saldo Disponible: <span className="font-mono font-bold text-emerald-400">${userBalance.toFixed(2)} USD</span></p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="grid grid-cols-2 gap-2 p-1 mt-4 bg-slate-950 rounded-2xl border border-slate-800">
          <button
            onClick={() => { setTab('deposit'); setErrorMsg(''); }}
            className={`py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
              tab === 'deposit'
                ? 'bg-emerald-500 text-slate-950 font-black shadow-lg shadow-emerald-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ArrowDownCircle className="w-4 h-4" />
            <span>Depositar Fondos</span>
          </button>
          <button
            onClick={() => { setTab('withdraw'); setErrorMsg(''); }}
            className={`py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
              tab === 'withdraw'
                ? 'bg-amber-500 text-slate-950 font-black shadow-lg shadow-amber-500/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ArrowUpCircle className="w-4 h-4" />
            <span>Retirar Fondos</span>
          </button>
        </div>

        {isSuccess ? (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40 animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="text-xl font-bold text-white">
              {tab === 'deposit' ? '¡Depósito Procesado!' : '¡Solicitud de Retiro Exitosa!'}
            </h4>
            <p className="text-sm text-slate-400">
              {tab === 'deposit' 
                ? `Se han acreditado $${amount.toFixed(2)} USD a tu cuenta.`
                : `Se han procesado $${amount.toFixed(2)} USD a tu método de pago.`}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            {/* Payment Method Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-2">Método de Pago</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setMethod('usdt')}
                  className={`p-2.5 rounded-xl border text-left flex flex-col gap-1 transition-all cursor-pointer ${
                    method === 'usdt'
                      ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400'
                      : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs">USDT</span>
                    <span className="text-[10px] px-1 rounded bg-slate-800 text-emerald-300">BEP-20</span>
                  </div>
                  <span className="text-[10px] text-slate-500">Cero Comisión</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMethod('binance')}
                  className={`p-2.5 rounded-xl border text-left flex flex-col gap-1 transition-all cursor-pointer ${
                    method === 'binance'
                      ? 'border-amber-500 bg-amber-500/10 text-amber-400'
                      : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs">Binance Pay</span>
                    <span className="text-[10px] px-1 rounded bg-amber-950 text-amber-300">ID Directo</span>
                  </div>
                  <span className="text-[10px] text-slate-500">Instantáneo</span>
                </button>

                <button
                  type="button"
                  onClick={() => setMethod('pagomovil')}
                  className={`p-2.5 rounded-xl border text-left flex flex-col gap-1 transition-all cursor-pointer ${
                    method === 'pagomovil'
                      ? 'border-blue-500 bg-blue-500/10 text-blue-400'
                      : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs">Pago Móvil</span>
                    <span className="text-[10px] px-1 rounded bg-slate-800 text-blue-300">VES</span>
                  </div>
                  <span className="text-[10px] text-slate-500">Tasa Oficial</span>
                </button>
              </div>
            </div>

            {/* Quick Presets */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-slate-400">Monto ({tab === 'deposit' ? 'a Recargar' : 'a Retirar'})</label>
                <span className="text-xs font-mono font-bold text-amber-400">${amount} USD</span>
              </div>
              <div className="grid grid-cols-6 gap-1.5 mb-2">
                {depositPresets.map(val => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setAmount(val)}
                    className={`py-1.5 text-xs font-mono font-bold rounded-lg border transition-all cursor-pointer ${
                      amount === val
                        ? 'border-amber-400 bg-amber-400/20 text-amber-300'
                        : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:bg-slate-800'
                    }`}
                  >
                    ${val}
                  </button>
                ))}
              </div>
              <input
                type="number"
                min="10"
                step="5"
                value={amount}
                onChange={e => setAmount(Number(e.target.value))}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-white font-mono font-bold focus:border-amber-500 focus:outline-none"
                placeholder="Ingresar cantidad personalizada"
              />
            </div>

            {/* Deposit address instructions */}
            {tab === 'deposit' && (
              <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-400">
                  <span>Dirección {method === 'usdt' ? 'USDT BEP-20' : method === 'binance' ? 'Binance Pay ID' : 'Pago Móvil'}</span>
                  <button
                    type="button"
                    onClick={() => handleCopy(method === 'binance' ? '294819401' : method === 'pagomovil' ? '0414-1234567 V-28123456' : '0x71c...892eB8F')}
                    className="flex items-center gap-1 text-amber-400 hover:text-amber-300 font-bold"
                  >
                    <Copy className="w-3 h-3" />
                    <span>{copied ? '¡Copiado!' : 'Copiar'}</span>
                  </button>
                </div>
                <div className="font-mono text-slate-300 break-all select-all bg-slate-900 p-2 rounded-lg border border-slate-800/80">
                  {method === 'binance' 
                    ? '294819401 (Broker Official Pay)'
                    : method === 'pagomovil'
                    ? 'Banesco (0134) - 0414-1234567 - V-28.123.456'
                    : '0x71C5A898F6543b593A16A54B9bFcC0E931892eB8F'}
                </div>
                <p className="text-[11px] text-slate-500 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  Depósito verificado automáticamente en la blockchain en menos de 60 segundos.
                </p>
              </div>
            )}

            {errorMsg && (
              <div className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 p-2 rounded-lg">
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              className={`w-full py-3.5 rounded-xl font-black text-sm uppercase tracking-wider transition-all cursor-pointer shadow-lg ${
                tab === 'deposit'
                  ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20'
                  : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/20'
              }`}
            >
              {tab === 'deposit' ? `Confirmar Depósito de $${amount} USD` : `Solicitar Retiro de $${amount} USD`}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
