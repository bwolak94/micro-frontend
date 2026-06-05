import { zodToJsonSchema } from 'zod-to-json-schema';

import { logBatchBodySchema } from '../../schemas/logs.schema';

import type { PostLogsRoute } from './logs.routes.types';
import type { FastifyInstance } from 'fastify';

export async function logsRoutes(fastify: FastifyInstance): Promise<void> {
  fastify.post<PostLogsRoute>(
    '/api/logs',
    { schema: { body: zodToJsonSchema(logBatchBodySchema) } },
    async (req, reply) => {
      const { entries } = req.body;
      for (const entry of entries) {
        const level = entry.level;
        fastify.log[level]({ ...entry }, `[${entry.service}] ${entry.message}`);
      }
      return reply.send({ received: entries.length });
    },
  );
}
