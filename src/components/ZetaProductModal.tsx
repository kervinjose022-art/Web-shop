import React, { useState } from 'react';
import { 
  X, 
  Star, 
  Heart, 
  ShoppingCart, 
  Truck, 
  ShieldCheck, 
  RotateCcw, 
  Check, 
  Building2, 
  Zap, 
  Share2,
  ChevronRight
} from 'lucide-react';
import { Product, Currency } from '../types/store';
import { formatPrice, calculateWholesalePrice } from '../utils/storeUtils';

interface ZetaProductModalProps {
  product: Product | null;
  currency: Currency;
  isWishlisted: boolean;
  onToggleWishlist: (p: Product) => void;
  onAddToCart: (p: Product, qty: number, color?: string, size?: string) => void;
  onBuyNow: (p: Product, qty: number, color?: string, size?: string) => void;
  onClose: () => void;
}

export const ZetaProductModal: React.FC<ZetaProductModalProps> = ({
  product,
  currency,
  isWishlisted,
  onToggleWishlist,
  onAddToCart,
  onBuyNow,
  onClose
}) => {
  if (!product) return null;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(product.colors[0] || '');
  const [selectedSize, setSelectedSize] = useState(product.sizes ? product.sizes[0] : '');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'descripcion' | 'mayorista' | 'opiniones'>('descripcion');
  const [copiedLink, setCopiedLink] = useState(false);

  const effectivePrice = calculateWholesalePrice(product.price, quantity, product.wholesaleTiers);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-white border border-slate-200 rounded-t-3xl sm:rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-slate-900">
        
        {/* Modal Header */}
        <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between sticky top-0 bg-slate-50 z-20">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="capitalize">{product.category}</span>
            <span>/</span>
            <span className="text-slate-900 font-bold truncate max-w-xs">{product.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="px-2.5 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 cursor-pointer text-xs flex items-center gap-1 transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copiedLink ? '¡Copiado!' : 'Compartir'}</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white border border-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Left Column: Image Gallery */}
          <div className="md:col-span-6 space-y-3">
            {/* Main Picture */}
            <div className="relative aspect-square w-full rounded-2xl bg-slate-100 overflow-hidden border border-slate-200">
              <img 
                src={product.images[activeImageIndex] || product.images[0]} 
                alt={product.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              {product.discountPct > 0 && (
                <span className="absolute top-3 left-3 bg-emerald-600 text-white font-bold text-xs px-2.5 py-1 rounded-lg shadow-sm">
                  -{product.discountPct}% OFF
                </span>
              )}
            </div>

            {/* Thumbnail Strip */}
            {product.images.length > 1 && (
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 cursor-pointer transition-all shrink-0 ${
                      activeImageIndex === idx ? 'border-emerald-600 scale-95 shadow-sm' : 'border-slate-200 opacity-75 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="thumb" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Buying Options & Details */}
          <div className="md:col-span-6 flex flex-col justify-between space-y-4">
            <div>
              {/* Rating and Reviews */}
              <div className="flex items-center gap-2 text-xs">
                <div className="flex items-center text-amber-500 font-bold">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                  <span className="ml-1 text-slate-900">{product.rating}</span>
                </div>
                <span className="text-slate-300">·</span>
                <span className="text-slate-500 font-medium">{product.reviewCount} opiniones</span>
                <span className="text-slate-300">·</span>
                <span className="text-emerald-700 font-bold">{product.soldCount}+ vendidos</span>
              </div>

              {/* Title */}
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 mt-2 leading-tight">
                {product.name}
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                {product.subtitle}
              </p>

              {/* Price Block */}
              <div className="mt-3 p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex items-baseline justify-between">
                <div>
                  <div className="text-[11px] text-slate-500 font-semibold">Precio promocional:</div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-mono tabular-nums font-black text-2xl text-emerald-700">
                      {formatPrice(effectivePrice, currency)}
                    </span>
                    {product.originalPrice > effectivePrice && (
                      <span className="text-sm text-slate-400 line-through font-mono tabular-nums">
                        {formatPrice(product.originalPrice, currency)}
                      </span>
                    )}
                  </div>
                </div>

                {quantity > 1 && effectivePrice < product.price && (
                  <span className="bg-amber-100 text-amber-800 border border-amber-300 text-[10px] font-bold px-2 py-1 rounded-lg">
                    Ahorro por volumen
                  </span>
                )}
              </div>

              {/* Wholesale Tier Table */}
              {product.wholesaleTiers && product.wholesaleTiers.length > 0 && (
                <div className="mt-3 bg-amber-50/70 border border-amber-200 rounded-2xl p-3">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 mb-2">
                    <Building2 className="w-3.5 h-3.5 text-amber-600" />
                    <span>Descuentos por Cantidad (Al Mayor):</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    {product.wholesaleTiers.map((tier, i) => (
                      <div 
                        key={i} 
                        onClick={() => setQuantity(tier.minQty)}
                        className={`p-2 rounded-xl border cursor-pointer transition-all ${
                          quantity >= tier.minQty 
                            ? 'bg-amber-500 border-amber-500 text-white font-bold shadow-xs' 
                            : 'bg-white border-amber-200 text-slate-700 hover:border-amber-400'
                        }`}
                      >
                        <div className="text-[10px] uppercase">{tier.minQty}+ Unidades</div>
                        <div className={`font-mono tabular-nums font-black mt-0.5 ${quantity >= tier.minQty ? 'text-white' : 'text-amber-700'}`}>
                          {formatPrice(tier.price, currency)}/u
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Color Selection */}
              {product.colors && product.colors.length > 0 && (
                <div className="mt-4">
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    Color seleccionado: <span className="text-emerald-700 font-extrabold">{selectedColor}</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                          selectedColor === color 
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs' 
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selection */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="mt-4">
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">
                    Talla / Medida: <span className="text-emerald-700 font-extrabold">{selectedSize}</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`w-11 h-9 rounded-xl text-xs font-black border transition-all cursor-pointer flex items-center justify-center ${
                          selectedSize === size 
                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs' 
                            : 'bg-slate-50 border-slate-200 text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Selector */}
              <div className="mt-4 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">Cantidad:</span>
                <div className="flex items-center bg-slate-100 border border-slate-200 rounded-2xl p-1">
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="w-8 h-8 rounded-xl bg-white border border-slate-200 text-slate-900 font-bold text-sm flex items-center justify-center cursor-pointer hover:bg-slate-50"
                  >
                    -
                  </button>
                  <span className="w-12 text-center font-mono tabular-nums font-black text-sm text-slate-900">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(q => q + 1)}
                    className="w-8 h-8 rounded-xl bg-white border border-slate-200 text-slate-900 font-bold text-sm flex items-center justify-center cursor-pointer hover:bg-slate-50"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* CTAs Action Buttons */}
            <div className="pt-4 border-t border-slate-200 space-y-2.5">
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  onClick={() => {
                    onAddToCart(product, quantity, selectedColor, selectedSize);
                    onClose();
                  }}
                  className="py-3 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-900 font-bold text-xs flex items-center justify-center gap-1.5 active:scale-95 transition-all cursor-pointer"
                >
                  <ShoppingCart className="w-4 h-4 text-emerald-700" />
                  <span>Añadir al Carrito</span>
                </button>

                <button
                  onClick={() => {
                    onBuyNow(product, quantity, selectedColor, selectedSize);
                    onClose();
                  }}
                  className="py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-95 transition-all cursor-pointer"
                >
                  <Zap className="w-4 h-4" />
                  <span>Comprar Ahora</span>
                </button>
              </div>

              {/* Delivery Info */}
              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-around text-[10px] text-slate-600">
                <span className="flex items-center gap-1 text-emerald-700 font-semibold">
                  <Check className="w-3 h-3 stroke-[3]" /> En stock ({product.stock} uds)
                </span>
                <span className="text-slate-300">·</span>
                <span className="flex items-center gap-1">
                  <Truck className="w-3 h-3 text-slate-500" /> Envío 24-48 horas
                </span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
