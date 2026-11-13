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
    const parsedOrig = parseFloat(newOriginalPrice);
    const origNum = parsedOrig && parsedOrig > priceNum ? parsedOrig : priceNum;
    const computedDiscount = origNum > priceNum
      ? Math.max(0, Math.round(((origNum - priceNum) / origNum) * 100))
      : 0;

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

    // Use uploaded images or ZetaMall logo fallback
    const finalImages = uploadedImages.length > 0 
      ? uploadedImages 
      : ['/zetamall_logo.png'];

    const product: Product = {
      id: `prod_custom_${Date.now()}`,
      name: newName.trim(),
      subtitle: newSubtitle.trim() || 'Mercancía verificada en catálogo',
      price: priceNum,
      originalPrice: origNum,
      discountPct: computedDiscount,
      rating: 5.0,
      reviewCount: 1,
      category: resolvedCategory,
      images: finalImages,
      colors: ['Estándar'],
      stock: parseInt(newStock) || 20,
      soldCount: 0,
      isNew: true,
      isFlashDeal: computedDiscount > 0,
      isFeaturedInBanner: showIn70Discount,
      description: 'Producto de alta calidad verificado por ZetaMall con despacho y garantía.',
      features: ['Calidad verificada en catálogo', 'Envío rápido asegurado por WhatsApp']
    };

    onAddProduct(product);
    setNewName('');
    setNewSubtitle('');
    setCustomCategoryName('');
    setUploadedImages([]);
    setExternalImageUrl('');
    alert(`¡Mercancía "${product.name}" publicada en la tienda con éxito!`);
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
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl text-slate-900 overflow-hidden">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-700">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-slate-900">Panel de Administración ZetaMall</h3>
              <p className="text-[11px] text-slate-500 font-mono">
                {isAdminAuthenticated ? 'kervinjose022@gmail.com · Administrador Activo' : 'Acceso Restringido'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isAdminAuthenticated && (
              <button
                onClick={handleAdminLogout}
                title="Cerrar Sesión Admin"
                className="px-2.5 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-rose-600 text-xs flex items-center gap-1 cursor-pointer transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Salir</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* If NOT Authenticated: Show Login Barrier */}
        {!isAdminAuthenticated ? (
          <div className="p-6 sm:p-10 flex flex-col items-center justify-center text-center max-w-md mx-auto space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-emerald-100 border border-emerald-200 flex items-center justify-center text-emerald-700 shadow-xs">
              <Lock className="w-7 h-7 stroke-[2.5]" />
            </div>
            
            <div className="space-y-1">
              <h4 className="text-xl font-bold text-slate-900">Acceso de Administrador</h4>
              <p className="text-xs text-slate-500">
                Introduce tu correo y contraseña maestra para ingresar al panel de control de ventas, catálogo y clientes.
              </p>
            </div>

            {loginError && (
              <div className="w-full p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                {loginError}
              </div>
            )}

            <form onSubmit={handleAdminLogin} className="w-full space-y-3 text-left text-xs">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Correo de Administrador</label>
                <input 
                  type="email" 
                  required
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-slate-900 outline-none focus:bg-white focus:border-emerald-600 transition-colors font-mono"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Contraseña</label>
                <input 
                  type="password" 
                  required
                  placeholder="••••••••"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-slate-900 outline-none focus:bg-white focus:border-emerald-600 transition-colors"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm active:scale-95 transition-all cursor-pointer flex items-center justify-center gap-1.5"
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
            <div className="bg-slate-50 border-b border-slate-200 px-5 flex items-center gap-2 text-xs font-bold overflow-x-auto no-scrollbar">
              <button
                onClick={() => setActiveTab('productos')}
                className={`py-3 px-3 border-b-2 whitespace-nowrap cursor-pointer transition-all ${
                  activeTab === 'productos' ? 'border-emerald-600 text-emerald-700 font-bold' : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                📦 Productos ({products.length})
              </button>
              <button
                onClick={() => setActiveTab('banner70')}
                className={`py-3 px-3 border-b-2 whitespace-nowrap cursor-pointer transition-all ${
                  activeTab === 'banner70' ? 'border-emerald-600 text-emerald-700 font-bold' : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                📁 Catálogos
              </button>
              <button
                onClick={() => setActiveTab('resumen')}
                className={`py-3 px-3 border-b-2 whitespace-nowrap cursor-pointer transition-all ${
                  activeTab === 'resumen' ? 'border-emerald-600 text-emerald-700 font-bold' : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                📊 Métricas
              </button>
              <button
                onClick={() => setActiveTab('pedidos')}
                className={`py-3 px-3 border-b-2 whitespace-nowrap cursor-pointer transition-all ${
                  activeTab === 'pedidos' ? 'border-emerald-600 text-emerald-700 font-bold' : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                🛍️ Pedidos ({orders.length})
              </button>
              <button
                onClick={() => setActiveTab('clientes')}
                className={`py-3 px-3 border-b-2 whitespace-nowrap cursor-pointer transition-all ${
                  activeTab === 'clientes' ? 'border-emerald-600 text-emerald-700 font-bold' : 'border-transparent text-slate-500 hover:text-slate-900'
                }`}
              >
                👥 Clientes ({registeredUsers.length})
              </button>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6 bg-white">

              {/* TAB: GESTIÓN DE CATÁLOGOS Y PRODUCTOS DESTACADOS */}
              {activeTab === 'banner70' && (
                <div className="space-y-6">
                  {/* Catalog Visibility & Create New Catalog */}
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                      <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
                        <Layers className="w-4 h-4 text-emerald-600" />
                        <span>Catálogos de la Tienda</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600">
                      Crea nuevos catálogos o gestiona las categorías visibles de la tienda:
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
                                ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                                : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900'
                            }`}
                          >
                            {isActive ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Plus className="w-3.5 h-3.5" />}
                            <span>{cat.name}</span>
                            <span className="text-[10px] opacity-70 font-mono tabular-nums">({count})</span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Quick create catalog */}
                    <form onSubmit={handleCreateQuickCatalog} className="flex items-center gap-2 pt-2 border-t border-slate-200">
                      <input
                        type="text"
                        placeholder="Crear nuevo catálogo (Ej. Bloques, Cemento, Celulares...)"
                        value={newCatalogName}
                        onChange={(e) => setNewCatalogName(e.target.value)}
                        className="flex-1 bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs text-slate-900 placeholder-slate-400 outline-none focus:border-emerald-600"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer shrink-0 transition-colors"
                      >
                        + Crear Catálogo
                      </button>
                    </form>
                  </div>

                  {/* Select Which Products Appear First */}
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-2">
                      <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
                        <Sparkles className="w-4 h-4 text-amber-500" />
                        <span>Elegir Productos Destacados (Aparecen Primero)</span>
                      </div>
                      <input
                        type="text"
                        placeholder="Buscar producto o catálogo..."
                        value={bannerFilterQuery}
                        onChange={(e) => setBannerFilterQuery(e.target.value)}
                        className="bg-white border border-slate-300 rounded-xl px-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 outline-none focus:border-emerald-600 sm:w-56"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-80 overflow-y-auto pr-1 text-xs">
                      {products
                        .filter(p => !bannerFilterQuery.trim() || p.name.toLowerCase().includes(bannerFilterQuery.toLowerCase()) || p.category.toLowerCase().includes(bannerFilterQuery.toLowerCase()))
                        .map(p => {
                          const isInBanner = Boolean(p.isFeaturedInBanner);
                          return (
                            <div key={p.id} className={`p-2.5 rounded-xl border flex items-center justify-between gap-2 transition-colors ${isInBanner ? 'bg-emerald-50 border-emerald-400' : 'bg-white border-slate-200'}`}>
                              <div className="flex items-center gap-2.5 overflow-hidden">
                                <img src={p.images[0]} alt={p.name} referrerPolicy="no-referrer" className="w-11 h-11 rounded-lg object-cover shrink-0 border border-slate-200" />
                                <div className="overflow-hidden">
                                  <div className="font-bold text-slate-900 truncate">{p.name}</div>
                                  <div className="text-[10px] text-slate-500 flex items-center gap-1.5">
                                    <span className="text-emerald-700 font-mono tabular-nums font-bold">{formatPrice(p.price, currency)}</span>
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
                                    ? 'bg-emerald-600 text-white'
                                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                                }`}
                              >
                                {isInBanner ? '⭐ Destacado' : '+ Destacar'}
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
                    <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl">
                      <div className="text-[11px] text-slate-500 uppercase font-semibold">Ventas Totales</div>
                      <div className="text-xl font-mono tabular-nums font-black text-emerald-700 mt-1">
                        {formatPrice(totalSales, currency)}
                      </div>
                      <div className="text-[10px] text-emerald-700 flex items-center gap-1 mt-1 font-bold">
                        <TrendingUp className="w-3 h-3" /> +18.4% este mes
                      </div>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl">
                      <div className="text-[11px] text-slate-500 uppercase font-semibold">Total Pedidos</div>
                      <div className="text-xl font-mono tabular-nums font-black text-slate-900 mt-1">
                        {orders.length + 84}
                      </div>
                      <div className="text-[10px] text-slate-500 mt-1">
                        {orders.length} pedidos en vivo
                      </div>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl">
                      <div className="text-[11px] text-slate-500 uppercase font-semibold">Clientes Registrados</div>
                      <div className="text-xl font-mono tabular-nums font-black text-cyan-700 mt-1">
                        {registeredUsers.length}
                      </div>
                      <div className="text-[10px] text-slate-500 mt-1">
                        Cuentas activas
                      </div>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl">
                      <div className="text-[11px] text-slate-500 uppercase font-semibold">Productos en Tienda</div>
                      <div className="text-xl font-mono tabular-nums font-black text-amber-700 mt-1">
                        {products.length}
                      </div>
                      <div className="text-[10px] text-slate-500 mt-1">
                        Inventario disponible
                      </div>
                    </div>
                  </div>

                  {/* Quick info note */}
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex items-center justify-between gap-3">
                    <div>
                      <div className="font-bold text-slate-900 text-xs">WhatsApp de Recepción de Pedidos:</div>
                      <div className="text-xs text-emerald-700 font-mono font-bold mt-0.5">+58 426 2139920</div>
                    </div>
                    <a
                      href="https://wa.me/584262139920"
                      target="_blank"
                      rel="noreferrer"
                      className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                    >
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>Abrir Mi WhatsApp</span>
                    </a>
                  </div>
                </div>
              )}

              {/* TAB 2: CATÁLOGO Y GESTOR DE ARCHIVOS DE MERCANCÍA */}
              {activeTab === 'productos' && (
                <div className="space-y-6">
                  {/* Form to Add New Product with FILE MANAGER */}
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 space-y-4">
                    <div className="flex items-center gap-2 font-bold text-sm text-slate-900 border-b border-slate-200 pb-2">
                      <Plus className="w-4 h-4 text-emerald-600" />
                      <span>Subir Nueva Mercancía al Catálogo (Gestor de Archivos)</span>
                    </div>

                    <form onSubmit={handleCreateProduct} className="space-y-3 text-xs">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-slate-700 font-semibold block mb-1">Nombre del Producto *</label>
                          <input 
                            type="text" 
                            required
                            placeholder="Ej. Zapatillas Urban Pro Retro"
                            value={newName}
                            onChange={(e) => setNewName(e.target.value)}
                            className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-slate-900 placeholder-slate-400 outline-none focus:border-emerald-600 transition-colors"
                          />
                        </div>
                        <div>
                          <label className="text-slate-700 font-semibold block mb-1">Subtítulo / Detalle</label>
                          <input 
                            type="text" 
                            placeholder="Ej. Edición especial 2026"
                            value={newSubtitle}
                            onChange={(e) => setNewSubtitle(e.target.value)}
                            className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-slate-900 placeholder-slate-400 outline-none focus:border-emerald-600 transition-colors"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div>
                          <label className="text-slate-700 font-semibold block mb-1">Catálogo / Categoría</label>
                          <select
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                            className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-slate-900 outline-none cursor-pointer"
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
                          <label className="text-slate-700 font-semibold block mb-1">Precio Venta ($ USD) *</label>
                          <input 
                            type="number" 
                            step="0.01"
                            required
                            value={newPrice}
                            onChange={(e) => setNewPrice(e.target.value)}
                            className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-slate-900 outline-none font-mono"
                          />
                        </div>
                        <div>
                          <label className="text-slate-700 font-semibold block mb-1">Precio Tachado ($ USD)</label>
                          <input 
                            type="number" 
                            step="0.01"
                            value={newOriginalPrice}
                            onChange={(e) => setNewOriginalPrice(e.target.value)}
                            className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-slate-900 outline-none font-mono"
                          />
                        </div>
                        <div>
                          <label className="text-slate-700 font-semibold block mb-1">Stock Disponible</label>
                          <input 
                            type="number" 
                            value={newStock}
                            onChange={(e) => setNewStock(e.target.value)}
                            className="w-full bg-white border border-slate-300 rounded-xl p-2.5 text-slate-900 outline-none font-mono"
                          />
                        </div>
                      </div>

                      {/* Custom Category input if chosen */}
                      {newCategory === 'custom' && (
                        <div className="p-3 rounded-xl bg-white border border-slate-200">
                          <label className="text-slate-700 block mb-1 text-[11px] font-bold">
                            Nombre del Nuevo Catálogo / Categoría:
                          </label>
                          <input 
                            type="text" 
                            placeholder="Ej. Materiales de Construcción, Ferretería, Bloques, etc."
                            value={customCategoryName}
                            onChange={(e) => setCustomCategoryName(e.target.value)}
                            className="w-full bg-slate-50 border border-emerald-500 rounded-xl p-2.5 text-slate-900 outline-none"
                          />
                        </div>
                      )}

                      {/* Featured Placement Checkbox */}
                      <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1">
                        <label className="flex items-center gap-2 cursor-pointer font-bold text-xs text-emerald-950">
                          <input 
                            type="checkbox" 
                            checked={showIn70Discount} 
                            onChange={(e) => setShowIn70Discount(e.target.checked)} 
                            className="w-4 h-4 accent-emerald-600 rounded cursor-pointer"
                          />
                          <span className="flex items-center gap-1.5">
                            <Sparkles className="w-4 h-4 text-emerald-600" />
                            <span>Destacar este producto al inicio de la tienda</span>
                          </span>
                        </label>
                        <p className="text-[11px] text-emerald-800 pl-6">
                          Al marcar esta casilla, el producto aparecerá entre los primeros lugares del catálogo principal.
                        </p>
                      </div>

                      {/* --- GESTOR DE ARCHIVOS DE IMÁGENES --- */}
                      <div className="space-y-2 pt-2 border-t border-slate-200">
                        <label className="text-slate-700 font-bold block">
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
                          className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-2xl p-4 text-center cursor-pointer transition-colors bg-white hover:bg-emerald-50/40 flex flex-col items-center justify-center gap-1.5"
                        >
                          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                            <Upload className="w-5 h-5" />
                          </div>
                          <div className="font-bold text-slate-900 text-xs">
                            {isUploadingFiles ? 'Cargando imágenes...' : 'Toca aquí para seleccionar fotos desde tu teléfono / computadora'}
                          </div>
                          <div className="text-[10px] text-slate-500">
                            Formatos soportados: JPG, PNG, WEBP (puedes subir varias fotos)
                          </div>
                        </div>

                        {/* Image Previews */}
                        {uploadedImages.length > 0 && (
                          <div className="space-y-1.5">
                            <div className="text-[11px] text-slate-600 font-bold">
                              Fotos seleccionadas ({uploadedImages.length}):
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {uploadedImages.map((img, idx) => (
                                <div key={idx} className="relative w-16 h-16 rounded-xl overflow-hidden border border-slate-300 group">
                                  <img src={img} alt="preview" className="w-full h-full object-cover" />
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveImage(idx)}
                                    className="absolute top-1 right-1 w-5 h-5 rounded-full bg-rose-600 text-white flex items-center justify-center text-xs opacity-90 hover:opacity-100 cursor-pointer"
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
                            className="flex-1 bg-white border border-slate-300 rounded-xl px-3 py-2 text-slate-900 placeholder-slate-400 outline-none text-[11px] font-mono"
                          />
                          <button
                            type="button"
                            onClick={handleAddExternalUrl}
                            className="px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs cursor-pointer transition-colors"
                          >
                            Agregar URL
                          </button>
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm cursor-pointer transition-all active:scale-95 flex items-center justify-center gap-1.5"
                      >
                        <Package className="w-4 h-4 stroke-[2.5]" />
                        <span>Publicar Mercancía en la Tienda</span>
                      </button>
                    </form>
                  </div>

                  {/* List of existing products */}
                  <div className="space-y-2">
                    <div className="font-bold text-xs text-slate-900">Catálogo Actual ({products.length} productos):</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {products.map((p) => {
                        const isInBanner = Boolean(p.isFeaturedInBanner);
                        return (
                          <div key={p.id} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2.5 overflow-hidden">
                              <img src={p.images[0]} alt={p.name} referrerPolicy="no-referrer" className="w-12 h-12 object-cover rounded-lg shrink-0 border border-slate-200 bg-white" />
                              <div className="overflow-hidden">
                                <div className="font-bold text-slate-900 truncate">{p.name}</div>
                                <div className="text-[11px] text-emerald-700 font-mono tabular-nums font-bold">{formatPrice(p.price, currency)}</div>
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
                                    ? 'bg-emerald-600 text-white'
                                    : 'bg-white border border-slate-200 hover:bg-slate-100 text-slate-700'
                                }`}
                                title="Destacar producto al principio de la tienda"
                              >
                                {isInBanner ? '⭐ Destacado' : '+ Destacar'}
                              </button>
                              <button
                                onClick={() => {
                                  if (confirm(`¿Eliminar ${p.name} del catálogo?`)) onDeleteProduct(p.id);
                                }}
                                className="w-7 h-7 rounded-lg bg-rose-50 hover:bg-rose-600 border border-rose-200 text-rose-600 hover:text-white flex items-center justify-center cursor-pointer transition-colors shrink-0"
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
                  <div className="font-bold text-xs text-slate-900">Pedidos Registrados ({orders.length}):</div>
                  {orders.length === 0 ? (
                    <div className="text-center py-10 bg-slate-50 border border-slate-200 rounded-2xl text-slate-500 text-xs">
                      No hay pedidos nuevos por el momento. Cuando un cliente complete su compra, aparecerá aquí.
                    </div>
                  ) : (
                    <div className="space-y-2 text-xs">
                      {orders.map((order) => (
                        <div key={order.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2">
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-slate-900">{order.id}</span>
                              <span className="text-[10px] text-slate-500">{order.createdAt}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <select
                                value={order.status}
                                onChange={(e) => onUpdateOrderStatus(order.id, e.target.value as Order['status'])}
                                className={`px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase outline-none cursor-pointer border ${
                                  order.status === 'entregado' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' :
                                  order.status === 'enviado' ? 'bg-blue-100 text-blue-800 border-blue-300' :
                                  order.status === 'procesando' ? 'bg-amber-100 text-amber-800 border-amber-300' :
                                  'bg-rose-100 text-rose-800 border-rose-300'
                                }`}
                              >
                                <option value="pendiente" className="bg-white text-slate-900">Pendiente</option>
                                <option value="procesando" className="bg-white text-slate-900">Procesando</option>
                                <option value="enviado" className="bg-white text-slate-900">Enviado</option>
                                <option value="entregado" className="bg-white text-slate-900">Entregado</option>
                              </select>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-700">
                            <div>
                              <span className="text-slate-500">Comprador: </span>
                              <strong className="text-slate-900">{order.customerName}</strong> ({order.customerPhone})
                            </div>
                            <div>
                              <span className="text-slate-500">Dirección: </span>
                              <span>{order.shippingAddress}, {order.city}</span>
                            </div>
                          </div>

                          <div className="pt-1 text-[11px] text-slate-600">
                            <span>Artículos: </span>
                            {order.items.map((it, i) => (
                              <span key={i} className="text-slate-900 font-medium">
                                {it.quantity}x {it.product.name} ({it.selectedColor || ''} {it.selectedSize || ''}){i < order.items.length - 1 ? ', ' : ''}
                              </span>
                            ))}
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-slate-200">
                            <span className="font-mono tabular-nums text-emerald-700 font-bold text-sm">
                              Total: {formatPrice(order.total, currency)} ({order.paymentMethod})
                            </span>
                            
                            {/* Direct WhatsApp link to client */}
                            <a
                              href={`https://wa.me/${order.customerPhone.replace(/[^0-9]/g, '')}?text=Hola%20${encodeURIComponent(order.customerName)},%20te%20escribo%20de%20ZetaMall%20sobre%20tu%20pedido%20%23${order.id}`}
                              target="_blank"
                              rel="noreferrer"
                              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
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
                    <div className="font-bold text-xs text-slate-900">
                      Lista de Clientes Registrados ({registeredUsers.length}):
                    </div>
                  </div>

                  {registeredUsers.length === 0 ? (
                    <div className="text-center py-10 bg-slate-50 border border-slate-200 rounded-2xl text-slate-500 text-xs">
                      No hay clientes registrados aún. En cuanto los clientes creen su cuenta, aparecerán aquí.
                    </div>
                  ) : (
                    <div className="space-y-2 text-xs">
                      {registeredUsers.map((user) => (
                        <div key={user.id} className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-900 text-sm">{user.name}</span>
                              <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${user.role === 'admin' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>
                                {user.role === 'admin' ? 'Super Admin' : 'Cliente'}
                              </span>
                            </div>
                            <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-600">
                              <span className="flex items-center gap-1">
                                <Mail className="w-3 h-3 text-slate-400" />
                                {user.email}
                              </span>
                              <span className="flex items-center gap-1">
                                <Phone className="w-3 h-3 text-slate-400" />
                                {user.phone}
                              </span>
                              {user.city && (
                                <span className="flex items-center gap-1">
                                  <MapPin className="w-3 h-3 text-slate-400" />
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
                              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer transition-colors"
                            >
                              <MessageCircle className="w-3.5 h-3.5" />
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
