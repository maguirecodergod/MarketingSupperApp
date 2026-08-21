import { initI18n } from '../init-i18n.js';
import { changeLocale, getLocale } from '../locale-runtime.js';

export async function testLocaleRuntime() {
  console.log('Testing locale runtime...');

  // Mock DOM
  (globalThis as any).document = {
    documentElement: {
      lang: 'vi-VN',
      dir: 'ltr',
      setAttribute: () => {},
    },
  };

  // 1. Initialize
  await initI18n('vi-VN');
  if (getLocale() !== 'vi-VN') throw new Error('Expected vi-VN initial locale');

  // 2. Change locale
  await changeLocale('en-US');
  if (getLocale() !== 'en-US') throw new Error('Expected en-US after change');

  console.log('✅ localeRuntime tests passed.');
}

if (typeof process !== 'undefined' && process.argv[1]?.includes('locale-runtime.test')) {
  testLocaleRuntime();
}
