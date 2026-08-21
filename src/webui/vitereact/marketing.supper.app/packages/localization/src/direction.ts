import type { SupportedLocale, LocaleDirection } from './types.js';
import { getLocaleDefinition } from './locale-registry.js';

export function getLocaleDirection(locale: SupportedLocale): LocaleDirection {
  return getLocaleDefinition(locale).direction;
}
