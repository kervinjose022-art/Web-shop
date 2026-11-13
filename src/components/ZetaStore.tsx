import React, { useState, useEffect, useMemo } from 'react';
import { 
  Filter, 
  ArrowUpDown, 
  Sparkles, 
  Flame, 
  Truck, 
  ShieldCheck, 
  Headphones, 
  RotateCcw,
  Building2,
  SlidersHorizontal,
  MessageCircle,
  HelpCircle,
  Tag
} from 'lucide-react';
import { Product, CartItem, Order, Currency, Coupon, CustomerUser, StoreCategory, BannerConfig } from '../types/store';
import { INITIAL_PRODUCTS, STORE_CATEGORIES } from '../data/initialProducts';
import { ZetaHeader } from './ZetaHeader';
import { ZetaProductCard } from './ZetaProductCard';
import { ZetaProductModal } from './ZetaProductModal';
import { ZetaCartDrawer } from './ZetaCartDrawer';
import { ZetaCheckoutModal } from './ZetaCheckoutModal';
import { ZetaAdminDashboard, AdminTab } from './ZetaAdminDashboard';
import { ZetaWishlistModal } from './ZetaWishlistModal';
import { ZetaAuthModal } from './ZetaAuthModal';
import { formatPrice } from '../utils/storeUtils';

const INITIAL_CUSTOMERS: CustomerUser[] = [
  {
    id: 'usr_carlos_1',
    name: 'Carlos Mendoza',
    email: 'carlos.mendoza@gmail.com',
    phone: '0414-2345678',
    address: 'Av. Bolívar, Res. El Bosque, Apto 4-B',
    city: 'Caracas',
    registeredAt: '10 nov 2026',
    role: 'customer'
  },
  {
    id: 'usr_maria_2',
    name: 'María Valentina Gómez',
    email: 'mariav.gomez@gmail.com',
    phone: '0424-8765432',
    address: 'Urb. Prebo, Calle 137',
    city: 'Valencia',
    registeredAt: '11 nov 2026',
    role: 'customer'
  },
  {
    id: 'usr_alejandro_3',
    name: 'Alejandro Silva',
    email: 'alejandro.silva@hotmail.com',
    phone: '0412-5559876',
    address: 'Av. Las Delicias',
    city: 'Maracay',
    registeredAt: '12 nov 2026',
    role: 'customer'
  }
];

