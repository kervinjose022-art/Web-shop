import React, { useState } from 'react';
import { 
  Star, 
  Heart, 
  ShoppingCart, 
  Eye, 
  Flame, 
  Sparkles, 
  Check, 
  PackageCheck,
  Building2
} from 'lucide-react';
import { Product, Currency } from '../types/store';
import { formatPrice } from '../utils/storeUtils';

interface ZetaProductCardProps {
  product: Product;
  currency: Currency;
  isWholesaleMode: boolean;
  isWishlisted: boolean;
  onToggleWishlist: (p: Product) => void;
  onAddToCart: (p: Product) => void;
  onViewProduct: (p: Product) => void;
}

export const ZetaProductCard: React.FC<ZetaProductCardProps> = ({
  product,
  currency,
  isWholesaleMode,
  isWishlisted,
  onToggleWishlist,
  onAddToCart,
  onViewProduct
}) => {
  const [currentImgIndex, setCurrentImgIndex] = useState(0);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart(product);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1200);
  };

  const handleHeartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleWishlist(product);
  };

  // Wholesale best price calculation
  const lowestWholesale = product.wholesaleTiers && product.wholesaleTiers.length > 0 
    ? product.wholesaleTiers[product.wholesaleTiers.length - 1].price 
    : null;

  return (
    <div 
      onClick={() => onViewProduct(product)}
      className="group bg-white border border-slate-200 hover:border-emerald-400 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 flex flex-col cursor-pointer relative"
    >
      {/* Product Image Area */}
      <div 
        className="relative aspect-square w-full bg-slate-100 overflow-hidden"
        onMouseEnter={() => {
          if (product.images.length > 1) setCurrentImgIndex(1);
        }}
        onMouseLeave={() => setCurrentImgIndex(0)}
      >
        <img 
          src={product.images[currentImgIndex] || product.images[0]} 
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Top Tag */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start z-10">
          {product.discountPct > 0 ? (
            <span className="bg-emerald-600 text-white font-bold text-[10px] px-2 py-0.5 rounded-md shadow-xs">
              -{product.discountPct}%
            </span>
          ) : product.isBestSeller ? (
            <span className="bg-white/95 text-slate-800 border border-slate-200 font-bold text-[9px] px-2 py-0.5 rounded-md shadow-xs">
              POPULAR
            </span>
          ) : null}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleHeartClick}
          title="Guardar en favoritos"
          className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 hover:bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:text-rose-500 shadow-xs transition-colors z-10 active:scale-90 cursor-pointer"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>

        {/* Wholesale Tag Over Image */}
        {isWholesaleMode && lowestWholesale && (
          <div className="absolute bottom-2 left-2 right-2 bg-white/95 backdrop-blur-xs border border-amber-300 rounded-xl px-2.5 py-1 text-[10px] text-amber-900 font-bold flex items-center justify-between shadow-sm">
            <span className="flex items-center gap-1">
              <Building2 className="w-3 h-3 text-amber-600" />
              Al mayor:
            </span>
            <span className="font-mono font-black text-amber-700 tabular-nums">{formatPrice(lowestWholesale, currency)}/u</span>
          </div>
        )}
      </div>

      {/* Content Info - Clean & Minimalist */}
      <div className="p-3 sm:p-3.5 flex-1 flex flex-col justify-between space-y-2.5">
        <div>
          {/* Rating */}
          <div className="flex items-center justify-between text-[11px] pb-1">
            <div className="flex items-center gap-1 text-amber-500 font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="text-slate-700">{product.rating}</span>
            </div>
            {product.isFlashDeal && (
              <span className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider">
                Oferta
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="font-bold text-xs sm:text-sm text-slate-900 line-clamp-2 leading-snug group-hover:text-emerald-700 transition-colors">
            {product.name}
          </h3>
        </div>

        {/* Pricing Area */}
        <div className="pt-2 border-t border-slate-100">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="font-mono tabular-nums font-extrabold text-base sm:text-lg text-slate-900">
              {formatPrice(product.price, currency)}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-xs text-slate-400 line-through font-mono tabular-nums">
                {formatPrice(product.originalPrice, currency)}
              </span>
            )}
          </div>

          {/* Quick Add Button */}
          <button
            onClick={handleQuickAdd}
            className={`mt-2.5 w-full py-2 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 cursor-pointer ${
              addedAnimation 
                ? 'bg-emerald-600 text-white scale-95' 
                : 'bg-slate-900 hover:bg-emerald-600 text-white'
            }`}
          >
            {addedAnimation ? (
              <>
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                <span>¡Listo!</span>
              </>
            ) : (
              <>
                <ShoppingCart className="w-3.5 h-3.5" />
                <span>Añadir</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
