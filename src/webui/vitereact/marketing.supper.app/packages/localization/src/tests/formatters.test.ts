import {
  formatNumber,
  formatInteger,
  formatPercent,
  formatCurrency,
  formatDate,
  formatDateTime,
  formatRelativeTime,
} from '../formatters.js';

export function testFormatters() {
  console.log('Testing formatters...');

  // Number / Integer
  const formattedIntVi = formatInteger(12450, 'vi-VN');
  const formattedIntEn = formatInteger(12450, 'en-US');
  if (!formattedIntVi.includes('12') || !formattedIntEn.includes('12')) {
    throw new Error('formatInteger failed');
  }

  // Percent
  const percentVi = formatPercent(0.85, 'vi-VN');
  const percentEn = formatPercent(0.85, 'en-US');
  if (!percentVi.includes('85') || !percentEn.includes('85')) {
    throw new Error('formatPercent failed');
  }

  // Currency
  const currencyVi = formatCurrency(500000, 'vi-VN');
  const currencyEn = formatCurrency(500, 'en-US');
  if (!currencyVi.includes('500') || !currencyEn.includes('500')) {
    throw new Error('formatCurrency failed');
  }

  // Dates
  const testDate = new Date('2026-08-21T12:00:00Z');
  const dateVi = formatDate(testDate, 'vi-VN');
  const dateEn = formatDate(testDate, 'en-US');
  if (!dateVi || !dateEn) throw new Error('formatDate failed');

  // Relative Time
  const relVi = formatRelativeTime(-5, 'day', 'vi-VN');
  const relEn = formatRelativeTime(-5, 'day', 'en-US');
  if (!relVi || !relEn) throw new Error('formatRelativeTime failed');

  console.log('✅ formatters tests passed.');
}

if (typeof process !== 'undefined' && process.argv[1]?.includes('formatters.test')) {
  testFormatters();
}
