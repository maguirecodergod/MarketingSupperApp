import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import openapiTS from 'openapi-typescript';

const contractPath = path.resolve(process.cwd(), 'contracts/openapi.yaml');
const outputDir = path.resolve(process.cwd(), 'packages/api-contracts/src/generated');
const versionFilePath = path.resolve(process.cwd(), 'packages/api-contracts/src/version.ts');

if (!fs.existsSync(contractPath)) {
  console.error(`\n❌ OpenAPI contract file not found at: ${contractPath}`);
  console.error('Phase 5 is BLOCKED because required input "contracts/openapi.yaml" is missing.');
  process.exit(1);
}

try {
  const contractBytes = fs.readFileSync(contractPath);
  const hash = crypto.createHash('sha256').update(contractBytes).digest('hex');

  console.log(`Generating types from OpenAPI contract (hash: ${hash})...`);
  const generatedTypes = await openapiTS(new URL(`file://${contractPath}`));

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const header = `// GENERATED FILE — DO NOT EDIT MANUALLY.\n// Source: contracts/openapi.yaml\n// Generator: openapi-typescript\n// Contract hash: ${hash}\n\n`;

  fs.writeFileSync(path.join(outputDir, 'index.ts'), header + generatedTypes, 'utf-8');

  const versionContent = `// GENERATED FILE — DO NOT EDIT MANUALLY.\n// Source: contracts/openapi.yaml\n// Generator: openapi-typescript\n// Contract hash: ${hash}\n\nexport const CONTRACT_HASH = '${hash}';\nexport const CONTRACT_SOURCE = 'contracts/openapi.yaml';\n`;
  fs.writeFileSync(versionFilePath, versionContent, 'utf-8');

  console.log('✅ OpenAPI types generated successfully.');
  process.exit(0);
} catch (err) {
  console.error('❌ Failed to generate API contracts:', err);
  process.exit(1);
}
