export type SupportedLocale = 'vi-VN' | 'en-US';
export type LocaleDirection = 'ltr' | 'rtl';

export type TranslationNamespace =
  | 'common'
  | 'navigation'
  | 'auth'
  | 'dashboard'
  | 'users'
  | 'settings'
  | 'forms'
  | 'validation'
  | 'data-grid'
  | 'feedback'
  | 'accessibility';

export interface LocaleDefinition {
  code: SupportedLocale;
  nativeName: string;
  englishName: string;
  direction: LocaleDirection;
  defaultCurrency: string;
  dateLocale: string;
  numberLocale: string;
}
