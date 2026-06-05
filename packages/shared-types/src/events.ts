import type { User } from './domain';

export interface CartItem {
  readonly productId: string;
  readonly quantity: number;
}

export interface EventMap {
  'auth:login': { readonly user: User };
  'auth:logout': undefined;
  'product:updated': { readonly id: string };
  'product:created': { readonly id: string };
  'product:deleted': { readonly id: string };
  'cart:changed': { readonly items: readonly CartItem[] };
  'theme:changed': { readonly theme: 'light' | 'dark' };
}
