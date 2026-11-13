import { Product } from '../types/store';

export const INITIAL_PRODUCTS: Product[] = [
  // --- MODA & ROPA ---
  {
    id: 'prod_shein_1',
    name: 'Chaqueta Oversize Bomber Streetwear Reflective',
    subtitle: 'Edición Limitada Colección Invierno 2026',
    price: 38.50,
    originalPrice: 79.99,
    discountPct: 52,
    rating: 4.9,
    reviewCount: 3840,
    category: 'moda',
    images: [
      'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1520975954732-35dd22299614?auto=format&fit=crop&w=800&q=80'
    ],
    colors: ['Negro Asfalto', 'Verde Militar', 'Blanco Hielo'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    stock: 45,
    soldCount: 1240,
    isFlashDeal: true,
    isBestSeller: true,
    wholesaleTiers: [
      { minQty: 5, price: 32.00 },
      { minQty: 20, price: 26.50 },
      { minQty: 50, price: 21.00 }
    ],
    description: 'Chaqueta bomber moderna con forro térmico impermeable, cremalleras YKK y corte oversize de tendencia urbana. Ideal para looks casuales y nocturnos.',
    features: ['Tejido cortavientos e impermeable', 'Bolsillo táctico en manga izquierda', 'Bordado frontal minimalista de alta definición']
  },
  {
    id: 'prod_shein_2',
    name: 'Vestido Largo de Gala Satén Esmeralda',
    subtitle: 'Espalda Descubierta con Lazada Ajustable',
    price: 29.90,
    originalPrice: 65.00,
    discountPct: 54,
    rating: 4.8,
    reviewCount: 2190,
    category: 'moda',
    images: [
      'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=800&q=80'
    ],
    colors: ['Verde Esmeralda', 'Rojo Rubí', 'Negro Obsidiana', 'Azul Real'],
    sizes: ['XS', 'S', 'M', 'L'],
    stock: 62,
    soldCount: 940,
    isBestSeller: true,
    wholesaleTiers: [
      { minQty: 6, price: 24.00 },
      { minQty: 25, price: 19.50 }
    ],
    description: 'Vestido fluido confeccionado en satén sedoso de primera calidad. Escote drapeado con caída elegante y abertura lateral seductora.',
    features: ['Satén no transparente con doble forro', 'Lazos ajustables en hombros', 'Caída fluida de fiesta']
  },
  {
    id: 'prod_shein_3',
    name: 'Conjunto Deportivo Seamless Gym Pro de 2 Piezas',
    subtitle: 'Top Push-Up + Leggings Efecto Moldeador',
    price: 22.00,
    originalPrice: 48.00,
    discountPct: 54,
    rating: 4.9,
    reviewCount: 4520,
    category: 'moda',
    images: [
      'https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80'
    ],
    colors: ['Gris Ceniza', 'Rosa Palo', 'Azul Petróleo', 'Negro Carbón'],
    sizes: ['S', 'M', 'L'],
    stock: 80,
    soldCount: 2150,
    isFlashDeal: true,
    wholesaleTiers: [
      { minQty: 10, price: 16.50 },
      { minQty: 50, price: 12.80 }
    ],
    description: 'Conjunto ultraelástico sin costuras que no se transparenta al agacharse (Squat-proof). Moldea la figura y mantiene la frescura gracias a su tejido transpirable.',
    features: ['Cintura de alta compresión', 'Tejido elástico en 4 direcciones', 'Cero transparencias garantizadas']
  },

  // --- TECNOLOGÍA & GADGETS ---
  {
    id: 'prod_amazon_1',
    name: 'Smartwatch Ultra Pro 49mm Titanium Edition',
    subtitle: 'Pantalla AMOLED 2.1", GPS, ECG, Llamadas Bluetooth y Resistencia al Agua',
    price: 49.99,
    originalPrice: 120.00,
    discountPct: 58,
    rating: 4.9,
    reviewCount: 5630,
    category: 'tecnologia',
    images: [
      'https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&w=800&q=80'
    ],
    colors: ['Titanio Naranja', 'Titanio Negro', 'Titanio Plateado'],
    sizes: ['Caja 49mm Universal'],
    stock: 35,
    soldCount: 3100,
    isFlashDeal: true,
    isBestSeller: true,
    wholesaleTiers: [
      { minQty: 5, price: 42.00 },
      { minQty: 20, price: 36.00 },
      { minQty: 100, price: 29.50 }
    ],
    description: 'Reloj inteligente de gama premium con carcasa de aleación de titanio resistente a caídas y golpes. Batería de hasta 7 días continuos y monitoreo integral de salud.',
    features: ['Monitor cardíaco 24/7 y oxígeno SpO2', 'Altavoz HD para contestar llamadas', 'Compatible con iPhone y Android']
  },
  {
    id: 'prod_amazon_2',
    name: 'Auriculares Inalámbricos Pro Noise Cancelling ANC',
    subtitle: 'Audio Espacial 360°, Cancelación Activa de Ruido 42dB',
    price: 34.00,
    originalPrice: 85.00,
    discountPct: 60,
    rating: 4.8,
    reviewCount: 4120,
    category: 'tecnologia',
    images: [
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1608156639585-b3a032ef9689?auto=format&fit=crop&w=800&q=80'
    ],
    colors: ['Blanco Mate', 'Negro Midnight', 'Oro Champagne'],
    stock: 50,
    soldCount: 1890,
    isBestSeller: true,
    wholesaleTiers: [
      { minQty: 10, price: 27.00 },
      { minQty: 50, price: 21.50 }
    ],
    description: 'Disfruta de sonido Hi-Fi con drivers de titanio de 13mm. Conexión instantánea Bluetooth 5.4 con estuche de carga USB-C e inalámbrica Qi.',
    features: ['36 horas de autonomía con estuche', 'Modo transparencia ambiental', 'Micrófonos cuádruples con IA para llamadas cristalinas']
  },
  {
    id: 'prod_amazon_3',
    name: 'Mini Proyector Portátil Láser 4K Smart Cinema',
    subtitle: 'Android 12 Integrado, WiFi 6, Netflix & YouTube',
    price: 68.00,
    originalPrice: 150.00,
    discountPct: 55,
    rating: 4.7,
    reviewCount: 1420,
    category: 'tecnologia',
    images: [
      'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1535016120720-40c646be5580?auto=format&fit=crop&w=800&q=80'
    ],
    colors: ['Blanco Polar', 'Gris Espacial'],
    stock: 22,
    soldCount: 680,
    isNew: true,
    wholesaleTiers: [
      { minQty: 5, price: 58.00 },
      { minQty: 25, price: 49.00 }
    ],
    description: 'Transforma tu habitación en una sala de cine de hasta 150 pulgadas. Autoenfoque digital, corrección trapezoidal automática y altavoz estéreo envolvente.',
    features: ['Rotación 180° para proyectar en pared o techo', 'Apps directas sin conectar laptop', 'Brillo de 8500 lúmenes']
  },

  // --- CALZADO & ZAPATILLAS ---
  {
    id: 'prod_calzado_1',
    name: 'Sneakers Retro Air Runner Urban Limited',
    subtitle: 'Suela Amortiguada con Cámara de Aire y Gamuza',
    price: 45.00,
    originalPrice: 95.00,
    discountPct: 53,
    rating: 4.9,
    reviewCount: 2980,
    category: 'calzado',
    images: [
      'https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?auto=format&fit=crop&w=800&q=80'
    ],
    colors: ['Vintage Panda (Blanco/Negro)', 'Beige & Terracota', 'Gris Reflective'],
    sizes: ['38', '39', '40', '41', '42', '43', '44', '45'],
    stock: 40,
    soldCount: 1530,
    isFlashDeal: true,
    wholesaleTiers: [
      { minQty: 6, price: 37.00 },
      { minQty: 24, price: 31.00 },
      { minQty: 60, price: 25.00 }
    ],
    description: 'Zapatillas urbanas de corte retro vintage combinadas con materiales premium de cuero sintético y gamuza suave. Plantilla ergonómica Memory Foam.',
    features: ['Cámara de aire anti-impacto', 'Suela de goma antideslizante con alto agarre', 'Plantilla acolchada lavable']
  },
  {
    id: 'prod_calzado_2',
    name: 'Mocasines Italianos de Cuero Genuino Oxford',
    subtitle: 'Acabado Artesanal con Detalle Metálico Dorado',
    price: 52.00,
    originalPrice: 110.00,
    discountPct: 53,
    rating: 4.8,
    reviewCount: 960,
    category: 'calzado',
    images: [
      'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1533867617858-e7b97e060509?auto=format&fit=crop&w=800&q=80'
    ],
    colors: ['Marrón Café Cuero', 'Negro Brillante', 'Azul Marino'],
    sizes: ['39', '40', '41', '42', '43', '44'],
    stock: 28,
    soldCount: 420,
    isBestSeller: false,
    wholesaleTiers: [
      { minQty: 4, price: 44.00 },
      { minQty: 15, price: 38.00 }
    ],
    description: 'Elegancia pura para eventos formales y oficina ejecutiva. Cuero flexible cosido a mano con forro antitranspirante y plantilla ortopédica suave.',
    features: ['Costuras reforzadas a mano', 'Herraje de acero inoxidable bañado en oro', 'Suela flexible de larga duración']
  },

  // --- JOYERÍA & RELOJES DE LUJO ---
  {
    id: 'prod_joyeria_1',
    name: 'Reloj Cronógrafo de Lujo Royal Chrono Bañado en Oro 18K',
    subtitle: 'Cristal de Zafiro Antirrayaduras y Maquinaria Japonesa',
    price: 65.00,
    originalPrice: 160.00,
    discountPct: 59,
    rating: 4.95,
    reviewCount: 1870,
    category: 'joyeria',
    images: [
      'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=80'
    ],
    colors: ['Oro 18K con Esfera Verde', 'Oro Rosa con Esfera Negra', 'Plata Diamante'],
    stock: 18,
    soldCount: 890,
    isBestSeller: true,
    wholesaleTiers: [
      { minQty: 3, price: 54.00 },
      { minQty: 12, price: 45.00 }
    ],
    description: 'Imponente reloj cronógrafo de precisión con triple subesfera funcional y fecha automática. Sumergible hasta 50 metros y con garantía de 2 años.',
    features: ['Bañado electrolítico de 5 capas en oro 18K', 'Manecillas luminosas nocturnas', 'Incluye estuche de madera y herramienta de ajuste']
  },
  {
    id: 'prod_joyeria_2',
    name: 'Collar Cadena Cubana Miami Iced Out con Circonias 5A',
    subtitle: 'Grosor 14mm, Acero de Titanio Quirúrgico Hipoalergénico',
    price: 28.00,
    originalPrice: 60.00,
    discountPct: 53,
    rating: 4.85,
    reviewCount: 3120,
    category: 'joyeria',
    images: [
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80'
    ],
    colors: ['Oro Amarillo', 'Plata Glaseada'],
    sizes: ['50 cm (20")', '55 cm (22")', '60 cm (24")'],
    stock: 75,
    soldCount: 1650,
    isFlashDeal: true,
    wholesaleTiers: [
      { minQty: 10, price: 21.00 },
      { minQty: 50, price: 16.00 }
    ],
    description: 'Cadena de eslabón cubano engastada artesanalmente con micro-circonias cúbicas de grado 5A que reflejan la luz como diamantes reales.',
    features: ['Cierre doble de seguridad', 'No se despinta ni oxida con el agua', 'Acabado hipoalergénico que no irrita la piel']
  },

  // --- HOGAR & COCINA ---
  {
    id: 'prod_hogar_1',
    name: 'Freidora de Aire Digital Dual Vortex 8 Litros',
    subtitle: '10 Programas Inteligentes, Ventana de Cristal y Cocción 360°',
    price: 79.99,
    originalPrice: 165.00,
    discountPct: 51,
    rating: 4.9,
    reviewCount: 6240,
    category: 'hogar',
    images: [
      'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=800&q=80'
    ],
    colors: ['Negro Mate con Cobre', 'Blanco Minimalista'],
    stock: 25,
    soldCount: 2840,
    isBestSeller: true,
    wholesaleTiers: [
      { minQty: 4, price: 68.00 },
      { minQty: 12, price: 59.00 }
    ],
    description: 'Cocina con hasta un 90% menos de grasa conservando el toque crujiente. Panel táctil LED con recetas preestablecidas y cesta antiadherente apta para lavavajillas.',
    features: ['Capacidad familiar de 8L', 'Tecnología de circulación de aire a 200°C', 'Ahorro del 65% de energía frente al horno']
  },

  // --- BELLEZA & CUIDADO PERSONAL ---
  {
    id: 'prod_belleza_1',
    name: 'Kit Completo de Maquillaje Profesional 48 Tonos + Brochas',
    subtitle: 'Paleta Sombras Pigmentadas, Iluminador, Contorno y Labiales',
    price: 32.50,
    originalPrice: 75.00,
    discountPct: 57,
    rating: 4.9,
    reviewCount: 3890,
    category: 'belleza',
    images: [
      'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80'
    ],
    colors: ['Edición Glamour Nude & Berry', 'Edición Sunset Gold'],
    stock: 55,
    soldCount: 1980,
    isBestSeller: true,
    wholesaleTiers: [
      { minQty: 6, price: 25.00 },
      { minQty: 24, price: 19.50 }
    ],
    description: 'Fórmula cremosa ultra pigmentada de larga duración que dura 24 horas sin desvanecerse. Incluye estuche organizador magnético de viaje.',
    features: ['100% Cruelty Free y vegano', 'Brochas sintéticas ultrasuaves profesionales', 'A prueba de agua y sudor']
  },
  // --- MATERIALES & CONSTRUCCIÓN ---
  {
    id: 'prod_mat_bloques_1',
    name: 'Bloques de Cemento Gris Pesado 15cm (Paleta / Camión)',
    subtitle: 'Material Estructural de Alta Resistencia para Obras y Construcción',
    price: 29.99,
    originalPrice: 99.99,
    discountPct: 70,
    rating: 5.0,
    reviewCount: 420,
    category: 'materiales',
    images: [
      'https://images.unsplash.com/photo-1590069261209-f8e9b8642343?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1541888946425-d0fbb186156a?auto=format&fit=crop&w=800&q=80'
    ],
    colors: ['Cemento Gris Natural', 'Estándar 15cm'],
    stock: 50,
    soldCount: 310,
    isFlashDeal: true,
    isBestSeller: true,
    isFeaturedInBanner: true,
    isNew: true,
    wholesaleTiers: [
      { minQty: 10, price: 24.50 },
      { minQty: 50, price: 19.99 }
    ],
    description: 'Bloques de cemento gris vibrocomprimido de máxima durabilidad y resistencia a la compresión. Despacho directo en camión de plataforma a pie de obra en toda la región.',
    features: [
      'Resistencia certificada para paredes y muros de carga',
      'Despacho directo y logística coordinada por WhatsApp',
      'Precio especial por paleta y viaje completo de camión'
    ]
  }
];

export const STORE_CATEGORIES = [
  { id: 'all', name: 'Todo', icon: 'Flame' },
  { id: 'moda', name: 'Ropa', icon: 'Shirt' },
  { id: 'tecnologia', name: 'Tecnología', icon: 'Laptop' },
  { id: 'materiales', name: 'Materiales & Construcción', icon: 'Building' },
  { id: 'calzado', name: 'Calzado', icon: 'Footprints' },
  { id: 'ferreteria', name: 'Ferretería & Herramientas', icon: 'Wrench' },
  { id: 'joyeria', name: 'Relojes & Joyas', icon: 'Watch' },
  { id: 'hogar', name: 'Hogar', icon: 'Home' },
  { id: 'belleza', name: 'Belleza', icon: 'Sparkles' },
  { id: 'vehiculos', name: 'Repuestos & Vehículos', icon: 'Car' },
  { id: 'alimentos', name: 'Víveres & Alimentos', icon: 'Package' }
];

export const STORE_COUPONS = [
  { code: 'ZETA10', discountPct: 10, description: '10% de descuento en tu compra' },
  { code: 'ZETASHOP20', discountPct: 20, description: '20% en pedidos mayores a $50' },
  { code: 'MAYORISTA30', discountPct: 30, description: '30% en pedidos al mayor' }
];

