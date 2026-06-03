# PRD — Microfrontend Portfolio Platform

> **Product Requirements Document**
> Wersja: 1.0
> Autor: Bartosz
> Status: Draft → Implementation
> Cel dokumentu: kompletna specyfikacja projektu portfolio prezentującego senior-level kompetencje frontend i full-stack.

---

## 1. Streszczenie wykonawcze

### 1.1 Czym jest ten projekt

**MFE Portfolio Platform** to działająca aplikacja typu _e-commerce admin panel_ zbudowana w architekturze mikrofrontendów. Projekt służy jako portfolio prezentujące dojrzałość architektoniczną na poziomie **Senior UI Lead / Senior Full-Stack Developer**.

Aplikacja składa się z aplikacji-hosta (shell) ładującej w runtime niezależne mikrofrontendy, każdy odpowiadający za inną domenę biznesową (autentykacja, dashboard, produkty). Całość jest zdockeryzowana, ma własny BFF, structured logging, observability stack i pipeline CI/CD.

### 1.2 Dlaczego mikrofrontendy

Mikrofrontendy są wybrane jako **pretekst do pokazania dojrzałości architektonicznej**, nie dlatego że są optymalnym rozwiązaniem dla każdej aplikacji. PRD wprost dokumentuje trade-offy (sekcja 14), bo rekruter senior-level oceni _zrozumienie kompromisów_ wyżej niż samo użycie modnej technologii.

### 1.3 Kryteria sukcesu

| Kryterium                           | Cel mierzalny                                        |
| ----------------------------------- | ---------------------------------------------------- |
| First-glance jakości README         | rekruter w 5 minut rozumie architekturę i decyzje    |
| Setup lokalny                       | jedno polecenie `docker compose up` uruchamia całość |
| Test coverage                       | ≥ 70% linii w packages, ≥ 60% w apps                 |
| Build time monorepo (cold)          | < 90s na GitHub Actions runner                       |
| Build time (cached przez Turborepo) | < 15s                                                |
| Bundle size shell (gzipped)         | < 80 kB                                              |
| Lighthouse Performance shell        | ≥ 90                                                 |
| Lighthouse Accessibility            | ≥ 95                                                 |
| TypeScript strict mode              | 100% kodu, zero `any` w PR                           |
| CI pipeline                         | < 5 min full run                                     |

---

## 2. Cele i zakres

### 2.1 Cele projektu

1. **Pokazać znajomość Module Federation** w środowisku Vite (nie webpack — bo Vite to obecny standard, a setup ModFed na Vite jest trudniejszy = większy _signal_ dla seniora).
2. **Pokazać polyglot frontend** — jeden MFE w Vue 3 mimo że pozostałe są w React, by udowodnić framework-agnostic podejście.
3. **Pokazać kompetencje full-stack** przez BFF z Fastify, structured logging, Docker, observability.
4. **Pokazać dyscyplinę inżynierską** — TypeScript strict, testy (unit + integration + e2e), CI/CD, dokumentację ADR.
5. **Być realnym workflow'em**, nie demo — czyli faktyczny domain logic (CRUD produktów, auth flow), a nie "Hello World" w trzech ramkach.

### 2.2 Out of scope (świadome wykluczenia)

Następujące rzeczy są **celowo poza zakresem**, by projekt był skończony, a nie wieczny:

- Produkcyjne deploymenty na Kubernetes (zostawiamy docker-compose, K8s w sekcji "Future Work" w README).
- Real-time collaboration / WebSockets — overkill dla demo.
- Pełna implementacja płatności — mock w BFF wystarczy.
- Internacjonalizacja (i18n) — pokaż w jednym MFE jako proof, ale nie wszędzie.
- SSR / SSG — MFE z Module Federation w SSR to wciąż zaawansowany research topic, nie warto ryzykować w portfolio.
- Mobile responsiveness na poziomie pixel-perfect — ma działać i wyglądać OK, ale fokus jest na architekturze.

**Dlaczego ważne to wypisać:** Senior PRD pokazuje _świadome ograniczenia_. Brak sekcji "out of scope" w PRD to czerwona flaga.

---

## 3. Persona i scenariusze użytkownika

Aplikacja udaje **wewnętrzny admin panel sklepu e-commerce**. Persona to _Marta — managerka operacyjna sklepu_.

**Scenariusz 1 (auth):** Marta wchodzi na `/login`, MFE Auth obsługuje logowanie, po sukcesie shell ustawia globalny stan auth, redirect na `/dashboard`.

**Scenariusz 2 (dashboard):** Dashboard MFE pobiera metryki sprzedażowe z BFF, renderuje wykresy. Click na kartę produktu → routing przekazuje sterowanie do MFE Products.

**Scenariusz 3 (CRUD):** W MFE Products Marta edytuje produkt. Po zapisie event-bus emituje `product:updated`, dashboard nasłuchuje i odświeża widget "ostatnio zmienione".

Scenariusze są **proste celowo** — chodzi o to, by pokazać _jak_ MFE się komunikują, nie _co_ robi biznes.

---

## 4. Architektura systemu

### 4.1 Diagram wysokopoziomowy

