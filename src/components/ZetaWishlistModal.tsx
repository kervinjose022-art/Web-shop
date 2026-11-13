import React from 'react';
import { X, Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { Product, Currency } from '../types/store';
import { formatPrice } from '../utils/storeUtils';

interface ZetaWishlistModalProps {
  isOpen: boolean;
  onClose: () => void;
  wishlist: Product[];
  currency: Currency;
  onRemoveFromWishlist: (p: Product) => void;
  onAddToCart: (p: Product) => void;
}

export const ZetaWishlistModal: React.FC<ZetaWishlistModalProps> = ({
  isOpen,
  onClose,
  wishlist,
  currency,
  onRemoveFromWishlist,
  onAddToCart
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-lg max-h-[85vh] flex flex-col shadow-2xl text-slate-900 overflow-hidden">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2">
            <Heart className="w-5 h-5 fill-rose-500 text-rose-500" />
            <h3 className="font-extrabold text-base text-slate-900">Tus Favoritos ({wishlist.length})</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white border border-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {wishlist.length === 0 ? (
            <div className="py-16 text-center space-y-2">
              <div className="text-3xl">💖</div>
              <div className="font-bold text-slate-900 text-sm">Aún no tienes favoritos guardados</div>
              <p className="text-xs text-slate-500">Toca el corazón en cualquier producto para guardarlo aquí.</p>
            </div>
          ) : (
            wishlist.map((prod) => (
              <div key={prod.id} className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <img src={prod.images[0]} alt={prod.name} referrerPolicy="no-referrer" className="w-14 h-14 rounded-xl object-cover bg-white border border-slate-200 shrink-0" />
                  <div>
                    <h4 className="font-bold text-slate-900 line-clamp-1">{prod.name}</h4>
                    <div className="font-mono tabular-nums font-extrabold text-emerald-700 mt-0.5">{formatPrice(prod.price, currency)}</div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => {
                      onAddToCart(prod);
                      onRemoveFromWishlist(prod);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 cursor-pointer active:scale-95 transition-colors"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Al Carrito</span>
                  </button>
                  <button
                    onClick={() => onRemoveFromWishlist(prod)}
                    className="p-1.5 rounded-xl bg-white text-slate-500 hover:text-rose-600 border border-slate-200 cursor-pointer transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};
