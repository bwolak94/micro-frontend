/// <reference types="vitest" />
import federation from '@originjs/vite-plugin-federation';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

import type { SharedConfig } from '@originjs/vite-plugin-federation';

// singleton is a valid runtime option but not yet reflected in the type definitions
type SharedConfigWithSingleton = SharedConfig & { singleton?: boolean };

export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    federation({
      name: 'shell',
      remotes: {
        mfeAuth:
          mode === 'production'
            ? '/mfe-auth/assets/remoteEntry.js'
            : 'http://localhost:3001/remoteEntry.js',
        mfeDashboard:
          mode === 'production'
            ? '/mfe-dashboard/assets/remoteEntry.js'
            : 'http://localhost:3002/remoteEntry.js',
        mfeProducts:
          mode === 'production'
            ? '/mfe-products/assets/remoteEntry.js'
            : 'http://localhost:3003/remoteEntry.js',
      },
      shared: {
        react: { singleton: true, requiredVersion: '^18.3.0' } as SharedConfigWithSingleton,
        'react-dom': { singleton: true, requiredVersion: '^18.3.0' } as SharedConfigWithSingleton,
        'react-router-dom': {
          singleton: true,
          requiredVersion: '^6.22.0',
        } as SharedConfigWithSingleton,
        '@tanstack/react-query': {
          singleton: true,
          requiredVersion: '^5.0.0',
        } as SharedConfigWithSingleton,
        '@portfolio/shared-types': { singleton: true } as SharedConfigWithSingleton,
      },
    }),
  ],
  build: {
    target: 'esnext',
    minify: false,
  },
  server: {
    port: 3000,
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    globals: true,
    css: false,
  },
}));
