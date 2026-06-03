import type { User } from './domain';

export interface EventMap {
  'auth:login': { readonly user: User };
  'auth:logout': undefined;
  'product:updated': { readonly id: string };
  'product:created': { readonly id: string };
  'product:deleted': { readonly id: string };
}
