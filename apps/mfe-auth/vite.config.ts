/// <reference types="vitest" />
import federation from '@originjs/vite-plugin-federation';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

import type { SharedConfig } from '@originjs/vite-plugin-federation';

// singleton is a valid runtime option but not yet reflected in the type definitions
type SharedConfigWithSingleton = SharedConfig & { singleton?: boolean };

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'mfeAuth',
      filename: 'remoteEntry.js',
      exposes: {
        './LoginPage': './src/LoginPage/LoginPage.tsx',
        './RegisterPage': './src/RegisterPage/RegisterPage.tsx',
      },
      shared: {
        react: { singleton: true, requiredVersion: '^18.3.0' } as SharedConfigWithSingleton,
        'react-dom': { singleton: true, requiredVersion: '^18.3.0' } as SharedConfigWithSingleton,
        'react-router-dom': {
          singleton: true,
          requiredVersion: '^6.22.0',
        } as SharedConfigWithSingleton,
        '@portfolio/shared-types': { singleton: true } as SharedConfigWithSingleton,
      },
    }),
  ],
  build: {
    target: 'esnext',
    minify: false,
    cssCodeSplit: false,
  },
  server: {
    port: 3001,
    cors: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
  preview: {
    port: 3001,
    cors: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    globals: true,
    css: false,
  },
});
