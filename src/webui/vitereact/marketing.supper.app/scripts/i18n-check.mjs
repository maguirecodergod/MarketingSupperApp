import fs from 'node:fs';
import path from 'node:path';

const rootDir = process.cwd();
const localesDir = path.join(rootDir, 'packages/localization/locales');
const supportedLocales = ['vi-VN', 'en-US'];

console.log('Validating localization resource symmetry and integrity...');

const viDir = path.join(localesDir, 'vi-VN');
const enDir = path.join(localesDir, 'en-US');

const viFiles = fs.readdirSync(viDir).filter((f) => f.endsWith('.json'));
const enFiles = fs.readdirSync(enDir).filter((f) => f.endsWith('.json'));

let hasError = false;

// 1. Check namespace symmetry
const missingInEn = viFiles.filter((f) => !enFiles.includes(f));
const missingInVi = enFiles.filter((f) => !viFiles.includes(f));

if (missingInEn.length > 0) {
  console.error(`❌ Namespaces missing in en-US: ${missingInEn.join(', ')}`);
  hasError = true;
}
if (missingInVi.length > 0) {
  console.error(`❌ Namespaces missing in vi-VN: ${missingInVi.join(', ')}`);
  hasError = true;
}

// 2. Check key symmetry in each namespace
for (const file of viFiles) {
  if (!enFiles.includes(file)) continue;

  const viPath = path.join(viDir, file);
  const enPath = path.join(enDir, file);

  let viJson, enJson;
  try {
    viJson = JSON.parse(fs.readFileSync(viPath, 'utf-8'));
    enJson = JSON.parse(fs.readFileSync(enPath, 'utf-8'));
  } catch (err) {
    console.error(`❌ JSON parse error in ${file}:`, err.message);
    hasError = true;
    continue;
  }

  const viKeys = Object.keys(viJson).sort();
  const enKeys = Object.keys(enJson).sort();

  const missingKeysInEn = viKeys.filter((k) => !enKeys.includes(k));
  const missingKeysInVi = enKeys.filter((k) => !viKeys.includes(k));

  if (missingKeysInEn.length > 0) {
    console.error(`❌ Keys in ${file} missing in en-US: ${missingKeysInEn.join(', ')}`);
    hasError = true;
  }
  if (missingKeysInVi.length > 0) {
    console.error(`❌ Keys in ${file} missing in vi-VN: ${missingKeysInVi.join(', ')}`);
    hasError = true;
  }
}

if (hasError) {
  console.error('\n❌ Localization check failed.');
  process.exit(1);
} else {
  console.log('✅ Localization resources symmetry and integrity verified.');
  process.exit(0);
}
