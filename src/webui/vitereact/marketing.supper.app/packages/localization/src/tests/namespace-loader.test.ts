import { loadNamespace, loadNamespaces } from '../namespace-loader.js';
import i18n from '../i18n.js';

export async function testNamespaceLoader() {
  console.log('Testing namespace loader...');

  await loadNamespace('vi-VN', 'dashboard');
  if (!i18n.hasResourceBundle('vi-VN', 'dashboard')) {
    throw new Error('dashboard namespace bundle missing');
  }

  await loadNamespaces('en-US', ['users', 'settings']);
  if (!i18n.hasResourceBundle('en-US', 'users')) {
    throw new Error('users namespace bundle missing');
  }
  if (!i18n.hasResourceBundle('en-US', 'settings')) {
    throw new Error('settings namespace bundle missing');
  }

  console.log('✅ namespaceLoader tests passed.');
}

if (typeof process !== 'undefined' && process.argv[1]?.includes('namespace-loader.test')) {
  testNamespaceLoader();
}
