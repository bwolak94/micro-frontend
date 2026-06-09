# MFE Portfolio Platform

> An e-commerce admin panel built with microfrontend architecture — demonstrating Senior UI Lead / Senior Full-Stack engineering competencies.

[![CI](https://github.com/bwolak94/mfe-portfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/bwolak94/mfe-portfolio/actions/workflows/ci.yml)
[![Codecov](https://codecov.io/gh/bwolak94/mfe-portfolio/graph/badge.svg)](https://codecov.io/gh/bwolak94/mfe-portfolio)
[![Storybook](https://img.shields.io/badge/Storybook-deployed-FF4785?logo=storybook&logoColor=white)](https://bwolak94.github.io/mfe-portfolio/)
[![Docker](https://img.shields.io/badge/docker-ghcr.io-2496ED?logo=docker&logoColor=white)](https://github.com/bwolak94/mfe-portfolio/pkgs/container/mfe-portfolio-shell)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4+-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node](https://img.shields.io/badge/Node-20%20LTS-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![pnpm](https://img.shields.io/badge/pnpm-9+-F69220?logo=pnpm&logoColor=white)](https://pnpm.io/)
[![Turborepo](https://img.shields.io/badge/Turborepo-2+-EF4444?logo=turborepo&logoColor=white)](https://turbo.build/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

---

## Tech Stack

| Layer                 | Technology                       | Version           | Purpose                                        |
| --------------------- | -------------------------------- | ----------------- | ---------------------------------------------- |
| **Monorepo**          | pnpm workspaces + Turborepo      | pnpm 9+, Turbo 2+ | Workspace management, build pipeline, caching  |
| **Frontend (React)**  | React + TypeScript + Vite        | 18.3, 5.4+, 5+    | Shell, MFE Auth, MFE Dashboard                 |
| **Frontend (Vue)**    | Vue 3 + TypeScript + Vite        | 3.4+, 5+          | MFE Products — proof of framework-agnostic MFE |
| **Module Federation** | @originjs/vite-plugin-federation | latest            | Runtime composition of microfrontends          |
| **Routing**           | React Router                     | 6.22+             | Shell-level routing, MFE route delegation      |
| **Data Fetching**     | TanStack Query                   | 5+                | Server state, caching, optimistic updates      |
| **Global State**      | Zustand                          | 4+                | Minimal shared state (auth, theme)             |
| **Styling**           | Tailwind CSS + shadcn/ui         | 3.4+, latest      | Utility-first styling, accessible components   |
| **Forms**             | React Hook Form + Zod            | 7+, 3+            | Typed validation, schema-driven forms          |
| **Charts**            | Recharts                         | 2+                | Dashboard metrics visualisation                |
| **Backend**           | Fastify + TypeScript             | 4+, 5.4+          | BFF — aggregates data, handles auth/JWT        |
| **ORM**               | Drizzle ORM                      | latest            | Type-safe DB access, migrations                |
| **Database**          | PostgreSQL                       | 16                | Persistent storage                             |
| **Logging**           | Pino + Loki + Promtail           | —                 | Structured JSON logs → Grafana Loki            |
| **Metrics**           | Prometheus + Grafana             | —                 | Request metrics, container metrics (cAdvisor)  |
| **Testing**           | Vitest + RTL + Playwright        | —                 | Unit, integration, E2E, a11y (axe-core)        |
| **CI/CD**             | GitHub Actions + Turborepo cache | —                 | Lint / test / build / docker pipeline          |
| **Containers**        | Docker multi-stage + Nginx       | —                 | Production-ready images, reverse proxy         |

---

## Architecture

> Coming soon — full architecture diagram, ADR index, and observability screenshots.

The platform follows a **host-remote Module Federation** pattern:

```
Browser
  └── Shell (host) :3000
        ├── loads MFE Auth      :3001  (React 18)
        ├── loads MFE Dashboard :3002  (React 18)
        └── loads MFE Products  :3003  (Vue 3)
                    │
              BFF (Fastify) :4000
                    │
              PostgreSQL + Redis
```

Each MFE is an independently deployable unit. Communication between MFEs flows through:

1. **URL / Router state** — first choice, bookmarkable
2. **`@portfolio/event-bus`** — typed pub/sub for cross-MFE events
3. **Auth context in Shell** — propagated via React Context Provider

See [`docs/adr/`](./docs/adr/) for Architecture Decision Records.

---

## Quick Start

```bash
# Prerequisites: Node 20 LTS, pnpm 9+
node --version  # v20.x.x
pnpm --version  # 9.x.x

# Install dependencies
pnpm install

# Start all apps in development mode
pnpm dev

# Or start the full stack with Docker
docker compose -f docker-compose.dev.yml up
```

| App           | URL                   |
| ------------- | --------------------- |
| Shell         | http://localhost:3000 |
| MFE Auth      | http://localhost:3001 |
| MFE Dashboard | http://localhost:3002 |
| MFE Products  | http://localhost:3003 |
| BFF API       | http://localhost:4000 |
| Grafana       | http://localhost:3100 |

---

## Project Structure

```
mfe-portfolio/
├── apps/
│   ├── shell/          # Host app — React 18 + Module Federation (host)
│   ├── mfe-auth/       # Auth MFE — login / register (React 18)
│   ├── mfe-dashboard/  # Dashboard MFE — metrics, charts (React 18)
│   ├── mfe-products/   # Products MFE — CRUD (Vue 3)
│   └── bff/            # Backend-for-Frontend — Fastify + Pino
├── packages/
│   ├── ui/             # Design system — shadcn/ui components
│   ├── shared-types/   # Cross-MFE TypeScript types
│   ├── event-bus/      # Typed pub/sub (EventTarget-based)
│   ├── logger/         # Frontend structured logger → BFF
│   ├── api-client/     # Base HTTP client + interceptors
│   ├── test-utils/     # Shared render helpers, MSW handlers
│   ├── tsconfig/       # Shared TypeScript config presets
│   └── eslint-config/  # Shared ESLint flat configs
├── docs/
│   └── adr/            # Architecture Decision Records
├── turbo.json
├── pnpm-workspace.yaml
└── docker-compose.yml
```

---

## Scripts

```bash
pnpm build       # Build all packages and apps (Turborepo, cached)
pnpm dev         # Start all apps in watch mode
pnpm lint        # Lint all packages
pnpm lint:fix    # Auto-fix lint issues
pnpm test        # Run all tests
pnpm typecheck   # TypeScript check across the monorepo
pnpm format      # Format all files with Prettier
pnpm clean       # Remove all build artefacts and caches
```

---

## What I'd Change for Production

This is a portfolio project. Here's what a production deployment would add:

- **K8s** instead of docker-compose — each MFE as a separate `Deployment`, HPA for autoscaling
- **CDN + MFE version manifest** — `remoteEntry.js` deployed to CloudFront with versioned paths, shell reads manifest at runtime for canary deployments
- **Dedicated IdP** (Keycloak / Auth0) instead of custom JWT — audited security, OIDC, MFA out-of-the-box
- **Service mesh** (Linkerd) — mTLS between MFE containers and BFF
- **Feature flags** (Unleash) — canary-deploy individual MFEs independently
- **Sentry + DataDog APM** — real-time error tracking and frontend performance
- **Synthetic monitoring** (Checkly) — proactive alerting on critical user journeys

---

## CI/CD

Three GitHub Actions workflows run automatically:

| Workflow                        | Trigger            | What it does                                       |
| ------------------------------- | ------------------ | -------------------------------------------------- |
| **CI** (`ci.yml`)               | Push / PR → `main` | Lint → Build → Unit tests → Coverage → E2E         |
| **Docker** (`docker.yml`)       | Push → `main`      | Build & push 5 images to GHCR (`latest` + SHA tag) |
| **Storybook** (`storybook.yml`) | Push → `main`      | Deploy `@portfolio/ui` Storybook to GitHub Pages   |

### Required secrets

| Secret          | Purpose                               |
| --------------- | ------------------------------------- |
| `TURBO_TOKEN`   | Turborepo remote cache authentication |
| `TURBO_TEAM`    | Turborepo remote cache team slug      |
| `CODECOV_TOKEN` | Upload coverage reports to Codecov    |

`GITHUB_TOKEN` is injected automatically by GitHub Actions for GHCR login.

### Branch protection (recommended)

Require the **CI** workflow to pass before merging to `main`:

1. Settings → Branches → Add rule → `main`
2. Check **Require status checks to pass** → select `Lint / Build / Test`
3. Check **Require branches to be up to date**

---

## Contributing

This is a portfolio project. Issues and discussions welcome via GitHub Issues.

---

## License

MIT
