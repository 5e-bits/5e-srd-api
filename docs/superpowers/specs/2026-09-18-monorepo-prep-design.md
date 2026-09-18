# Monorepo prep design

## Context

`5e-srd-api` is a single Node/TS app living at the repo root, already on pnpm
(`pnpm-workspace.yaml` exists but has no `packages:` list yet — it's only
build-allowlist config). The `5e-bits` org also has two sibling repos that
will eventually merge into this one via `git subtree` (history preserved),
decided separately from this design:

- `5e-bits/docs` — docs site (MDX/TS/CSS)
- `5e-bits/5e-database` — standalone data/tooling package (own `package.json`,
  scripts like `db:refresh`/`db:update`, own Dockerfile that publishes a
  Mongo-seed image). Not a running service, not a shared library — just data
  + scripts. Consumed today by `docker-compose.yml` as a prebuilt image
  (`ghcr.io/5e-bits/5e-database:latest`), not a code dependency.

Goal of this task: get *this* repo monorepo-ready, as two stacked PRs, before
either sibling repo is actually merged in.

## Tooling decision

Plain pnpm workspaces. No Turborepo/Nx. The three eventual members
(api, docs, 5e-database) are independently built/tested/deployed today with
no shared build graph, so there's nothing for a task-orchestrator to cache
yet. Revisit only if CI time becomes a measurable problem once all three
packages are actually present.

## Layout convention

- `apps/` — deployables: `apps/api` (this repo's current `src/`), `apps/docs`
  (future).
- `packages/` — everything else: `packages/5e-database` (future). Stays
  empty until something is genuinely shared (e.g. a shared eslint/tsconfig
  base) — no placeholder scaffolding for hypothetical packages.

## PR1 — Groundwork (no code moves)

Scope: zero risk to the running API, purely additive.

- `pnpm-workspace.yaml`: add
  ```yaml
  packages:
    - 'apps/*'
    - 'packages/*'
  ```
  alongside the existing `allowBuilds` / `publicHoistPattern` keys.
- Add `apps/README.md` and `packages/README.md` explaining the convention
  and noting `apps/api`, `apps/docs`, `packages/5e-database` are landing via
  follow-up PRs (api move is PR2, stacked on this one; docs/5e-database
  subtree merges are separate future work).
- No changes to `src/`, CI workflows, Dockerfile, docker-compose, or
  release-please. The API keeps building and deploying exactly as today.

## PR2 — Move the API into `apps/api` (stacked on PR1)

- `git mv` everything API-specific into `apps/api/`: `src/`, `tsconfig.json`,
  `vitest.config.ts`, `vitest.config.integration.ts`, `nodemon.json`,
  `.redocly.yaml`, `openapi-to-postman.json`, `Dockerfile`,
  `docker-compose.yml`, `app.json`, `heroku.yml`, `.dockerignore`, and its
  `package.json`.
- Root `package.json` becomes a minimal private workspace root: `name`,
  `private: true`, `packageManager`, `engines`. No app dependencies live at
  root after this PR.
- `apps/api/package.json` keeps the real scripts and dependencies
  (unchanged from today's root `package.json` other than its new location).
- Update `.github/workflows/ci.yml` and `.github/workflows/release.yml` to
  operate from `apps/api` (via `pnpm --filter` or `working-directory`), and
  point the Docker build context at `apps/api`.
- Update `release-please-config.json`: the package path becomes `apps/api`
  (keep `package-name: 5e-srd-api`). Still a single-package config — docs
  and 5e-database aren't in this repo yet.
- Verify from the new layout: `pnpm install --frozen-lockfile`,
  `pnpm run build`, `pnpm run lint`, `pnpm run test:unit`,
  `pnpm run test:integration:local`, and the Docker build.

## Explicitly out of scope

- Actually subtree-merging `docs` or `5e-database` into this repo — separate
  future task per repo, after this restructuring lands.
- Turborepo/Nx, shared root eslint/tsconfig base — add when there's a second
  real TS package to share config with (PR2 doesn't create one).
- Any versioning/release-process change beyond making release-please
  path-aware for `apps/api`.
