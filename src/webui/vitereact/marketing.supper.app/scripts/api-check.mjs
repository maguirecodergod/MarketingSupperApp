import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import openapiTS from 'openapi-typescript';

const contractPath = path.resolve(process.cwd(), 'contracts/openapi.yaml');
const generatedIndexPath = path.resolve(process.cwd(), 'packages/api-contracts/src/generated/index.ts');
const versionFilePath = path.resolve(process.cwd(), 'packages/api-contracts/src/version.ts');

if (!fs.existsSync(contractPath)) {
  console.error(`\n❌ OpenAPI contract file not found at: ${contractPath}`);
  process.exit(1);
}

if (!fs.existsSync(generatedIndexPath) || !fs.existsSync(versionFilePath)) {
  console.error(`\n❌ Generated API contracts not found at: ${generatedIndexPath}`);
  process.exit(1);
}

try {
  const contractBytes = fs.readFileSync(contractPath);
  const hash = crypto.createHash('sha256').update(contractBytes).digest('hex');
  const expectedHeader = `// GENERATED FILE — DO NOT EDIT MANUALLY.\n// Source: contracts/openapi.yaml\n// Generator: openapi-typescript\n// Contract hash: ${hash}\n\n`;

  const newTypes = await openapiTS(new URL(`file://${contractPath}`));
  const currentContent = fs.readFileSync(generatedIndexPath, 'utf-8');

  if (currentContent !== expectedHeader + newTypes) {
    console.error('❌ Generated index.ts drift detected. Please run "pnpm api:generate".');
    process.exit(1);
  }

  console.log('✅ API generation check passed without drift.');
  process.exit(0);
} catch (err) {
  console.error('❌ Failed during api-check:', err);
  process.exit(1);
}