export const ZetaStore: React.FC = () => {
  // Products list from localStorage or defaults
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('zetashop_products');
      if (saved) {
        const parsed: Product[] = JSON.parse(saved);
        const existingIds = new Set(parsed.map((p) => p.id));
        const missingInitial = INITIAL_PRODUCTS.filter(p => !existingIds.has(p.id));
        return [...missingInitial, ...parsed];
      }
      return INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  // Orders list
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('zetashop_orders');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Cart & Wishlist state
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('zetashop_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [wishlist, setWishlist] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('zetashop_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Preferences & Mode
  const [currency, setCurrency] = useState<Currency>(() => {
    try {
      return (localStorage.getItem('zetashop_currency') as Currency) || 'USD';
    } catch {
      return 'USD';
    }
  });
  const [isWholesaleMode, setIsWholesaleMode] = useState<boolean>(false);

  // Search & Filtering
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState<'destacados' | 'precio_bajo' | 'precio_alto' | 'ventas' | 'rating'>('destacados');
  const [filterOnlyFlash, setFilterOnlyFlash] = useState(false);

  // Modals & Drawers
  const [activeProductModal, setActiveProductModal] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [adminInitialTab, setAdminInitialTab] = useState<AdminTab>('productos');
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  // Dynamic Store Categories / Catalogs
  const [categories, setCategories] = useState<StoreCategory[]>(() => {
    try {
      const saved = localStorage.getItem('zetamall_categories');
      if (saved) {
        const parsed: StoreCategory[] = JSON.parse(saved);
        const existingIds = new Set(parsed.map(c => c.id));
        const missing = STORE_CATEGORIES.filter(c => !existingIds.has(c.id));
        return [...parsed, ...missing];
      }
      return STORE_CATEGORIES;
    } catch {
      return STORE_CATEGORIES;
    }
  });

  // Banner 70% Discount Config (controlled by Admin)
  const [bannerConfig, setBannerConfig] = useState<BannerConfig>(() => {
    const defaultCfg: BannerConfig = {
      badgeText: 'Ofertas Especiales de Temporada',
      discountText: '70% de Descuento',
      subtitleText: 'Mercancía verificada con rebajas directas, precios al mayor y despachos inmediatos por WhatsApp.',
      featuredCategoryId: 'all',
      visibleCatalogIds: STORE_CATEGORIES.filter(c => c.id !== 'all').map(c => c.id)
    };
    try {
      const saved = localStorage.getItem('zetamall_banner_config');
      return saved ? { ...defaultCfg, ...JSON.parse(saved) } : defaultCfg;
    } catch {
      return defaultCfg;
    }
  });

  // Customer Authentication & User Accounts
  const [currentUser, setCurrentUser] = useState<CustomerUser | null>(() => {
    try {
      const saved = localStorage.getItem('zetamall_current_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [registeredUsers, setRegisteredUsers] = useState<CustomerUser[]>(() => {
    try {
      const saved = localStorage.getItem('zetamall_users');
      return saved ? JSON.parse(saved) : INITIAL_CUSTOMERS;
    } catch {
      return INITIAL_CUSTOMERS;
    }
  });

  // Sync to localStorage
  useEffect(() => {
    try { localStorage.setItem('zetashop_products', JSON.stringify(products)); } catch {}
  }, [products]);

  useEffect(() => {
    try { localStorage.setItem('zetashop_cart', JSON.stringify(cartItems)); } catch {}
  }, [cartItems]);

  useEffect(() => {
    try { localStorage.setItem('zetashop_wishlist', JSON.stringify(wishlist)); } catch {}
  }, [wishlist]);

  useEffect(() => {
    try { localStorage.setItem('zetashop_orders', JSON.stringify(orders)); } catch {}
  }, [orders]);

  useEffect(() => {
    try { localStorage.setItem('zetamall_users', JSON.stringify(registeredUsers)); } catch {}
  }, [registeredUsers]);

  useEffect(() => {
    try { localStorage.setItem('zetamall_categories', JSON.stringify(categories)); } catch {}
  }, [categories]);

  useEffect(() => {
    try { localStorage.setItem('zetamall_banner_config', JSON.stringify(bannerConfig)); } catch {}
  }, [bannerConfig]);

  useEffect(() => {
    try { localStorage.setItem('zetashop_currency', currency); } catch {}
  }, [currency]);

  // Cart operations
  const handleAddToCart = (product: Product, quantity = 1, selectedColor?: string, selectedSize?: string) => {
    setCartItems(prev => {
      const color = selectedColor || product.colors[0] || 'Estándar';
      const size = selectedSize || (product.sizes ? product.sizes[0] : undefined);
      const existingIdx = prev.findIndex(item => 
        item.product.id === product.id && 
        item.selectedColor === color && 
        item.selectedSize === size
      );

      if (existingIdx >= 0) {
        const copy = [...prev];
        copy[existingIdx].quantity += quantity;
        return copy;
      }
      return [...prev, { product, quantity, selectedColor: color, selectedSize: size }];
    });
  };

  const handleUpdateQty = (productId: string, delta: number, color?: string, size?: string) => {
    setCartItems(prev => {
      return prev.map(item => {
        if (item.product.id === productId && item.selectedColor === color && item.selectedSize === size) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      }).filter(Boolean) as CartItem[];
    });
  };

  const handleRemoveItem = (productId: string, color?: string, size?: string) => {
    setCartItems(prev => prev.filter(item => 
      !(item.product.id === productId && item.selectedColor === color && item.selectedSize === size)
    ));
  };

  const handleToggleWishlist = (product: Product) => {
    setWishlist(prev => {
      const exists = prev.some(p => p.id === product.id);
      if (exists) return prev.filter(p => p.id !== product.id);
      return [...prev, product];
    });
  };

  const handleBuyNow = (product: Product, quantity = 1, selectedColor?: string, selectedSize?: string) => {
    handleAddToCart(product, quantity, selectedColor, selectedSize);
    setIsCheckoutOpen(true);
  };

  const handleOrderCompleted = (newOrder: Order) => {
    setOrders(prev => [newOrder, ...prev]);
    setCartItems([]);
    setAppliedCoupon(null);
  };

  // Filtered & Sorted Products
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Category
    if (selectedCategory !== 'all') {
      result = result.filter(p => p.category === selectedCategory);
    }

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.name.toLowerCase().includes(q) || 
        p.subtitle.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
      );
    }

    // Flash deals only
    if (filterOnlyFlash) {
      result = result.filter(p => p.isFlashDeal);
    }

    // Sorting
    if (sortBy === 'precio_bajo') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'precio_alto') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'ventas') {
      result.sort((a, b) => b.soldCount - a.soldCount);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    } else {
      // 'destacados': Admin-featured products appear first at the top
      result.sort((a, b) => (b.isFeaturedInBanner ? 1 : 0) - (a.isFeaturedInBanner ? 1 : 0));
    }

    return result;
  }, [products, selectedCategory, searchQuery, filterOnlyFlash, sortBy]);

  const cartTotalAmount = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const cartTotalCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 font-sans selection:bg-emerald-600 selection:text-white">
      
      {/* Top Navbar Header */}
      <ZetaHeader 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        categories={categories}
        currency={currency}
        onSelectCurrency={setCurrency}
        isWholesaleMode={isWholesaleMode}
        onToggleWholesale={() => setIsWholesaleMode(!isWholesaleMode)}
        cartCount={cartTotalCount}
        cartTotal={cartTotalAmount}
        onOpenCart={() => setIsCartOpen(true)}
        wishlistCount={wishlist.length}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenAdmin={() => {
          setAdminInitialTab('productos');
          setIsAdminOpen(true);
        }}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      {/* Main Content Area - Products Start Directly Here */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 py-5 sm:py-7 w-full space-y-5">
        
        {/* Quick Search Chips & Search bar helper */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          <span className="text-[11px] font-bold text-slate-500 shrink-0 mr-1">Rápido:</span>
          {[
            { label: '🧱 Bloques', query: 'bloque' },
            { label: '👟 Zapatillas', query: 'sneaker' },
            { label: '⌚ Relojes', query: 'reloj' },
            { label: '📱 Smartwatch', query: 'smartwatch' },
            { label: '🎧 Audífonos', query: 'audifonos' },
            { label: '👗 Vestidos', query: 'vestido' },
            { label: '🧥 Chaquetas', query: 'chaqueta' },
            { label: '💎 Joyas', query: 'joya' },
            { label: '🍳 Freidora', query: 'freidora' },
            { label: '🔥 Ofertas', query: '', filterFlash: true }
          ].map((tag) => (
            <button
              key={tag.label}
              onClick={() => {
                if (tag.filterFlash) {
                  setFilterOnlyFlash(true);
                  setSelectedCategory('all');
                  setSearchQuery('');
                } else {
                  setSearchQuery(tag.query);
                  setSelectedCategory('all');
                  setFilterOnlyFlash(false);
                }
              }}
              className="px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 hover:text-slate-900 text-xs font-medium whitespace-nowrap cursor-pointer transition-colors"
            >
              {tag.label}
            </button>
          ))}
          {(searchQuery || filterOnlyFlash) && (
            <button
              onClick={() => {
                setSearchQuery('');
                setFilterOnlyFlash(false);
              }}
              className="px-2.5 py-1.5 rounded-lg bg-rose-50 text-rose-700 border border-rose-200 text-xs font-bold whitespace-nowrap cursor-pointer hover:bg-rose-100"
            >
              ✕ Limpiar filtros
            </button>
          )}
        </div>

        {/* Filter and Sorting Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 flex items-baseline gap-2.5">
              <span>{categories.find(c => c.id === selectedCategory)?.name || 'Catálogo'}</span>
              <span className="text-xs font-mono font-semibold text-slate-500 tabular-nums">
                · {filteredProducts.length} productos
              </span>
            </h2>
            {isWholesaleMode && (
              <p className="text-xs text-amber-700 font-semibold mt-0.5 flex items-center gap-1">
                <Building2 className="w-3.5 h-3.5" />
                Precios al mayor activos por volumen
              </p>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Admin Quick Shortcut if logged in as admin */}
            {currentUser?.role === 'admin' && (
              <button
                onClick={() => {
                  setAdminInitialTab('productos');
                  setIsAdminOpen(true);
                }}
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white transition-all flex items-center gap-1 cursor-pointer shadow-sm"
              >
                <span>+ Subir Producto / Catálogo</span>
              </button>
            )}

            {/* Flash Deal Filter Toggle */}
            <button
              onClick={() => setFilterOnlyFlash(!filterOnlyFlash)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center gap-1.5 cursor-pointer ${
                filterOnlyFlash 
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm' 
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900'
              }`}
            >
              <Flame className={`w-3.5 h-3.5 ${filterOnlyFlash ? 'text-amber-300' : 'text-amber-500'}`} />
              <span>Solo Ofertas</span>
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-600 shadow-xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="bg-transparent text-slate-900 outline-none cursor-pointer font-semibold"
              >
                <option value="destacados" className="bg-white text-slate-900">Destacados</option>
                <option value="ventas" className="bg-white text-slate-900">Más Vendidos</option>
                <option value="rating" className="bg-white text-slate-900">Mejor Calificados</option>
                <option value="precio_bajo" className="bg-white text-slate-900">Menor Precio</option>
                <option value="precio_alto" className="bg-white text-slate-900">Mayor Precio</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {filteredProducts.length === 0 ? (
          <div className="py-20 text-center space-y-3">
            <div className="text-4xl">🔍</div>
            <h3 className="font-bold text-lg text-slate-900">No encontramos productos con ese filtro</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Prueba con otra palabra clave o selecciona otra categoría arriba.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setFilterOnlyFlash(false);
              }}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl cursor-pointer transition-colors"
            >
              Restablecer Filtros
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-5">
            {filteredProducts.map((prod) => (
              <ZetaProductCard 
                key={prod.id}
                product={prod}
                currency={currency}
                isWholesaleMode={isWholesaleMode}
                isWishlisted={wishlist.some(w => w.id === prod.id)}
                onToggleWishlist={handleToggleWishlist}
                onAddToCart={(p) => handleAddToCart(p, 1)}
                onViewProduct={(p) => setActiveProductModal(p)}
              />
            ))}
          </div>
        )}

        {/* Feature Highlights Strip - Envíos Rápidos & Soporte WhatsApp */}
        <div className="pt-8 border-t border-slate-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
            <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-700 border border-emerald-200/80 flex items-center justify-center shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-sm text-slate-900">Envíos Rápidos</div>
                <div className="text-xs text-slate-500 mt-0.5">Entrega segura en 24-48 horas</div>
              </div>
            </div>

            <a
              href="https://wa.me/584262139920?text=Hola%20ZetaMall,%20necesito%20atenci%C3%B3n%20personalizada"
              target="_blank"
              rel="noreferrer"
              className="p-4 sm:p-5 rounded-2xl bg-slate-50 hover:bg-emerald-50/70 border border-slate-200 hover:border-emerald-300 flex items-center gap-3.5 transition-colors cursor-pointer"
            >
              <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-700 border border-emerald-200/80 flex items-center justify-center shrink-0">
                <Headphones className="w-5 h-5" />
              </div>
              <div>
                <div className="font-bold text-sm text-slate-900">Soporte WhatsApp</div>
                <div className="text-xs text-slate-500 mt-0.5">Atención personalizada · 0426-2139920</div>
              </div>
            </a>
          </div>
        </div>

      </main>

      {/* Floating WhatsApp Action Button */}
      <a
        href="https://wa.me/584262139920?text=Hola%20ZetaMall,%20tengo%20una%20consulta%20sobre%20un%20producto"
        target="_blank"
        rel="noreferrer"
        title="Chatear con soporte en WhatsApp"
        className="fixed bottom-5 right-5 z-40 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-3 rounded-full shadow-lg shadow-emerald-600/25 flex items-center gap-2 font-bold text-xs cursor-pointer active:scale-95 transition-all group"
      >
        <MessageCircle className="w-5 h-5" />
        <span className="hidden sm:inline">WhatsApp: 0426-2139920</span>
      </a>

      {/* Footer */}
      <footer className="bg-slate-50 border-t border-slate-200 text-slate-600 py-8 px-4 text-center text-xs space-y-2.5">
        <div className="flex items-center justify-center gap-2 flex-wrap">
          <span className="font-black text-slate-900 text-sm">Zeta<span className="text-emerald-600">Mall</span></span>
          <span className="text-slate-400">·</span>
          <span>Tienda Oficial con Envíos Rápidos y Soporte WhatsApp</span>
        </div>
        <p className="text-[11px] text-slate-500 max-w-md mx-auto">
          Atención directa vía WhatsApp al 0426-2139920 y despachos seguros a todo el país.
        </p>
        <div className="text-[11px] text-slate-400">
          © 2026 ZetaMall. Todos los derechos reservados.
        </div>
      </footer>

      {/* Modals & Drawers */}
      <ZetaProductModal 
        product={activeProductModal}
        currency={currency}
        isWishlisted={activeProductModal ? wishlist.some(w => w.id === activeProductModal.id) : false}
        onToggleWishlist={handleToggleWishlist}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
        onClose={() => setActiveProductModal(null)}
      />

      <ZetaCartDrawer 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        currency={currency}
        onUpdateQty={handleUpdateQty}
        onRemoveItem={handleRemoveItem}
        onClearCart={() => setCartItems([])}
        appliedCoupon={appliedCoupon}
        onApplyCoupon={setAppliedCoupon}
        onProceedToCheckout={() => setIsCheckoutOpen(true)}
      />

      <ZetaCheckoutModal 
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        cartItems={cartItems}
        currency={currency}
        appliedCoupon={appliedCoupon}
        onOrderCompleted={handleOrderCompleted}
        currentUser={currentUser}
      />

      <ZetaAdminDashboard 
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        products={products}
        orders={orders}
        registeredUsers={registeredUsers}
        categories={categories}
        bannerConfig={bannerConfig}
        currency={currency}
        initialTab={adminInitialTab}
        onAddProduct={(p) => setProducts(prev => [p, ...prev])}
        onDeleteProduct={(id) => setProducts(prev => prev.filter(p => p.id !== id))}
        onToggleProductInBanner={(productId) => {
          setProducts(prev => prev.map(p => 
            p.id === productId 
              ? { ...p, isFeaturedInBanner: !p.isFeaturedInBanner, isFlashDeal: !p.isFeaturedInBanner || p.isFlashDeal } 
              : p
          ));
        }}
        onUpdateBannerConfig={setBannerConfig}
        onAddCategory={(cat) => setCategories(prev => [...prev, cat])}
        onDeleteCategory={(catId) => setCategories(prev => prev.filter(c => c.id !== catId))}
        onUpdateOrderStatus={(id, status) => {
          setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
        }}
      />

      <ZetaWishlistModal 
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlist={wishlist}
        currency={currency}
        onRemoveFromWishlist={handleToggleWishlist}
        onAddToCart={(p) => handleAddToCart(p, 1)}
      />

      {/* Customer Registration & Admin Login Modal */}
      <ZetaAuthModal 
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        currentUser={currentUser}
        onLogin={(user) => {
          setCurrentUser(user);
          try {
            localStorage.setItem('zetamall_current_user', JSON.stringify(user));
          } catch {}
        }}
        onLogout={() => {
          setCurrentUser(null);
          try {
            localStorage.removeItem('zetamall_current_user');
          } catch {}
        }}
        onRegister={(newUser) => {
          setRegisteredUsers(prev => [newUser, ...prev]);
          setCurrentUser(newUser);
          try {
            localStorage.setItem('zetamall_current_user', JSON.stringify(newUser));
          } catch {}
        }}
        registeredUsers={registeredUsers}
        onOpenAdminDirectly={() => setIsAdminOpen(true)}
      />

    </div>
  );
};
