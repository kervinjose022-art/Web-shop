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
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex justify-end animate-in fade-in">
      <div className="bg-white border-l border-slate-200 w-full max-w-md h-full flex flex-col shadow-2xl text-slate-900">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-emerald-600" />
            <h3 className="font-extrabold text-base text-slate-900">Tu Carrito de Compras</h3>
            <span className="bg-white border border-slate-200 text-slate-700 font-mono tabular-nums font-bold text-xs px-2 py-0.5 rounded-full">
              {cartItems.reduce((acc, i) => acc + i.quantity, 0)}
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white border border-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Free Shipping Meter */}
        <div className="bg-emerald-50/70 px-4 py-3 border-b border-slate-200">
          <div className="flex items-center justify-between text-xs font-bold mb-1.5">
            <span className="flex items-center gap-1.5 text-slate-700">
              <Truck className="w-3.5 h-3.5 text-emerald-600" />
              {isFreeShipping ? (
                <strong className="text-emerald-700">¡Felicidades! Tienes Envío Gratis</strong>
              ) : (
                <span>Agrega <strong className="text-emerald-700 font-mono tabular-nums">{formatPrice(remainingForFreeShipping, currency)}</strong> para Envío Gratis</span>
              )}
            </span>
            <span className="text-[10px] text-slate-500 font-mono tabular-nums">{freeShippingProgress}%</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-500 ${
                isFreeShipping ? 'bg-emerald-600' : 'bg-emerald-500'
              }`}
              style={{ width: `${freeShippingProgress}%` }}
            />
          </div>
        </div>

        {/* Cart Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cartItems.length === 0 ? (
            <div className="py-20 text-center space-y-3">
              <div className="w-16 h-16 rounded-3xl bg-slate-100 border border-slate-200 flex items-center justify-center text-3xl mx-auto">
                🛒
              </div>
              <h4 className="font-bold text-base text-slate-900">Tu carrito está vacío</h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Explora nuestro catálogo para agregar tus productos favoritos.
              </p>
              <button
                onClick={onClose}
                className="mt-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer shadow-sm active:scale-95 transition-all"
              >
                Empezar a Comprar
              </button>
            </div>
          ) : (
            cartItems.map((item, idx) => (
              <div 
                key={`${item.product.id}_${item.selectedColor}_${item.selectedSize}_${idx}`}
                className="bg-slate-50 border border-slate-200 rounded-2xl p-3 flex gap-3"
              >
                {/* Thumb */}
                <img 
                  src={item.product.images[0]} 
                  alt={item.product.name}
                  referrerPolicy="no-referrer"
                  className="w-20 h-20 rounded-xl object-cover border border-slate-200 bg-white shrink-0"
                />

                {/* Details */}
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-start gap-1">
                    <div>
                      <h4 className="font-bold text-xs text-slate-900 line-clamp-1">
                        {item.product.name}
                      </h4>
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-500 mt-0.5">
                        {item.selectedColor && <span>Color: {item.selectedColor}</span>}
                        {item.selectedSize && <span>· Talla: {item.selectedSize}</span>}
                      </div>
                    </div>
                    <button
                      onClick={() => onRemoveItem(item.product.id, item.selectedColor, item.selectedSize)}
                      className="text-slate-400 hover:text-rose-600 p-1 cursor-pointer transition-colors"
                      title="Eliminar"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="font-mono tabular-nums font-extrabold text-xs text-emerald-700">
                      {formatPrice(item.product.price, currency)}
                    </span>

                    {/* Qty Controls */}
                    <div className="flex items-center bg-white border border-slate-200 rounded-xl p-0.5">
                      <button
                        onClick={() => onUpdateQty(item.product.id, -1, item.selectedColor, item.selectedSize)}
                        className="w-6 h-6 rounded-lg bg-slate-100 text-slate-800 font-bold text-xs flex items-center justify-center cursor-pointer hover:bg-slate-200"
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-mono tabular-nums font-bold text-xs text-slate-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => onUpdateQty(item.product.id, 1, item.selectedColor, item.selectedSize)}
                        className="w-6 h-6 rounded-lg bg-slate-100 text-slate-800 font-bold text-xs flex items-center justify-center cursor-pointer hover:bg-slate-200"
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
          <div className="p-4 border-t border-slate-200 bg-slate-50 space-y-3">
            
            {/* Coupon Input */}
            <form onSubmit={handleApplyCoupon} className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Código de cupón (ej. ZETA10)..."
                    value={couponCodeInput}
                    onChange={(e) => setCouponCodeInput(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 uppercase placeholder:normal-case placeholder-slate-400 outline-none focus:border-emerald-600 font-mono"
                  />
                  <Tag className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
                </div>
                <button
                  type="submit"
                  className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl cursor-pointer transition-colors"
                >
                  Aplicar
                </button>
              </div>

              {appliedCoupon && (
                <div className="flex items-center justify-between text-[11px] text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg">
                  <span>✓ Cupón <strong>{appliedCoupon.code}</strong> aplicado ({appliedCoupon.discountPct}% OFF)</span>
                  <button onClick={() => onApplyCoupon(null)} className="text-slate-500 hover:text-slate-900 p-0.5 cursor-pointer">✕</button>
                </div>
              )}
              {couponError && (
                <div className="text-[10px] text-rose-600 pl-1 font-medium">{couponError}</div>
              )}
            </form>

            {/* Price Breakdown */}
            <div className="space-y-1.5 text-xs text-slate-600 pt-1 font-mono tabular-nums">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span className="text-slate-900 font-bold">{formatPrice(rawSubtotal, currency)}</span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between text-emerald-700 font-semibold">
                  <span>Descuento ({appliedCoupon.code}):</span>
                  <span>-{formatPrice(discountAmount, currency)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Envío:</span>
                <span className={isFreeShipping ? 'text-emerald-700 font-bold' : 'text-slate-900'}>
                  {isFreeShipping ? 'GRATIS' : formatPrice(shippingCost, currency)}
                </span>
              </div>
              <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-200">
                <span>Total a Pagar:</span>
                <span className="text-emerald-700">{formatPrice(grandTotal, currency)}</span>
              </div>
            </div>

            {/* Checkout Button */}
            <button
              onClick={() => {
                onClose();
                onProceedToCheckout();
              }}
              className="w-full py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-sm active:scale-95 transition-all cursor-pointer"
            >
              <span>Tramitar Pedido / Pagar</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </button>

            <div className="flex items-center justify-center gap-3 text-[10px] text-slate-500 text-center">
              <span>Envíos Rápidos</span>
              <span>·</span>
              <span>WhatsApp Directo 0426-2139920</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
