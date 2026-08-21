import i18n from './i18n.js';
import { getNamespaceResource } from './resources.js';
import { startSpan } from '@enterprise/observability';
import type { SupportedLocale, TranslationNamespace } from './types.js';

const loadedNamespaces = new Set<string>();
const inflightLoads = new Map<string, Promise<void>>();

export async function loadNamespace(locale: SupportedLocale, ns: TranslationNamespace): Promise<void> {
  const cacheKey = `${locale}:${ns}`;
  if (loadedNamespaces.has(cacheKey) || i18n.hasResourceBundle(locale, ns)) {
    return;
  }

  if (inflightLoads.has(cacheKey)) {
    return inflightLoads.get(cacheKey)!;
  }

  const loadPromise = (async () => {
    const span = startSpan('i18n.load_namespace', { locale, namespace: ns });
    try {
      const data = getNamespaceResource(locale, ns);
      i18n.addResourceBundle(locale, ns, data, true, true);
      loadedNamespaces.add(cacheKey);
      span.end();
    } catch (err) {
      span.end();
      throw err;
    } finally {
      inflightLoads.delete(cacheKey);
    }
  })();

  inflightLoads.set(cacheKey, loadPromise);
  return loadPromise;
}

export async function loadNamespaces(locale: SupportedLocale, namespaces: TranslationNamespace[]): Promise<void> {
  await Promise.all(namespaces.map((ns) => loadNamespace(locale, ns)));
}
