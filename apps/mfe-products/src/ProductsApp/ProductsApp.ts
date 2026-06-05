import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';

import AppComponent from '../App.vue';
import { routes } from '../router';
import '../styles/global.css';

import type { MountOptions, ProductsAppInstance } from './ProductsApp.types';

export function mountProductsApp(el: HTMLElement, options: MountOptions = {}): ProductsAppInstance {
  const router = createRouter({
    history: createWebHistory(),
    routes: [...routes],
  });

  if (options.initialPath !== undefined && options.initialPath !== '') {
    void router.push(options.initialPath);
  }

  const app = createApp(AppComponent);
  app.use(router);
  app.mount(el);

  return app;
}
