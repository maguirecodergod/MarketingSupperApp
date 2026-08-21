import fs from 'node:fs';
import path from 'node:path';

console.log('Validating development environment configuration...');
const envDevPath = path.resolve(process.cwd(), '.env.development');

if (!fs.existsSync(envDevPath)) {
  console.error('❌ Missing .env.development file');
  process.exit(1);
}

const content = fs.readFileSync(envDevPath, 'utf-8');
const requiredKeys = ['VITE_API_BASE_URL', 'VITE_APP_ENV', 'VITE_APP_VERSION'];

const missing = [];
for (const key of requiredKeys) {
  if (!content.includes(`${key}=`)) {
    missing.push(key);
  }
}

if (missing.length > 0) {
  console.error(`❌ .env.development is missing required keys: ${missing.join(', ')}`);
  process.exit(1);
}

console.log('✅ Environment configuration check passed.');
process.exit(0);
