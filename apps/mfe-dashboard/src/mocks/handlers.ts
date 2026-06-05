import { http, HttpResponse } from 'msw';

import { mockMetrics, mockOrders, mockRecentProducts, mockSalesData } from './data';

export const handlers = [
  http.get('/api/dashboard/sales', () => HttpResponse.json({ data: mockSalesData, range: '30d' })),

  http.get('/api/dashboard/orders', () => HttpResponse.json({ data: mockOrders })),

  http.get('/api/dashboard/metrics', () => HttpResponse.json({ data: mockMetrics })),

  http.get('/api/dashboard/products/recent', () => HttpResponse.json({ data: mockRecentProducts })),
];
