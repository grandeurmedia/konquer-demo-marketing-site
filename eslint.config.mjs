import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const nextCoreWebVitals = require('eslint-config-next/core-web-vitals');

/** @type {import('eslint').Linter.Config[]} */
const eslintConfig = [
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      'out/**',
      'coverage/**',
      'backups/**',
      'app/page.backup.tsx',
    ],
  },
  ...nextCoreWebVitals,
  {
    rules: {
      // Valid patterns for timers, hydration, and fetch lifecycles; React 19 rule is overly strict here.
      'react-hooks/set-state-in-effect': 'off',
      // Prose-heavy marketing copy; escaping hurts readability.
      'react/no-unescaped-entities': 'off',
      // Single-page font loading is intentional on some previews.
      '@next/next/no-page-custom-font': 'off',
    },
  },
];

export default eslintConfig;
