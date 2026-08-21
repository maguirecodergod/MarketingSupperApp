import fs from 'node:fs';
import path from 'node:path';

const rootDir = process.cwd();
const localesDir = path.join(rootDir, 'packages/localization/locales');
const targetDts = path.join(rootDir, 'packages/localization/src/translation-key-types.d.ts');

console.log('Generating type-safe translation key definitions...');

const enDir = path.join(localesDir, 'en-US');
const namespaces = fs
  .readdirSync(enDir)
  .filter((f) => f.endsWith('.json'))
  .map((f) => f.replace('.json', ''));

const imports = namespaces
  .map((ns) => {
    const varName = ns.replace(/-([a-z])/g, (_, l) => l.toUpperCase());
    return `import type ${varName} from '../locales/en-US/${ns}.json' with { type: 'json' };`;
  })
  .join('\n');

const resourceFields = namespaces
  .map((ns) => {
    const varName = ns.replace(/-([a-z])/g, (_, l) => l.toUpperCase());
    const keyStr = ns.includes('-') ? `'${ns}'` : ns;
    return `    ${keyStr}: typeof ${varName};`;
  })
  .join('\n');

const dtsContent = `/* Auto-generated translation key types. Do not edit directly. */
import 'i18next';
${imports}

export interface CustomTypeOptions {
  defaultNS: 'common';
  resources: {
${resourceFields}
  };
}

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common';
    resources: {
${resourceFields}
    };
  }
}
`;

fs.writeFileSync(targetDts, dtsContent, 'utf-8');
console.log('✅ Generated translation key types in packages/localization/src/translation-key-types.d.ts.');
