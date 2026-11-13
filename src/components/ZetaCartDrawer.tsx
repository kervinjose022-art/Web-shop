import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  ShoppingBag, 
  Truck, 
  Tag, 
  ArrowRight, 
  Check, 
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { CartItem, Currency, Coupon } from '../types/store';
import { STORE_COUPONS } from '../data/initialProducts';
import { formatPrice } from '../utils/storeUtils';

interface ZetaCartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  currency: Currency;
  onUpdateQty: (productId: string, delta: number, color?: string, size?: string) => void;
  onRemoveItem: (productId: string, color?: string, size?: string) => void;
  onClearCart: () => void;
  appliedCoupon: Coupon | null;
  onApplyCoupon: (coupon: Coupon | null) => void;
  onProceedToCheckout: () => void;
}

const FREE_SHIPPING_THRESHOLD = 35.0;
const STANDARD_SHIPPING_COST = 4.99;

export const ZetaCartDrawer: React.FC<ZetaCartDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  currency,
  onUpdateQty,
  onRemoveItem,
  onClearCart,
  appliedCoupon,
  onApplyCoupon,
  onProceedToCheckout
}) => {
  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [couponError, setCouponError] = useState<string | null>(null);

  if (!isOpen) return null;

  // Calculations
  const rawSubtotal = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const discountAmount = appliedCoupon ? (rawSubtotal * appliedCoupon.discountPct) / 100 : 0;
  const subtotalAfterDiscount = Math.max(0, rawSubtotal - discountAmount);
  
  const isFreeShipping = subtotalAfterDiscount >= FREE_SHIPPING_THRESHOLD || cartItems.length === 0;
  const shippingCost = isFreeShipping ? 0 : STANDARD_SHIPPING_COST;
  const grandTotal = subtotalAfterDiscount + shippingCost;
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotalAfterDiscount);
  const freeShippingProgress = Math.min(100, Math.round((subtotalAfterDiscount / FREE_SHIPPING_THRESHOLD) * 100));

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = couponCodeInput.trim().toUpperCase();
    const found = STORE_COUPONS.find(c => c.code === clean);
    if (found) {
      onApplyCoupon(found);
      setCouponError(null);
    } else {
      setCouponError('Cupón no válido. Prueba con ZETA10 o ZETASHOP20');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-end animate-in fade-in">
      <div className="bg-[#090f1f] border-l border-slate-800 w-full max-w-md h-full flex flex-col shadow-2xl text-white">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-rose-500" />
            <h3 className="font-black text-base text-white">Tu Carrito de Compras</h3>
            <span className="bg-slate-900 border border-slate-800 text-slate-300 font-mono font-bold text-xs px-2 py-0.5 rounded-full">
              {cartItems.reduce((acc, i) => acc + i.quantity, 0)}
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Free Shipping Meter */}
        <div className="bg-[#0b1428] px-4 py-3 border-b border-slate-800">
          <div className="flex items-center justify-between text-xs font-bold mb-1.5">
            <span className="flex items-center gap-1.5 text-slate-300">
              <Truck className="w-3.5 h-3.5 text-cyan-400" />
              {isFreeShipping ? (
                <strong className="text-emerald-400">¡Felicidades! Tienes Envío Gratis 🚚</strong>
              ) : (
                <span>Agrega <strong className="text-amber-400 font-mono">{formatPrice(remainingForFreeShipping, currency)}</strong> para Envío Gratis</span>
              )}
            </span>
            <span className="text-[10px] text-slate-400">{freeShippingProgress}%</span>
          </div>
          <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${
                isFreeShipping ? 'bg-emerald-500' : 'bg-gradient-to-r from-rose-500 to-amber-500'
              }`}
              style={{ width: `${freeShippingProgress}%` }}
            />
          </div>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cartItems.length === 0 ? (
            <div className="py-20 text-center space-y-3">
              <div className="w-16 h-16 rounded-3xl bg-slate-900/80 border border-slate-800 flex items-center justify-center text-3xl mx-auto text-slate-500">
                🛒
              </div>
              <h4 className="font-bold text-base text-white">Tu carrito está vacío</h4>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Explora las tendencias en moda, gadgets y calzado para agregar tus productos favoritos.
              </p>
              <button
                onClick={onClose}
                className="mt-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-rose-500 to-amber-500 text-slate-950 font-black text-xs cursor-pointer shadow-lg active:scale-95 transition-all"
              >
                Empezar a Comprar
              </button>
            </div>
          ) : (
            cartItems.map((item, idx) => (
              <div 
                key={`${item.product.id}_${item.selectedColor}_${item.selectedSize}_${idx}`}
                className="bg-[#0b1325] border border-slate-800/80 rounded-2xl p-3 flex gap-3 shadow-md"
              >
                {/* Thumb */}
                <img 
                  src={item.product.images[0]} 
                  alt={item.product.name}
                  className="w-20 h-20 rounded-xl object-cover border border-slate-800 bg-slate-950 shrink-0"
                />

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-start gap-1">
                    <div>
                      <h4 className="font-bold text-xs text-white line-clamp-1">
                        {item.product.name}
                      </h4>
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-0.5">
                        {item.selectedColor && <span>Color: {item.selectedColor}</span>}
                        {item.selectedSize && <span>· Talla: {item.selectedSize}</span>}
                      </div>
                    </div>
                    <button
                      onClick={() => onRemoveItem(item.product.id, item.selectedColor, item.selectedSize)}
                      className="text-slate-500 hover:text-rose-400 p-1 cursor-pointer"
                      title="Eliminar"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="font-mono font-black text-xs text-rose-400">
                      {formatPrice(item.product.price, currency)}
                    </span>

                    {/* Qty Controls */}
                    <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl p-0.5">
                      <button
                        onClick={() => onUpdateQty(item.product.id, -1, item.selectedColor, item.selectedSize)}
                        className="w-6 h-6 rounded-lg bg-slate-900 text-white font-bold text-xs flex items-center justify-center cursor-pointer hover:bg-slate-800"
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-mono font-bold text-xs text-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQty(item.product.id, 1, item.selectedColor, item.selectedSize)}
                        className="w-6 h-6 rounded-lg bg-slate-900 text-white font-bold text-xs flex items-center justify-center cursor-pointer hover:bg-slate-800"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer with Coupon, Totals and Checkout Button */}
        {cartItems.length > 0 && (
          <div className="p-4 border-t border-slate-800 bg-[#070c18] space-y-3">
            
            {/* Coupon Input */}
            <form onSubmit={handleApplyCoupon} className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Código de cupón (ej. ZETA10)..."
                    value={couponCodeInput}
                    onChange={(e) => setCouponCodeInput(e.target.value)}
                    className="w-full bg-[#080d19] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white uppercase placeholder:normal-case placeholder-slate-500 outline-none focus:border-emerald-500 font-mono"
                  />
                  <Tag className="w-3.5 h-3.5 text-slate-500 absolute right-3 top-2.5 pointer-events-none" />
                </div>
                <button
                  type="submit"
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs rounded-xl cursor-pointer"
                >
                  Aplicar
                </button>
              </div>

              {appliedCoupon && (
                <div className="flex items-center justify-between text-[11px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-1 rounded-lg">
                  <span>✓ Cupón <strong>{appliedCoupon.code}</strong> aplicado ({appliedCoupon.discountPct}% OFF)</span>
                  <button onClick={() => onApplyCoupon(null)} className="text-slate-400 hover:text-white p-0.5">✕</button>
                </div>
              )}
              {couponError && (
                <div className="text-[10px] text-rose-400 pl-1">{couponError}</div>
              )}
            </form>

            {/* Price Breakdown */}
            <div className="space-y-1.5 text-xs text-slate-400 pt-1 font-mono">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="text-white font-bold">{formatPrice(rawSubtotal, currency)}</span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between text-emerald-400">
                  <span>Descuento ({appliedCoupon.code}):</span>
                  <span>-{formatPrice(discountAmount, currency)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Envío:</span>
                <span className={isFreeShipping ? 'text-emerald-400 font-bold' : 'text-white'}>
                  {isFreeShipping ? 'GRATIS' : formatPrice(shippingCost, currency)}
                </span>
              </div>
              <div className="flex justify-between text-base font-black text-white pt-2 border-t border-slate-800">
                <span>Total a Pagar:</span>
                <span className="text-emerald-400">{formatPrice(grandTotal, currency)}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={() => {
                onClose();
                onProceedToCheckout();
              }}
              className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all cursor-pointer"
            >
              <span>Tramitar Pedido / Pagar</span>
              <ArrowRight className="w-4 h-4 stroke-[3]" />
            </button>

            <div className="flex items-center justify-center gap-3 text-[10px] text-slate-500 text-center">
              <span>🔒 Pago Seguro SSL</span>
              <span>•</span>
              <span>WhatsApp Directo</span>
              <span>•</span>
              <span>Garantía de Devolución</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