```
                      ┌────────────────────────┐
                      │      Użytkownik         │
                      │  (browser, Chrome 120+) │
                      └───────────┬────────────┘
                                  │
                      ┌───────────▼────────────┐
                      │   Nginx Reverse Proxy   │
                      │       :80 / :443        │
                      └───┬──────┬──────┬──┬────┘
                          │      │      │  │
            ┌─────────────┘      │      │  └──────────────┐
            │                    │      │                  │
    ┌───────▼────────┐  ┌────────▼────┐ │  ┌──────────────▼─────┐
    │  Shell (Host)  │  │ MFE: Auth   │ │  │  MFE: Products      │
    │  React 18 + TS │  │ React + TS  │ │  │  Vue 3 + TS         │
    │      :3000     │  │   :3001     │ │  │     :3003           │
    └────┬───────────┘  └─────┬───────┘ │  └────────┬────────────┘
         │                    │         │           │
         │           ┌────────▼─────────▼───┐       │
         │           │   MFE: Dashboard      │       │
         │           │   React + TS  :3002   │       │
         │           └────────┬──────────────┘       │
         │                    │                      │
         │                    │                      │
         └────────────────────┼──────────────────────┘
                              │ (HTTP/JSON)
                  ┌───────────▼────────────┐
                  │   BFF (Fastify + TS)    │
                  │         :4000           │
                  └───────────┬────────────┘
                              │ (stdout JSON logs)
                  ┌───────────▼────────────┐
                  │    Promtail (sidecar)   │
                  └───────────┬────────────┘
                              │
            ┌─────────────────┼─────────────────┐
            │                 │                 │
    ┌───────▼──────┐  ┌───────▼──────┐  ┌──────▼──────┐
    │     Loki      │  │  Prometheus  │  │   Grafana    │
    │  (logs store) │  │   (metrics)  │  │     :3100    │
    └───────────────┘  └──────────────┘  └──────────────┘
```

### 4.2 Decyzje architektoniczne (ADR-style)

Każda decyzja w PRD ma format: **co**, **dlaczego**, **alternatywy odrzucone**. To wzorzec ADR (Architecture Decision Record) — senior must-have.

#### ADR-001: Module Federation (Vite) zamiast iframe / Web Components / Single-SPA

- **Co:** Każdy MFE eksponuje moduły przez `@originjs/vite-plugin-federation`, shell ładuje je w runtime.
- **Dlaczego:** Module Federation to **branżowy standard** dla MFE w 2025/2026. Pozwala na shared dependencies (jeden React zamiast n), runtime composition, niezależne deploye.
- **Alternatywy odrzucone:**
  - _iframe_ — najbezpieczniejsze, ale fatalna UX (osobne scrollbary, brak shared state, dziwne deep-linki).
  - _Web Components_ — eleganckie, ale tracimy ekosystem React (hooki, Suspense, biblioteki).
  - _Single-SPA_ — działa, ale boilerplate jest większy i community mniejsze niż wokół ModFed.
  - _Webpack 5 ModFed_ — działa identycznie, ale Vite jest szybszy w dev i bardziej "future-proof". Pokazanie ModFed na Vite to większy _signal_.

#### ADR-002: pnpm + Turborepo zamiast Nx / Lerna / Rush

- **Co:** Monorepo zarządzane przez **pnpm workspaces** + **Turborepo** do orkiestracji buildów.
- **Dlaczego:**
  - pnpm — symlinki + content-addressable store, ~3× szybszy install niż npm/yarn, **strict mode** chroni przed phantom dependencies (ważne w MFE!).
  - Turborepo — prosty config, świetny cache (lokalny + remote), task pipeline. Mniej narzutu niż Nx, którego pełne możliwości w portfolio i tak nie wykorzystamy.
- **Alternatywy odrzucone:**
  - _Nx_ — potężniejszy, ale boilerplate i lock-in na Nx-specific patterny.
  - _Lerna_ — legacy, nie ma sensu w 2026.
  - _Rush_ — Microsoftowy, niszowy, mała community.

#### ADR-003: Vite zamiast Webpack / Rspack

- **Co:** Każda aplikacja używa Vite z `@originjs/vite-plugin-federation`.
- **Dlaczego:** dev server uruchamia się w <1s, HMR jest natychmiastowy, ESM-first podejście pasuje do nowoczesnego MFE. Webpack jest 5× wolniejszy w dev.
- **Trade-off:** plugin federation dla Vite jest community-driven (nie oficjalny), ma drobne ograniczenia (np. dynamic remotes). Wymieniamy to wprost w README.

#### ADR-004: React 18 + jeden MFE w Vue 3

- **Co:** Shell, Auth, Dashboard w React 18. Products w Vue 3.
- **Dlaczego:** Pokazujemy że MFE jest _framework-agnostic_. To kluczowy _selling point_ MFE — gdyby wszystko było w React, równie dobrze można by zrobić zwykły monolit React.
- **Trade-off:** dwa frameworki w bundle = większy payload. Akceptowalne dla demo, opisane w README jako "production consideration".

#### ADR-005: TypeScript strict mode wszędzie

- **Co:** `strict: true`, `noUncheckedIndexedAccess: true`, `exactOptionalPropertyTypes: true` w każdym `tsconfig.json`.
- **Dlaczego:** Brak TS w 2026 to disqualifier. Strict mode pokazuje dyscyplinę. `noUncheckedIndexedAccess` to _senior signal_ — większość ludzi nie wie że istnieje.
- **Cross-MFE typing:** wspólne typy w `packages/shared-types`, MFE importują przez alias `@portfolio/types`.

#### ADR-006: Fastify zamiast Express dla BFF

