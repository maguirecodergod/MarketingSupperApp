import { testLocaleNormalization } from '../packages/localization/src/tests/locale-normalization.test.js';
import { testLocaleDetection } from '../packages/localization/src/tests/locale-detection.test.js';
import { testDirection } from '../packages/localization/src/tests/direction.test.js';
import { testFormatters } from '../packages/localization/src/tests/formatters.test.js';
import { testLocaleRuntime } from '../packages/localization/src/tests/locale-runtime.test.js';
import { testNamespaceLoader } from '../packages/localization/src/tests/namespace-loader.test.js';

console.log('--- Running Localization Package Test Suite ---');
try {
  testLocaleNormalization();
  testLocaleDetection();
  testDirection();
  testFormatters();
  await testLocaleRuntime();
  await testNamespaceLoader();
  console.log('\n🎉 All Localization package tests completed successfully.');
} catch (err) {
  console.error('\n❌ Localization test failure:', err);
  process.exit(1);
}
