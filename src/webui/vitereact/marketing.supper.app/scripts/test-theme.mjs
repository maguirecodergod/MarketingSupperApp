import { testResolveTheme } from '../packages/theme/src/tests/resolve-theme.test.js';
import { testThemeStorage } from '../packages/theme/src/tests/theme-store.test.js';
import { testApplyTheme } from '../packages/theme/src/tests/apply-theme.test.js';
import { testBootstrapTheme } from '../packages/theme/src/tests/bootstrap-theme.test.js';
import { testSystemTheme } from '../packages/theme/src/tests/system-theme.test.js';

console.log('--- Running Theme Package Test Suite ---');
try {
  testResolveTheme();
  testThemeStorage();
  testApplyTheme();
  testBootstrapTheme();
  testSystemTheme();
  console.log('\n🎉 All Theme package tests completed successfully.');
} catch (err) {
  console.error('\n❌ Theme test failure:', err);
  process.exit(1);
}
