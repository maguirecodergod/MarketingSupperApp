import fs from 'node:fs';
import path from 'node:path';

const violations = [];
const rootDir = process.cwd();

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name === 'node_modules' || entry.name === 'dist' || entry.name === '.git' || entry.name === 'coverage') continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath);
    } else if (/\.(ts|tsx|js|jsx|mjs)$/.test(entry.name)) {
      checkFile(fullPath);
    }
  }
}

function checkFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const relativePath = path.relative(rootDir, filePath).replace(/\\/g, '/');

  // Rule 1: No packages/ui importing from apps/admin or features
  if (relativePath.startsWith('packages/ui/')) {
    if (/from\s+['"][^'"]*apps\/admin/.test(content) || /from\s+['"][^'"]*features\//.test(content)) {
      violations.push(`${relativePath}: packages/ui must not import from apps/admin or features`);
    }
  }

  // Rule 2: No raw import.meta.env outside packages/config
  if (!relativePath.startsWith('packages/config/') && !relativePath.startsWith('scripts/') && !relativePath.endsWith('.config.ts')) {
    if (/import\.meta\.env/.test(content)) {
      violations.push(`${relativePath}: Direct import.meta.env access is forbidden outside packages/config`);
    }
  }

  // Rule 3: No raw fetch in feature/UI code outside packages/api
  if (relativePath.includes('/features/') || relativePath.startsWith('packages/ui/')) {
    if (/\bfetch\(/.test(content)) {
      violations.push(`${relativePath}: Direct fetch() calls are forbidden in UI/features. Use packages/api.`);
    }
  }

  // Rule 4: No direct localStorage/sessionStorage outside storage adapters
  if (!relativePath.includes('storage.ts') && !relativePath.includes('test') && !relativePath.includes('mock') && !relativePath.startsWith('scripts/')) {
    if (/\blocalStorage\b/.test(content) || /\bsessionStorage\b/.test(content)) {
      violations.push(`${relativePath}: Direct localStorage/sessionStorage access forbidden outside storage adapters`);
    }
  }
}

console.log('Running architectural boundary checks...');
if (fs.existsSync(path.join(rootDir, 'packages')) || fs.existsSync(path.join(rootDir, 'apps')) || fs.existsSync(path.join(rootDir, 'src'))) {
  walk(rootDir);
}

if (violations.length > 0) {
  console.error('\n❌ Architectural Boundary Violations found:');
  violations.forEach((v) => console.error(`  - ${v}`));
  process.exit(1);
} else {
  console.log('✅ Architectural boundaries check passed.');
  process.exit(0);
}
