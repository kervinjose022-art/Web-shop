import React from 'react';
import { X, CheckCircle, Clock, Trash2, ExternalLink, Image as ImageIcon, Shield } from 'lucide-react';
import { SubscriberSubmission } from './PlanModal';

interface AdminSubscribersModalProps {
  isOpen: boolean;
  onClose: () => void;
  subscribers: SubscriberSubmission[];
  onUpdateStatus: (id: string, status: 'approved' | 'rejected' | 'pending') => void;
  onDeleteSubscriber: (id: string) => void;
  walletAddress: string;
}

export const AdminSubscribersModal: React.FC<AdminSubscribersModalProps> = ({
  isOpen,
  onClose,
  subscribers,
  onUpdateStatus,
  onDeleteSubscriber,
  walletAddress
}) => {
  const [selectedProof, setSelectedProof] = React.useState<string | null>(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-[#0e172a] border border-amber-500/40 rounded-2xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Panel de Suscripciones y Pagos USDT</h3>
              <p className="text-xs text-slate-400">
                Verifica las transferencias BEP-20 enviadas a la billetera oficial
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Billetera Info */}
        <div className="bg-slate-950 p-3 px-4 border-b border-slate-800 text-xs flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Billetera Oficial BEP-20:</span>
            <span className="font-mono text-amber-300 font-bold">{walletAddress}</span>
          </div>
          <span className="bg-amber-500/10 text-amber-300 border border-amber-500/20 px-2 py-0.5 rounded text-[11px] font-bold">
            {subscribers.length} Registros
          </span>
        </div>

        {/* Content list */}
        <div className="p-4 overflow-y-auto space-y-3 flex-1 scrollbar-thin">
          {subscribers.length === 0 ? (
            <div className="text-center py-12 text-slate-500 space-y-2">
              <Clock className="w-8 h-8 mx-auto text-slate-600" />
              <p className="text-sm">Aún no hay suscriptores registrados.</p>
              <p className="text-xs text-slate-600">
                Cuando un usuario elija un plan y envíe su pago USDT, aparecerá listado aquí.
              </p>
            </div>
          ) : (
            subscribers.map(sub => (
              <div
                key={sub.id}
                className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 space-y-2.5 transition-all hover:border-slate-700"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{sub.fullName}</span>
                    <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded text-[10px] font-black uppercase">
                      {sub.planName} (${sub.amountUSDT} USDT)
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                        sub.status === 'approved'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : sub.status === 'rejected'
                          ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse'
                      }`}
                    >
                      {sub.status === 'approved' ? 'Aprobado ✓' : sub.status === 'rejected' ? 'Rechazado' : 'Pendiente'}
                    </span>
                    <button
                      onClick={() => onDeleteSubscriber(sub.id)}
                      className="p-1 text-slate-500 hover:text-red-400 transition-colors"
                      title="Eliminar registro"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs text-slate-300 font-mono">
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase">Contacto:</span>
                    <span>{sub.email}</span>
                    <span className="block text-slate-400">{sub.phone}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase">Documento / ID:</span>
                    <span>{sub.documentId}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block uppercase">Fecha:</span>
                    <span>{new Date(sub.date).toLocaleString()}</span>
                  </div>
                </div>

                {/* TxID & Proof */}
                <div className="bg-slate-950 p-2 rounded-lg border border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-1.5 font-mono">
                    <span className="text-slate-500 text-[10px]">TxID:</span>
                    <span className="text-amber-300 select-all break-all">{sub.txHash}</span>
                  </div>

                  {sub.proofImage && (
                    <button
                      onClick={() => setSelectedProof(sub.proofImage!)}
                      className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 underline"
                    >
                      <ImageIcon className="w-3.5 h-3.5" />
                      Ver Comprobante
                    </button>
                  )}
                </div>

                {/* Status action buttons */}
                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => onUpdateStatus(sub.id, 'approved')}
                    className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-1.5 rounded-lg text-xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    Aprobar Plan y Activar
                  </button>
                  <button
                    onClick={() => onUpdateStatus(sub.id, 'rejected')}
                    className="px-3 bg-slate-800 hover:bg-red-900/40 text-slate-400 hover:text-red-300 font-bold py-1.5 rounded-lg text-xs transition-colors cursor-pointer"
                  >
                    Rechazar
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Proof Viewer Modal */}
      {selectedProof && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/90">
          <div className="relative max-w-xl max-h-[85vh] bg-slate-900 p-2 rounded-xl">
            <button
              onClick={() => setSelectedProof(null)}
              className="absolute -top-3 -right-3 p-1.5 bg-red-600 text-white rounded-full shadow-lg"
            >
              <X className="w-4 h-4" />
            </button>
            <img src={selectedProof} alt="Comprobante" className="max-h-[80vh] w-auto rounded-lg object-contain" />
          </div>
        </div>
      )}
    </div>
  );
};
