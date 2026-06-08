import federation from '@originjs/vite-plugin-federation';
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

import type { SharedConfig } from '@originjs/vite-plugin-federation';

// singleton is a valid runtime option but not yet reflected in the type definitions
type SharedConfigWithSingleton = SharedConfig & { singleton?: boolean };

export default defineConfig({
  plugins: [
    vue(),
    federation({
      name: 'mfeProducts',
      filename: 'remoteEntry.js',
      exposes: {
        './ProductsApp': './src/ProductsApp/ProductsApp.ts',
      },
      shared: {
        vue: { singleton: true, requiredVersion: '^3.4.0' } as SharedConfigWithSingleton,
        'vue-router': { singleton: true, requiredVersion: '^4.3.0' } as SharedConfigWithSingleton,
        '@portfolio/shared-types': { singleton: true } as SharedConfigWithSingleton,
        '@portfolio/event-bus': { singleton: true } as SharedConfigWithSingleton,
      },
    }),
  ],
  build: {
    target: 'esnext',
    minify: false,
    cssCodeSplit: false,
  },
  server: {
    port: 3003,
    cors: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
  preview: {
    port: 3003,
    cors: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
});
