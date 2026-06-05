import { ref } from 'vue';

import { productsClient } from '../../api/productsClient';

import type {
  ProductFormData,
  ProductsQueryParams,
  UseProductEditReturn,
  UseProductListReturn,
} from './useProducts.types';
import type { Product } from '@portfolio/shared-types';

export function useProductList(): UseProductListReturn {
  const products = ref<readonly Product[]>([]);
  const total = ref(0);
  const loading = ref(false);
  const error = ref<string | null>(null);

  async function fetchProducts(params: ProductsQueryParams = {}): Promise<void> {
    loading.value = true;
    error.value = null;
    try {
      const response = await productsClient.getProducts(params);
      products.value = response.data;
      total.value = response.total;
    } catch {
      error.value = 'Failed to load products';
    } finally {
      loading.value = false;
    }
  }

  return { products, total, loading, error, fetchProducts };
}

export function useProductEdit(): UseProductEditReturn {
  const product = ref<Product | null>(null);
  const loading = ref(false);
  const saving = ref(false);
  const deleting = ref(false);
  const error = ref<string | null>(null);

  async function fetchProduct(id: string): Promise<void> {
    loading.value = true;
    error.value = null;
    try {
      const response = await productsClient.getProduct(id);
      product.value = response.data;
    } catch {
      error.value = 'Failed to load product';
    } finally {
      loading.value = false;
    }
  }

  async function saveProduct(id: string | null, data: ProductFormData): Promise<Product> {
    saving.value = true;
    error.value = null;
    try {
      if (id !== null) {
        const response = await productsClient.updateProduct(id, data);
        product.value = response.data;
        return response.data;
      } else {
        const response = await productsClient.createProduct({
          name: data.name,
          description: data.description,
          category: data.category as Product['category'],
          price: data.price,
          stock: data.stock,
        });
        product.value = response.data;
        return response.data;
      }
    } catch {
      error.value = 'Failed to save product';
      throw new Error(error.value);
    } finally {
      saving.value = false;
    }
  }

  async function deleteProduct(id: string): Promise<void> {
    deleting.value = true;
    error.value = null;
    try {
      await productsClient.deleteProduct(id);
      product.value = null;
    } catch {
      error.value = 'Failed to delete product';
      throw new Error(error.value);
    } finally {
      deleting.value = false;
    }
  }

  return { product, loading, saving, deleting, error, fetchProduct, saveProduct, deleteProduct };
}
