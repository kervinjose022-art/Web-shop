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
      className="group bg-[#0b1325] border border-slate-800/80 hover:border-slate-700 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col cursor-pointer relative"
    >
      {/* Product Image Area */}
      <div 
        className="relative aspect-square w-full bg-slate-950 overflow-hidden"
        onMouseEnter={() => {
          if (product.images.length > 1) setCurrentImgIndex(1);
        }}
        onMouseLeave={() => setCurrentImgIndex(0)}
      >
        <img 
          src={product.images[currentImgIndex] || product.images[0]} 
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 items-start z-10">
          {product.discountPct > 0 && (
            <span className="bg-emerald-600 text-white font-bold text-[10px] px-2 py-0.5 rounded-full shadow-md">
              -{product.discountPct}%
            </span>
          )}
          {product.isFlashDeal && (
            <span className="bg-amber-500 text-slate-950 font-black text-[9px] px-2 py-0.5 rounded-full flex items-center gap-0.5 shadow-md">
              <Flame className="w-3 h-3 fill-slate-950" />
              OFERTA
            </span>
          )}
          {product.isBestSeller && !product.isFlashDeal && (
            <span className="bg-slate-800 text-slate-200 border border-slate-700 font-bold text-[9px] px-2 py-0.5 rounded-full shadow-md">
              POPULAR
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleHeartClick}
          title="Guardar en favoritos"
          className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-slate-950/70 hover:bg-slate-950 backdrop-blur-md border border-slate-800 flex items-center justify-center text-slate-300 hover:text-rose-500 transition-colors z-10 active:scale-90"
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
        </button>

        {/* Wholesale Tag Over Image */}
        {isWholesaleMode && lowestWholesale && (
          <div className="absolute bottom-2 left-2 right-2 bg-[#090f1e]/90 backdrop-blur-md border border-amber-500/40 rounded-xl px-2 py-1 text-[10px] text-amber-300 font-bold flex items-center justify-between shadow-md">
            <span className="flex items-center gap-1">
              <Building2 className="w-3 h-3 text-amber-400" />
              Al mayor:
            </span>
            <span className="font-mono font-black text-amber-400">{formatPrice(lowestWholesale, currency)}/u</span>
          </div>
        )}
      </div>

      {/* Content Info - Clean & Minimalist */}
      <div className="p-3 sm:p-3.5 flex-1 flex flex-col justify-between space-y-2">
        <div>
          {/* Rating */}
          <div className="flex items-center justify-between text-[11px] pb-1">
            <div className="flex items-center gap-1 text-amber-400 font-bold">
              <Star className="w-3.5 h-3.5 fill-amber-400" />
              <span>{product.rating}</span>
            </div>
            {product.isFlashDeal && (
              <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
                Recomendado
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="font-bold text-xs sm:text-sm text-white line-clamp-2 leading-snug group-hover:text-emerald-400 transition-colors">
            {product.name}
          </h3>
        </div>

        {/* Pricing Area */}
        <div className="pt-2 border-t border-slate-800/80">
          <div className="flex items-baseline gap-2">
            <span className="font-mono font-black text-base sm:text-lg text-white">
              {formatPrice(product.price, currency)}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-xs text-slate-500 line-through font-mono">
                {formatPrice(product.originalPrice, currency)}
              </span>
            )}
          </div>

          {/* Quick Add Button */}
          <button
            onClick={handleQuickAdd}
            className={`mt-2.5 w-full py-2 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-md active:scale-95 cursor-pointer ${
              addedAnimation 
                ? 'bg-emerald-500 text-slate-950 scale-95' 
                : 'bg-[#0f172a] hover:bg-emerald-500 text-slate-200 hover:text-slate-950 border border-slate-800 hover:border-emerald-400'
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
