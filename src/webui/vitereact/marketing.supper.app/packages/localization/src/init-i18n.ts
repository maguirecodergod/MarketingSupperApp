import { initReactI18next } from 'react-i18next';
import i18n from './i18n.js';
import { DEFAULT_LOCALE, FALLBACK_LOCALE, DEFAULT_NAMESPACE, SHELL_NAMESPACES } from './constants.js';
import { staticResources } from './resources.js';
import { updateDocumentLocale } from './document-locale.js';
import type { SupportedLocale } from './types.js';

let isInitialized = false;

export async function initI18n(initialLocale: SupportedLocale = DEFAULT_LOCALE): Promise<typeof i18n> {
  if (isInitialized) {
    if (i18n.language !== initialLocale) {
      await i18n.changeLanguage(initialLocale);
      updateDocumentLocale(initialLocale);
    }
    return i18n;
  }

  // Pre-bundle shell resources for instant startup
  const initialResources: Record<string, any> = {
    'vi-VN': {
      common: staticResources['vi-VN'].common,
      navigation: staticResources['vi-VN'].navigation,
      feedback: staticResources['vi-VN'].feedback,
    },
    'en-US': {
      common: staticResources['en-US'].common,
      navigation: staticResources['en-US'].navigation,
      feedback: staticResources['en-US'].feedback,
    },
  };

  await i18n.use(initReactI18next).init({
    lng: initialLocale,
    fallbackLng: FALLBACK_LOCALE,
    defaultNS: DEFAULT_NAMESPACE,
    fallbackNS: DEFAULT_NAMESPACE,
    ns: [...SHELL_NAMESPACES],
    resources: initialResources,
    interpolation: {
      escapeValue: false, // React already escapes values safely
    },
    react: {
      useSuspense: false,
    },
    returnNull: false,
    returnEmptyString: false,
  });

  updateDocumentLocale(initialLocale);
  isInitialized = true;
  return i18n;
}
