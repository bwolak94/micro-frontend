import type { Order, OrderStatus, Product, ProductCategory, User } from './domain';

export interface ApiError {
  readonly statusCode: number;
  readonly message: string;
  readonly error: string;
}

export interface ApiResponse<T> {
  readonly data: T;
  readonly message?: string;
}

export interface PaginatedResponse<T> {
  readonly data: readonly T[];
  readonly total: number;
  readonly page: number;
  readonly pageSize: number;
  readonly totalPages: number;
}

// Auth
export interface LoginRequest {
  readonly email: string;
  readonly password: string;
}

export interface LoginResponse {
  readonly user: User;
}

export interface RegisterRequest {
  readonly name: string;
  readonly email: string;
  readonly password: string;
}

export interface RegisterResponse {
  readonly user: User;
}

// Products
export interface GetProductsRequest {
  readonly page?: number;
  readonly pageSize?: number;
  readonly category?: ProductCategory;
  readonly search?: string;
}

export interface CreateProductRequest {
  readonly name: string;
  readonly description: string;
  readonly price: number;
  readonly category: ProductCategory;
  readonly stock: number;
  readonly imageUrl?: string;
}

export type UpdateProductRequest = Partial<CreateProductRequest>;

export type GetProductsResponse = PaginatedResponse<Product>;
export interface GetProductResponse {
  readonly data: Product;
}
export interface CreateProductResponse {
  readonly data: Product;
}
export interface UpdateProductResponse {
  readonly data: Product;
}

// Orders
export interface GetOrdersRequest {
  readonly page?: number;
  readonly pageSize?: number;
  readonly status?: OrderStatus;
  readonly userId?: string;
}

export type GetOrdersResponse = PaginatedResponse<Order>;
export interface GetOrderResponse {
  readonly data: Order;
}
