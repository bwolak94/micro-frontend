import { zodToJsonSchema } from 'zod-to-json-schema';

import { authLoginErrorsTotal, authLoginTotal } from '../../plugins/metrics';
import { loginBodySchema, registerBodySchema } from '../../schemas/auth.schema';
import { AuthError } from '../../services/auth/auth.service.types';

import type { AuthRoutesOpts, LoginRoute, RegisterRoute } from './auth.routes.types';
import type { FastifyInstance } from 'fastify';

export async function authRoutes(fastify: FastifyInstance, opts: AuthRoutesOpts): Promise<void> {
  const { authService } = opts;

  fastify.post<LoginRoute>(
    '/api/auth/login',
    { schema: { body: zodToJsonSchema(loginBodySchema) } },
    async (req, reply) => {
      authLoginTotal.inc();
      try {
        const user = await authService.verifyCredentials(req.body.email, req.body.password);
        const token = await reply.jwtSign({ sub: user.id, email: user.email, role: user.role });
        return reply
          .setCookie('token', token, {
            httpOnly: true,
            secure: process.env['COOKIE_SECURE'] === 'true',
            sameSite: 'lax',
            path: '/',
          })
          .send({ user });
      } catch (err) {
        if (err instanceof AuthError) {
          authLoginErrorsTotal.inc();
          return reply
            .status(err.statusCode)
            .send({ statusCode: err.statusCode, message: err.message, error: 'Unauthorized' });
        }
        throw err;
      }
    },
  );

  fastify.post<RegisterRoute>(
    '/api/auth/register',
    { schema: { body: zodToJsonSchema(registerBodySchema) } },
    async (req, reply) => {
      try {
        const user = await authService.createUser(req.body.name, req.body.email, req.body.password);
        const token = await reply.jwtSign({ sub: user.id, email: user.email, role: user.role });
        return reply
          .status(201)
          .setCookie('token', token, {
            httpOnly: true,
            secure: process.env['COOKIE_SECURE'] === 'true',
            sameSite: 'lax',
            path: '/',
          })
          .send({ user });
      } catch (err) {
        if (err instanceof AuthError) {
          return reply
            .status(err.statusCode)
            .send({ statusCode: err.statusCode, message: err.message, error: 'Conflict' });
        }
        throw err;
      }
    },
  );

  fastify.post('/api/auth/logout', async (_req, reply) => {
    return reply.clearCookie('token', { path: '/' }).send({ message: 'Logged out successfully' });
  });

  fastify.get('/api/auth/me', { preHandler: [fastify.authenticate] }, async (req, reply) => {
    const user = await authService.getUserById(req.user.sub);
    if (user === null) {
      return reply
        .status(404)
        .send({ statusCode: 404, message: 'User not found', error: 'Not Found' });
    }
    return reply.send({ user });
  });
}