- **Co:** Backend w Fastify + TypeScript.
- **Dlaczego:** ~2× szybszy niż Express, natywne wsparcie JSON Schema (walidacja + dokumentacja w jednym), pluginy o jakości production-grade, świetnie integruje się z Pino (logging).
- **Alternatywy odrzucone:** Express (legacy, słabszy DX), NestJS (overkill dla cienkiego BFF), Hono (świetny, ale mniej rozpoznawalny przez rekruterów).

#### ADR-007: Loki + Promtail + Grafana zamiast ELK

- **Co:** Stack obserwowalności oparty na Grafana Loki.
- **Dlaczego:** Loki jest **dramatycznie lżejszy** niż Elasticsearch (label-based indexing, nie full-text). Idealny do portfolio bo wstaje w 30s w docker-compose, nie zjada 4 GB RAM. Grafana zna każdy DevOps.
- **Alternatywy odrzucone:** ELK (zbyt ciężki), Datadog/New Relic (płatne, SaaS), własny ClickHouse (overkill).

#### ADR-008: Komunikacja MFE przez custom event bus + URL state

- **Co:** Wspólny pakiet `@portfolio/event-bus` bazujący na `EventTarget` z typowaniem TS. Stan dzielony minimalnie — głównie auth context i theme.
- **Dlaczego:** Tight coupling przez shared global state to **klasyczny anty-wzorzec MFE**. URL i events są loosely-coupled, łatwe do testowania.
- **Co NIE jest w shared state:** dane produktowe, dane użytkownika, formularze — każdy MFE pobiera własne dane z BFF.

---

## 5. Struktura monorepo

```
mfe-portfolio/
├── apps/
│   ├── shell/                          # Host app (React 18 + TS + Vite)
│   │   ├── src/
│   │   │   ├── App.tsx
│   │   │   ├── bootstrap.tsx           # entry point dla ModFed
│   │   │   ├── router/                 # React Router v6
│   │   │   ├── layout/                 # AppShell, Sidebar, Topbar
│   │   │   ├── providers/              # AuthProvider, ThemeProvider, QueryProvider
│   │   │   ├── error-boundary/         # MFEErrorBoundary z fallback UI
│   │   │   └── remotes/                # typowane wrappery dla każdego remote
│   │   ├── vite.config.ts              # konfiguracja Module Federation (host)
│   │   ├── tsconfig.json
│   │   ├── Dockerfile
│   │   └── package.json
│   │
│   ├── mfe-auth/                       # MFE: logowanie/rejestracja
│   │   ├── src/
│   │   │   ├── bootstrap.tsx
│   │   │   ├── LoginForm.tsx
│   │   │   ├── RegisterForm.tsx
│   │   │   └── api/authClient.ts
│   │   └── vite.config.ts              # exposes: ./LoginPage, ./RegisterPage
│   │
│   ├── mfe-dashboard/                  # MFE: dashboard z metrykami
│   │   ├── src/
│   │   │   ├── bootstrap.tsx
│   │   │   ├── widgets/
│   │   │   │   ├── SalesChart.tsx
│   │   │   │   ├── RecentOrders.tsx
│   │   │   │   └── ProductActivity.tsx  # nasłuchuje event-bus
│   │   │   └── api/dashboardClient.ts
│   │   └── vite.config.ts              # exposes: ./DashboardPage
│   │
│   ├── mfe-products/                   # MFE: produkty (Vue 3)
│   │   ├── src/
│   │   │   ├── bootstrap.ts
│   │   │   ├── App.vue
│   │   │   ├── views/
│   │   │   │   ├── ProductList.vue
│   │   │   │   └── ProductEdit.vue
│   │   │   └── api/productsClient.ts
│   │   └── vite.config.ts              # exposes: ./ProductsApp
│   │
│   └── bff/                            # Backend-for-frontend
│       ├── src/
│       │   ├── server.ts               # Fastify bootstrap
│       │   ├── routes/
│       │   │   ├── auth.ts
│       │   │   ├── products.ts
│       │   │   ├── dashboard.ts
│       │   │   └── logs.ts             # endpoint do zbierania logów z frontu
│       │   ├── plugins/
│       │   │   ├── auth.ts             # JWT, RBAC
│       │   │   ├── logger.ts           # Pino config
│       │   │   ├── cors.ts
│       │   │   └── rate-limit.ts
│       │   ├── domain/                 # logika biznesowa
│       │   └── schemas/                # JSON Schema dla walidacji
│       ├── tsconfig.json
│       ├── Dockerfile
│       └── package.json
│
├── packages/
│   ├── ui/                             # design system
│   │   ├── src/components/             # Button, Input, Card, Modal, Toast...
│   │   ├── .storybook/
│   │   └── package.json
│   │
│   ├── shared-types/                   # wspólne typy TS
│   │   └── src/
│   │       ├── domain.ts               # User, Product, Order
│   │       ├── api.ts                  # request/response shapes
│   │       └── events.ts               # typowanie event-bus
│   │
│   ├── event-bus/                      # typed pub/sub
│   │   └── src/index.ts
│   │
│   ├── logger/                         # frontowy logger wysyłający do BFF
│   │   └── src/
│   │       ├── createLogger.ts
│   │       └── transports/
│   │
│   ├── api-client/                     # bazowy HTTP client + interceptory
│   │   └── src/
│   │
│   ├── eslint-config/                  # shared ESLint config
│   ├── tsconfig/                       # shared tsconfig presets
│   └── test-utils/                     # custom render, msw handlers
│
├── docker/
│   ├── nginx/
│   │   └── nginx.conf
│   ├── loki/
│   │   └── loki-config.yml
│   ├── promtail/
│   │   └── promtail-config.yml
│   ├── grafana/
│   │   ├── provisioning/
│   │   │   ├── datasources/
│   │   │   └── dashboards/
│   │   └── dashboards/                 # JSON dashboardy do automatycznego importu
│   └── prometheus/
│       └── prometheus.yml
│
├── .github/
│   └── workflows/
│       ├── ci.yml                      # lint + test + build na PR
│       ├── docker.yml                  # build & push images on main
│       └── storybook.yml               # deploy Storybook na GH Pages
│
├── docs/
│   ├── adr/                            # Architecture Decision Records
│   │   ├── 001-module-federation.md
│   │   ├── 002-monorepo-tooling.md
│   │   └── ...
│   ├── architecture.md                 # rozbudowana wersja sekcji 4
│   ├── runbook.md                      # jak debugować w razie problemów
│   └── images/                         # diagramy, screenshoty
│
├── docker-compose.yml                  # produkcyjny stack (zbudowane MFE + nginx + observability)
├── docker-compose.dev.yml              # dev stack (tylko BFF + observability + DB)
├── turbo.json
├── pnpm-workspace.yaml
├── .nvmrc                              # Node 20 LTS
├── .editorconfig
├── .gitignore
├── README.md                           # główna wizytówka projektu
└── PRD.md                              # ten dokument
```

