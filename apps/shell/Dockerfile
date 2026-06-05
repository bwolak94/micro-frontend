# Stage 1: Prune monorepo to only shell and its dependencies
FROM node:20-alpine AS pruner
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate
WORKDIR /app
COPY . .
RUN pnpm dlx turbo prune shell --docker

# Stage 2: Install dependencies (separate layer for caching)
FROM node:20-alpine AS deps
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate
WORKDIR /app
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
RUN pnpm install --frozen-lockfile

# Stage 3: Build
FROM node:20-alpine AS builder
RUN corepack enable && corepack prepare pnpm@9.15.0 --activate
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages ./packages
COPY --from=pruner /app/out/full/ .
RUN pnpm turbo run build --filter=shell

# Stage 4: Serve with nginx
FROM nginx:alpine AS runner
COPY --from=builder /app/apps/shell/dist /usr/share/nginx/html
COPY docker/nginx/app.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
