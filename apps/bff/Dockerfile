# Stage 1: Prune monorepo to only bff and its dependencies
FROM node:20-alpine AS pruner
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate
WORKDIR /app
COPY . .
RUN pnpm dlx turbo prune @portfolio/bff --docker

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
COPY --from=deps /app/ .
COPY --from=pruner /app/out/full/ .
RUN pnpm turbo run build --filter=@portfolio/bff

# Stage 4: Production runtime — install only prod deps, copy compiled output
FROM node:20-alpine AS runner
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate
WORKDIR /app

# Install production deps only
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install --frozen-lockfile --prod --ignore-scripts

# Copy compiled output and migrations into the app directory
# so Node.js resolves packages from apps/bff/node_modules
COPY --from=builder /app/apps/bff/dist ./apps/bff/dist
COPY --from=builder /app/apps/bff/drizzle ./apps/bff/drizzle

# Copy entrypoint script
COPY apps/bff/docker-entrypoint.sh ./apps/bff/docker-entrypoint.sh
RUN chmod +x ./apps/bff/docker-entrypoint.sh

WORKDIR /app/apps/bff
EXPOSE 4000
ENTRYPOINT ["./docker-entrypoint.sh"]
