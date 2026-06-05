import type { ProductRepo, ProductsService } from './products.service.types';
import type { DbProduct } from '../../domain/schema';
import type { Product, ProductCategory } from '@portfolio/shared-types';

function mapToProduct(db: DbProduct): Product {
  return {
    id: db.id,
    name: db.name,
    description: db.description,
    price: db.price,
    category: db.category as ProductCategory,
    stock: db.stock,
    ...(db.imageUrl !== null && { imageUrl: db.imageUrl }),
    createdAt: db.createdAt.toISOString(),
    updatedAt: db.updatedAt.toISOString(),
  };
}

export function createProductsService(productRepo: ProductRepo): ProductsService {
  return {
    async getProducts(params) {
      const { rows, total } = await productRepo.findAll(params);
      return {
        data: rows.map(mapToProduct),
        total,
        page: params.page,
        pageSize: params.pageSize,
        totalPages: Math.ceil(total / params.pageSize),
      };
    },

    async getProduct(id: string): Promise<Product | null> {
      const found = await productRepo.findById(id);
      return found !== null ? mapToProduct(found) : null;
    },

    async createProduct(data: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
      const created = await productRepo.insert({
        name: data.name,
        description: data.description,
        price: data.price,
        category: data.category,
        stock: data.stock,
        ...(data.imageUrl !== undefined && { imageUrl: data.imageUrl }),
      });
      return mapToProduct(created);
    },

    async updateProduct(
      id: string,
      data: Partial<Omit<Product, 'id' | 'createdAt' | 'updatedAt'>>,
    ): Promise<Product | null> {
      const updated = await productRepo.update(id, {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.description !== undefined && { description: data.description }),
        ...(data.price !== undefined && { price: data.price }),
        ...(data.category !== undefined && { category: data.category }),
        ...(data.stock !== undefined && { stock: data.stock }),
        ...(data.imageUrl !== undefined && { imageUrl: data.imageUrl }),
      });
      return updated !== null ? mapToProduct(updated) : null;
    },

    async deleteProduct(id: string): Promise<boolean> {
      return productRepo.remove(id);
    },
  };
}
