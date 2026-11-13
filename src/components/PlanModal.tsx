import React, { useState } from 'react';
import { X, Copy, Check, ShieldCheck, ArrowRight, ArrowLeft, Upload, AlertCircle, Sparkles } from 'lucide-react';

export interface PlanData {
  id: string;
  name: string;
  price: number;
  period: string;
  description: string;
  operations: string;
  features: string[];
  popular?: boolean;
}

export interface SubscriberSubmission {
  id: string;
  planId: string;
  planName: string;
  amountUSDT: number;
  fullName: string;
  email: string;
  phone: string;
  documentId: string;
  txHash: string;
  proofImage?: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface PlanModalProps {
  plan: PlanData | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmitSuccess: (submission: SubscriberSubmission) => void;
  walletAddress?: string;
}

export const PlanModal: React.FC<PlanModalProps> = ({
  plan,
  isOpen,
  onClose,
  onSubmitSuccess,
  walletAddress = '0x4ec021c9900178c6072092a1711167f3495a269d'
}) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneCountry, setPhoneCountry] = useState('+58');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [documentId, setDocumentId] = useState('');
  const [txHash, setTxHash] = useState('');
  const [proofImage, setProofImage] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen || !plan) return null;

  const handleCopyWallet = () => {
    navigator.clipboard.writeText(walletAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleGoToStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !phoneNumber.trim() || !documentId.trim()) {
      setErrorMsg('Por favor completa todos los campos requeridos marcados con *');
      return;
    }
    setErrorMsg('');
    setStep(2);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setProofImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!txHash.trim()) {
      setErrorMsg('Por favor introduce el Hash de Transacción (TxID) de tu envío.');
      return;
    }

    const newSub: SubscriberSubmission = {
      id: 'sub_' + Date.now(),
      planId: plan.id,
      planName: plan.name,
      amountUSDT: plan.price,
      fullName: fullName.trim(),
      email: email.trim(),
      phone: `${phoneCountry} ${phoneNumber.trim()}`,
      documentId: documentId.trim(),
      txHash: txHash.trim(),
      proofImage,
      date: new Date().toISOString(),
      status: 'pending'
    };

    onSubmitSuccess(newSub);
    onClose();
    // Reset state
    setStep(1);
    setFullName('');
    setEmail('');
    setPhoneNumber('');
    setDocumentId('');
    setTxHash('');
    setProofImage('');
    setErrorMsg('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-[#0e172a] border border-amber-500/30 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Top Header */}
        <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full">
                Paso {step} de 2
              </span>
              <span className="text-xs text-slate-400">Activación Rápida</span>
            </div>
            <h3 className="text-base font-black text-white flex items-center gap-1.5">
              Suscripción <span className="text-amber-400">{plan.name}</span>
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 scrollbar-thin">
          {errorMsg && (
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-300 flex items-center gap-2 animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {step === 1 ? (
            /* STEP 1: Personal Data */
            <form id="step1-form" onSubmit={handleGoToStep2} className="space-y-3.5">
              <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800 space-y-1">
                <span className="text-[11px] font-bold text-amber-300 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  Registro de Suscriptor
                </span>
                <p className="text-[11px] text-slate-400">
                  Completa tus datos para activar el plan y registrar las {plan.operations}.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Nombre y Apellidos <span className="text-amber-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  placeholder="Ej. Carlos Mendoza Pérez"
                  className="inpt text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Correo Electrónico <span className="text-amber-400">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="carlos.mendoza@email.com"
                  className="inpt text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Teléfono <span className="text-amber-400">*</span>
                  </label>
                  <div className="flex gap-1.5">
                    <select
                      value={phoneCountry}
                      onChange={e => setPhoneCountry(e.target.value)}
                      className="bg-slate-900 text-xs font-bold text-slate-200 border border-slate-700 rounded-xl px-2.5 py-2 cursor-pointer outline-none shrink-0"
                    >
                      <option value="+58">🇻🇪 +58</option>
                      <option value="+1">🇺🇸 +1</option>
                      <option value="+34">🇪🇸 +34</option>
                      <option value="+57">🇨🇴 +57</option>
                      <option value="+52">🇲🇽 +52</option>
                      <option value="+54">🇦🇷 +54</option>
                      <option value="+56">🇨🇱 +56</option>
                      <option value="+51">🇵🇪 +51</option>
                    </select>
                    <input
                      type="tel"
                      required
                      value={phoneNumber}
                      onChange={e => setPhoneNumber(e.target.value)}
                      placeholder="412 1234567"
                      className="inpt text-sm flex-1"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Documento / Cédula / DNI <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={documentId}
                    onChange={e => setDocumentId(e.target.value)}
                    placeholder="V-18478242 / DNI"
                    className="inpt text-sm"
                  />
                </div>
              </div>

              {/* Summary box */}
              <div className="bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 flex items-center justify-between mt-2">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wide block">Plan Seleccionado</span>
                  <span className="text-xs font-bold text-white">{plan.name} ({plan.operations})</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wide block">Total a Pagar</span>
                  <span className="text-base font-black text-amber-400 font-mono">{plan.price} USDT</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-[#facc15] hover:bg-[#eab308] active:scale-[0.98] text-slate-950 font-black py-3 rounded-xl text-sm transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <span>CONTINUAR AL PAGO (PASO 2)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            /* STEP 2: USDT BEP-20 Payment Details */
            <form id="step2-form" onSubmit={handleFinalSubmit} className="space-y-4">
              <div className="bg-slate-900/60 p-3 rounded-xl border border-amber-500/20 space-y-1">
                <span className="text-[11px] font-bold text-amber-300 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  Confirmación de Transferencia USDT (BEP-20)
                </span>
                <p className="text-[11px] text-slate-300">
                  Envía exactamente <strong className="text-amber-400">{plan.price} USDT</strong> por la red <strong className="text-emerald-400">BNB Smart Chain (BEP-20)</strong> a la siguiente dirección:
                </p>
              </div>

              {/* Wallet Box */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-300">
                  Dirección de Billetera Oficial USDT-BEP20:
                </label>
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-700 flex items-center justify-between gap-2">
                  <span className="text-xs font-mono text-amber-300 break-all select-all">
                    {walletAddress}
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyWallet}
                    className="shrink-0 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg border border-slate-600 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? '¡Copiado!' : 'Copiar'}
                  </button>
                </div>
                <span className="text-[10px] text-amber-400/90 block">
                  ⚠️ Importante: Asegúrate de enviar exclusivamente a través de la red BEP-20 (Binance Smart Chain).
                </span>
              </div>

              {/* Tx Hash / ID */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Hash de la Transacción (TxID) o ID de Envío <span className="text-amber-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={txHash}
                  onChange={e => setTxHash(e.target.value)}
                  placeholder="Ej. 0x8f2d... ó número de referencia"
                  className="inpt text-xs font-mono"
                />
              </div>

              {/* Upload payment screenshot */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Adjuntar Comprobante de Pago (Opcional pero recomendado)
                </label>
                <label className="border-2 border-dashed border-slate-700 hover:border-amber-500/50 rounded-xl p-3 flex flex-col items-center justify-center gap-1.5 cursor-pointer bg-slate-900/40 hover:bg-slate-900/70 transition-all">
                  <Upload className="w-5 h-5 text-slate-400" />
                  <span className="text-xs text-slate-300 font-medium">
                    {proofImage ? 'Comprobante seleccionado ✓' : 'Toca para subir captura de pantalla'}
                  </span>
                  <span className="text-[10px] text-slate-500">PNG, JPG o WEBP</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Buttons */}
              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Volver
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-[#facc15] hover:bg-[#eab308] active:scale-[0.98] text-slate-950 font-black py-2.5 rounded-xl text-xs transition-all shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  CONFIRMAR TRANSFERENCIA
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
