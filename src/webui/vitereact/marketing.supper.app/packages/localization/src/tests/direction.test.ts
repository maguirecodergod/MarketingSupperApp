import { getLocaleDirection } from '../direction.js';

export function testDirection() {
  console.log('Testing direction...');

  if (getLocaleDirection('vi-VN') !== 'ltr') throw new Error('vi-VN direction failed');
  if (getLocaleDirection('en-US') !== 'ltr') throw new Error('en-US direction failed');

  console.log('✅ direction tests passed.');
}

if (typeof process !== 'undefined' && process.argv[1]?.includes('direction.test')) {
  testDirection();
}
