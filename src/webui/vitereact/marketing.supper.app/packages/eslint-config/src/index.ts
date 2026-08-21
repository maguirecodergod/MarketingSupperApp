export * from './base.js';

export const reactRules = {
  'react-hooks/rules-of-hooks': 'error',
  'react-hooks/exhaustive-deps': 'warn',
};

export const testRules = {
  '@typescript-eslint/no-explicit-any': 'off',
};

export const storybookRules = {
  'import/no-anonymous-default-export': 'off',
};
