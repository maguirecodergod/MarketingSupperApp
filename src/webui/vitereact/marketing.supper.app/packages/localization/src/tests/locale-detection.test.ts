import { detectLocale } from '../locale-detection.js';
import { localeStorage } from '../locale-storage.js';

export function testLocaleDetection() {
  console.log('Testing locale detection...');

  const store: Record<string, string> = {};
  (globalThis as any).window = {
    localStorage: {
      getItem: (k: string) => store[k] ?? null,
      setItem: (k: string, v: string) => { store[k] = v; },
      removeItem: (k: string) => { delete store[k]; },
    },
  };

  (globalThis as any).navigator = {
    languages: ['fr-FR', 'en-US'],
    language: 'fr-FR',
  };

  // Case 1: Browser language matches en-US
  localeStorage.clearPreference();
  if (detectLocale() !== 'en-US') throw new Error('Expected browser detection en-US');

  // Case 2: Persisted vi-VN overrides browser language
  localeStorage.setPreference('vi-VN');
  if (detectLocale() !== 'vi-VN') throw new Error('Expected persisted vi-VN');

  // Case 3: Fallback when browser has unsupported language
  localeStorage.clearPreference();
  (globalThis as any).navigator.languages = ['de-DE', 'ja-JP'];
  if (detectLocale() !== 'vi-VN') throw new Error('Expected default fallback vi-VN');

  console.log('✅ localeDetection tests passed.');
}

if (typeof process !== 'undefined' && process.argv[1]?.includes('locale-detection.test')) {
  testLocaleDetection();
}
