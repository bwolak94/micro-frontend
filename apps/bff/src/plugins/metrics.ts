import fp from 'fastify-plugin';
import { collectDefaultMetrics, Counter, Histogram, Registry } from 'prom-client';

import type { FastifyInstance } from 'fastify';

// Singleton registry shared across the application
export const metricsRegistry = new Registry();

// Default Node.js metrics (heap, GC, event loop, etc.)
collectDefaultMetrics({ register: metricsRegistry });

// --- Custom counters ---

export const authLoginTotal = new Counter({
  name: 'auth_login_total',
  help: 'Total number of login attempts',
  registers: [metricsRegistry],
});

export const authLoginErrorsTotal = new Counter({
  name: 'auth_login_errors_total',
  help: 'Total number of failed login attempts',
  registers: [metricsRegistry],
});

export const productUpdatesTotal = new Counter({
  name: 'product_updates_total',
  help: 'Total number of product create/update/delete operations',
  registers: [metricsRegistry],
});

// --- Request duration histogram ---

export const httpRequestDuration = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'HTTP request duration in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5],
  registers: [metricsRegistry],
});

export const metricsPlugin = fp(async function (fastify: FastifyInstance): Promise<void> {
  // Track request duration for all routes
  fastify.addHook('onResponse', async (req, reply) => {
    const route = req.routeOptions?.url ?? req.url;
    const duration = reply.elapsedTime / 1000; // ms → seconds
    httpRequestDuration.labels(req.method, route, String(reply.statusCode)).observe(duration);
  });

  // Expose /metrics endpoint in Prometheus text format
  fastify.get('/metrics', async (_req, reply) => {
    const metrics = await metricsRegistry.metrics();
    return reply.header('Content-Type', metricsRegistry.contentType).send(metrics);
  });
});