**Dlaczego taka struktura:**

- `apps/` vs `packages/` — apps są deployowalne, packages są bibliotekami. Standard w Nx/Turborepo, czytelny dla każdego.
- `bootstrap.tsx` jako osobny plik — wymóg Module Federation (asynchroniczne ładowanie shared deps wymaga dynamicznego importu entry pointa).
- `docs/adr/` — pokazuje że dokumentujesz decyzje. Rekruterzy _kochają_ ADRs.

---

## 6. Stack technologiczny — pełne uzasadnienie

### 6.1 Frontend core

| Technologia                          | Wersja | Zastosowanie                   | Dlaczego                                                               |
| ------------------------------------ | ------ | ------------------------------ | ---------------------------------------------------------------------- |
| **TypeScript**                       | 5.4+   | wszystko                       | strict mode, brak `any`, type-safety cross-MFE przez `shared-types`    |
| **React**                            | 18.3   | shell, mfe-auth, mfe-dashboard | concurrent features (Suspense dla ładowania MFE), największa community |
| **Vue**                              | 3.4    | mfe-products                   | dowód że MFE są framework-agnostic                                     |
| **Vite**                             | 5+     | bundler każdej app             | szybki dev server, ESM-native, integracja z ModFed                     |
| **@originjs/vite-plugin-federation** | latest | Module Federation w Vite       | jedyny dojrzały plugin dla Vite ModFed                                 |
| **React Router**                     | 6.22+  | routing w shell                | declarative routing, kompatybilny z Suspense                           |
| **TanStack Query**                   | 5+     | data fetching                  | caching, deduplikacja, optimistic updates, devtools                    |
| **Zustand**                          | 4+     | minimalny global state         | lekka alternatywa dla Redux, świetna typowo                            |
| **Tailwind CSS**                     | 3.4+   | stylowanie                     | utility-first, prefiks per MFE zapobiega kolizjom                      |
| **shadcn/ui**                        | latest | bazowe komponenty              | kopiowane do `packages/ui`, pełna kontrola                             |
| **clsx** + **tailwind-merge**        | latest | conditional classes            | standard w ekosystemie shadcn                                          |
| **Recharts**                         | 2+     | wykresy w dashboard            | React-native, deklaratywne, popularne                                  |
| **Zod**                              | 3+     | runtime validation             | wspólny schema dla forma + API, type inference                         |
| **React Hook Form**                  | 7+     | formularze                     | minimalne re-rendery, integracja z Zod przez resolver                  |

### 6.2 Backend (BFF)

| Technologia             | Wersja | Zastosowanie                               | Dlaczego                                                                                |
| ----------------------- | ------ | ------------------------------------------ | --------------------------------------------------------------------------------------- |
| **Node.js**             | 20 LTS | runtime                                    | LTS, stabilne, native fetch, test runner                                                |
| **Fastify**             | 4+     | HTTP server                                | wydajność, JSON Schema validation, plugin system                                        |
| **@fastify/jwt**        | latest | autentykacja                               | dojrzały, dobrze udokumentowany                                                         |
| **@fastify/cors**       | latest | CORS dla MFE pochodzących z różnych portów | wymóg setupu MFE                                                                        |
| **@fastify/rate-limit** | latest | DDoS protection demo                       | pokazuje świadomość security                                                            |
| **Pino**                | 9+     | structured logging                         | najszybszy logger Node, JSON output → Loki                                              |
| **Pino-pretty**         | latest | dev logs                                   | czytelność w terminalu w dev                                                            |
| **Zod**                 | 3+     | walidacja runtime                          | te same schemas co frontend                                                             |
| **Drizzle ORM**         | latest | dostęp do DB                               | TS-first, lekki, świetne typy. Alternatywa Prisma — cięższa, ale prostsza w prototypach |
| **PostgreSQL**          | 16     | persystencja                               | standard branżowy, działa świetnie w Dockerze                                           |
| **Redis**               | 7      | cache + rate-limit storage                 | opcjonalnie dla pokazania                                                               |

