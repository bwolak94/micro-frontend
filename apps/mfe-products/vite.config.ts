import federation from '@originjs/vite-plugin-federation';
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

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
        vue: { singleton: true, requiredVersion: '^3.4.0' },
        'vue-router': { singleton: true, requiredVersion: '^4.3.0' },
        '@portfolio/shared-types': { singleton: true },
        '@portfolio/event-bus': { singleton: true },
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
