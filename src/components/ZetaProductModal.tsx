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
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-[#0b1325] border border-slate-800 rounded-t-3xl sm:rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-white">
        
        {/* Modal Header */}
        <div className="px-5 py-3 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-[#0b1325] z-20">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="capitalize">{product.category}</span>
            <span>/</span>
            <span className="text-white font-bold truncate max-w-xs">{product.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="p-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white cursor-pointer text-xs flex items-center gap-1"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copiedLink ? 'Copiado!' : 'Compartir'}</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer"
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
            <div className="relative aspect-square w-full rounded-3xl bg-slate-950 overflow-hidden border border-slate-800 shadow-inner">
              <img 
                src={product.images[activeImageIndex] || product.images[0]} 
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.discountPct > 0 && (
                <span className="absolute top-3 left-3 bg-rose-600 text-white font-black text-xs px-2.5 py-1 rounded-full shadow-lg">
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
                      activeImageIndex === idx ? 'border-rose-500 scale-95 shadow-md' : 'border-slate-800 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="thumb" className="w-full h-full object-cover" />
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
                <div className="flex items-center text-amber-400 font-bold">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                  ))}
                  <span className="ml-1 text-white">{product.rating}</span>
                </div>
                <span className="text-slate-500">·</span>
                <span className="text-slate-400 font-medium">{product.reviewCount} opiniones verificadas</span>
                <span className="text-slate-500">·</span>
                <span className="text-emerald-400 font-bold">{product.soldCount}+ vendidos</span>
              </div>

              {/* Title */}
              <h2 className="text-lg sm:text-xl font-black text-white mt-2 leading-tight">
                {product.name}
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                {product.subtitle}
              </p>

              {/* Price Block */}
              <div className="mt-3 p-3 bg-slate-950 border border-slate-800 rounded-2xl flex items-baseline justify-between">
                <div>
                  <div className="text-[11px] text-slate-400 font-semibold">Precio promocional:</div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-mono font-black text-2xl text-rose-400">
                      {formatPrice(effectivePrice, currency)}
                    </span>
                    {product.originalPrice > effectivePrice && (
                      <span className="text-sm text-slate-500 line-through font-mono">
                        {formatPrice(product.originalPrice, currency)}
                      </span>
                    )}
                  </div>
                </div>

                {quantity > 1 && effectivePrice < product.price && (
                  <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-black px-2 py-1 rounded-xl">
                    ¡Ahorraste con precio por volumen!
                  </span>
                )}
              </div>

              {/* Wholesale Tier Table */}
              {product.wholesaleTiers && product.wholesaleTiers.length > 0 && (
                <div className="mt-3 bg-amber-500/10 border border-amber-500/30 rounded-2xl p-3">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300 mb-2">
                    <Building2 className="w-3.5 h-3.5" />
                    <span>Descuentos por Cantidad (Al Mayor):</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    {product.wholesaleTiers.map((tier, i) => (
                      <div 
                        key={i} 
                        onClick={() => setQuantity(tier.minQty)}
                        className={`p-2 rounded-xl border cursor-pointer transition-all ${
                          quantity >= tier.minQty 
                            ? 'bg-amber-500/30 border-amber-400 text-white font-bold' 
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-amber-500/40'
                        }`}
                      >
                        <div className="text-[10px] uppercase">{tier.minQty}+ Unidades</div>
                        <div className="font-mono font-black text-amber-400 mt-0.5">{formatPrice(tier.price, currency)}/u</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Color Selection */}
              {product.colors && product.colors.length > 0 && (
                <div className="mt-4">
                  <label className="text-xs font-bold text-slate-300 block mb-1.5">
                    Color seleccionado: <span className="text-rose-400 font-black">{selectedColor}</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                          selectedColor === color 
                            ? 'bg-rose-500 text-white border-rose-400 shadow-md' 
                            : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
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
                  <label className="text-xs font-bold text-slate-300 block mb-1.5">
                    Talla / Medida: <span className="text-rose-400 font-black">{selectedSize}</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`w-11 h-9 rounded-xl text-xs font-black border transition-all cursor-pointer flex items-center justify-center ${
                          selectedSize === size 
                            ? 'bg-rose-500 text-white border-rose-400 shadow-md' 
                            : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
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
                <span className="text-xs font-bold text-slate-300">Cantidad:</span>
                <div className="flex items-center bg-slate-950 border border-slate-800 rounded-2xl p-1">
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="w-8 h-8 rounded-xl bg-slate-900 text-white font-bold text-sm flex items-center justify-center cursor-pointer hover:bg-slate-800"
                  >
                    -
                  </button>
                  <span className="w-12 text-center font-mono font-black text-sm text-white">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(q => q + 1)}
                    className="w-8 h-8 rounded-xl bg-slate-900 text-white font-bold text-sm flex items-center justify-center cursor-pointer hover:bg-slate-800"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* CTAs Action Buttons */}
            <div className="pt-4 border-t border-slate-800 space-y-2.5">
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  onClick={() => {
                    onAddToCart(product, quantity, selectedColor, selectedSize);
                    onClose();
                  }}
                  className="py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer"
                >
                  <ShoppingCart className="w-4 h-4 text-emerald-400" />
                  <span>Añadir al Carrito</span>
                </button>

                <button
                  onClick={() => {
                    onBuyNow(product, quantity, selectedColor, selectedSize);
                    onClose();
                  }}
                  className="py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all cursor-pointer"
                >
                  <Zap className="w-4 h-4 fill-slate-950" />
                  <span>⚡ Comprar Ahora</span>
                </button>
              </div>

              {/* Guarantees */}
              <div className="p-2.5 bg-slate-950 rounded-2xl border border-slate-800 flex items-center justify-around text-[10px] text-slate-400">
                <span className="flex items-center gap-1 text-emerald-400">
                  <Check className="w-3 h-3 stroke-[3]" /> En stock ({product.stock} uds)
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Truck className="w-3 h-3" /> Envío 24-48 horas
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" /> Garantía de compra
                </span>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
