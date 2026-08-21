import fs from 'node:fs';
import path from 'node:path';

console.log('Checking generated files governance...');
const generatedFiles = [
  'packages/api-contracts/src/generated/index.ts',
  'packages/api-contracts/src/version.ts'
];

let valid = true;
for (const file of generatedFiles) {
  const fullPath = path.resolve(process.cwd(), file);
  if (fs.existsSync(fullPath)) {
    const content = fs.readFileSync(fullPath, 'utf-8');
    if (!content.includes('GENERATED FILE — DO NOT EDIT MANUALLY')) {
      console.error(`❌ Generated file ${file} lacks required generated header!`);
      valid = false;
    }
  }
}

if (!valid) {
  process.exit(1);
}

console.log('✅ Generated files headers valid.');
process.exit(0);
