import type { ProductCategory } from '@portfolio/shared-types';

export interface ProductListFilters {
  readonly search: string;
  readonly category: ProductCategory | '';
}

export interface ProductListPagination {
  readonly page: number;
  readonly pageSize: number;
}
