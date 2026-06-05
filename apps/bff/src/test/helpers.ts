import fastifyCookie from '@fastify/cookie';
import fastifyJwt from '@fastify/jwt';
import Fastify from 'fastify';

import '../plugins/auth/auth.plugin.types';
import type { JwtPayload, UserRole } from '../plugins/auth/auth.plugin.types';
import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

export const TEST_JWT_SECRET = 'test-secret-that-is-at-least-32-chars-long!!';

export async function buildBaseApp(): Promise<FastifyInstance> {
  const app = Fastify({ logger: false });

  await app.register(fastifyCookie);
  await app.register(fastifyJwt, {
    secret: TEST_JWT_SECRET,
    cookie: { cookieName: 'token', signed: false },
  });

  app.decorate('authenticate', async (req: FastifyRequest, reply: FastifyReply): Promise<void> => {
    try {
      await req.jwtVerify();
    } catch {
      await reply
        .status(401)
        .send({ statusCode: 401, message: 'Unauthorized', error: 'Unauthorized' });
    }
  });

  app.decorate(
    'authorize',
    (role: UserRole) =>
      async (req: FastifyRequest, reply: FastifyReply): Promise<void> => {
        try {
          await req.jwtVerify();
          if (req.user.role !== role && req.user.role !== 'admin') {
            await reply
              .status(403)
              .send({ statusCode: 403, message: 'Forbidden', error: 'Forbidden' });
          }
        } catch {
          await reply
            .status(401)
            .send({ statusCode: 401, message: 'Unauthorized', error: 'Unauthorized' });
        }
      },
  );

  return app;
}

export function signTestToken(
  app: FastifyInstance,
  payload: Partial<JwtPayload> & { sub: string },
): string {
  return app.jwt.sign({
    sub: payload.sub,
    email: payload.email ?? 'test@example.com',
    role: payload.role ?? 'viewer',
  });
}

export function cookieHeader(token: string): string {
  return `token=${token}`;
}
