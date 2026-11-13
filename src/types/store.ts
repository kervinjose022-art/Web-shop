export interface Product {
  id: string;
  name: string;
  subtitle: string;
  price: number;
  originalPrice: number;
  discountPct: number;
  rating: number;
  reviewCount: number;
  category: string;
  images: string[];
  colors: string[];
  sizes?: string[];
  stock: number;
  soldCount: number;
  isFlashDeal?: boolean;
  isBestSeller?: boolean;
  isNew?: boolean;
  isFeaturedInBanner?: boolean;
  wholesaleTiers?: { minQty: number; price: number }[];
  description: string;
  features: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

export interface Order {
  id: string;
  createdAt: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  shippingAddress: string;
  city: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shippingCost: number;
  total: number;
  paymentMethod: 'whatsapp' | 'card' | 'pagomovil' | 'paypal' | 'usdt';
  status: 'pendiente' | 'procesando' | 'enviado' | 'entregado';
}

export type Currency = 'USD' | 'EUR' | 'BS' | 'COP' | 'MXN';

export interface Coupon {
  code: string;
  discountPct: number;
  description: string;
}

export interface CustomerUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  password?: string;
  address?: string;
  city?: string;
  registeredAt: string;
  role: 'customer' | 'admin';
}

export interface StoreCategory {
  id: string;
  name: string;
  icon?: string;
}

export interface BannerConfig {
  badgeText: string;
  discountText: string;
  subtitleText: string;
  featuredCategoryId: string;
  visibleCatalogIds: string[];
}


