# Enterprise Frontend Platform — AGENTS.md

## Architectural Rules & Ownership
1. **Package Ownership**:
   - `apps/admin`: Top-level application shell, routing, feature integration.
   - `packages/api`: Transport layer, timeout, retry, error normalization.
   - `packages/api-contracts`: OpenAPI generated TypeScript types. Do NOT edit generated files manually.
   - `packages/auth`: Session management, RBAC evaluator, route guards.
   - `packages/config`: Runtime configuration validation using Zod. No `import.meta.env` access outside this package.
   - `packages/eslint-config`: Shared ESLint configurations.
   - `packages/feature-flags`: Feature flag definitions, evaluation, lifecycle.
   - `packages/forms`: Form factory using TanStack Form + Zod.
   - `packages/observability`: OpenTelemetry & Sentry wrappers.
   - `packages/query`: TanStack Query client defaults, key factory, mutation policies.
   - `packages/schemas`: Shared domain and validation schemas.
   - `packages/state`: Zustand client/UI state and persistence adapters. No API cache in Zustand.
   - `packages/tsconfig`: Shared strict TypeScript configurations.
   - `packages/ui`: Design system, Radix primitives, shadcn components, Tailwind styles, EnterpriseDataGrid.
   - `tooling/*`: Vitest, Storybook, Playwright presets.

2. **Import Direction & Boundaries**:
   - `apps/admin` -> `features` -> `packages/platform`
   - `features` -> `api`, `query`, `auth`, `schemas`, `forms`, `state`, `ui`
   - `ui` -> Radix primitives, internal styling, utilities. No imports from `apps/*` or `features/*`.
   - `api-contracts` -> TypeScript types only.
   - `config` -> `schemas` only.

3. **State Ownership**:
   - Server state: TanStack Query ONLY.
   - UI / local ephemeral state: Zustand / React useState.
   - Form state: TanStack Form + Zod.
   - URL / filter / pagination / sorting state: TanStack Router.

4. **Security & Secrets**:
   - No hardcoded credentials, secret keys, or production DSNs in Git.
   - Authentication must use secure sessions / HTTP-only cookies where applicable.
   - Authorization decisions are enforced by backend; frontend guards provide UI navigation control.

5. **Definition of Done**:
   - Clean typecheck (`pnpm typecheck`)
   - Strict boundary check (`pnpm boundaries:check`)
   - Runtime config validation (`pnpm env:check`)
   - Automated tests pass (`pnpm test`)
   - Production build passes (`pnpm build`)
