import React, { useState } from 'react';
import { 
  X, 
  Check, 
  CreditCard, 
  Smartphone, 
  Send, 
  ShieldCheck, 
  Building, 
  Coins, 
  Copy, 
  ArrowRight,
  Package,
  Sparkles,
  MessageCircle,
  HelpCircle
} from 'lucide-react';
import { CartItem, Currency, Coupon, Order, CustomerUser } from '../types/store';
import { formatPrice } from '../utils/storeUtils';

interface ZetaCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  currency: Currency;
  appliedCoupon: Coupon | null;
  onOrderCompleted: (order: Order) => void;
  currentUser?: CustomerUser | null;
}

export const ZetaCheckoutModal: React.FC<ZetaCheckoutModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  currency,
  appliedCoupon,
  onOrderCompleted,
  currentUser
}) => {
  if (!isOpen) return null;

  // Form states (autofilled if customer is logged in)
  const [customerName, setCustomerName] = useState(() => currentUser?.name || '');
  const [customerEmail, setCustomerEmail] = useState(() => currentUser?.email || '');
  const [customerPhone, setCustomerPhone] = useState(() => currentUser?.phone || '');
  const [shippingAddress, setShippingAddress] = useState(() => currentUser?.address || '');
  const [city, setCity] = useState(() => currentUser?.city || '');
  const [paymentMethod, setPaymentMethod] = useState<'whatsapp' | 'pagomovil' | 'zelle' | 'usdt' | 'card'>('whatsapp');

  // Card details
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  // Copy feedback state
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Completed order state
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculations
  const rawSubtotal = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const discountAmount = appliedCoupon ? (rawSubtotal * appliedCoupon.discountPct) / 100 : 0;
  const subtotalAfterDiscount = Math.max(0, rawSubtotal - discountAmount);
  const shippingCost = subtotalAfterDiscount >= 35.0 ? 0 : 4.99;
  const grandTotal = subtotalAfterDiscount + shippingCost;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || !customerPhone.trim() || !shippingAddress.trim()) {
      alert('Por favor completa el Nombre del Comprador, Teléfono de WhatsApp y la Dirección de entrega.');
      return;
    }

    setIsSubmitting(true);

    const newOrder: Order = {
      id: `ZM-${Math.floor(100000 + Math.random() * 900000)}`,
      createdAt: new Date().toLocaleString('es-ES', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }),
      customerName,
      customerPhone,
      customerEmail: customerEmail || 'cliente@zetamall.com',
      shippingAddress,
      city: city || 'Ciudad Principal',
      items: [...cartItems],
      subtotal: rawSubtotal,
      discount: discountAmount,
      shippingCost,
      total: grandTotal,
      paymentMethod: paymentMethod === 'zelle' ? 'whatsapp' : paymentMethod,
      status: 'pendiente'
    };

    setTimeout(() => {
      setIsSubmitting(false);
      setCompletedOrder(newOrder);
      onOrderCompleted(newOrder);

      // WhatsApp direct checkout message
      if (paymentMethod === 'whatsapp' || paymentMethod === 'zelle') {
        const itemsText = cartItems.map(i => `• ${i.quantity}x ${i.product.name} (${i.selectedColor || 'Estándar'} ${i.selectedSize || ''}) = $${(i.product.price * i.quantity).toFixed(2)}`).join('\n');
        const text = encodeURIComponent(
          `¡Hola ZetaMall! 👋 Deseo confirmar mi pedido #${newOrder.id}:\n\n` +
          `🛍️ *PRODUCTOS:*\n${itemsText}\n\n` +
          `💰 *TOTAL A PAGAR:* ${formatPrice(grandTotal, currency)}\n` +
          `💳 *MÉTODO DE PAGO:* ${paymentMethod === 'zelle' ? 'Zelle' : 'WhatsApp / Pago Móvil'}\n` +
          `👤 *COMPRADOR:* ${customerName}\n` +
          `📧 *CORREO:* ${customerEmail || 'No especificado'}\n` +
          `📞 *WHATSAPP:* ${customerPhone}\n` +
          `📍 *DIRECCIÓN DE ENVÍO:* ${shippingAddress}, ${city || 'Venezuela'}\n\n` +
          `Quedo a la espera de confirmar el pago y el envío. ¡Muchas gracias!`
        );
        window.open(`https://wa.me/584262139920?text=${text}`, '_blank');
      }
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-2xl max-h-[92vh] flex flex-col shadow-2xl text-slate-900 overflow-hidden">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-700">
              <Package className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-slate-900">
                {completedOrder ? '¡Pedido Registrado con Éxito!' : 'Finalizar Pedido'}
              </h3>
              <p className="text-[11px] text-slate-500">
                {completedOrder ? 'Detalles de tu orden y comprobante' : 'Completa tus datos para coordinar el envío'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6">
          {completedOrder ? (
            /* Order Success Screen */
            <div className="py-6 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-700 border border-emerald-200 flex items-center justify-center text-2xl mx-auto shadow-xs">
                <Check className="w-7 h-7 stroke-[2.5]" />
              </div>

              <div className="space-y-1">
                <span className="text-xs font-mono text-emerald-700 font-bold uppercase tracking-wider">Orden Generada</span>
                <h4 className="text-xl sm:text-2xl font-extrabold text-slate-900">¡Gracias por tu compra, {completedOrder.customerName}!</h4>
                <p className="text-xs text-slate-500">
                  Tu pedido <strong className="text-slate-900 font-mono">{completedOrder.id}</strong> ha sido recibido correctamente.
                </p>
              </div>

              {/* Order Receipt Box */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left max-w-md mx-auto space-y-2 text-xs">
                <div className="flex justify-between text-slate-500">
                  <span>Nº de Orden:</span>
                  <span className="font-mono text-slate-900 font-bold">{completedOrder.id}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Comprador:</span>
                  <span className="text-slate-900 font-medium">{completedOrder.customerName}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Teléfono:</span>
                  <span className="text-slate-900 font-medium">{completedOrder.customerPhone}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Destino:</span>
                  <span className="text-slate-900 font-medium">{completedOrder.shippingAddress}, {completedOrder.city}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Método de pago:</span>
                  <span className="text-emerald-700 uppercase font-bold">{completedOrder.paymentMethod}</span>
                </div>
                <div className="flex justify-between text-slate-600 border-t border-slate-200 pt-2 font-mono tabular-nums">
                  <span className="text-slate-900 font-bold">Monto Total:</span>
                  <span className="text-emerald-700 font-black text-sm">{formatPrice(completedOrder.total, currency)}</span>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap justify-center gap-3">
                <a
                  href={`https://wa.me/584262139920?text=Hola%20ZetaMall,%20acabo%20de%20realizar%20el%20pedido%20%23${completedOrder.id}`}
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm flex items-center gap-2 cursor-pointer transition-all"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Contactar Asesor por WhatsApp</span>
                </a>
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-800 font-bold text-xs cursor-pointer transition-all"
                >
                  Cerrar y Seguir Comprando
                </button>
              </div>
            </div>
          ) : (
            /* Checkout Form */
            <form onSubmit={handleSubmitOrder} className="space-y-5">
              
              {/* Step 1: Datos del Comprador y Envío */}
              <div className="space-y-3">
                <div className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center font-mono text-[10px] font-black">1</span>
                  <span>Datos del Comprador y Entrega</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Nombre del Comprador *</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Nombre y Apellido completo"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-slate-900 placeholder-slate-400 outline-none focus:bg-white focus:border-emerald-600 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Número de WhatsApp *</label>
                    <input 
                      type="tel" 
                      required
                      placeholder="Ej. 0426 2139920"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-slate-900 placeholder-slate-400 outline-none focus:bg-white focus:border-emerald-600 transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="sm:col-span-1">
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Correo Electrónico</label>
                    <input 
                      type="email" 
                      placeholder="correo@ejemplo.com"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-slate-900 placeholder-slate-400 outline-none focus:bg-white focus:border-emerald-600 transition-colors"
                    />
                  </div>
                  <div className="sm:col-span-1">
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Dirección de Entrega *</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Calle, Edificio, Casa o Punto de Ref."
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-slate-900 placeholder-slate-400 outline-none focus:bg-white focus:border-emerald-600 transition-colors"
                    />
                  </div>
                  <div className="sm:col-span-1">
                    <label className="text-[11px] font-bold text-slate-700 block mb-1">Ciudad / Estado *</label>
                    <input 
                      type="text" 
                      required
                      placeholder="Ej. Caracas, Valencia, etc."
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-slate-900 placeholder-slate-400 outline-none focus:bg-white focus:border-emerald-600 transition-colors"
                    />
                  </div>
                </div>
              </div>

              {/* Step 2: Método de Pago */}
              <div className="space-y-3 pt-3 border-t border-slate-200">
                <div className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center font-mono text-[10px] font-black">2</span>
                  <span>Selecciona Método de Pago</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                  {/* WhatsApp */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('whatsapp')}
                    className={`p-2.5 rounded-xl border text-center flex flex-col items-center gap-1 cursor-pointer transition-all ${
                      paymentMethod === 'whatsapp' 
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-900 font-bold shadow-xs' 
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <MessageCircle className="w-4 h-4 text-emerald-600" />
                    <span>WhatsApp</span>
                    <span className="text-[9px] text-emerald-700 font-semibold">Directo</span>
                  </button>

                  {/* Pago Móvil */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('pagomovil')}
                    className={`p-2.5 rounded-xl border text-center flex flex-col items-center gap-1 cursor-pointer transition-all ${
                      paymentMethod === 'pagomovil' 
                        ? 'bg-cyan-50 border-cyan-500 text-cyan-950 font-bold shadow-xs' 
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Smartphone className="w-4 h-4 text-cyan-600" />
                    <span>Pago Móvil</span>
                    <span className="text-[9px] text-cyan-700 font-semibold">Bs. Vzla</span>
                  </button>

                  {/* Zelle */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('zelle')}
                    className={`p-2.5 rounded-xl border text-center flex flex-col items-center gap-1 cursor-pointer transition-all ${
                      paymentMethod === 'zelle' 
                        ? 'bg-purple-50 border-purple-500 text-purple-950 font-bold shadow-xs' 
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Send className="w-4 h-4 text-purple-600" />
                    <span>Zelle</span>
                    <span className="text-[9px] text-purple-700 font-semibold">USD</span>
                  </button>

                  {/* USDT BEP-20 */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('usdt')}
                    className={`p-2.5 rounded-xl border text-center flex flex-col items-center gap-1 cursor-pointer transition-all ${
                      paymentMethod === 'usdt' 
                        ? 'bg-amber-50 border-amber-500 text-amber-950 font-bold shadow-xs' 
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Coins className="w-4 h-4 text-amber-600" />
                    <span>USDT</span>
                    <span className="text-[9px] text-amber-700 font-semibold">BEP-20</span>
                  </button>

                  {/* Tarjeta */}
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-2.5 rounded-xl border text-center flex flex-col items-center gap-1 cursor-pointer transition-all col-span-2 sm:col-span-1 ${
                      paymentMethod === 'card' 
                        ? 'bg-blue-50 border-blue-500 text-blue-950 font-bold shadow-xs' 
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 text-blue-600" />
                    <span>Tarjeta</span>
                    <span className="text-[9px] text-blue-700 font-semibold">Déb/Créd</span>
                  </button>
                </div>

                {/* --- Payment Method Specific Boxes --- */}

                {/* 1. WHATSAPP DIRECTO */}
                {paymentMethod === 'whatsapp' && (
                  <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                        <MessageCircle className="w-4 h-4 text-emerald-600" />
                        Atención Personalizada por WhatsApp:
                      </span>
                      <span className="text-[11px] font-mono text-emerald-800 font-bold">0426-2139920</span>
                    </div>
                    <p className="text-[11px] text-emerald-800 leading-relaxed">
                      Al tocar el botón <strong>"Confirmar Pedido"</strong>, se abrirá tu WhatsApp con el resumen de tus productos, tu dirección y el monto total para que nuestro asesor confirme tu envío de inmediato.
                    </p>
                  </div>
                )}

                {/* 2. PAGO MÓVIL (Venezuela & Mercantil) */}
                {paymentMethod === 'pagomovil' && (
                  <div className="p-3.5 bg-slate-50 border border-cyan-200 rounded-2xl text-xs space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                      <span className="font-bold text-cyan-900 flex items-center gap-1.5">
                        <Smartphone className="w-4 h-4 text-cyan-600" />
                        Datos para Pago Móvil / Transferencia:
                      </span>
                      <span className="text-[10px] bg-cyan-100 text-cyan-800 border border-cyan-200 px-2 py-0.5 rounded-md font-bold">
                        Bs. Tasa Oficial
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-[11px]">
                      <div className="bg-white p-2.5 rounded-xl border border-slate-200 flex items-center justify-between">
                        <div>
                          <div className="text-[10px] text-slate-500 font-sans">Cédula de Identidad:</div>
                          <div className="text-slate-900 font-bold text-sm">26.304.421</div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopy('26304421', 'ci')}
                          className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs text-slate-700 flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <Copy className="w-3 h-3" />
                          <span>{copiedKey === 'ci' ? '¡Copiado!' : 'Copiar'}</span>
                        </button>
                      </div>

                      <div className="bg-white p-2.5 rounded-xl border border-slate-200 flex items-center justify-between">
                        <div>
                          <div className="text-[10px] text-slate-500 font-sans">Teléfono Pago Móvil:</div>
                          <div className="text-slate-900 font-bold text-sm">0426-2139920</div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopy('04262139920', 'tel')}
                          className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs text-slate-700 flex items-center gap-1 cursor-pointer transition-colors"
                        >
                          <Copy className="w-3 h-3" />
                          <span>{copiedKey === 'tel' ? '¡Copiado!' : 'Copiar'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Bancos Disponibles */}
                    <div className="space-y-1.5">
                      <div className="text-[11px] font-bold text-slate-600">Bancos Disponibles:</div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                        <div className="bg-white p-2 rounded-xl border border-slate-200 flex items-center gap-2">
                          <Building className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                          <div>
                            <span className="font-bold text-slate-900">0102 - Banco de Venezuela</span>
                          </div>
                        </div>
                        <div className="bg-white p-2 rounded-xl border border-slate-200 flex items-center gap-2">
                          <Building className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                          <div>
                            <span className="font-bold text-slate-900">Banco Mercantil</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <p className="text-[10px] text-slate-500 italic">
                      * Luego de realizar el Pago Móvil, envía el capture o número de referencia al WhatsApp 0426-2139920 para despachar tu paquete.
                    </p>
                  </div>
                )}

                {/* 3. ZELLE */}
                {paymentMethod === 'zelle' && (
                  <div className="p-3.5 bg-purple-50 border border-purple-200 rounded-2xl text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-purple-900 flex items-center gap-1.5">
                        <Send className="w-4 h-4 text-purple-600" />
                        Pago en Dólares por Zelle:
                      </span>
                      <span className="text-[10px] bg-purple-100 text-purple-800 px-2 py-0.5 rounded-md font-bold">
                        Vía WhatsApp
                      </span>
                    </div>
                    <p className="text-[11px] text-purple-900/80 leading-relaxed">
                      Para solicitar los datos actualizados de la cuenta Zelle, comunícate directamente con nuestro asesor de ventas al WhatsApp:
                    </p>
                    <div className="bg-white p-2.5 rounded-xl border border-purple-200 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <MessageCircle className="w-4 h-4 text-emerald-600" />
                        <span className="font-mono font-bold text-slate-900 text-sm">0426-2139920</span>
                      </div>
                      <a 
                        href="https://wa.me/584262139920?text=Hola,%20deseo%20los%20datos%20de%20Zelle%20para%20pagar%20mi%20pedido%20en%20ZetaMall"
                        target="_blank"
                        rel="noreferrer"
                        className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                      >
                        Abrir Chat Zelle
                      </a>
                    </div>
                  </div>
                )}

                {/* 4. USDT BEP-20 */}
                {paymentMethod === 'usdt' && (
                  <div className="p-3.5 bg-amber-50/70 border border-amber-200 rounded-2xl text-xs space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-amber-900 flex items-center gap-1.5">
                        <Coins className="w-4 h-4 text-amber-600" />
                        Billetera USDT (BEP-20):
                      </span>
                      <span className="text-[10px] bg-amber-100 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-md font-bold">
                        BNB Smart Chain
                      </span>
                    </div>

                    <div className="bg-white p-2.5 rounded-xl border border-amber-200 space-y-1.5">
                      <div className="text-[10px] text-slate-500">Dirección de depósito (Red BEP-20):</div>
                      <div className="font-mono text-slate-900 text-[11px] break-all select-all bg-slate-50 p-2 rounded-lg border border-slate-200">
                        0x29f0f1edd5258ee3b7553bff665df4d1dd811af0
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopy('0x29f0f1edd5258ee3b7553bff665df4d1dd811af0', 'usdt')}
                        className="w-full py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold flex items-center justify-center gap-1 cursor-pointer transition-colors"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        <span>{copiedKey === 'usdt' ? '¡Dirección Copiada!' : 'Copiar Dirección USDT'}</span>
                      </button>
                    </div>

                    <p className="text-[10px] text-slate-600 italic">
                      * Envía únicamente USDT a través de la red BNB Smart Chain (BEP-20). Luego envía el hash o comprobante al WhatsApp 0426-2139920.
                    </p>
                  </div>
                )}

                {/* 5. TARJETA */}
                {paymentMethod === 'card' && (
                  <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl space-y-2.5 text-xs">
                    <div>
                      <label className="text-[10px] text-slate-600 font-semibold block mb-1">Número de Tarjeta (Débito o Crédito)</label>
                      <input 
                        type="text" 
                        placeholder="4532 •••• •••• 8821" 
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 font-mono text-slate-900 outline-none focus:border-emerald-600"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] text-slate-600 font-semibold block mb-1">Vencimiento (MM/AA)</label>
                        <input 
                          type="text" 
                          placeholder="12/28" 
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 font-mono text-slate-900 outline-none focus:border-emerald-600"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-600 font-semibold block mb-1">CVV</label>
                        <input 
                          type="password" 
                          placeholder="•••" 
                          maxLength={4}
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value)}
                          className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 font-mono text-slate-900 outline-none focus:border-emerald-600"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Order Total Review & Submit Button */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between">
                <div>
                  <div className="text-xs text-slate-500">Total a Pagar ({cartItems.length} artículos):</div>
                  <div className="text-xl font-mono tabular-nums font-black text-emerald-700">{formatPrice(grandTotal, currency)}</div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs sm:text-sm rounded-xl shadow-sm transition-all cursor-pointer flex items-center gap-2"
                >
                  {isSubmitting ? (
                    <span>Registrando...</span>
                  ) : (
                    <>
                      <span>Confirmar Pedido</span>
                      <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                    </>
                  )}
                </button>
              </div>

            </form>
          )}
        </div>

      </div>
    </div>
  );
};