**Dlaczego BFF a nie direct calls do hipotetycznych microserwisów:**
W realnej architekturze MFE każdy mikrofrontend często rozmawia z osobnym mikroserwisem backendu. W demo robimy _jeden BFF agregujący_ — to **wzorzec Backend-for-Frontend** zaproponowany przez SoundCloud i opisany przez Sama Newmana. Jest to standardowy partner architektoniczny dla MFE.

### 6.3 Testowanie

| Technologia                     | Zastosowanie              | Dlaczego                                                           |
| ------------------------------- | ------------------------- | ------------------------------------------------------------------ |
| **Vitest**                      | unit + integration testy  | natywny do Vite, ESM-first, ~5× szybszy niż Jest, kompatybilne API |
| **@testing-library/react**      | testy komponentów React   | testowanie zachowania zamiast implementacji — best practice        |
| **@testing-library/vue**        | testy komponentów Vue     | analogicznie dla Vue MFE                                           |
| **@testing-library/user-event** | symulacja interakcji      | bardziej realistyczne niż fireEvent                                |
| **MSW (Mock Service Worker)**   | mockowanie HTTP w testach | pracuje na poziomie sieci → te same mocki dla testów i Storybooka  |
| **Playwright**                  | e2e testy przez shell     | szybszy i stabilniejszy niż Cypress, trace viewer, multi-browser   |
| **@axe-core/playwright**        | testy a11y w e2e          | pokazuje że accessibility nie jest dopiskiem                       |
| **Stryker** _(opcjonalnie)_     | mutation testing          | _senior signal_ — pokazuje że rozumiesz limitations coverage       |
| **k6** _(opcjonalnie)_          | load testing BFF          | pokazuje świadomość performance                                    |

**Strategia testowa (test pyramid + szczegóły):**

- **Unit (Vitest)** — czysta logika, hooki, utility, walidatory. Cel: ~70% pokrycia w packages.
- **Integration (Vitest + RTL + MSW)** — komponenty z prawdziwą logiką + zamockowane API. Cel: krytyczne ścieżki w każdym MFE.
- **Contract tests** — dla każdego endpointu BFF test sprawdzający schemat odpowiedzi (Zod runtime + test).
- **E2E (Playwright)** — minimum 5 kluczowych scenariuszy: login → dashboard, edit product, error recovery (zabity MFE), cross-MFE event flow, RBAC denial.
- **A11y (axe)** — na każdym e2e teście automatyczna walidacja a11y.

**Dlaczego ten zestaw:** Vitest + RTL + Playwright to **obecny industry standard 2026**. MSW jest _senior signal_ — wielu juniorów wciąż mockuje przez jest.fn(), MSW pokazuje że rozumiesz wartość testowania na poziomie sieci.

### 6.4 Linting / formatting / hooks

| Technologia                   | Zastosowanie         | Dlaczego                                           |
| ----------------------------- | -------------------- | -------------------------------------------------- |
| **ESLint**                    | linting              | standard                                           |
| **@typescript-eslint**        | TS rules             | type-aware lintowanie                              |
| **eslint-plugin-react-hooks** | reguły hooków        | wyłapuje bugi przed runtime                        |
| **eslint-plugin-vue**         | dla mfe-products     |                                                    |
| **eslint-plugin-import**      | porządek importów    | spójność w monorepo                                |
| **eslint-plugin-jsx-a11y**    | a11y rules           | wczesne wyłapywanie problemów                      |
| **Prettier**                  | formatowanie         | end of debates                                     |
| **Husky** + **lint-staged**   | git hooks            | szybki feedback przed commit                       |
| **commitlint**                | conventional commits | czysty changelog + integracja z `semantic-release` |

### 6.5 DevOps / Observability

| Technologia                         | Zastosowanie                        | Dlaczego                                               |
| ----------------------------------- | ----------------------------------- | ------------------------------------------------------ |
| **Docker** + **multi-stage builds** | konteneryzacja każdej aplikacji     | mniejsze image, separacja build/runtime                |
| **Docker Compose**                  | orkiestracja lokalna                | wystarczające dla portfolio, K8s to overkill           |
| **Nginx** (alpine)                  | reverse proxy + serwowanie statyków | de-facto standard, lekki, łatwy SSL                    |
| **Loki**                            | log aggregation                     | label-based, lekki, query language LogQL               |
| **Promtail**                        | zbieranie logów z kontenerów        | natywna integracja z Loki                              |
| **Grafana**                         | dashboardy                          | każdy zna, świetne dashboardy auto-provision           |
| **Prometheus**                      | metryki                             | scrape `/metrics` z BFF (przez `fastify-metrics`)      |
| **cAdvisor**                        | metryki kontenerów                  | bezpłatny insight w CPU/RAM kontenerów                 |
| **OpenTelemetry** _(stretch)_       | distributed tracing                 | _strong senior signal_ — trace przez shell → MFE → BFF |

### 6.6 CI/CD

| Technologia                          | Zastosowanie                | Dlaczego                                       |
| ------------------------------------ | --------------------------- | ---------------------------------------------- |
| **GitHub Actions**                   | CI/CD                       | darmowe dla publicznych repo, dobre integracje |
| **Turborepo Remote Cache**           | współdzielony cache buildów | pokazuje że umiesz optymalizować CI            |
| **Docker Buildx** + **GHCR**         | build & push obrazów        | publish do GitHub Container Registry           |
| **Renovate**                         | auto-update zależności      | best-practice, lepszy niż Dependabot           |
| **semantic-release** _(opcjonalnie)_ | wersjonowanie pakietów      | automated versioning po conventional commits   |
| **Codecov**                          | publikacja coverage         | badge w README                                 |

