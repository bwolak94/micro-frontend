import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';

import App from './App.vue';
import { routes } from './router';
import './styles/global.css';

const router = createRouter({
  history: createWebHistory(),
  routes: [...routes],
});

const rootEl = document.getElementById('root');
if (rootEl === null) throw new Error('[mfe-products] Root DOM element #root not found');

createApp(App).use(router).mount(rootEl);
