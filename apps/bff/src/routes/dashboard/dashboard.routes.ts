import { zodToJsonSchema } from 'zod-to-json-schema';

import { ordersQuerySchema, salesQuerySchema } from '../../schemas/dashboard.schema';

import type { DashboardRoutesOpts, OrdersRoute, SalesRoute } from './dashboard.routes.types';
import type { FastifyInstance } from 'fastify';

export async function dashboardRoutes(
  fastify: FastifyInstance,
  opts: DashboardRoutesOpts,
): Promise<void> {
  const { dashboardService } = opts;

  fastify.get(
    '/api/dashboard/metrics',
    { preHandler: [fastify.authenticate] },
    async (_req, reply) => {
      const metrics = await dashboardService.getMetrics();
      return reply.send(metrics);
    },
  );

  fastify.get<SalesRoute>(
    '/api/dashboard/sales',
    {
      preHandler: [fastify.authenticate],
      schema: { querystring: zodToJsonSchema(salesQuerySchema) },
    },
    async (req, reply) => {
      const query = salesQuerySchema.parse(req.query);
      const data = await dashboardService.getSalesData(query.range);
      return reply.send({ data });
    },
  );

  fastify.get<OrdersRoute>(
    '/api/dashboard/orders',
    {
      preHandler: [fastify.authenticate],
      schema: { querystring: zodToJsonSchema(ordersQuerySchema) },
    },
    async (req, reply) => {
      const query = ordersQuerySchema.parse(req.query);
      const orders = await dashboardService.getRecentOrders(query.limit);
      return reply.send({ data: orders });
    },
  );
}
