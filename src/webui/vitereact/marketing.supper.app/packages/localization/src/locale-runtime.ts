import { useCallback } from 'react';
import { usePreferencesStore } from '@enterprise/state';
import i18n from './i18n.js';
import { localeStorage } from './locale-storage.js';
import { updateDocumentLocale } from './document-locale.js';
import { getLocaleDirection } from './direction.js';
import { loadNamespaces } from './namespace-loader.js';
import { SHELL_NAMESPACES } from './constants.js';
import { startSpan } from '@enterprise/observability';
import type { SupportedLocale, LocaleDirection } from './types.js';

export function getLocale(): SupportedLocale {
  return (i18n.language as SupportedLocale) || 'vi-VN';
}

export function getDirection(locale: SupportedLocale = getLocale()): LocaleDirection {
  return getLocaleDirection(locale);
}

export async function changeLocale(locale: SupportedLocale): Promise<void> {
  const previousLocale = getLocale();
  if (previousLocale === locale && i18n.isInitialized) {
    return;
  }

  const span = startSpan('locale_changed', {
    previous_locale: previousLocale,
    next_locale: locale,
  });

  try {
    // 1. Preload shell namespaces for target locale
    await loadNamespaces(locale, [...SHELL_NAMESPACES]);

    // 2. Change active i18next language
    await i18n.changeLanguage(locale);

    // 3. Persist user preference
    localeStorage.setPreference(locale);
    usePreferencesStore.getState().setLocale(locale);

    // 4. Synchronize document lang & dir attributes
    updateDocumentLocale(locale);
  } finally {
    span.end();
  }
}

export async function preloadLocale(locale: SupportedLocale): Promise<void> {
  await loadNamespaces(locale, [...SHELL_NAMESPACES]);
}

export function useLocale() {
  const storeLocale = usePreferencesStore((s) => s.locale);
  const setStoreLocale = usePreferencesStore((s) => s.setLocale);

  const setLocale = useCallback(
    async (nextLocale: SupportedLocale) => {
      await changeLocale(nextLocale);
      setStoreLocale(nextLocale);
    },
    [setStoreLocale]
  );

  return {
    locale: storeLocale,
    direction: getLocaleDirection(storeLocale),
    setLocale,
    isVietnamese: storeLocale === 'vi-VN',
    isEnglish: storeLocale === 'en-US',
  };
}
