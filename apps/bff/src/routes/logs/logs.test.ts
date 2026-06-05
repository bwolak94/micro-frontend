import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { buildBaseApp } from '../../test/helpers';

import { logsRoutes } from './logs.routes';

import type { FastifyInstance } from 'fastify';

describe('Logs Routes', () => {
  let app: FastifyInstance;

  beforeEach(async () => {
    app = await buildBaseApp();
    await app.register(logsRoutes);
    await app.ready();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('POST /api/logs', () => {
    it('returns 200 and received count on valid payload', async () => {
      const res = await app.inject({
        method: 'POST',
        url: '/api/logs',
        payload: {
          entries: [
            {
              service: 'shell',
              version: '1.0.0',
              level: 'info',
              message: 'User logged in',
              timestamp: new Date().toISOString(),
            },
          ],
        },
      });
      expect(res.statusCode).toBe(200);
      const body = res.json<{ received: number }>();
      expect(body.received).toBe(1);
    });

    it('accepts multiple log entries', async () => {
      const entries = Array.from({ length: 3 }, (_, i) => ({
        service: 'mfe-dashboard',
        version: '1.0.0',
        level: 'warn' as const,
        message: `Log entry ${String(i)}`,
        timestamp: new Date().toISOString(),
      }));

      const res = await app.inject({
        method: 'POST',
        url: '/api/logs',
        payload: { entries },
      });
      expect(res.statusCode).toBe(200);
      expect(res.json<{ received: number }>().received).toBe(3);
    });

    it('returns 400 on invalid payload', async () => {
      const res = await app.inject({
        method: 'POST',
        url: '/api/logs',
        payload: { entries: [] },
      });
      expect(res.statusCode).toBe(400);
    });
  });
});
