import fs from 'node:fs';
import path from 'node:path';

const violations = [];
const rootDir = process.cwd();

const SECRET_PATTERNS = [
  /-----BEGIN\s+(RSA|EC|DSA|OPENSSH|PRIVATE)\s+KEY-----/i,
  /AKIA[0-9A-Z]{16}/,
  /(ghp|gho|ghu|ghs|ghr)_[A-Za-z0-9_]{36,}/,
  /AIza[0-9A-Za-z-_]{35}/,
  /xox[baprs]-[0-9a-zA-Z]{10,48}/,
  /sk_live_[0-9a-zA-Z]{24}/,
];

function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name === 'node_modules' || entry.name === 'dist' || entry.name === '.git' || entry.name === 'coverage' || entry.name === '.turbo') continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath);
    } else {
      checkFile(fullPath);
    }
  }
}

function checkFile(filePath) {
  const relativePath = path.relative(rootDir, filePath).replace(/\\/g, '/');
  
  if (relativePath === '.env' || relativePath.startsWith('.env.production') || relativePath.endsWith('.pem') || relativePath.endsWith('.key')) {
    violations.push(`Forbidden sensitive file found tracked: ${relativePath}`);
    return;
  }

  if (/\.(png|jpg|jpeg|gif|svg|ico|webp|woff|woff2|ttf|eot)$/.test(filePath)) return;

  const content = fs.readFileSync(filePath, 'utf-8');
  for (const pattern of SECRET_PATTERNS) {
    if (pattern.test(content)) {
      violations.push(`Potential secret pattern matched in ${relativePath}: ${pattern}`);
    }
  }
}

console.log('Running secret scan on codebase...');
walk(rootDir);

if (violations.length > 0) {
  console.error('\n❌ Secret scan violations found:');
  violations.forEach((v) => console.error(`  - ${v}`));
  process.exit(1);
} else {
  console.log('✅ Secret check passed cleanly.');
  process.exit(0);
}
