import type { DbProduct, NewDbProduct } from '../../domain/schema';
import type { Product, ProductCategory } from '@portfolio/shared-types';

export interface ProductRepo {
  findAll(params: {
    page: number;
    pageSize: number;
    search?: string;
    category?: ProductCategory;
  }): Promise<{ rows: DbProduct[]; total: number }>;
  findById(id: string): Promise<DbProduct | null>;
  insert(data: NewDbProduct): Promise<DbProduct>;
  update(id: string, data: Partial<NewDbProduct>): Promise<DbProduct | null>;
  remove(id: string): Promise<boolean>;
}

export interface ProductsService {
  getProducts(params: {
    page: number;
    pageSize: number;
    search?: string;
    category?: ProductCategory;
  }): Promise<{
    data: Product[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  }>;
  getProduct(id: string): Promise<Product | null>;
  createProduct(data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product>;
  updateProduct(
    id: string,
    data: Partial<Omit<Product, 'id' | 'createdAt' | 'updatedAt'>>,
  ): Promise<Product | null>;
  deleteProduct(id: string): Promise<boolean>;
}
