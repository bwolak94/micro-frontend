import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    globals: true,
    css: false,
    exclude: ['e2e/**', 'node_modules/**', 'dist/**'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      thresholds: { lines: 60, functions: 60, branches: 60, statements: 60 },
    },
    alias: {
      // Mock Module Federation remote imports — remotes are not available in unit tests
      'mfeAuth/LoginPage': new URL('./src/test/mocks/mfeAuth-LoginPage.tsx', import.meta.url)
        .pathname,
      'mfeAuth/RegisterPage': new URL('./src/test/mocks/mfeAuth-RegisterPage.tsx', import.meta.url)
        .pathname,
      'mfeDashboard/DashboardPage': new URL(
        './src/test/mocks/mfeDashboard-DashboardPage.tsx',
        import.meta.url,
      ).pathname,
      'mfeProducts/ProductsApp': new URL(
        './src/test/mocks/mfeProducts-ProductsApp.ts',
        import.meta.url,
      ).pathname,
    },
  },
});
