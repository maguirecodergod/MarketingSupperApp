import type { SupportedLocale, LocaleDefinition } from './types.js';

export const LOCALE_REGISTRY: Record<SupportedLocale, LocaleDefinition> = {
  'vi-VN': {
    code: 'vi-VN',
    nativeName: 'Tiếng Việt',
    englishName: 'Vietnamese',
    direction: 'ltr',
    defaultCurrency: 'VND',
    dateLocale: 'vi-VN',
    numberLocale: 'vi-VN',
  },
  'en-US': {
    code: 'en-US',
    nativeName: 'English (US)',
    englishName: 'English (US)',
    direction: 'ltr',
    defaultCurrency: 'USD',
    dateLocale: 'en-US',
    numberLocale: 'en-US',
  },
};

export function getLocaleDefinition(locale: SupportedLocale): LocaleDefinition {
  return LOCALE_REGISTRY[locale] || LOCALE_REGISTRY['vi-VN'];
}