---

## 7. Module Federation — szczegóły konfiguracji

### 7.1 Shared dependencies

Kluczowa decyzja — co dzielimy między MFE:

| Pakiet                  | Strategia                                     | Powód                                                                               |
| ----------------------- | --------------------------------------------- | ----------------------------------------------------------------------------------- |
| `react`, `react-dom`    | `singleton: true, requiredVersion: "^18.3.0"` | dwie instancje React = crash hooków                                                 |
| `react-router-dom`      | `singleton: true`                             | jeden router musi rządzić nawigacją                                                 |
| `@tanstack/react-query` | `singleton: true`                             | dzielimy cache między MFE                                                           |
| `vue`                   | `singleton: true` w Vue MFE                   | dla mfe-products                                                                    |
| `@portfolio/event-bus`  | `singleton: true`                             | event bus z definicji musi być jeden                                                |
| `@portfolio/ui`         | `singleton: false` (eager)                    | każdy MFE może mieć swoją wersję — _deliberate trade-off_ dla niezależnych deployów |
| `lodash`, `date-fns`    | nie shared                                    | małe utility, lepiej tree-shake lokalnie                                            |

### 7.2 Versioning & deploy independence

- Każdy MFE ma swój `package.json` z własną wersją (semver).
- Shell ma w `remotes` URL-e do `remoteEntry.js` każdego MFE. W dev wskazują `localhost:300X`, w prod — na statyki za nginxem.
- **Production strategy** (opisana w README): MFE byłyby deployowane niezależnie na CDN, shell trzymałby manifest mapujący wersje. W demo wszystko leci jednym `docker compose up`.

### 7.3 Error boundary i fallback

Każdy remote w shellu jest opakowany w `<MFEErrorBoundary fallback={<MFEUnavailable name="Products" />}>`. Gdy MFE padnie (np. nie załaduje się `remoteEntry.js`), użytkownik widzi czytelny komunikat zamiast białego ekranu — _kluczowy element production-readiness MFE_.

---

## 8. Komunikacja między MFE

### 8.1 Hierarchia preferowanych mechanizmów (od luźnych do mocnych couplingów)

1. **URL / Router state** — pierwsza opcja zawsze. Bookmarkowalne, dzielalne, testowalne.
2. **Custom events przez `@portfolio/event-bus`** — dla "ogłoszeń" typu `product:updated`, `cart:changed`.
3. **Shared minimal state przez Context (w shellu)** — tylko: auth, theme, locale.
4. **Bezpośredni import komponentów** — _unikamy_. Tylko z `packages/ui`, nigdy cross-MFE.

### 8.2 Event Bus — kontrakt

```ts
// packages/event-bus/src/index.ts
import type { EventMap } from '@portfolio/shared-types';

class TypedEventBus<T extends Record<string, unknown>> {
  emit<K extends keyof T>(event: K, payload: T[K]): void;
  on<K extends keyof T>(event: K, handler: (payload: T[K]) => void): () => void;
}

export const eventBus = new TypedEventBus<EventMap>();
```

`EventMap` w `shared-types` jest **single source of truth** dla wszystkich eventów — pełny type-check cross-MFE.

### 8.3 Auth flow

1. Użytkownik → `/login` (route shell → renderuje `mfe-auth`).
2. MFE Auth POST `/api/auth/login` → BFF → JWT.
3. Shell zapisuje token w `httpOnly` cookie (BFF ustawia), w pamięci shellu jest `user` object.
4. `AuthContext` w shellu rozsyła stan przez Context Provider — Provider jest na poziomie shellu, MFE konsumują przez `useAuth()` z `packages/ui` (re-export contextu shellu — anti-pattern w klasycznym sensie, ale celowy dla _demo_ — opisany jako trade-off).

---

## 9. Logging — szczegóły

### 9.1 Strategia

Wszystkie logi (frontend + BFF) są w **structured JSON** i trafiają finalnie do Loki przez Promtail. Format jednolity:

```json
{
  "timestamp": "2026-05-14T10:23:45.123Z",
  "level": "info",
  "service": "mfe-dashboard",
  "version": "1.2.0",
  "traceId": "01HXY...",
  "spanId": "...",
  "userId": "user-42",
  "sessionId": "sess-abc",
  "message": "Widget loaded",
  "context": {
    "widget": "SalesChart",
    "loadTimeMs": 234
  }
}
```

### 9.2 Frontend logger

`packages/logger` eksportuje `createLogger(service: string)`. Wewnętrznie:

- Buforuje logi (10 logów lub 2s, whichever first).
- POST `/api/logs` do BFF.
- Fallback: `console` jeśli BFF niedostępny.
- W dev: dodatkowo `console.log` z prettify.
- Automatyczna propagacja `traceId` z headera response (W3C traceparent).

### 9.3 BFF logger

Pino z transportem `pino/file` do stdout (Docker zbiera stdout). Każdy request dostaje `traceId` (z headera albo generowany). Wszystkie logi z BFF mają go w polu `traceId`.

### 9.4 Promtail config

Promtail jest **sidecar** w docker-compose, mountuje `/var/lib/docker/containers` i wysyła do Loki z labelami `container_name`, `service`, `level`.

### 9.5 Grafana dashboards (auto-provisioned)

W repo będą dashboardy JSON automatycznie ładowane:

