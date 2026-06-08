import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    server: 'src/server.ts',
    migrate: 'src/migrate.ts',
  },
  format: ['esm'],
  target: 'node20',
  outDir: 'dist',
  clean: true,
  sourcemap: false,
  splitting: false,
  bundle: true,
  // External: keep node built-ins and large native deps external
  external: [
    'postgres',
    'bcryptjs',
    '@fastify/jwt',
    '@fastify/cookie',
    '@fastify/cors',
    '@fastify/rate-limit',
    '@fastify/swagger',
    '@fastify/swagger-ui',
    'fastify',
    'fastify-plugin',
    'drizzle-orm',
    'prom-client',
    'zod',
    'zod-to-json-schema',
  ],
  noExternal: ['@portfolio/shared-types'],
});
