export interface User {
  readonly id: string;
  readonly email: string;
  readonly name: string;
  readonly role: 'admin' | 'manager' | 'viewer';
}

export interface AuthTokenPayload {
  readonly sub: string;
  readonly email: string;
  readonly role: User['role'];
  readonly iat: number;
  readonly exp: number;
}

export type ProductCategory = 'electronics' | 'clothing' | 'food' | 'books' | 'other';

export interface Product {
  readonly id: string;
  readonly name: string;
  readonly description: string;
  readonly price: number;
  readonly category: ProductCategory;
  readonly stock: number;
  readonly imageUrl?: string;
  readonly createdAt: string;
  readonly updatedAt: string;
}

export interface OrderItem {
  readonly productId: string;
  readonly productName: string;
  readonly quantity: number;
  readonly unitPrice: number;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface Order {
  readonly id: string;
  readonly userId: string;
  readonly items: readonly OrderItem[];
  readonly total: number;
  readonly status: OrderStatus;
  readonly createdAt: string;
  readonly updatedAt: string;
}
