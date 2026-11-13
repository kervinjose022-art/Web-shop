import React, { useState } from 'react';
import { 
  Search, 
  ShoppingCart, 
  Heart, 
  ShieldCheck, 
  Sparkles, 
  Globe, 
  Menu, 
  X,
  Truck,
  Flame,
  Zap,
  Building2,
  ChevronDown,
  Tag,
  Shirt,
  Laptop,
  Footprints,
  Watch,
  Home,
  User,
  Building,
  Wrench,
  Car,
  Package,
  Layers
} from 'lucide-react';
import { Currency, CustomerUser, StoreCategory } from '../types/store';
import { STORE_CATEGORIES } from '../data/initialProducts';

interface ZetaHeaderProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  categories?: StoreCategory[];
  currency: Currency;
  onSelectCurrency: (c: Currency) => void;
  isWholesaleMode: boolean;
  onToggleWholesale: () => void;
  cartCount: number;
  cartTotal: number;
  onOpenCart: () => void;
  wishlistCount: number;
  onOpenWishlist: () => void;
  onOpenAdmin: () => void;
  currentUser: CustomerUser | null;
  onOpenAuth: () => void;
}

export const ZetaHeader: React.FC<ZetaHeaderProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  categories = STORE_CATEGORIES,
  currency,
  onSelectCurrency,
  isWholesaleMode,
  onToggleWholesale,
  cartCount,
  cartTotal,
  onOpenCart,
  wishlistCount,
  onOpenWishlist,
  onOpenAdmin,
  currentUser,
  onOpenAuth
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCurrencyDropdownOpen, setIsCurrencyDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* Top Ticker Bar */}
      <div className="bg-emerald-50 border-b border-emerald-100 px-3 py-1.5 text-center text-xs font-semibold text-emerald-900 flex items-center justify-center gap-2 overflow-hidden">
        <span className="flex items-center gap-1.5 shrink-0 text-emerald-700">
          <Truck className="w-3.5 h-3.5" />
          <span>¡Envío Express Gratis en compras mayores a $35!</span>
        </span>
        <span className="hidden sm:inline text-emerald-300">·</span>
        <span className="hidden sm:flex items-center gap-1 shrink-0 text-slate-700">
          <Tag className="w-3.5 h-3.5 text-amber-600" />
          <span>Usa cupón <strong className="underline bg-white border border-emerald-200 px-1.5 py-0.5 rounded text-emerald-800 font-mono">ZETA10</strong> para 10% OFF</span>
        </span>
        <span className="hidden md:inline text-emerald-300">·</span>
        <span className="hidden md:flex items-center gap-1 shrink-0 text-emerald-800">
          <Zap className="w-3.5 h-3.5 text-emerald-600" />
          <span>Atención y pedidos por WhatsApp 0426-2139920</span>
        </span>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 flex items-center justify-between gap-3">
        {/* Brand Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <button 
            onClick={() => onSelectCategory('all')} 
            className="flex items-center gap-2.5 text-left cursor-pointer group"
          >
            <img
              src="/zetamall_logo.png"
              alt="ZetaMall"
              className="w-10 h-10 rounded-xl object-contain bg-white border border-slate-200 p-0.5 shadow-xs group-hover:scale-105 transition-transform"
            />
            <div>
              <div className="font-extrabold text-xl tracking-tight text-slate-900 flex items-center gap-0.5 leading-none">
                <span>Zeta</span>
                <span className="text-emerald-600">Mall</span>
              </div>
              <div className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase mt-0.5">
                Tienda Oficial
              </div>
            </div>
          </button>
        </div>

        {/* Global Search Bar */}
        <div className="flex-1 max-w-2xl hidden md:block">
          <div className="relative flex items-center">
            <input 
              type="text" 
              placeholder="Buscar productos (ropa, zapatillas, relojes, gadgets)..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-slate-100 border border-slate-200 rounded-2xl pl-11 pr-24 py-2.5 text-xs text-slate-900 placeholder-slate-500 focus:outline-none focus:bg-white focus:border-emerald-500 transition-colors"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
            
            {searchQuery && (
              <button 
                onClick={() => onSearchChange('')}
                className="absolute right-20 text-slate-400 hover:text-slate-700 p-1 text-xs cursor-pointer"
              >
                ✕
              </button>
            )}

            <button className="absolute right-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl cursor-pointer shadow-xs transition-colors">
              Buscar
            </button>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Wholesale Mode Toggle */}
          <button
            onClick={onToggleWholesale}
            title="Activar precios especiales al mayor por volumen"
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
              isWholesaleMode 
                ? 'bg-amber-50 text-amber-800 border-amber-400 shadow-xs' 
                : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-amber-600" />
            <span className="hidden lg:inline">Al Mayor</span>
            <span className={`text-[10px] px-1.5 py-0.5 rounded font-black ${isWholesaleMode ? 'bg-amber-500 text-white' : 'bg-slate-200 text-slate-600'}`}>
              B2B
            </span>
          </button>

          {/* Currency Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsCurrencyDropdownOpen(!isCurrencyDropdownOpen)}
              className="flex items-center gap-1 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-2.5 py-1.5 rounded-xl text-xs font-bold text-slate-800 cursor-pointer whitespace-nowrap"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-600" />
              <span>{currency}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {isCurrencyDropdownOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white border border-slate-200 rounded-2xl p-1.5 shadow-xl z-50 text-xs">
                {(['USD', 'EUR', 'BS', 'COP', 'MXN'] as Currency[]).map((c) => (
                  <button
                    key={c}
                    onClick={() => {
                      onSelectCurrency(c);
                      setIsCurrencyDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between cursor-pointer font-bold ${
                      currency === c ? 'bg-emerald-600 text-white' : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    <span>{c}</span>
                    <span className={`text-[10px] ${currency === c ? 'text-emerald-100' : 'text-slate-400'}`}>
                      {c === 'USD' ? 'Dólares' : c === 'EUR' ? 'Euros' : c === 'BS' ? 'Bolívares' : c === 'COP' ? 'Pesos Col' : 'Pesos Mex'}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            onClick={onOpenWishlist}
            className="relative w-9 h-9 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-center text-rose-500 cursor-pointer transition-colors"
            title="Lista de Deseos / Favoritos"
          >
            <Heart className={`w-4 h-4 ${wishlistCount > 0 ? 'fill-rose-500 text-rose-500' : ''}`} />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-500 text-white font-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Shopping Cart Button */}
          <button
            onClick={onOpenCart}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-xl font-bold text-xs shadow-sm active:scale-95 transition-all cursor-pointer whitespace-nowrap"
          >
            <div className="relative">
              <ShoppingCart className="w-4 h-4 text-white stroke-[2.5]" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-slate-900 text-white font-mono font-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow-sm border border-white">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="hidden sm:inline font-bold">Carrito</span>
          </button>

          {/* User Account / Iniciar Sesión Button */}
          <button
            onClick={onOpenAuth}
            className="flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-2.5 py-1.5 rounded-xl text-xs font-bold text-slate-700 hover:text-slate-900 cursor-pointer transition-colors whitespace-nowrap"
            title={currentUser ? `Mi Cuenta: ${currentUser.name}` : "Iniciar Sesión / Crear Cuenta"}
          >
            <User className="w-3.5 h-3.5 text-emerald-600" />
            <span className="hidden sm:inline max-w-[85px] truncate font-semibold">
              {currentUser ? currentUser.name.split(' ')[0] : 'Cuenta'}
            </span>
          </button>

          {/* Admin Dashboard Entry */}
          <button
            onClick={onOpenAdmin}
            title="Panel de Administración (Kervin)"
            className="w-9 h-9 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600 hover:text-emerald-700 cursor-pointer transition-colors"
          >
            <ShieldCheck className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="px-3 pb-2.5 md:hidden">
        <div className="relative flex items-center">
          <input 
            type="text" 
            placeholder="Buscar productos (ropa, zapatillas, gadgets)..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-slate-100 border border-slate-200 rounded-xl pl-9 pr-10 py-2 text-xs text-slate-900 placeholder-slate-500 focus:outline-none focus:bg-white focus:border-emerald-500 transition-colors"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 pointer-events-none" />
          {searchQuery && (
            <button 
              onClick={() => onSearchChange('')}
              className="absolute right-3 text-slate-400 hover:text-slate-700 p-1 text-xs cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Category Pills Navigation - Clean & Simplified */}
      <div className="border-t border-slate-100 bg-white px-3 sm:px-6 py-2 overflow-x-auto no-scrollbar flex items-center gap-1.5">
        {categories.map((cat) => {
          const getCategoryIcon = () => {
            switch (cat.id) {
              case 'all': return <Flame className="w-3.5 h-3.5" />;
              case 'moda': return <Shirt className="w-3.5 h-3.5" />;
              case 'tecnologia': return <Laptop className="w-3.5 h-3.5" />;
              case 'materiales': return <Building className="w-3.5 h-3.5" />;
              case 'calzado': return <Footprints className="w-3.5 h-3.5" />;
              case 'ferreteria': return <Wrench className="w-3.5 h-3.5" />;
              case 'joyeria': return <Watch className="w-3.5 h-3.5" />;
              case 'hogar': return <Home className="w-3.5 h-3.5" />;
              case 'belleza': return <Sparkles className="w-3.5 h-3.5" />;
              case 'vehiculos': return <Car className="w-3.5 h-3.5" />;
              case 'alimentos': return <Package className="w-3.5 h-3.5" />;
              default: return <Layers className="w-3.5 h-3.5" />;
            }
          };

          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap text-xs font-bold cursor-pointer transition-all flex items-center gap-1.5 shrink-0 ${
                selectedCategory === cat.id
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200/80 text-slate-700 hover:text-slate-900 border border-slate-200/60'
              }`}
            >
              {getCategoryIcon()}
              <span>{cat.name}</span>
            </button>
          );
        })}

        {/* Mobile Wholesale Pill */}
        <button
          onClick={onToggleWholesale}
          className={`sm:hidden px-2.5 py-1.5 rounded-xl whitespace-nowrap text-xs font-bold cursor-pointer border flex items-center gap-1 shrink-0 ${
            isWholesaleMode 
              ? 'bg-amber-500 text-white border-amber-500 font-black' 
              : 'bg-amber-50 border-amber-200 text-amber-800'
          }`}
        >
          <Building2 className="w-3 h-3" />
          <span>Al Mayor {isWholesaleMode ? 'ON' : 'OFF'}</span>
        </button>
      </div>
    </header>
  );
};
