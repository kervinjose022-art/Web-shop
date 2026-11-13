import React, { useState, useRef } from 'react';
import { 
  X, 
  Plus, 
  Package, 
  ShoppingBag, 
  DollarSign, 
  Users, 
  Trash2, 
  Check, 
  Edit, 
  Send, 
  TrendingUp,
  Tag,
  ShieldCheck,
  Lock,
  ArrowRight,
  Upload,
  Image as ImageIcon,
  MessageCircle,
  Phone,
  Mail,
  MapPin,
  Calendar,
  LogOut,
  Flame,
  Layers,
  Sparkles,
  Eye
} from 'lucide-react';
import { Product, Order, Currency, CustomerUser, StoreCategory, BannerConfig } from '../types/store';
import { formatPrice } from '../utils/storeUtils';

export type AdminTab = 'resumen' | 'banner70' | 'productos' | 'pedidos' | 'clientes';

interface ZetaAdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  orders: Order[];
  registeredUsers: CustomerUser[];
  categories: StoreCategory[];
  bannerConfig: BannerConfig;
  currency: Currency;
  initialTab?: AdminTab;
  onAddProduct: (p: Product) => void;
  onDeleteProduct: (id: string) => void;
  onToggleProductInBanner: (productId: string) => void;
  onUpdateBannerConfig: (cfg: BannerConfig) => void;
  onAddCategory: (cat: StoreCategory) => void;
  onDeleteCategory: (catId: string) => void;
  onUpdateOrderStatus: (orderId: string, status: Order['status']) => void;
}

