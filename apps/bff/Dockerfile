# Stage 1: Prune monorepo to only bff and its dependencies
FROM node:20-alpine AS pruner
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate
WORKDIR /app
COPY . .
RUN pnpm dlx turbo prune bff --docker

# Stage 2: Install all dependencies (dev + prod for building)
FROM node:20-alpine AS deps
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate
WORKDIR /app
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install --frozen-lockfile

# Stage 3: Compile TypeScript
FROM node:20-alpine AS builder
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages ./packages
COPY --from=pruner /app/out/full/ .
RUN pnpm turbo run build --filter=bff

# Stage 4: Production runtime — install only prod deps, copy compiled output
FROM node:20-alpine AS runner
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate
WORKDIR /app

# Install production deps only
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install --frozen-lockfile --prod

# Copy compiled output and migrations
COPY --from=builder /app/apps/bff/dist ./dist
COPY --from=builder /app/apps/bff/drizzle ./drizzle

# Copy entrypoint script
COPY apps/bff/docker-entrypoint.sh ./docker-entrypoint.sh
RUN chmod +x ./docker-entrypoint.sh

EXPOSE 4000
ENTRYPOINT ["./docker-entrypoint.sh"]
