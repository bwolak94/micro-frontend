import fastifyCookie from '@fastify/cookie';
import fastifyJwt from '@fastify/jwt';
import fp from 'fastify-plugin';

import './auth.plugin.types';

import type { UserRole } from './auth.plugin.types';
import type { Config } from '../../config';
import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

export const authPlugin = fp(async function (
  fastify: FastifyInstance,
  opts: { config: Config },
): Promise<void> {
  await fastify.register(fastifyCookie);

  await fastify.register(fastifyJwt, {
    secret: opts.config.JWT_SECRET,
    cookie: { cookieName: 'token', signed: false },
  });

  fastify.decorate(
    'authenticate',
    async (req: FastifyRequest, reply: FastifyReply): Promise<void> => {
      try {
        await req.jwtVerify();
      } catch {
        await reply
          .status(401)
          .send({ statusCode: 401, message: 'Unauthorized', error: 'Unauthorized' });
      }
    },
  );

  fastify.decorate(
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
});