1. **Service Health** — log volume per service, error rate.
2. **MFE Errors** — błędy z każdego MFE, top 10 najczęstszych.
3. **User Journey** — śledzenie sesji przez `sessionId`.
4. **BFF Performance** — request duration histogram (z Prometheus).

**Screenshoty tych dashboardów lądują w README** — _one of the strongest visual selling points_ projektu.

---

## 10. Bezpieczeństwo

Sekcja krótka, ale obecna — _security przemyślane_ to senior signal.

| Aspekt                   | Realizacja                                                                                               |
| ------------------------ | -------------------------------------------------------------------------------------------------------- |
| **JWT storage**          | `httpOnly`, `secure`, `sameSite=lax` cookie. Nigdy localStorage.                                         |
| **CSRF**                 | double-submit cookie pattern dla mutujących endpointów                                                   |
| **XSS**                  | React/Vue auto-escape + brak `dangerouslySetInnerHTML`                                                   |
| **CSP**                  | Nginx ustawia restrictive CSP header (allowed sources tylko własne origins + CDN tailwind jeśli używamy) |
| **Rate limiting**        | `@fastify/rate-limit` — 100 req/min per IP                                                               |
| **Walidacja inputów**    | Zod schemas na froncie + JSON Schema w Fastify (auto z Zod przez `zod-to-json-schema`)                   |
| **Secrets**              | `.env.example` w repo, `.env` w `.gitignore`, w CI przez GH Secrets                                      |
| **Dependency audit**     | `pnpm audit` w CI, Renovate aktualizacje                                                                 |
| **OWASP Top 10 mapping** | krótka sekcja w `docs/security.md`                                                                       |

---

## 11. Wydajność

### 11.1 Targety

- **LCP** shell + dashboard < 2.5s na M4 simulated 3G.
- **TTI** < 4s.
- **Bundle size** — limit per MFE: 250 kB gzipped initial, lazy chunks bez limitu.
- **API p95 latency** (BFF) < 200ms dla każdego endpointu.

### 11.2 Mechanizmy

| Technika                     | Gdzie                                                                              |
| ---------------------------- | ---------------------------------------------------------------------------------- |
| Code splitting               | Vite robi automatycznie + manualne `React.lazy`                                    |
| Module Federation lazy load  | każdy MFE ładowany dopiero przy nawigacji                                          |
| TanStack Query caching       | dedup, stale-while-revalidate                                                      |
| HTTP cache headers           | Nginx ustawia `Cache-Control` dla statyków (1y immutable)                          |
| Preload kluczowych remote'ów | shell w `index.html` ma `<link rel="modulepreload">` dla najczęściej używanych MFE |
| Image optimization           | brak ciężkich obrazów, SVG dla ikon (lucide-react)                                 |
| Tree-shaking                 | ESM-first, named imports                                                           |

---

## 12. Accessibility (a11y)

- WCAG 2.1 AA jako target.
- `eslint-plugin-jsx-a11y` w lincie.
- axe-core w każdym e2e teście.
- Klawiaturowa nawigacja przetestowana dla każdej krytycznej ścieżki.
- Kolorystyka z kontrastem ≥ 4.5:1 (sprawdzane w design tokens).
- Focus management cross-MFE — przy nawigacji do MFE focus przenosi się na nagłówek.
- Skip links w shellu.

---

## 13. Roadmap implementacji

Czas estymowany przy ~10–15h/tydzień:

| Tydzień | Milestone              | Co konkretnie                                                                      |
| ------- | ---------------------- | ---------------------------------------------------------------------------------- |
| 1       | **Foundation**         | pnpm + Turborepo, tsconfig presets, ESLint/Prettier, struktura folderów, README v0 |
| 2       | **Shell + MFE Auth**   | Vite ModFed config, shell ładuje mfe-auth, podstawowy routing, AuthContext         |
| 3       | **Shared packages**    | `event-bus`, `shared-types`, `logger`, `ui` (5 komponentów) + Storybook            |
| 4       | **MFE Dashboard**      | dashboard MFE, widgety, integracja z TanStack Query                                |
| 5       | **MFE Products (Vue)** | Vue MFE w monorepo, ModFed config dla Vue, ProductList + ProductEdit               |
| 6       | **BFF**                | Fastify, JWT, endpointy auth/products/dashboard/logs, Pino, Drizzle + PG           |
| 7       | **Dockeryzacja**       | Dockerfile dla każdej app (multi-stage), docker-compose, nginx config              |
| 8       | **Observability**      | Loki + Promtail + Grafana + Prometheus, auto-provisioned dashboardy                |
| 9       | **Testy**              | Vitest setup, MSW, RTL + Vue Test Utils, 5 e2e w Playwright                        |
| 10      | **CI/CD**              | GH Actions: lint/test/build/docker, Codecov, Storybook deploy                      |
| 11      | **Polish**             | README, diagramy (Excalidraw → SVG w repo), screenshoty, ADR-y, video demo         |
| 12      | **Buffer**             | bug fixing, performance tuning, accessibility audit, _stretch goals_ (OTel)        |

**Total: ~12 tygodni / ~150h pracy.** Możliwe szybsze przy intensywniejszej pracy.

---

## 14. Trade-offs, ryzyka, ograniczenia

> **Ta sekcja jest najważniejsza dla rekrutera senior-level.** Pokazuje krytyczne myślenie.

### 14.1 Trade-offy mikrofrontendów (świadome akceptacje)

