import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    globals: true,
    css: false,
    alias: {
      // Mock Module Federation remote imports — remotes are not available in unit tests
      'mfeAuth/LoginPage': new URL('./src/test/mocks/mfeAuth-LoginPage.tsx', import.meta.url)
        .pathname,
      'mfeAuth/RegisterPage': new URL('./src/test/mocks/mfeAuth-RegisterPage.tsx', import.meta.url)
        .pathname,
    },
  },
});
