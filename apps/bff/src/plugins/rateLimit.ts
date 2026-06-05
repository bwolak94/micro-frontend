import fastifyRateLimit from '@fastify/rate-limit';
import fp from 'fastify-plugin';

import type { FastifyInstance } from 'fastify';

export const rateLimitPlugin = fp(async function (fastify: FastifyInstance): Promise<void> {
  await fastify.register(fastifyRateLimit, {
    max: 100,
    timeWindow: '1 minute',
    // TODO: for production, configure Redis store via REDIS_URL
    errorResponseBuilder: (_req, context) => ({
      statusCode: 429,
      error: 'Too Many Requests',
      message: `Rate limit exceeded. Try again in ${String(context.after)}.`,
    }),
  });
});
