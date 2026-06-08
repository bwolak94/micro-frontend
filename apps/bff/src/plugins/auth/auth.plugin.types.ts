import type { FastifyReply, FastifyRequest } from 'fastify';

export type UserRole = 'admin' | 'manager' | 'viewer';

export interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
}

export type { FastifyReply, FastifyRequest };

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: JwtPayload;
    user: JwtPayload;
  }
}

declare module 'fastify' {
  interface FastifyInstance {
    authenticate: (req: FastifyRequest, reply: FastifyReply) => Promise<void>;
    authorize: (role: UserRole) => (req: FastifyRequest, reply: FastifyReply) => Promise<void>;
  }
}
