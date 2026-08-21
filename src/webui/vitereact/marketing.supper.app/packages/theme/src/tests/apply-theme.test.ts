import { applyTheme } from '../apply-theme.js';
import { THEME_DATA_ATTRIBUTE } from '../constants.js';

export function testApplyTheme() {
  console.log('Testing applyTheme...');

  const classListSet = new Set<string>(['existing-class']);
  const attributes: Record<string, string> = {};
  const styleObj: Record<string, string> = {};

  (globalThis as any).document = {
    documentElement: {
      classList: {
        add: (c: string) => classListSet.add(c),
        remove: (c: string) => classListSet.delete(c),
        contains: (c: string) => classListSet.has(c),
      },
      setAttribute: (k: string, v: string) => { attributes[k] = v; },
      style: styleObj,
    },
  };

  // Apply dark
  applyTheme('dark');
  if (!classListSet.has('dark') || classListSet.has('light')) throw new Error('applyTheme dark failed class check');
  if (attributes[THEME_DATA_ATTRIBUTE] !== 'dark') throw new Error('applyTheme dark failed data-theme check');
  if (styleObj.colorScheme !== 'dark') throw new Error('applyTheme dark failed colorScheme check');
  if (!classListSet.has('existing-class')) throw new Error('applyTheme destroyed existing class');

  // Apply light
  applyTheme('light');
  if (!classListSet.has('light') || classListSet.has('dark')) throw new Error('applyTheme light failed class check');
  if (attributes[THEME_DATA_ATTRIBUTE] !== 'light') throw new Error('applyTheme light failed data-theme check');
  if (styleObj.colorScheme !== 'light') throw new Error('applyTheme light failed colorScheme check');

  console.log('✅ applyTheme tests passed.');
}

if (typeof process !== 'undefined' && process.argv[1]?.includes('apply-theme.test')) {
  testApplyTheme();
}
