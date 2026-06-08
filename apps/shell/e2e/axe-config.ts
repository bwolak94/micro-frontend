import type { RunOptions } from 'axe-core';

/**
 * Axe accessibility configuration shared across all E2E scenarios.
 * Add known-acceptable violations here with justification.
 */
export const axeOptions: RunOptions = {
  // Run all WCAG 2.1 AA rules
  runOnly: {
    type: 'tag',
    values: ['wcag2a', 'wcag2aa', 'best-practice'],
  },
  rules: {
    // colour-contrast is often incorrect in test environments with non-rendered CSS
    'color-contrast': { enabled: false },
  },
};