export const ZetaAdminDashboard: React.FC<ZetaAdminDashboardProps> = ({
  isOpen,
  onClose,
  products,
  orders,
  registeredUsers,
  categories,
  bannerConfig,
  currency,
  initialTab = 'banner70',
  onAddProduct,
  onDeleteProduct,
  onToggleProductInBanner,
  onUpdateBannerConfig,
  onAddCategory,
  onDeleteCategory,
  onUpdateOrderStatus
}) => {
  // Admin authentication state
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    try {
      return localStorage.getItem('zetamall_admin_auth') === 'true';
    } catch {
      return false;
    }
  });

  // Admin login inputs
  const [adminEmail, setAdminEmail] = useState('kervinjose022@gmail.com');
  const [adminPassword, setAdminPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Dashboard active tab
  const [activeTab, setActiveTab] = useState<AdminTab>(initialTab);

  // Sync tab when opened with a specific initialTab
  React.useEffect(() => {
    if (isOpen && initialTab) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  // New catalog creator input
  const [newCatalogName, setNewCatalogName] = useState('');
  const [bannerFilterQuery, setBannerFilterQuery] = useState('');

  // New product form
  const [newName, setNewName] = useState('');
  const [newSubtitle, setNewSubtitle] = useState('');
  const [newCategory, setNewCategory] = useState<string>('materiales');
  const [customCategoryName, setCustomCategoryName] = useState('');
  const [newPrice, setNewPrice] = useState('29.99');
  const [newOriginalPrice, setNewOriginalPrice] = useState('99.99');
  const [newStock, setNewStock] = useState('50');
  const [showIn70Discount, setShowIn70Discount] = useState(true);
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [externalImageUrl, setExternalImageUrl] = useState('');
  const [isUploadingFiles, setIsUploadingFiles] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Handle Admin Login Check
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    if (adminEmail.trim().toLowerCase() === 'kervinjose022@gmail.com' && adminPassword.trim() === '26304421') {
      setIsAdminAuthenticated(true);
      try {
        localStorage.setItem('zetamall_admin_auth', 'true');
      } catch {}
    } else {
      setLoginError('Credenciales incorrectas. Verifica tu correo y contraseña.');
    }
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    try {
      localStorage.removeItem('zetamall_admin_auth');
    } catch {}
  };

  // Handle file uploads from device / mobile gallery
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploadingFiles(true);
    const newFilesArray: string[] = [];
    let processed = 0;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          newFilesArray.push(event.target.result as string);
        }
        processed++;
        if (processed === files.length) {
          setUploadedImages((prev) => [...prev, ...newFilesArray]);
          setIsUploadingFiles(false);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (index: number) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddExternalUrl = () => {
    if (externalImageUrl.trim()) {
      setUploadedImages((prev) => [...prev, externalImageUrl.trim()]);
      setExternalImageUrl('');
    }
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newPrice) {
      alert('Por favor ingresa al menos el Nombre y Precio del producto.');
      return;
    }

    const priceNum = parseFloat(newPrice) || 10;
    let origNum = parseFloat(newOriginalPrice);

    // If 70% discount is selected and original price is empty or lower, calculate a 70% off original price
    if (showIn70Discount && (!origNum || origNum <= priceNum)) {
      origNum = Math.round((priceNum / 0.30) * 100) / 100;
    } else if (!origNum) {
      origNum = priceNum * 1.5;
    }

    const computedDiscount = Math.max(0, Math.round(((origNum - priceNum) / origNum) * 100));

    // Resolve final category: if custom was chosen, register it as a store catalog too
    let resolvedCategory = newCategory;
    if (newCategory === 'custom') {
      const cleanLabel = customCategoryName.trim() || 'Varios';
      const customId = cleanLabel.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '_');
      resolvedCategory = customId || 'varios';
      if (!categories.some(c => c.id === resolvedCategory)) {
        onAddCategory({ id: resolvedCategory, name: cleanLabel, icon: 'Layers' });
      }
      if (!bannerConfig.visibleCatalogIds.includes(resolvedCategory)) {
        onUpdateBannerConfig({
          ...bannerConfig,
          visibleCatalogIds: [...bannerConfig.visibleCatalogIds, resolvedCategory]
        });
      }
    }

    // Use uploaded images or fallback
    const finalImages = uploadedImages.length > 0 
      ? uploadedImages 
      : ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80'];

    const product: Product = {
      id: `prod_custom_${Date.now()}`,
      name: newName.trim(),
      subtitle: newSubtitle.trim() || 'Mercancía verificada en catálogo',
      price: priceNum,
      originalPrice: origNum,
      discountPct: showIn70Discount ? Math.max(70, computedDiscount) : computedDiscount,
      rating: 5.0,
      reviewCount: 1,
      category: resolvedCategory,
      images: finalImages,
      colors: ['Estándar'],
      stock: parseInt(newStock) || 20,
      soldCount: 0,
      isNew: true,
      isFlashDeal: showIn70Discount,
      isFeaturedInBanner: showIn70Discount,
      description: 'Producto de alta calidad verificado por ZetaMall con despacho y garantía.',
      features: ['Garantía de calidad oficial', 'Envío rápido asegurado por WhatsApp']
    };

    onAddProduct(product);
    setNewName('');
    setNewSubtitle('');
    setCustomCategoryName('');
    setUploadedImages([]);
    setExternalImageUrl('');
    alert(`¡Mercancía "${product.name}" agregada con éxito al catálogo ${showIn70Discount ? 'y a la sección de 70% de Descuento' : ''}!`);
  };

  const handleCreateQuickCatalog = (e: React.FormEvent) => {
    e.preventDefault();
    const label = newCatalogName.trim();
    if (!label) return;
    const id = label.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '_');
    if (!categories.some(c => c.id === id)) {
      onAddCategory({ id, name: label, icon: 'Layers' });
    }
    if (!bannerConfig.visibleCatalogIds.includes(id)) {
      onUpdateBannerConfig({
        ...bannerConfig,
        visibleCatalogIds: [...bannerConfig.visibleCatalogIds, id]
      });
    }
    setNewCatalogName('');
  };

  const handleToggleCatalogInBanner = (catId: string) => {
    const exists = bannerConfig.visibleCatalogIds.includes(catId);
    const updated = exists
      ? bannerConfig.visibleCatalogIds.filter(id => id !== catId)
      : [...bannerConfig.visibleCatalogIds, catId];
    onUpdateBannerConfig({
      ...bannerConfig,
      visibleCatalogIds: updated
    });
  };

  const totalSales = orders.reduce((sum, o) => sum + o.total, 0) + 4820.00;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-[#0b1324] border border-slate-800 rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl text-slate-100 overflow-hidden">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between bg-[#080d19]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-white">Panel de Administración ZetaMall</h3>
              <p className="text-[11px] text-slate-400 font-mono">
                {isAdminAuthenticated ? 'kervinjose022@gmail.com · Administrador Activo' : 'Acceso Restringido'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isAdminAuthenticated && (
              <button
                onClick={handleAdminLogout}
                title="Cerrar Sesión Admin"
                className="px-2.5 py-1 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-rose-400 text-xs flex items-center gap-1 cursor-pointer transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Salir</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* If NOT Authenticated: Show Login Barrier */}
        {!isAdminAuthenticated ? (
          <div className="p-6 sm:p-10 flex flex-col items-center justify-center text-center max-w-md mx-auto space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-lg">
              <Lock className="w-7 h-7 stroke-[2.5]" />
            </div>
            
            <div className="space-y-1">
              <h4 className="text-xl font-bold text-white">Acceso de Administrador</h4>
              <p className="text-xs text-slate-400">
                Introduce tu correo y contraseña maestra para ingresar al panel de control de ventas, catálogo y clientes.
              </p>
            </div>

            {loginError && (
              <div className="w-full p-2.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-medium">
                {loginError}
              </div>
            )}

            <form onSubmit={handleAdminLogin} className="w-full space-y-3 text-left text-xs">
              <div>
                <label className="text-[11px] font-bold text-slate-400 block mb-1">Correo de Administrador</label>
                <input 
                  type="email" 
                  required
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className="w-full bg-[#080d19] border border-slate-800 rounded-xl px-3 py-2.5 text-white outline-none focus:border-emerald-500 transition-colors font-mono"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-400 block mb-1">Contraseña</label>
                <input 
                  type="password" 
                  required
                  placeholder="••••••••"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full bg-[#080d19] border border-slate-800 rounded-xl px-3 py-2.5 text-white outline-none focus:border-emerald-500 transition-colors"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Ingresar al Panel de Control</span>
              </button>
            </form>
          </div>
        ) : (
          /* AUTHENTICATED ADMIN DASHBOARD */
          <>
            {/* Navigation Tabs */}
            <div className="bg-[#080d19] border-b border-slate-800 px-5 flex items-center gap-2 text-xs font-bold overflow-x-auto no-scrollbar">
              <button
                onClick={() => setActiveTab('banner70')}
                className={`py-3 px-3 border-b-2 whitespace-nowrap cursor-pointer transition-all ${
                  activeTab === 'banner70' ? 'border-emerald-400 text-emerald-400 font-bold' : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                🔥 Catálogo 70%
              </button>
              <button
                onClick={() => setActiveTab('productos')}
                className={`py-3 px-3 border-b-2 whitespace-nowrap cursor-pointer transition-all ${
                  activeTab === 'productos' ? 'border-emerald-400 text-emerald-400 font-bold' : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                📦 Productos ({products.length})
              </button>
              <button
                onClick={() => setActiveTab('resumen')}
                className={`py-3 px-3 border-b-2 whitespace-nowrap cursor-pointer transition-all ${
                  activeTab === 'resumen' ? 'border-emerald-400 text-emerald-400 font-bold' : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                📊 Métricas
              </button>
              <button
                onClick={() => setActiveTab('pedidos')}
                className={`py-3 px-3 border-b-2 whitespace-nowrap cursor-pointer transition-all ${
                  activeTab === 'pedidos' ? 'border-emerald-400 text-emerald-400 font-bold' : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                🛍️ Pedidos ({orders.length})
              </button>
              <button
                onClick={() => setActiveTab('clientes')}
                className={`py-3 px-3 border-b-2 whitespace-nowrap cursor-pointer transition-all ${
                  activeTab === 'clientes' ? 'border-emerald-400 text-emerald-400 font-bold' : 'border-transparent text-slate-400 hover:text-white'
                }`}
              >
                👥 Clientes ({registeredUsers.length})
              </button>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">

              {/* TAB 0: CONFIGURAR CATÁLOGO EN ZONA 70% DESCUENTO */}
              {activeTab === 'banner70' && (
                <div className="space-y-6">
                  {/* Banner Headline & Main Featured Catalog Picker */}
                  <div className="bg-[#080d19] border border-emerald-500/30 rounded-2xl p-4 sm:p-5 space-y-4">
                    <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-2">
                      <div className="flex items-center gap-2 font-bold text-sm text-white">
                        <Flame className="w-4 h-4 text-emerald-400" />
                        <span>Configurar Sección "70% de Descuento en Catálogo"</span>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 font-bold border border-emerald-500/30">
                        Vista Principal
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="text-slate-400 block mb-1 font-bold">
                          Catálogo Principal donde dice "Hasta 70% de Descuento en..."
                        </label>
                        <select
                          value={bannerConfig.featuredCategoryId}
                          onChange={(e) => onUpdateBannerConfig({ ...bannerConfig, featuredCategoryId: e.target.value })}
                          className="w-full bg-[#0b1324] border border-emerald-500/40 rounded-xl p-2.5 text-white outline-none cursor-pointer font-bold"
                        >
                          <option value="all">🌟 Todos los Catálogos ("en Catálogo")</option>
                          {categories.filter(c => c.id !== 'all').map(cat => (
                            <option key={cat.id} value={cat.id}>
                              📁 {cat.name}
                            </option>
                          ))}
                        </select>
                        <p className="text-[10px] text-slate-500 mt-1">
                          El catálogo que elijas aquí se abrirá primero apenas el cliente entre a la tienda.
                        </p>
                      </div>

                      <div>
                        <label className="text-slate-400 block mb-1 font-bold">Texto de Descuento en el Banner</label>
                        <input
                          type="text"
                          value={bannerConfig.discountText}
                          onChange={(e) => onUpdateBannerConfig({ ...bannerConfig, discountText: e.target.value })}
                          placeholder="70% de Descuento"
                          className="w-full bg-[#0b1324] border border-slate-800 rounded-xl p-2.5 text-emerald-400 font-bold outline-none focus:border-emerald-500"
                        />
                        <p className="text-[10px] text-slate-500 mt-1">
                          Ej: "70% de Descuento", "50% de Descuento", "Precios de Fábrica".
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="text-slate-400 block mb-1 font-bold">Etiqueta Superior</label>
                        <input
                          type="text"
                          value={bannerConfig.badgeText}
                          onChange={(e) => onUpdateBannerConfig({ ...bannerConfig, badgeText: e.target.value })}
                          className="w-full bg-[#0b1324] border border-slate-800 rounded-xl p-2.5 text-white outline-none focus:border-emerald-500"
                        />
                      </div>
                      <div>
                        <label className="text-slate-400 block mb-1 font-bold">Descripción Breve</label>
                        <input
                          type="text"
                          value={bannerConfig.subtitleText}
                          onChange={(e) => onUpdateBannerConfig({ ...bannerConfig, subtitleText: e.target.value })}
                          className="w-full bg-[#0b1324] border border-slate-800 rounded-xl p-2.5 text-white outline-none focus:border-emerald-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Catalog Visibility & Create New Catalog */}
                  <div className="bg-[#080d19] border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <div className="flex items-center gap-2 font-bold text-sm text-white">
                        <Layers className="w-4 h-4 text-emerald-400" />
                        <span>Catálogos Activos en la Zona de 70% Descuento</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-400">
                      Toca cualquier catálogo para activarlo o desactivarlo en la barra de ofertas del 70%, o crea un catálogo nuevo:
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {categories.filter(c => c.id !== 'all').map(cat => {
                        const isActive = bannerConfig.visibleCatalogIds.includes(cat.id);
                        const count = products.filter(p => p.category === cat.id).length;
                        return (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => handleToggleCatalogInBanner(cat.id)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center gap-1.5 ${
                              isActive
                                ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300'
                                : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
                            }`}
                          >
                            {isActive ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Plus className="w-3.5 h-3.5" />}
                            <span>{cat.name}</span>
                            <span className="text-[10px] opacity-70 font-mono">({count})</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Quick create catalog */}
                    <form onSubmit={handleCreateQuickCatalog} className="flex items-center gap-2 pt-2 border-t border-slate-800">
                      <input
                        type="text"
                        placeholder="Crear nuevo catálogo (Ej. Bloques, Cemento, Celulares...)"
                        value={newCatalogName}
                        onChange={(e) => setNewCatalogName(e.target.value)}
                        className="flex-1 bg-[#0b1324] border border-slate-800 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-emerald-500"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs cursor-pointer shrink-0"
                      >
                        + Crear Catálogo
                      </button>
                    </form>
                  </div>

                  {/* Select Which Products Go in the 70% Discount Banner */}
                  <div className="bg-[#080d19] border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2">
                      <div className="flex items-center gap-2 font-bold text-sm text-white">
                        <Sparkles className="w-4 h-4 text-amber-400" />
                        <span>Elegir Productos en "70% de Descuento"</span>
                      </div>
                      <input
                        type="text"
                        placeholder="Buscar producto o catálogo..."
                        value={bannerFilterQuery}
                        onChange={(e) => setBannerFilterQuery(e.target.value)}
                        className="bg-[#0b1324] border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-white outline-none focus:border-emerald-500 sm:w-56"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-80 overflow-y-auto pr-1 text-xs">
                      {products
                        .filter(p => !bannerFilterQuery.trim() || p.name.toLowerCase().includes(bannerFilterQuery.toLowerCase()) || p.category.toLowerCase().includes(bannerFilterQuery.toLowerCase()))
                        .map(p => {
                          const isInBanner = Boolean(p.isFeaturedInBanner);
                          return (
                            <div key={p.id} className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 transition-colors ${isInBanner ? 'bg-emerald-500/10 border-emerald-500/40' : 'bg-[#0b1324] border-slate-800'}`}>
                              <div className="flex items-center gap-2.5 overflow-hidden">
                                <img src={p.images[0]} alt={p.name} className="w-11 h-11 rounded-lg object-cover shrink-0 border border-slate-800" />
                                <div className="overflow-hidden">
                                  <div className="font-bold text-white truncate">{p.name}</div>
                                  <div className="text-[10px] text-slate-400 flex items-center gap-1.5">
                                    <span className="text-emerald-400 font-mono font-bold">{formatPrice(p.price, currency)}</span>
                                    <span>·</span>
                                    <span className="capitalize">{categories.find(c => c.id === p.category)?.name || p.category}</span>
                                  </div>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => onToggleProductInBanner(p.id)}
                                className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold shrink-0 cursor-pointer transition-all ${
                                  isInBanner
                                    ? 'bg-emerald-500 text-slate-950'
                                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                                }`}
                              >
                                {isInBanner ? '🔥 En 70%' : '+ Poner en 70%'}
                              </button>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                </div>
              )}
              
              {/* TAB 1: RESUMEN Y MÉTRICAS */}
              {activeTab === 'resumen' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-[#080d19] border border-slate-800 p-4 rounded-2xl">
                      <div className="text-[11px] text-slate-400 uppercase font-semibold">Ventas Totales</div>
                      <div className="text-xl font-mono font-black text-emerald-400 mt-1">
                        {formatPrice(totalSales, currency)}
                      </div>
                      <div className="text-[10px] text-emerald-400 flex items-center gap-1 mt-1 font-bold">
                        <TrendingUp className="w-3 h-3" /> +18.4% este mes
                      </div>
                    </div>

                    <div className="bg-[#080d19] border border-slate-800 p-4 rounded-2xl">
                      <div className="text-[11px] text-slate-400 uppercase font-semibold">Total Pedidos</div>
                      <div className="text-xl font-mono font-black text-white mt-1">
                        {orders.length + 84}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1">
                        {orders.length} pedidos en vivo
                      </div>
                    </div>

                    <div className="bg-[#080d19] border border-slate-800 p-4 rounded-2xl">
                      <div className="text-[11px] text-slate-400 uppercase font-semibold">Clientes Registrados</div>
                      <div className="text-xl font-mono font-black text-cyan-400 mt-1">
                        {registeredUsers.length}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1">
                        Cuentas activas
                      </div>
                    </div>

                    <div className="bg-[#080d19] border border-slate-800 p-4 rounded-2xl">
                      <div className="text-[11px] text-slate-400 uppercase font-semibold">Productos en Tienda</div>
                      <div className="text-xl font-mono font-black text-amber-400 mt-1">
                        {products.length}
                      </div>
                      <div className="text-[10px] text-slate-400 mt-1">
                        Inventario disponible
                      </div>
                    </div>
                  </div>

                  {/* Quick info note */}
                  <div className="p-4 bg-[#080d19] border border-slate-800 rounded-2xl flex items-center justify-between">
                    <div>
                      <div className="font-bold text-white text-xs">WhatsApp de Recepción de Pedidos:</div>
                      <div className="text-xs text-emerald-400 font-mono font-bold mt-0.5">+58 426 2139920</div>
                    </div>
                    <a
                      href="https://wa.me/584262139920"
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <MessageCircle className="w-3.5 h-3.5 fill-slate-950" />
                      <span>Abrir Mi WhatsApp</span>
                    </a>
                  </div>
                </div>
              )}

              {/* TAB 2: CATÁLOGO Y GESTOR DE ARCHIVOS DE MERCANCÍA */}
              {activeTab === 'productos' && (
                <div className="space-y-6">
                  {/* Form to Add New Product with FILE MANAGER */}
                  <div className="bg-[#080d19] border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4">
                    <div className="flex items-center gap-2 font-bold text-sm text-white border-b border-slate-800 pb-2">
                      <Plus className="w-4 h-4 text-emerald-400" />
                      <span>Subir Nueva Mercancía al Catálogo (Gestor de Archivos)</span>
                    </div>

                    <form onSubmit={handleCreateProduct} className="space-y-3 text-xs">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-slate-400 block mb-1">Nombre del Producto *</label>
                          <input 
                            type="text" 
                            required
                            placeholder="Ej. Zapatillas Urban Pro Retro"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            className="w-full bg-[#0b1324] border border-slate-800 rounded-xl p-2.5 text-white outline-none focus:border-emerald-500 transition-colors"
                          />
                        </div>
                        <div>
                          <label className="text-slate-400 block mb-1">Subtítulo / Detalle</label>
                          <input 
                            type="text" 
                            placeholder="Ej. Edición especial 2026"
                            value={newSubtitle}
                            onChange={(e) => setNewSubtitle(e.target.value)}
                            className="w-full bg-[#0b1324] border border-slate-800 rounded-xl p-2.5 text-white outline-none focus:border-emerald-500 transition-colors"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div>
                          <label className="text-slate-400 block mb-1">Catálogo / Categoría</label>
                          <select
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                            className="w-full bg-[#0b1324] border border-slate-800 rounded-xl p-2.5 text-white outline-none cursor-pointer"
                          >
                            {categories.filter(c => c.id !== 'all').map(cat => (
                              <option key={cat.id} value={cat.id}>
                                📁 {cat.name}
                              </option>
                            ))}
                            <option value="custom">➕ Crear Otro Catálogo...</option>
                          </select>
                        </div>
                        <div>
                          <label className="text-slate-400 block mb-1">Precio Venta ($ USD) *</label>
                          <input 
                            type="number" 
                            step="0.01"
                            required
                            value={newPrice}
                            onChange={(e) => setNewPrice(e.target.value)}
                            className="w-full bg-[#0b1324] border border-slate-800 rounded-xl p-2.5 text-white outline-none font-mono"
                          />
                        </div>
                        <div>
                          <label className="text-slate-400 block mb-1">Precio Tachado ($ USD)</label>
                          <input 
                            type="number" 
                            step="0.01"
                            value={newOriginalPrice}
                            onChange={(e) => setNewOriginalPrice(e.target.value)}
                            className="w-full bg-[#0b1324] border border-slate-800 rounded-xl p-2.5 text-white outline-none font-mono"
                          />
                        </div>
                        <div>
                          <label className="text-slate-400 block mb-1">Stock Disponible</label>
                          <input 
                            type="number" 
                            value={newStock}
                            onChange={(e) => setNewStock(e.target.value)}
                            className="w-full bg-[#0b1324] border border-slate-800 rounded-xl p-2.5 text-white outline-none font-mono"
                          />
                        </div>
                      </div>

                      {/* Custom Category input if chosen */}
                      {newCategory === 'custom' && (
                        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                          <label className="text-slate-300 block mb-1 text-[11px] font-bold">
                            Nombre del Nuevo Catálogo / Categoría:
                          </label>
                          <input 
                            type="text" 
                            placeholder="Ej. Materiales de Construcción, Ferretería, Bloques, etc."
                            value={customCategoryName}
                            onChange={(e) => setCustomCategoryName(e.target.value)}
                            className="w-full bg-[#0b1324] border border-emerald-500/50 rounded-xl p-2.5 text-white outline-none"
                          />
                        </div>
                      )}

                      {/* 70% Discount Banner Placement Checkbox */}
                      <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-1">
                        <label className="flex items-center gap-2 cursor-pointer font-bold text-xs text-white">
                          <input 
                            type="checkbox" 
                            checked={showIn70Discount} 
                            onChange={(e) => setShowIn70Discount(e.target.checked)} 
                            className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
                          />
                          <span className="flex items-center gap-1.5">
                            <Flame className="w-4 h-4 text-emerald-400" />
                            <span>Mostrar en "Hasta 70% de Descuento en Catálogo" (Banner Principal de la Tienda)</span>
                          </span>
                        </label>
                        <p className="text-[11px] text-slate-400 pl-6">
                          Al marcar esta casilla, el producto aparecerá inmediatamente en el carrusel de ofertas destacadas al inicio de la página.
                        </p>
                      </div>

                      {/* --- GESTOR DE ARCHIVOS DE IMÁGENES --- */}
                      <div className="space-y-2 pt-2 border-t border-slate-800">
                        <label className="text-slate-300 font-bold block">
                          📸 Fotos de la Mercancía (Sube directamente desde tu celular o archivos):
                        </label>
                        
                        {/* Hidden native file input */}
                        <input 
                          type="file" 
                          ref={fileInputRef}
                          accept="image/*"
                          multiple
                          onChange={handleFileChange}
                          className="hidden"
                        />

                        {/* Drag and Drop / Click Button Box */}
                        <div 
                          onClick={() => fileInputRef.current?.click()}
                          className="border-2 border-dashed border-slate-700 hover:border-emerald-500 rounded-2xl p-4 text-center cursor-pointer transition-colors bg-[#0b1324] hover:bg-[#0e1930] flex flex-col items-center justify-center gap-1.5"
                        >
                          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                            <Upload className="w-5 h-5" />
                          </div>
                          <div className="font-bold text-white text-xs">
                            {isUploadingFiles ? 'Cargando imágenes...' : 'Toca aquí para seleccionar fotos desde tu teléfono / computadora'}
                          </div>
                          <div className="text-[10px] text-slate-400">
                            Formatos soportados: JPG, PNG, WEBP (puedes subir varias fotos)
                          </div>
                        </div>

                        {/* Image Previews */}
                        {uploadedImages.length > 0 && (
                          <div className="space-y-1.5">
                            <div className="text-[11px] text-slate-400 font-bold">
                              Fotos seleccionadas ({uploadedImages.length}):
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {uploadedImages.map((img, idx) => (
                                <div key={idx} className="relative w-16 h-16 rounded-xl overflow-hidden border border-slate-700 group">
                                  <img src={img} alt="preview" className="w-full h-full object-cover" />
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveImage(idx)}
                                    className="absolute top-1 right-1 w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center text-xs opacity-90 hover:opacity-100"
                                  >
                                    ✕
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Optional External URL */}
                        <div className="flex items-center gap-2 pt-1">
                          <input 
                            type="url" 
                            placeholder="O pega el enlace de una foto en internet (URL)..."
                            value={externalImageUrl}
                            onChange={(e) => setExternalImageUrl(e.target.value)}
                            className="flex-1 bg-[#0b1324] border border-slate-800 rounded-xl px-3 py-2 text-white outline-none text-[11px] font-mono"
                          />
                          <button
                            type="button"
                            onClick={handleAddExternalUrl}
                            className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl text-xs cursor-pointer"
                          >
                            Agregar URL
                          </button>
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 cursor-pointer transition-all active:scale-95 flex items-center justify-center gap-1.5"
                      >
                        <Package className="w-4 h-4 stroke-[2.5]" />
                        <span>Publicar Mercancía en la Tienda</span>
                      </button>
                    </form>
                  </div>

                  {/* List of existing products */}
                  <div className="space-y-2">
                    <div className="font-bold text-xs text-white">Catálogo Actual ({products.length} productos):</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {products.map((p) => {
                        const isInBanner = Boolean(p.isFeaturedInBanner);
                        return (
                          <div key={p.id} className="p-3 bg-[#080d19] border border-slate-800 rounded-xl flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2.5 overflow-hidden">
                              <img src={p.images[0]} alt={p.name} className="w-12 h-12 object-cover rounded-lg shrink-0 border border-slate-800" />
                              <div className="overflow-hidden">
                                <div className="font-bold text-white truncate">{p.name}</div>
                                <div className="text-[11px] text-emerald-400 font-mono font-bold">{formatPrice(p.price, currency)}</div>
                                <div className="text-[10px] text-slate-500 capitalize">
                                  {categories.find(c => c.id === p.category)?.name || p.category} · Stock: {p.stock}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0">
                              <button
                                type="button"
                                onClick={() => onToggleProductInBanner(p.id)}
                                className={`px-2 py-1 rounded-lg text-[10px] font-bold cursor-pointer transition-all ${
                                  isInBanner
                                    ? 'bg-emerald-500 text-slate-950'
                                    : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                                }`}
                                title="Activar o quitar de la sección 70% de Descuento"
                              >
                                {isInBanner ? '🔥 En 70%' : '+ 70%'}
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`¿Eliminar ${p.name} del catálogo?`)) onDeleteProduct(p.id);
                                }}
                                className="w-7 h-7 rounded-lg bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white flex items-center justify-center cursor-pointer transition-colors shrink-0"
                                title="Eliminar producto"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: PEDIDOS */}
              {activeTab === 'pedidos' && (
                <div className="space-y-3">
                  <div className="font-bold text-xs text-white">Pedidos Registrados ({orders.length}):</div>
                  {orders.length === 0 ? (
                    <div className="text-center py-10 bg-[#080d19] border border-slate-800 rounded-2xl text-slate-400 text-xs">
                      No hay pedidos nuevos por el momento. Cuando un cliente complete su compra, aparecerá aquí.
                    </div>
                  ) : (
                    <div className="space-y-2 text-xs">
                      {orders.map((order) => (
                        <div key={order.id} className="p-4 bg-[#080d19] border border-slate-800 rounded-2xl space-y-2">
                          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2">
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-white">{order.id}</span>
                              <span className="text-[10px] text-slate-400">{order.createdAt}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <select
                                value={order.status}
                                onChange={(e) => onUpdateOrderStatus(order.id, e.target.value as Order['status'])}
                                className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase outline-none cursor-pointer border ${
                                  order.status === 'entregado' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' :
                                  order.status === 'enviado' ? 'bg-blue-500/20 text-blue-300 border-blue-500/40' :
                                  order.status === 'procesando' ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' :
                                  'bg-rose-500/20 text-rose-300 border-rose-500/40'
                                }`}
                              >
                                <option value="pendiente" className="bg-slate-900">Pendiente</option>
                                <option value="procesando" className="bg-slate-900">Procesando</option>
                                <option value="enviado" className="bg-slate-900">Enviado</option>
                                <option value="entregado" className="bg-slate-900">Entregado</option>
                              </select>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-300">
                            <div>
                              <span className="text-slate-500">Comprador: </span>
                              <strong className="text-white">{order.customerName}</strong> ({order.customerPhone})
                            </div>
                            <div>
                              <span className="text-slate-500">Dirección: </span>
                              <span>{order.shippingAddress}, {order.city}</span>
                            </div>
                          </div>

                          <div className="pt-1 text-[11px] text-slate-400">
                            <span>Artículos: </span>
                            {order.items.map((it, i) => (
                              <span key={i} className="text-white font-medium">
                                {it.quantity}x {it.product.name} ({it.selectedColor || ''} {it.selectedSize || ''}){i < order.items.length - 1 ? ', ' : ''}
                              </span>
                            ))}
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                            <span className="font-mono text-emerald-400 font-bold text-sm">
                              Total: {formatPrice(order.total, currency)} ({order.paymentMethod})
                            </span>
                            
                            {/* Direct WhatsApp link to client */}
                            <a
                              href={`https://wa.me/${order.customerPhone.replace(/[^0-9]/g, '')}?text=Hola%20${encodeURIComponent(order.customerName)},%20te%20escribo%20de%20ZetaMall%20sobre%20tu%20pedido%20%23${order.id}`}
                              target="_blank"
                              rel="noreferrer"
                              className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                            >
                              <MessageCircle className="w-3.5 h-3.5 fill-slate-950" />
                              <span>Escribir al Cliente</span>
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: CLIENTES REGISTRADOS */}
              {activeTab === 'clientes' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="font-bold text-xs text-white">
                      Lista de Clientes Registrados ({registeredUsers.length}):
                    </div>
                  </div>

                  {registeredUsers.length === 0 ? (
                    <div className="text-center py-10 bg-[#080d19] border border-slate-800 rounded-2xl text-slate-400 text-xs">
                      No hay clientes registrados aún. En cuanto los clientes creen su cuenta, aparecerán aquí.
                    </div>
                  ) : (
                    <div className="space-y-2 text-xs">
                      {registeredUsers.map((user) => (
                        <div key={user.id} className="p-3.5 bg-[#080d19] border border-slate-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-white text-sm">{user.name}</span>
                              <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${user.role === 'admin' ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'}`}>
                                {user.role === 'admin' ? 'Super Admin' : 'Cliente'}
                              </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400">
                              <span className="flex items-center gap-1">
                                <Mail className="w-3 h-3 text-slate-500" />
                                {user.email}
                              </span>
                              <span className="flex items-center gap-1">
                                <Phone className="w-3 h-3 text-slate-500" />
                                {user.phone}
                              </span>
                              {user.city && (
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3 text-slate-500" />
                                  {user.city}
                                </span>
                              )}
                              <span className="flex items-center gap-1 font-mono text-[10px] text-slate-500">
                                <Calendar className="w-3 h-3" />
                                {user.registeredAt}
                              </span>
                            </div>
                          </div>

                          <div className="shrink-0 flex items-center gap-2">
                            <a
                              href={`https://wa.me/${user.phone.replace(/[^0-9]/g, '')}?text=Hola%20${encodeURIComponent(user.name)},%20te%20saludamos%20de%20ZetaMall.`}
                              target="_blank"
                              rel="noreferrer"
                              className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                            >
                              <MessageCircle className="w-3.5 h-3.5 fill-slate-950" />
                              <span>WhatsApp</span>
                            </a>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

            </div>
          </>
        )}

      </div>
    </div>
  );
};
