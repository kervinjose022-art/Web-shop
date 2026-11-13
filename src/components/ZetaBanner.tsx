import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  Flame, 
  ArrowRight, 
  Building2, 
  ShoppingCart, 
  Check,
  Settings,
  Layers
} from 'lucide-react';
import { Product, Currency, StoreCategory, BannerConfig } from '../types/store';
import { formatPrice } from '../utils/storeUtils';

interface ZetaBannerProps {
  products: Product[];
  categories: StoreCategory[];
  bannerConfig: BannerConfig;
  currency: Currency;
  isAdmin?: boolean;
  onOpenBannerAdmin?: () => void;
  onSelectProduct: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onExploreDeals: () => void;
  onExploreWholesale: () => void;
}

export const ZetaBanner: React.FC<ZetaBannerProps> = ({ 
  products,
  categories,
  bannerConfig,
  currency,
  isAdmin = false,
  onOpenBannerAdmin,
  onSelectProduct,
  onAddToCart,
  onExploreDeals, 
  onExploreWholesale
}) => {
  // Flash deal countdown timer
  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 59, seconds: 40 });
  const [addedId, setAddedId] = useState<string | null>(null);
  const [activeCatalogFilter, setActiveCatalogFilter] = useState<string>(bannerConfig.featuredCategoryId || 'all');

  // Sync active filter when admin changes the featuredCategoryId in BannerConfig
  useEffect(() => {
    setActiveCatalogFilter(bannerConfig.featuredCategoryId || 'all');
  }, [bannerConfig.featuredCategoryId]);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 5, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatZero = (n: number) => n.toString().padStart(2, '0');

  const formatCategoryName = (catId: string) => {
    const found = categories.find(c => c.id === catId);
    if (found) return found.name;
    return catId.charAt(0).toUpperCase() + catId.slice(1);
  };

  // Catalog tabs that admin enabled for the 70% discount banner
  const activeBannerCatalogs = categories.filter(
    c => c.id !== 'all' && (bannerConfig.visibleCatalogIds.length === 0 || bannerConfig.visibleCatalogIds.includes(c.id))
  );

  // Filter products for the 70% discount showcase
  const showcaseProducts = products
    .filter(p => {
      if (activeCatalogFilter === 'all') {
        const matchesVisibleCatalog = bannerConfig.visibleCatalogIds.length === 0 || bannerConfig.visibleCatalogIds.includes(p.category);
        return matchesVisibleCatalog && (p.isFeaturedInBanner || p.isFlashDeal || p.discountPct >= 40 || p.isNew);
      }
      // If a specific catalog is selected in the 70% section, show all products in that catalog (prioritizing featured)
      return p.category === activeCatalogFilter;
    })
    .sort((a, b) => {
      // Featured in banner products always appear first
      const aFeat = a.isFeaturedInBanner ? 1 : 0;
      const bFeat = b.isFeaturedInBanner ? 1 : 0;
      if (bFeat !== aFeat) return bFeat - aFeat;
      return b.discountPct - a.discountPct;
    });

  const handleQuickAdd = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    onAddToCart(product);
    setAddedId(product.id);
    setTimeout(() => setAddedId(null), 1200);
  };

  const featuredTitleSuffix =
    bannerConfig.featuredCategoryId && bannerConfig.featuredCategoryId !== 'all'
      ? formatCategoryName(bannerConfig.featuredCategoryId)
      : 'Catálogo';

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-[#060a14] via-[#091122] to-[#070c17] border-b border-slate-800 text-white">
      {/* Subtle ambient lighting */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-5 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6 relative z-10 space-y-4">
        
        {/* TOP ROW: Compact Headline + Countdown Timer + Admin Shortcut */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          <div className="space-y-1.5 text-left">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[11px] font-bold">
                <Flame className="w-3 h-3 text-emerald-400" />
                <span>{bannerConfig.badgeText || 'Ofertas Especiales de Temporada'}</span>
              </div>

              {/* Compact inline timer on mobile so products stay visible above the fold */}
              <div className="flex md:hidden items-center gap-1 font-mono text-[11px] font-black bg-[#080d19] border border-slate-800 rounded-full px-2.5 py-0.5">
                <Clock className="w-3 h-3 text-emerald-400 animate-pulse" />
                <span className="text-emerald-400">{formatZero(timeLeft.hours)}h</span>
                <span className="text-slate-600">:</span>
                <span className="text-emerald-400">{formatZero(timeLeft.minutes)}m</span>
                <span className="text-slate-600">:</span>
                <span className="text-amber-400">{formatZero(timeLeft.seconds)}s</span>
              </div>

              {/* Quick Admin button if signed in as admin */}
              {isAdmin && onOpenBannerAdmin && (
                <button
                  onClick={onOpenBannerAdmin}
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-300 text-[11px] font-bold cursor-pointer transition-colors"
                >
                  <Settings className="w-3 h-3" />
                  <span>Editar Catálogo 70%</span>
                </button>
              )}
            </div>

            <h1 className="text-xl sm:text-3xl font-black tracking-tight text-white leading-tight">
              Hasta <span className="text-emerald-400">{bannerConfig.discountText || '70% de Descuento'}</span> en{' '}
              <span className="underline decoration-emerald-500/40 decoration-2 underline-offset-4">
                {featuredTitleSuffix}
              </span>
            </h1>
            
            <p className="text-[11px] sm:text-xs text-slate-400 line-clamp-1 sm:line-clamp-none">
              {bannerConfig.subtitleText || 'Mercancía verificada con rebajas directas, precios al mayor y despachos inmediatos por WhatsApp.'}
            </p>
          </div>

          {/* Desktop Timer & Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <div className="hidden md:flex bg-[#080d19]/90 border border-slate-800 rounded-2xl px-3.5 py-2.5 items-center gap-2.5 shadow-xl">
              <div className="flex items-center gap-1 text-[11px] font-bold text-slate-300">
                <Clock className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                <span>Termina en:</span>
              </div>
              <div className="flex items-center gap-1 font-mono text-sm font-black">
                <span className="bg-[#04070e] px-2 py-1 rounded-lg border border-slate-800 text-emerald-400">{formatZero(timeLeft.hours)}h</span>
                <span className="text-slate-600">:</span>
                <span className="bg-[#04070e] px-2 py-1 rounded-lg border border-slate-800 text-emerald-400">{formatZero(timeLeft.minutes)}m</span>
                <span className="text-slate-600">:</span>
                <span className="bg-[#04070e] px-2 py-1 rounded-lg border border-slate-800 text-amber-400">{formatZero(timeLeft.seconds)}s</span>
              </div>
            </div>

            <button
              onClick={onExploreDeals}
              className="px-3.5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md shadow-emerald-500/20 active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <span>Ver Todo</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>

            <button
              onClick={onExploreWholesale}
              className="px-3 py-2 rounded-xl bg-[#0b1324] hover:bg-[#0f1b33] border border-slate-700 font-bold text-xs text-amber-300 transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Building2 className="w-3.5 h-3.5 text-amber-400" />
              <span>Al Mayor</span>
            </button>
          </div>

        </div>

        {/* --- CATÁLOGOS Y PRODUCTOS DENTRO DEL 70% DE DESCUENTO --- */}
        <div className="pt-2.5 border-t border-slate-800/80 space-y-2.5">
          
          {/* Catalog Tabs Row */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1 shrink-0 mr-1">
              <Layers className="w-3.5 h-3.5" />
              <span>Catálogos:</span>
            </span>

            <button
              onClick={() => setActiveCatalogFilter('all')}
              className={`px-2.5 py-1 rounded-xl text-[11px] font-bold whitespace-nowrap cursor-pointer transition-all ${
                activeCatalogFilter === 'all'
                  ? 'bg-emerald-500 text-slate-950 font-black shadow-md shadow-emerald-500/20'
                  : 'bg-slate-900/90 hover:bg-slate-800 text-slate-300 border border-slate-800'
              }`}
            >
              Todos en Oferta
            </button>

            {activeBannerCatalogs.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCatalogFilter(cat.id)}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-bold whitespace-nowrap cursor-pointer transition-all ${
                  activeCatalogFilter === cat.id
                    ? 'bg-emerald-500 text-slate-950 font-black shadow-md shadow-emerald-500/20'
                    : 'bg-slate-900/90 hover:bg-slate-800 text-slate-300 border border-slate-800'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Horizontal Scroll on Mobile / Grid on Desktop so products appear immediately in the 70% section */}
          {showcaseProducts.length > 0 ? (
            <div className="flex sm:grid sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2.5 sm:gap-3 overflow-x-auto no-scrollbar pb-1 snap-x">
              {showcaseProducts.slice(0, 10).map((product) => {
                const isAdded = addedId === product.id;
                const displayDiscount = product.discountPct > 0 ? product.discountPct : 70;
                const mainImage = product.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80';

                return (
                  <div
                    key={product.id}
                    onClick={() => onSelectProduct(product)}
                    className="min-w-[152px] w-[152px] sm:w-auto sm:min-w-0 snap-start group relative bg-[#090f1d] hover:bg-[#0c1529] border border-slate-800 hover:border-emerald-500/50 rounded-2xl p-2 flex flex-col justify-between transition-all duration-200 cursor-pointer shadow-lg shrink-0"
                  >
                    {/* Top Image & Discount Ribbon */}
                    <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-slate-950 mb-1.5">
                      <img
                        src={mainImage}
                        alt={product.name}
                        className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />

                      <div className="absolute top-1.5 left-1.5 bg-gradient-to-r from-emerald-500 to-teal-400 text-slate-950 font-black text-[10px] px-1.5 py-0.5 rounded-lg shadow-md flex items-center gap-0.5">
                        <Flame className="w-2.5 h-2.5 fill-slate-950" />
                        <span>-{displayDiscount}%</span>
                      </div>

                      <div className="absolute bottom-1.5 left-1.5 bg-black/75 backdrop-blur-sm text-slate-200 text-[9px] font-bold px-1.5 py-0.5 rounded-md border border-white/10 max-w-[90%] truncate">
                        {formatCategoryName(product.category)}
                      </div>
                    </div>

                    {/* Title & Price */}
                    <div className="space-y-0.5">
                      <h3 className="font-bold text-[11px] sm:text-xs text-white line-clamp-1 group-hover:text-emerald-300 transition-colors">
                        {product.name}
                      </h3>
                      
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-black text-xs sm:text-sm text-emerald-400 font-mono">
                          {formatPrice(product.price, currency)}
                        </span>
                        {product.originalPrice > product.price && (
                          <span className="text-[10px] text-slate-500 line-through font-mono">
                            {formatPrice(product.originalPrice, currency)}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Quick Action Button */}
                    <div className="pt-1.5 mt-1">
                      <button
                        type="button"
                        onClick={(e) => handleQuickAdd(e, product)}
                        className={`w-full py-1.5 rounded-xl font-bold text-[11px] flex items-center justify-center gap-1 transition-all cursor-pointer ${
                          isAdded
                            ? 'bg-emerald-400 text-slate-950'
                            : 'bg-slate-900 hover:bg-emerald-500 hover:text-slate-950 text-slate-300 border border-slate-700/80'
                        }`}
                      >
                        {isAdded ? (
                          <>
                            <Check className="w-3 h-3 stroke-[3]" />
                            <span>¡Listo!</span>
                          </>
                        ) : (
                          <>
                            <ShoppingCart className="w-3 h-3" />
                            <span>+ Carrito</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 text-center text-xs text-slate-400">
              No hay productos asignados en este catálogo aún. Sube mercancía desde el Panel de Administrador.
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
