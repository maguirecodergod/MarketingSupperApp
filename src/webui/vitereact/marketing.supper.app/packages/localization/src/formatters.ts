import type { SupportedLocale } from './types.js';
import { getLocaleDefinition } from './locale-registry.js';

export function formatNumber(
  value: number,
  locale: SupportedLocale = 'vi-VN',
  options?: Intl.NumberFormatOptions
): string {
  try {
    return new Intl.NumberFormat(locale, options).format(value);
  } catch {
    return String(value);
  }
}

export function formatInteger(value: number, locale: SupportedLocale = 'vi-VN'): string {
  return formatNumber(value, locale, { maximumFractionDigits: 0 });
}

export function formatDecimal(
  value: number,
  locale: SupportedLocale = 'vi-VN',
  options?: { minFraction?: number; maxFraction?: number }
): string {
  return formatNumber(value, locale, {
    minimumFractionDigits: options?.minFraction ?? 0,
    maximumFractionDigits: options?.maxFraction ?? 2,
  });
}

export function formatPercent(
  value: number,
  locale: SupportedLocale = 'vi-VN',
  options?: { minFraction?: number; maxFraction?: number }
): string {
  return formatNumber(value, locale, {
    style: 'percent',
    minimumFractionDigits: options?.minFraction ?? 0,
    maximumFractionDigits: options?.maxFraction ?? 1,
  });
}

export function formatCurrency(
  value: number,
  locale: SupportedLocale = 'vi-VN',
  currencyOverride?: string
): string {
  const currency = currencyOverride || getLocaleDefinition(locale).defaultCurrency;
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
    }).format(value);
  } catch {
    return `${value} ${currency}`;
  }
}

export function formatDate(
  value: Date | string | number,
  locale: SupportedLocale = 'vi-VN',
  options?: Intl.DateTimeFormatOptions
): string {
  try {
    const d = typeof value === 'string' || typeof value === 'number' ? new Date(value) : value;
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      ...options,
    }).format(d);
  } catch {
    return String(value);
  }
}

export function formatDateTime(
  value: Date | string | number,
  locale: SupportedLocale = 'vi-VN',
  options?: Intl.DateTimeFormatOptions
): string {
  try {
    const d = typeof value === 'string' || typeof value === 'number' ? new Date(value) : value;
    return new Intl.DateTimeFormat(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      ...options,
    }).format(d);
  } catch {
    return String(value);
  }
}

export function formatTime(
  value: Date | string | number,
  locale: SupportedLocale = 'vi-VN',
  options?: Intl.DateTimeFormatOptions
): string {
  try {
    const d = typeof value === 'string' || typeof value === 'number' ? new Date(value) : value;
    return new Intl.DateTimeFormat(locale, {
      hour: '2-digit',
      minute: '2-digit',
      ...options,
    }).format(d);
  } catch {
    return String(value);
  }
}

export function formatRelativeTime(
  value: number,
  unit: Intl.RelativeTimeFormatUnit,
  locale: SupportedLocale = 'vi-VN'
): string {
  try {
    if (typeof Intl !== 'undefined' && typeof Intl.RelativeTimeFormat === 'function') {
      return new Intl.RelativeTimeFormat(locale, { numeric: 'auto' }).format(value, unit);
    }
    return `${value} ${unit}`;
  } catch {
    return `${value} ${unit}`;
  }
}

export function formatList(
  values: string[],
  locale: SupportedLocale = 'vi-VN',
  options?: Intl.ListFormatOptions
): string {
  try {
    if (typeof Intl !== 'undefined' && typeof (Intl as any).ListFormat === 'function') {
      return new (Intl as any).ListFormat(locale, options).format(values);
    }
    return values.join(', ');
  } catch {
    return values.join(', ');
  }
}
