import fastifyCors from '@fastify/cors';
import fp from 'fastify-plugin';

import type { Config } from '../config';
import type { FastifyInstance } from 'fastify';

export const corsPlugin = fp(async function (
  fastify: FastifyInstance,
  opts: { config: Config },
): Promise<void> {
  const origins = opts.config.CORS_ORIGINS.split(',').map((o) => o.trim());

  await fastify.register(fastifyCors, {
    origin: origins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'traceparent', 'x-trace-id'],
  });
});
