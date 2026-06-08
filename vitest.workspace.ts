import { defineWorkspace } from 'vitest/config';

export default defineWorkspace([
  'apps/shell/vitest.config.ts',
  'apps/mfe-auth/vitest.config.ts',
  'apps/mfe-dashboard/vitest.config.ts',
  'apps/mfe-products/vitest.config.ts',
  'apps/bff/vitest.config.ts',
  'packages/event-bus/vitest.config.ts',
  'packages/logger/vitest.config.ts',
  'packages/api-client/vitest.config.ts',
  'packages/ui/vitest.config.ts',
]);
