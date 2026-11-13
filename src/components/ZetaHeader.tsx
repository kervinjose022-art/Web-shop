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
    <header className="sticky top-0 z-40 bg-[#080d19] border-b border-slate-800/90 shadow-xl">
      {/* Top Ticker Bar */}
      <div className="bg-[#050912] border-b border-slate-800/80 px-3 py-1.5 text-center text-xs font-semibold text-slate-300 flex items-center justify-center gap-2 overflow-hidden">
        <span className="flex items-center gap-1.5 shrink-0 text-emerald-400">
          <Truck className="w-3.5 h-3.5" />
          <span>¡Envío Express Gratis en compras mayores a $35!</span>
        </span>
        <span className="hidden sm:inline text-slate-600">·</span>
        <span className="hidden sm:flex items-center gap-1 shrink-0 text-slate-300">
          <Tag className="w-3.5 h-3.5 text-amber-400" />
          <span>Usa cupón <strong className="underline bg-slate-800 px-1.5 py-0.5 rounded text-white font-mono">ZETA10</strong> para 10% OFF</span>
        </span>
        <span className="hidden md:inline text-slate-600">·</span>
        <span className="hidden md:flex items-center gap-1 shrink-0 text-amber-300">
          <Zap className="w-3.5 h-3.5" />
          <span>Atención y pedidos por WhatsApp 0426-2139920</span>
        </span>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 flex items-center justify-between gap-3">
        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => onSelectCategory('all')} 
            className="flex items-center gap-2.5 text-left cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-md shadow-emerald-500/15 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#080d19] rounded-[14px] flex items-center justify-center">
                <span className="font-black text-xl text-emerald-400">
                  Z
                </span>
              </div>
            </div>
            <div>
              <div className="font-black text-xl tracking-tight text-white flex items-center gap-0.5">
                <span>Zeta</span>
                <span className="text-emerald-400">Mall</span>
              </div>
              <div className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">
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
              className="w-full bg-[#050912] border border-slate-800 rounded-2xl pl-11 pr-24 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition-colors shadow-inner"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
            
            {searchQuery && (
              <button 
                onClick={() => onSearchChange('')}
                className="absolute right-20 text-slate-400 hover:text-white p-1 text-xs"
              >
                ✕
              </button>
            )}

            <button className="absolute right-1.5 px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl cursor-pointer shadow-md transition-colors">
              Buscar
            </button>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Wholesale Mode Toggle */}
          <button
            onClick={onToggleWholesale}
            title="Activar precios especiales al mayor por volumen"
            className={`hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
              isWholesaleMode 
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/60 shadow-md shadow-amber-500/20' 
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden lg:inline">Al Mayor</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded font-black ${isWholesaleMode ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
              B2B
            </span>
          </button>

          {/* Currency Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsCurrencyDropdownOpen(!isCurrencyDropdownOpen)}
              className="flex items-center gap-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 px-2 py-1.5 rounded-xl text-xs font-bold text-white cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <span>{currency}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {isCurrencyDropdownOpen && (
              <div className="absolute right-0 mt-2 w-36 bg-[#0d1629] border border-slate-700 rounded-2xl p-1.5 shadow-2xl z-50 text-xs">
                {(['USD', 'EUR', 'BS', 'COP', 'MXN'] as Currency[]).map((c) => (
                  <button
                    key={c}
                    onClick={() => {
                      onSelectCurrency(c);
                      setIsCurrencyDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between cursor-pointer font-bold ${
                      currency === c ? 'bg-rose-500 text-white' : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <span>{c}</span>
                    <span className="text-[10px] opacity-75">
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
            className="relative w-9 h-9 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 flex items-center justify-center text-rose-400 cursor-pointer transition-colors"
            title="Lista de Deseos / Favoritos"
          >
            <Heart className={`w-4 h-4 ${wishlistCount > 0 ? 'fill-rose-500 text-rose-500' : ''}`} />
            {wishlistCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-500 text-white font-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center animate-bounce">
                {wishlistCount}
              </span>
            )}
          </button>

          {/* Shopping Cart Button */}
          <button
            onClick={onOpenCart}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-3 py-1.5 rounded-xl font-bold text-xs shadow-md shadow-emerald-500/15 active:scale-95 transition-all cursor-pointer"
          >
            <div className="relative">
              <ShoppingCart className="w-4 h-4 text-slate-950 stroke-[2.5]" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-slate-950 text-emerald-400 font-mono font-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow-md border border-emerald-500/40">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="hidden sm:inline font-bold">Carrito</span>
          </button>

          {/* User Account / Iniciar Sesión Button */}
          <button
            onClick={onOpenAuth}
            className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 px-2.5 py-1.5 rounded-xl text-xs font-bold text-slate-200 hover:text-white cursor-pointer transition-colors"
            title={currentUser ? `Mi Cuenta: ${currentUser.name}` : "Iniciar Sesión / Crear Cuenta"}
          >
            <User className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline max-w-[85px] truncate font-medium">
              {currentUser ? currentUser.name.split(' ')[0] : 'Cuenta'}
            </span>
          </button>

          {/* Admin Dashboard Entry */}
          <button
            onClick={onOpenAdmin}
            title="Panel de Administración (Kervin)"
            className="w-9 h-9 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 flex items-center justify-center text-slate-400 hover:text-amber-400 cursor-pointer transition-colors"
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
            className="w-full bg-[#050912] border border-slate-800 rounded-xl pl-9 pr-10 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
          />
          <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 pointer-events-none" />
          {searchQuery && (
            <button 
              onClick={() => onSearchChange('')}
              className="absolute right-3 text-slate-400 hover:text-white p-1 text-xs"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Category Pills Navigation - Clean & Simplified */}
      <div className="border-t border-slate-800/80 bg-[#070c17]/95 px-3 sm:px-6 py-2 overflow-x-auto no-scrollbar flex items-center gap-1.5">
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
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap text-xs font-bold cursor-pointer transition-all flex items-center gap-1.5 ${
                selectedCategory === cat.id
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20 font-bold'
                  : 'bg-slate-900/60 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800/70'
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
              ? 'bg-amber-500 text-slate-950 border-amber-400 font-black' 
              : 'bg-slate-900 border-slate-800 text-amber-400'
          }`}
        >
          <Building2 className="w-3 h-3" />
          <span>Al Mayor {isWholesaleMode ? 'ON' : 'OFF'}</span>
        </button>
      </div>
    </header>
  );
};
