import ProductEdit from '../views/ProductEdit/ProductEdit.vue';
import ProductList from '../views/ProductList/ProductList.vue';

import type { RouteRecordRaw } from 'vue-router';

export const routes: readonly RouteRecordRaw[] = [
  { path: '/products', component: ProductList },
  { path: '/products/new', component: ProductEdit },
  { path: '/products/:id', component: ProductEdit },
  { path: '/:pathMatch(.*)*', redirect: '/products' },
] as const;
