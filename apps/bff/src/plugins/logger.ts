import fp from 'fastify-plugin';

import type { Config } from '../config';
import type { FastifyInstance } from 'fastify';

export const loggerPlugin = fp(async function (
  fastify: FastifyInstance,
  opts: { config: Config },
): Promise<void> {
  const isDev = opts.config.NODE_ENV !== 'production';

  fastify.addHook('onRequest', async (req) => {
    const traceId =
      (req.headers['traceparent'] as string | undefined) ??
      (req.headers['x-trace-id'] as string | undefined) ??
      crypto.randomUUID();
    req.headers['x-trace-id'] = traceId;
    req.log.info({ method: req.method, url: req.url, traceId }, 'incoming request');
  });

  fastify.addHook('onResponse', async (req, reply) => {
    req.log.info(
      { method: req.method, url: req.url, statusCode: reply.statusCode },
      'request completed',
    );
  });

  if (isDev) {
    fastify.log.info('Logger plugin registered (dev mode with pino-pretty)');
  }
});
