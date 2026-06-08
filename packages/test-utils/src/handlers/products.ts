import { http, HttpResponse } from 'msw';

import type { Product } from '@portfolio/shared-types';

export const mockProducts: Product[] = [
  {
    id: 'p1',
    name: 'Widget A',
    description: 'A great widget',
    price: 29.99,
    category: 'electronics',
    stock: 150,
    createdAt: '2024-04-01T00:00:00Z',
    updatedAt: '2024-05-01T00:00:00Z',
  },
  {
    id: 'p2',
    name: 'Gadget B',
    description: 'An amazing gadget',
    price: 149.99,
    category: 'electronics',
    stock: 42,
    createdAt: '2024-03-15T00:00:00Z',
    updatedAt: '2024-05-02T00:00:00Z',
  },
  {
    id: 'p3',
    name: 'Book C',
    description: 'A fascinating book',
    price: 12.5,
    category: 'books',
    stock: 300,
    createdAt: '2024-02-10T00:00:00Z',
    updatedAt: '2024-04-20T00:00:00Z',
  },
];

export const productsHandlers = [
  http.get('/api/products', ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get('page') ?? '1');
    const pageSize = Number(url.searchParams.get('pageSize') ?? '10');
    const search = url.searchParams.get('search') ?? '';
    const category = url.searchParams.get('category') ?? '';

    const filtered = mockProducts.filter((p) => {
      const matchesSearch = search === '' || p.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === '' || p.category === category;
      return matchesSearch && matchesCategory;
    });

    const start = (page - 1) * pageSize;
    const paged = filtered.slice(start, start + pageSize);

    return HttpResponse.json({
      data: paged,
      total: filtered.length,
      page,
      pageSize,
      totalPages: Math.ceil(filtered.length / pageSize),
    });
  }),

  http.get('/api/products/:id', ({ params }) => {
    const product = mockProducts.find((p) => p.id === params['id']);
    if (!product) {
      return HttpResponse.json(
        { message: 'Not found', statusCode: 404, error: 'Not Found' },
        { status: 404 },
      );
    }
    return HttpResponse.json({ data: product });
  }),

  http.post('/api/products', async ({ request }) => {
    const body = (await request.json()) as Omit<Product, 'id' | 'createdAt' | 'updatedAt'>;
    const newProduct: Product = {
      ...body,
      id: `p${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return HttpResponse.json({ data: newProduct }, { status: 201 });
  }),

  http.put('/api/products/:id', async ({ params, request }) => {
    const existing = mockProducts.find((p) => p.id === params['id']);
    if (!existing) {
      return HttpResponse.json(
        { message: 'Not found', statusCode: 404, error: 'Not Found' },
        { status: 404 },
      );
    }
    const body = (await request.json()) as Partial<Product>;
    const updated: Product = { ...existing, ...body, updatedAt: new Date().toISOString() };
    return HttpResponse.json({ data: updated });
  }),

  http.delete('/api/products/:id', () => {
    return HttpResponse.json({});
  }),
];
