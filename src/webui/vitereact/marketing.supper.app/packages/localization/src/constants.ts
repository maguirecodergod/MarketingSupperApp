import type { SupportedLocale, TranslationNamespace } from './types.js';

export const LOCALE_STORAGE_KEY = 'enterprise_locale_preference';
export const DEFAULT_LOCALE: SupportedLocale = 'vi-VN';
export const FALLBACK_LOCALE: SupportedLocale = 'en-US';
export const SUPPORTED_LOCALES: readonly SupportedLocale[] = ['vi-VN', 'en-US'] as const;

export const DEFAULT_NAMESPACE: TranslationNamespace = 'common';
export const SHELL_NAMESPACES: readonly TranslationNamespace[] = ['common', 'navigation', 'feedback'] as const;

export const ALL_NAMESPACES: readonly TranslationNamespace[] = [
  'common',
  'navigation',
  'auth',
  'dashboard',
  'users',
  'settings',
  'forms',
  'validation',
  'data-grid',
  'feedback',
  'accessibility',
] as const;
