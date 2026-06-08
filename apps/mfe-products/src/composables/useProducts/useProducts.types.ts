import type { Product, ProductCategory } from '@portfolio/shared-types';
import type { Ref } from 'vue';

export interface ProductsQueryParams {
  readonly search?: string;
  readonly category?: ProductCategory;
  readonly page?: number;
  readonly pageSize?: number;
}

export interface ProductFormData {
  readonly name: string;
  readonly description: string;
  readonly category: ProductCategory;
  readonly price: number;
  readonly stock: number;
}

export interface UseProductListReturn {
  readonly products: Ref<readonly Product[]>;
  readonly total: Ref<number>;
  readonly loading: Ref<boolean>;
  readonly error: Ref<string | null>;
  readonly fetchProducts: (params?: ProductsQueryParams) => Promise<void>;
}

export interface UseProductEditReturn {
  readonly product: Ref<Product | null>;
  readonly loading: Ref<boolean>;
  readonly saving: Ref<boolean>;
  readonly deleting: Ref<boolean>;
  readonly error: Ref<string | null>;
  readonly fetchProduct: (id: string) => Promise<void>;
  readonly saveProduct: (id: string | null, data: ProductFormData) => Promise<Product>;
  readonly deleteProduct: (id: string) => Promise<void>;
}
