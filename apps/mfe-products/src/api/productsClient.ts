import { createApiClient } from '@portfolio/api-client';

import type {
  CreateProductRequest,
  CreateProductResponse,
  GetProductResponse,
  GetProductsRequest,
  GetProductsResponse,
  UpdateProductRequest,
  UpdateProductResponse,
} from './productsClient.types';

const apiClient = createApiClient({ baseUrl: '/api' });

function buildQuery(params: GetProductsRequest): string {
  const qs = new URLSearchParams();
  if (params.page !== undefined) qs.set('page', String(params.page));
  if (params.pageSize !== undefined) qs.set('pageSize', String(params.pageSize));
  if (params.search !== undefined && params.search !== '') qs.set('search', params.search);
  if (params.category !== undefined) qs.set('category', params.category);
  const str = qs.toString();
  return str !== '' ? `?${str}` : '';
}

export const productsClient = {
  getProducts: (params: GetProductsRequest = {}): Promise<GetProductsResponse> =>
    apiClient.get<GetProductsResponse>(`/products${buildQuery(params)}`),

  getProduct: (id: string): Promise<GetProductResponse> =>
    apiClient.get<GetProductResponse>(`/products/${id}`),

  createProduct: (data: CreateProductRequest): Promise<CreateProductResponse> =>
    apiClient.post<CreateProductResponse>('/products', data),

  updateProduct: (id: string, data: UpdateProductRequest): Promise<UpdateProductResponse> =>
    apiClient.put<UpdateProductResponse>(`/products/${id}`, data),

  deleteProduct: (id: string): Promise<void> => apiClient.delete<void>(`/products/${id}`),
} as const;