| Trade-off                                           | Mityzacja w projekcie                                                   |
| --------------------------------------------------- | ----------------------------------------------------------------------- |
| **Większy initial bundle** (2 frameworki, dup deps) | Module Federation sharing, opisane w README jako "production trade-off" |
| **Złożoność deployu**                               | docker-compose ukrywa to dla demo, README opisuje real-world strategię  |
| **Cross-MFE testing trudniejsze**                   | e2e Playwright przez shell weryfikuje integrację                        |
| **Style isolation**                                 | Tailwind prefiksy + CSS Modules tam gdzie krytyczne                     |
| **Dependency drift**                                | Renovate + centralne wersje w `package.json` root przez `pnpm catalog`  |
| **Onboarding stromy**                               | szczegółowe README + diagramy + `docs/runbook.md`                       |

### 14.2 Ryzyka projektowe

| Ryzyko                                                       | P   | I   | Mitygacja                                                                                |
| ------------------------------------------------------------ | --- | --- | ---------------------------------------------------------------------------------------- |
| Vite ModFed plugin ma drobne ograniczenia (community-driven) | M   | M   | wybrane wzorce testowane na produkcji w innych projektach                                |
| Cross-framework MFE (React + Vue) może wymagać extra polishu | M   | N   | jeśli kosztuje za dużo czasu, dropujemy Vue MFE i robimy 3× React + uzasadniamy w README |
| Observability stack może być cięższy niż portfolio wymaga    | N   | N   | jest opcjonalny, można uruchomić `docker-compose.minimal.yml` bez                        |
| Time creep — nigdy nie skończę                               | W   | W   | striktne out-of-scope, milestones, 12-tygodniowy hard cap                                |

### 14.3 Sekcja "Co bym zrobił inaczej w prod"

W README będzie sekcja **What I'd change for production**:

- K8s zamiast docker-compose, każdy MFE osobny Deployment.
- CDN (CloudFront/Fastly) z manifestem wersji MFE.
- Dedicated identity provider (Keycloak, Auth0) zamiast własnego JWT.
- Service mesh (Linkerd) dla mTLS między MFE↔BFF.
- Feature flags (Unleash, LaunchDarkly) dla canary deployów MFE.
- Real database migrations (Drizzle Kit) zamiast bootstrap seed.
- Sentry / DataDog APM dla front-end observability.
- Synthetic monitoring (Checkly) dla krytycznych ścieżek.

**Dlaczego to istnieje:** pokazuje że rozumiesz różnicę między portfolio a produkcją. To **najczęściej brakujący element** w portfolio juniorów i mediorów.

---

## 15. Definition of Done

Projekt jest "skończony" gdy:

- [ ] `docker compose up` startuje wszystko w < 60s na świeżym hoście.
- [ ] Wszystkie testy zielone w CI.
- [ ] Coverage ≥ targety z sekcji 1.3.
- [ ] Lighthouse CI ≥ 90/95/95/100 (Perf/A11y/BestPractices/SEO) dla shell.
- [ ] README ma: opis, architecture diagram, screenshoty Grafany, instrukcję setup, sekcję ADR, trade-offs, "production considerations".
- [ ] Każdy ADR zapisany w `docs/adr/`.
- [ ] Storybook deployed na GH Pages z linkiem w README.
- [ ] CI badge, coverage badge, license badge w README.
- [ ] 30-60s video walkthrough zalinkowane w README (loom/asciinema/mp4).
- [ ] Co najmniej 3 ścieżki użytkownika w demo działają end-to-end bez błędów.
- [ ] LinkedIn post / blog post o projekcie napisany (opcjonalnie, dla traffic).

---

## 16. Co nie jest w PRD (świadome)

PRD nie zawiera:

- Szczegółowych mockupów UI — design jest _good enough_, nie _pixel perfect_. Fokus jest na architekturze.
- Pełnego data modelu — pojawia się w `packages/shared-types` w trakcie implementacji.
- API spec (OpenAPI) — generowany automatycznie z Zod schemas przez `fastify-swagger`, zalinkowany w README.

---

## 17. Słownik

| Termin                  | Znaczenie                                                                   |
| ----------------------- | --------------------------------------------------------------------------- |
| **MFE**                 | Microfrontend — niezależnie deployowalny moduł frontendowy                  |
| **Shell** / **Host**    | Aplikacja-kontener ładująca MFE w runtime                                   |
| **Remote**              | MFE eksponujący moduły dla shellu                                           |
| **Module Federation**   | Mechanizm Webpack/Vite do runtime composition modułów                       |
| **BFF**                 | Backend-for-Frontend — API zoptymalizowane pod konkretny frontend           |
| **ADR**                 | Architecture Decision Record — krótki dokument opisujący decyzję techniczną |
| **DDD bounded context** | Domena biznesowa z własnym językiem i modelem                               |

---

## 18. Referencje (dla README i osobnego studiowania)

- _Building Micro-Frontends_ — Luca Mezzalira (O'Reilly, 2022) — biblia tematu.
- _Microfrontends.com_ — Cam Jackson — kanoniczny artykuł na martinfowler.com.
- Module Federation docs — module-federation.io.
- Sam Newman — _Building Microservices_ (rozdział o BFF).
- _Team Topologies_ — Skelton & Pais — kontekst organizacyjny MFE.

---

**Koniec PRD.**
_Dokument żyje razem z kodem — każda zmiana decyzji architektonicznej aktualizuje ten plik z odpowiednim ADR w `docs/adr/`._
