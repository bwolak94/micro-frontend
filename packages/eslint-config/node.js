import base from './base.js';

/** @type {import('eslint').Linter.FlatConfig[]} */
const node = [
  ...base,
  {
    files: ['**/*.{ts,mts,cts}'],
    rules: {
      // Allow process.env access in Node context
      'no-process-env': 'off',
      // Node-specific overrides
      '@typescript-eslint/no-require-imports': 'error',
      'no-console': 'off',
    },
  },
];

export default node;
