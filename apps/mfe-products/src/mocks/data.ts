import type { Product } from '@portfolio/shared-types';

export const mockProducts: readonly Product[] = [
  {
    id: 'p1',
    name: 'Widget A',
    description: 'A great widget for everyday use',
    price: 29.99,
    category: 'electronics',
    stock: 150,
    createdAt: '2024-04-01T00:00:00Z',
    updatedAt: '2024-05-01T00:00:00Z',
  },
  {
    id: 'p2',
    name: 'Gadget B',
    description: 'An amazing gadget with advanced features',
    price: 149.99,
    category: 'electronics',
    stock: 42,
    createdAt: '2024-03-15T00:00:00Z',
    updatedAt: '2024-05-02T00:00:00Z',
  },
  {
    id: 'p3',
    name: 'Book C',
    description: 'A must-read programming book',
    price: 39.99,
    category: 'books',
    stock: 200,
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2024-04-15T00:00:00Z',
  },
  {
    id: 'p4',
    name: 'Shirt D',
    description: 'A comfortable cotton shirt',
    price: 24.99,
    category: 'clothing',
    stock: 85,
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-03-20T00:00:00Z',
  },
];
