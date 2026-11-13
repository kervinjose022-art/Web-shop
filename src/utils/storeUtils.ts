import { Currency } from '../types/store';

export const CURRENCY_RATES: Record<Currency, { symbol: string; rate: number; prefix: boolean }> = {
  USD: { symbol: '$', rate: 1.0, prefix: true },
  EUR: { symbol: '€', rate: 0.92, prefix: false },
  BS: { symbol: 'Bs. ', rate: 65.0, prefix: true },
  COP: { symbol: 'COP $', rate: 4150, prefix: true },
  MXN: { symbol: 'MXN $', rate: 18.4, prefix: true }
};

export function formatPrice(amountUsd: number, currency: Currency = 'USD'): string {
  const c = CURRENCY_RATES[currency] || CURRENCY_RATES.USD;
  const converted = amountUsd * c.rate;

  let formatted = '';
  if (currency === 'COP') {
    formatted = Math.round(converted).toLocaleString('es-CO');
  } else if (currency === 'BS') {
    formatted = converted.toLocaleString('es-VE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  } else {
    formatted = converted.toFixed(2);
  }

  return c.prefix ? `${c.symbol}${formatted}` : `${formatted} ${c.symbol}`;
}

export function calculateWholesalePrice(basePrice: number, quantity: number, tiers?: { minQty: number; price: number }[]): number {
  if (!tiers || tiers.length === 0) return basePrice;
  // Sort descending by minQty
  const sorted = [...tiers].sort((a, b) => b.minQty - a.minQty);
  for (const t of sorted) {
    if (quantity >= t.minQty) {
      return t.price;
    }
  }
  return basePrice;
}
