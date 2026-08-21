import { normalizeLocale } from '../locale-normalization.js';

export function testLocaleNormalization() {
  console.log('Testing locale normalization...');

  if (normalizeLocale('vi') !== 'vi-VN') throw new Error('vi normalization failed');
  if (normalizeLocale('vi-VN') !== 'vi-VN') throw new Error('vi-VN normalization failed');
  if (normalizeLocale('vi_VN') !== 'vi-VN') throw new Error('vi_VN normalization failed');
  if (normalizeLocale('en') !== 'en-US') throw new Error('en normalization failed');
  if (normalizeLocale('en-US') !== 'en-US') throw new Error('en-US normalization failed');
  if (normalizeLocale('en_US') !== 'en-US') throw new Error('en_US normalization failed');
  if (normalizeLocale('en-GB') !== 'en-US') throw new Error('en-GB normalization failed');

  // Unsupported locales
  if (normalizeLocale('fr-FR') !== null) throw new Error('fr-FR should be null');
  if (normalizeLocale('de-DE') !== null) throw new Error('de-DE should be null');
  if (normalizeLocale('') !== null) throw new Error('empty should be null');
  if (normalizeLocale(null) !== null) throw new Error('null should be null');

  console.log('✅ localeNormalization tests passed.');
}

if (typeof process !== 'undefined' && process.argv[1]?.includes('locale-normalization.test')) {
  testLocaleNormalization();
}
