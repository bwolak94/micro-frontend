import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';
import Fastify from 'fastify';

import { loadConfig } from './config';
import { createDatabase } from './domain/db';
import { createDashboardRepository } from './domain/repositories/dashboard.repository';
import { createProductsRepository } from './domain/repositories/products.repository';
import { createUsersRepository } from './domain/repositories/users.repository';
import { authPlugin } from './plugins/auth/auth.plugin';
import { corsPlugin } from './plugins/cors';
import { loggerPlugin } from './plugins/logger';
import { rateLimitPlugin } from './plugins/rateLimit';
import { authRoutes } from './routes/auth/auth.routes';
import { dashboardRoutes } from './routes/dashboard/dashboard.routes';
import { logsRoutes } from './routes/logs/logs.routes';
import { productsRoutes } from './routes/products/products.routes';
import { createAuthService } from './services/auth/auth.service';
import { createDashboardService } from './services/dashboard/dashboard.service';
import { createProductsService } from './services/products/products.service';

async function build(): Promise<ReturnType<typeof Fastify>> {
  const config = loadConfig();
  const isDev = config.NODE_ENV !== 'production';

  const app = Fastify({
    logger: isDev
      ? {
          transport: { target: 'pino-pretty', options: { colorize: true } },
          level: 'info',
        }
      : { level: 'info' },
  });

  // Swagger (register before routes)
  await app.register(fastifySwagger, {
    openapi: {
      info: {
        title: 'MFE Portfolio BFF',
        version: '1.0.0',
        description: 'Backend for Frontend API',
      },
      servers: [{ url: `http://localhost:${String(config.PORT)}` }],
    },
  });
  await app.register(fastifySwaggerUi, { routePrefix: '/docs' });

  // Core plugins
  await app.register(loggerPlugin, { config });
  await app.register(corsPlugin, { config });
  await app.register(rateLimitPlugin);
  await app.register(authPlugin, { config });

  // Database + services
  const db = createDatabase(config.DATABASE_URL);
  const usersRepo = createUsersRepository(db);
  const productsRepo = createProductsRepository(db);
  const dashboardRepo = createDashboardRepository(db);

  const authService = createAuthService(usersRepo);
  const productsService = createProductsService(productsRepo);
  const dashboardService = createDashboardService(dashboardRepo);

  // Health & metrics endpoints
  app.get('/health', async (_req, reply) => {
    return reply.send({ status: 'ok', uptime: process.uptime(), version: '1.0.0' });
  });

  app.get('/metrics', async (_req, reply) => {
    const mem = process.memoryUsage();
    const lines = [
      `# HELP process_uptime_seconds Process uptime in seconds`,
      `# TYPE process_uptime_seconds gauge`,
      `process_uptime_seconds ${process.uptime().toFixed(2)}`,
      `# HELP process_heap_bytes Node.js heap used bytes`,
      `# TYPE process_heap_bytes gauge`,
      `process_heap_bytes ${String(mem.heapUsed)}`,
    ];
    return reply.header('Content-Type', 'text/plain; charset=utf-8').send(lines.join('\n'));
  });

  // Routes
  await app.register(authRoutes, { authService });
  await app.register(productsRoutes, { productsService });
  await app.register(dashboardRoutes, { dashboardService });
  await app.register(logsRoutes);

  return app;
}

async function start(): Promise<void> {
  const config = loadConfig();
  const app = await build();

  const shutdown = async (): Promise<void> => {
    app.log.info('Shutting down server...');
    await app.close();
    process.exit(0);
  };

  process.on('SIGTERM', () => void shutdown());
  process.on('SIGINT', () => void shutdown());

  try {
    await app.listen({ port: config.PORT, host: '0.0.0.0' });
    app.log.info(`Server listening on port ${String(config.PORT)}`);
    app.log.info(`Swagger UI: http://localhost:${String(config.PORT)}/docs`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
}

void start();
