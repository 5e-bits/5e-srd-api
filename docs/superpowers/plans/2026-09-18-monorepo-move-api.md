# Move API Into apps/api Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Relocate the API's source and config from the repo root into `apps/api`, with the root becoming a minimal pnpm workspace root, and update everything (Docker, CI, release-please) that assumed the API lived at the repo root.

**Architecture:** A mechanical `git mv` of every API-specific file into `apps/api/`, a new minimal root `package.json`/`README.md`, and targeted edits to the three places that hardcoded root-relative paths: the Dockerfile (+ `.dockerignore` + `docker-compose.yml`), the GitHub Actions workflows, and `release-please-config.json`. Every relative import/path inside the moved files (tsconfig `paths`, vitest `resolve.alias`, eslint `tsconfigRootDir`) already uses `./` or `__dirname`-relative references, so they keep working unmodified once moved as a unit.

**Tech Stack:** pnpm workspaces, Docker, GitHub Actions, release-please.

**Spec:** [docs/superpowers/specs/2026-09-18-monorepo-prep-design.md](../specs/2026-09-18-monorepo-prep-design.md) — implements the "PR2 — Move the API into `apps/api`" section.

**Depends on:** the groundwork plan ([docs/superpowers/plans/2026-09-18-monorepo-groundwork.md](2026-09-18-monorepo-groundwork.md)) must already be merged/committed — this plan needs `apps/` to exist and `pnpm-workspace.yaml` to already declare `apps/*` as a package pattern.

## Global Constraints

- pnpm's workspace lockfile (`pnpm-lock.yaml`) and `pnpm-workspace.yaml` must stay at the repo root — pnpm workspaces support exactly one lockfile per workspace, not one per package.
- Docker build context must therefore stay the **repo root** (`.`), not `apps/api` — a build context can never `COPY` a path outside itself, and the Dockerfile needs `pnpm-lock.yaml`/`pnpm-workspace.yaml` from root. The Dockerfile itself lives at `apps/api/Dockerfile` and is referenced via each caller's `file:`/`-f` option. This is a deliberate correction of the spec's shorthand ("point the Docker build context at apps/api") — the context has to stay at root for the single-lockfile reason above; only the Dockerfile's own location and its internal `COPY` paths move.
- Every command below is written assuming your shell's cwd is the repo root unless a step says otherwise.

---

### Task 1: Move API-specific files into `apps/api/`

**Files:**
- Move (via `git mv`): `src/`, `tsconfig.json`, `vitest.config.ts`, `vitest.config.integration.ts`, `nodemon.json`, `.redocly.yaml`, `openapi-to-postman.json`, `Dockerfile`, `docker-compose.yml`, `app.json`, `heroku.yml`, `eslint.config.js`, `.prettierrc`, `.nvmrc`, `CHANGELOG.md`, `README.md`, `package.json` → same filenames under `apps/api/`
- Stays at root, untouched by this task: `LICENSE.md`, `.gitignore`, `.github/`, `pnpm-lock.yaml`, `pnpm-workspace.yaml`, `release-please-config.json`, `.dockerignore`

**Interfaces:**
- Consumes: `apps/` directory created by the groundwork plan.
- Produces: `apps/api/package.json` (name `dnd-5e-srd-api`, unchanged content) — later tasks in this plan reference this package by that name via `pnpm --filter dnd-5e-srd-api`.

- [ ] **Step 1: Move the files**

```bash
git mv src apps/api/src
git mv tsconfig.json apps/api/tsconfig.json
git mv vitest.config.ts apps/api/vitest.config.ts
git mv vitest.config.integration.ts apps/api/vitest.config.integration.ts
git mv nodemon.json apps/api/nodemon.json
git mv .redocly.yaml apps/api/.redocly.yaml
git mv openapi-to-postman.json apps/api/openapi-to-postman.json
git mv Dockerfile apps/api/Dockerfile
git mv docker-compose.yml apps/api/docker-compose.yml
git mv app.json apps/api/app.json
git mv heroku.yml apps/api/heroku.yml
git mv eslint.config.js apps/api/eslint.config.js
git mv .prettierrc apps/api/.prettierrc
git mv .nvmrc apps/api/.nvmrc
git mv CHANGELOG.md apps/api/CHANGELOG.md
git mv README.md apps/api/README.md
git mv package.json apps/api/package.json
```

- [ ] **Step 2: Verify nothing was left behind or duplicated**

Run: `git status`

Expected: every path above shows as a rename (`renamed:`), nothing shows as both deleted-and-untracked (which would mean the destination path was typo'd), and `LICENSE.md`, `.gitignore`, `.github/`, `pnpm-lock.yaml`, `pnpm-workspace.yaml`, `release-please-config.json`, `.dockerignore` still show as unmodified at the root.

- [ ] **Step 3: Commit**

```bash
git add -A
git commit -m "chore: move API into apps/api"
```

(Don't run `pnpm install` or any build/test/lint yet — `apps/api/package.json` still has the old name and the root `pnpm-lock.yaml` still expects a `.` importer, both fixed in Task 2. Running installs/tests now would fail for reasons this task doesn't address.)

---

### Task 2: Minimal root `package.json` + regenerate the lockfile

**Files:**
- Modify: `package.json` (replace entirely — this becomes the workspace root, not the API's package.json anymore)
- Modify: `pnpm-lock.yaml` (regenerated by `pnpm install`, not hand-edited)

**Interfaces:**
- Consumes: `apps/api/package.json` (name `dnd-5e-srd-api`) from Task 1.
- Produces: a root `package.json` with `name: "5e-bits-monorepo"`, `private: true` — nothing later depends on this name, it just needs to be distinct from `dnd-5e-srd-api` so pnpm doesn't collide the two importers.

- [ ] **Step 1: Replace root `package.json`**

```json
{
  "name": "5e-bits-monorepo",
  "private": true,
  "packageManager": "pnpm@12.4.2"
}
```

- [ ] **Step 2: Regenerate the lockfile**

Run: `pnpm install`

(Not `--frozen-lockfile` here — the lockfile's `importers` section is keyed by path, and the API's package.json moved from importer key `.` to `apps/api`, so the lockfile must be rewritten. This is expected to change only the importer path keys, not any dependency version — `apps/api/package.json`'s dependencies are byte-identical to what they were at the root.)

- [ ] **Step 3: Verify the workspace resolves correctly**

Run: `pnpm list --filter dnd-5e-srd-api --depth -1`

Expected: shows the `dnd-5e-srd-api` package resolved from `apps/api`.

Run: `git diff pnpm-lock.yaml | grep -E '^[+-]\s+importers:|^[+-]\s+\x27?\.\x27?:|^[+-]\s+apps/api:' `

Expected: shows the importer key changing from `.` to `apps/api` (and `5e-bits-monorepo` appearing as the new root importer) — no dependency version lines (`specifier:`/`version:`) should appear in this filtered diff.

- [ ] **Step 4: Commit**

```bash
git add package.json pnpm-lock.yaml
git commit -m "chore: make root package.json a minimal workspace root"
```

---

### Task 3: Minimal root `README.md`

**Files:**
- Create: `README.md` (the old root README already moved to `apps/api/README.md` in Task 1 — this is a new, separate file)

**Interfaces:**
- Consumes: `apps/README.md` and `packages/README.md` from the groundwork plan (linked from here).
- Produces: nothing consumed by later tasks — this is a leaf, documentation-only change.

- [ ] **Step 1: Write the new root README**

```markdown
# 5e-bits monorepo

Home for the D&D 5e SRD API and, eventually, its supporting docs and
database repos.

- [`apps/api`](apps/api) — the REST/GraphQL API ([README](apps/api/README.md))
- `apps/docs` — docs site (coming soon, merged in from
  [5e-bits/docs](https://github.com/5e-bits/docs))
- `packages/5e-database` — seed data + scripts (coming soon, merged in from
  [5e-bits/5e-database](https://github.com/5e-bits/5e-database))

See [apps/README.md](apps/README.md) and [packages/README.md](packages/README.md)
for the directory conventions.

Talk to us [on Discord!](https://discord.gg/TQuYTv7)
```

- [ ] **Step 2: Commit**

```bash
git add README.md
git commit -m "docs: add root monorepo README"
```

---

### Task 4: Fix the Docker build for the new layout

**Files:**
- Modify: `apps/api/Dockerfile`
- Modify: `.dockerignore` (stays at root — Docker always looks for `.dockerignore` next to the build context root, which is the repo root now, not next to the Dockerfile)
- Modify: `apps/api/docker-compose.yml`

**Interfaces:**
- Consumes: `apps/api/package.json` (Task 1/2), `pnpm-lock.yaml` + `pnpm-workspace.yaml` at root.
- Produces: an image built from context `.` with `-f apps/api/Dockerfile`, runtime `WORKDIR /app/apps/api` — the release workflow (Task 6) references this same `file:` path.

- [ ] **Step 1: Rewrite `apps/api/Dockerfile`**

```dockerfile
# ---- Builder Stage ----
FROM node:24-alpine AS builder

WORKDIR /app

RUN npm install -g pnpm@12.4.2

COPY pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/api/package.json ./apps/api/package.json

# Clean existing node_modules just in case of Docker layer caching weirdness.
# Then run `pnpm install --frozen-lockfile` which is generally recommended for CI/Docker.
RUN rm -rf node_modules
RUN pnpm install --frozen-lockfile

# Copy the rest of the api package's source code
# .dockerignore will handle exclusions like node_modules, dist, etc.
COPY apps/api ./apps/api

# Build the application
# This uses apps/api/tsconfig.json to output to apps/api/dist
RUN pnpm --filter dnd-5e-srd-api run build

# ---- Final Stage ----
FROM node:24-alpine

WORKDIR /app

# pnpm (unlike npm) isn't bundled with the node image; test:integration:local
# execs `pnpm run test:integration` inside this final-stage container.
RUN npm install -g pnpm@12.4.2

# Copy the whole installed workspace (node_modules incl. pnpm's symlink
# structure, built dist/, source, and config) from the builder stage in one
# shot -- copying individual subpaths instead breaks pnpm's node_modules
# symlinks between /app/node_modules and /app/apps/api/node_modules.
COPY --from=builder /app ./

ENV NODE_ENV=production

EXPOSE 3000

WORKDIR /app/apps/api

CMD ["node", "--experimental-specifier-resolution=node", "dist/src/start.js"]
```

- [ ] **Step 2: Update root `.dockerignore` for nested paths**

Now that the build context is the repo root, the ignore patterns need to also match `node_modules`/`dist` under `apps/*` (not just at the root), otherwise a locally-built `apps/api/node_modules` or `apps/api/dist` would get copied into the image by `COPY apps/api ./apps/api`.

```
node_modules
**/node_modules
dist
**/dist

# Git / VCS
.git/

# Editor / IDE
.vscode/

# Environment / Secrets
.env

# Logs
*.log
npm-debug.log*

# OS generated files
.DS_Store
```

- [ ] **Step 3: Update `apps/api/docker-compose.yml`'s build context**

Current `api` service has `build: .`, which (relative to the compose file's own new location at `apps/api/docker-compose.yml`) would resolve to `apps/api` — wrong, for the same single-lockfile reason as Task 4 Step 1. Change it to:

```yaml
  api:
    environment:
      MONGODB_URI: mongodb://db/5e-database
      REDIS_URL: redis://cache:6379
    build:
      context: ..
      dockerfile: apps/api/Dockerfile
    ports:
      - '3000:3000'
    depends_on:
      - db
      - cache
```

(`context: ..` is relative to the compose file's directory, i.e. `apps/api/..` = repo root.)

- [ ] **Step 4: Verify the image builds**

Run: `cd apps/api && docker compose build api`

Expected: builds successfully. If Docker isn't available in this environment, run the equivalent plain build instead: `docker build -f apps/api/Dockerfile -t api-build-check .` from the repo root.

- [ ] **Step 5: Commit**

```bash
git add apps/api/Dockerfile .dockerignore apps/api/docker-compose.yml
git commit -m "fix: repoint Docker build at repo-root context for apps/api"
```

---

### Task 5: Update `ci.yml` for the new working directory

**Files:**
- Modify: `.github/workflows/ci.yml`

**Interfaces:**
- Consumes: `apps/api/package.json` scripts (`lint`, `validate-swagger`, `test:unit`, `test:integration:local`).

- [ ] **Step 1: Add `working-directory: apps/api` to every script-running step**

`pnpm install --frozen-lockfile` stays at the repo root (that's where `pnpm-lock.yaml` lives) in the `lint` and `unit` jobs. Every step that runs an `apps/api` package script gets `working-directory: apps/api`. Edit `.github/workflows/ci.yml`:

Replace:
```yaml
      - run: pnpm install --frozen-lockfile
      - name: Lint Code
        run: pnpm run lint
      - name: Validate OpenAPI Spec
        run: pnpm run validate-swagger
```
with:
```yaml
      - run: pnpm install --frozen-lockfile
      - name: Lint Code
        working-directory: apps/api
        run: pnpm run lint
      - name: Validate OpenAPI Spec
        working-directory: apps/api
        run: pnpm run validate-swagger
```

Replace:
```yaml
      - run: pnpm install --frozen-lockfile
      - run: pnpm run test:unit
```
with:
```yaml
      - run: pnpm install --frozen-lockfile
      - working-directory: apps/api
        run: pnpm run test:unit
```

Replace:
```yaml
      - uses: pnpm/action-setup@ea17c68df8912ef543352723c149a84f56e3d413 # @v6.1.0
      - run: pnpm run test:integration:local
```
with:
```yaml
      - uses: pnpm/action-setup@ea17c68df8912ef543352723c149a84f56e3d413 # @v6.1.0
      - working-directory: apps/api
        run: pnpm run test:integration:local
```

- [ ] **Step 2: Verify locally**

Run each command manually from the repo root to confirm they'd succeed under `working-directory: apps/api` semantics:

```bash
pnpm install --frozen-lockfile
cd apps/api && pnpm run lint && pnpm run validate-swagger && pnpm run test:unit
```

Expected: all pass. (`test:integration:local` is Docker-heavy — covered by Task 4 Step 4's build check plus CI itself; not required to run it again here.)

- [ ] **Step 3: Commit**

```bash
git add .github/workflows/ci.yml
git commit -m "ci: run apps/api scripts from their new working directory"
```

---

### Task 6: Update the release pipeline (`release.yml` + `release-please-config.json`)

**Files:**
- Modify: `.github/workflows/release.yml`
- Modify: `release-please-config.json`

**Interfaces:**
- Consumes: `apps/api/Dockerfile` (Task 4), `apps/api/package.json` scripts (`bundle-swagger`, `gen-postman`).

- [ ] **Step 1: `build-and-publish` job — run package scripts from `apps/api`**

Replace:
```yaml
      - name: Install Dependencies
        run: pnpm install --frozen-lockfile
      - name: Build Artifacts
        run: |
          pnpm run bundle-swagger
          pnpm run gen-postman
      - name: Upload Release Assets
        if: github.event_name == 'release'
        run: |
          gh release upload ${{ github.event.release.tag_name }} \
            ./dist/openapi.yml \
            ./dist/openapi.json \
            ./dist/collection.postman.json
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```
with:
```yaml
      - name: Install Dependencies
        run: pnpm install --frozen-lockfile
      - name: Build Artifacts
        working-directory: apps/api
        run: |
          pnpm run bundle-swagger
          pnpm run gen-postman
      - name: Upload Release Assets
        if: github.event_name == 'release'
        working-directory: apps/api
        run: |
          gh release upload ${{ github.event.release.tag_name }} \
            ./dist/openapi.yml \
            ./dist/openapi.json \
            ./dist/collection.postman.json
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

- [ ] **Step 2: `container-release` job — point at the moved Dockerfile, keep context at root**

Replace:
```yaml
      - name: Build and push Docker image
        uses: docker/build-push-action@v7
        with:
          context: .
          push: true
          tags: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:${{ steps.tag.outputs.tag }},${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:latest
          labels: version=${{ steps.tag.outputs.tag }}
```
with:
```yaml
      - name: Build and push Docker image
        uses: docker/build-push-action@v7
        with:
          context: .
          file: ./apps/api/Dockerfile
          push: true
          tags: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:${{ steps.tag.outputs.tag }},${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:latest
          labels: version=${{ steps.tag.outputs.tag }}
```

- [ ] **Step 3: `heroku-deploy` job — tell the action the app now lives in a subdirectory**

Replace:
```yaml
      - name: Deploy to Heroku
        uses: akhileshns/heroku-deploy@v3.15.15
        with:
          heroku_api_key: ${{ secrets.HEROKU_API_KEY }}
          heroku_app_name: "dnd-5e-srd-api"
          heroku_email: "cdurianward@gmail.com"
```
with:
```yaml
      - name: Deploy to Heroku
        uses: akhileshns/heroku-deploy@v3.15.15
        with:
          heroku_api_key: ${{ secrets.HEROKU_API_KEY }}
          heroku_app_name: "dnd-5e-srd-api"
          heroku_email: "cdurianward@gmail.com"
          appdir: "apps/api"
```

(`appdir` is a documented input of this action — "Set if your app is located in a subdirectory" — it makes the action push `apps/api`'s contents as the root of what Heroku receives, so `heroku.yml`/`Dockerfile` are found where Heroku's container stack expects them.)

- [ ] **Step 4: Update `release-please-config.json`'s package path**

Replace:
```json
{
  "release-type": "node",
  "packages": {
    ".": {
      "release-type": "node",
      "package-name": "5e-srd-api",
      "changelog-sections": [
        {
          "type": "feat",
          "section": "Features"
        },
        {
          "type": "fix",
          "section": "Bug Fixes"
        },
        {
          "type": "deps",
          "section": "Dependencies",
          "hidden": false
        }
      ]
    }
  }
}
```
with:
```json
{
  "release-type": "node",
  "packages": {
    "apps/api": {
      "release-type": "node",
      "package-name": "5e-srd-api",
      "changelog-sections": [
        {
          "type": "feat",
          "section": "Features"
        },
        {
          "type": "fix",
          "section": "Bug Fixes"
        },
        {
          "type": "deps",
          "section": "Dependencies",
          "hidden": false
        }
      ]
    }
  }
}
```

- [ ] **Step 5: Commit**

```bash
git add .github/workflows/release.yml release-please-config.json
git commit -m "ci: point release pipeline at apps/api"
```

**Note for after this PR merges:** this repo has no `.release-please-manifest.json` today, so release-please is presumably inferring the next version from the latest GitHub release tag rather than a stored path→version map. That means the path rename here is not verifiable locally — watch the next `release-please` workflow run on `main` after merge to confirm it still proposes the expected version bump instead of treating `apps/api` as a brand-new package starting at `1.0.0`.

---

### Task 7: Full verification pass

**Files:** none (verification only).

- [ ] **Step 1: Clean install from scratch**

```bash
rm -rf node_modules apps/api/node_modules
pnpm install --frozen-lockfile
```

Expected: succeeds with no errors, no lockfile diff.

- [ ] **Step 2: Lint, build, unit test**

```bash
cd apps/api
pnpm run lint
pnpm run build
pnpm run test:unit
cd ..
```

Expected: all three pass.

- [ ] **Step 3: Docker build**

```bash
cd apps/api && docker compose build api
```

Expected: succeeds (already checked once in Task 4, this re-confirms after the CI/release edits didn't touch Docker files, so should be unchanged — cheap to re-run).

- [ ] **Step 4: Confirm the root workspace no longer carries app dependencies**

Run: `cat package.json`

Expected: only `name`, `private`, `packageManager` — no `dependencies`/`devDependencies`/`scripts`.

- [ ] **Step 5: Final review of the full diff against the spec**

Run: `git diff main --stat` (or `git log main..HEAD --oneline` for the commit list)

Expected: every file touched maps to a line item in the spec's "PR2" section or this plan — no stray changes.

No commit for this task — it's verification of Tasks 1-6's commits, not a new change.

## Definition of Done

- `apps/api/` contains everything the API needs to build, lint, test, and run; the repo root contains only workspace-level files (`package.json`, `README.md`, `LICENSE.md`, `.gitignore`, `.dockerignore`, `pnpm-lock.yaml`, `pnpm-workspace.yaml`, `release-please-config.json`, `.github/`).
- `pnpm install --frozen-lockfile`, `pnpm run lint`/`build`/`test:unit` (from `apps/api`), and `docker compose build` (from `apps/api`) all pass.
- `ci.yml`, `release.yml`, and `release-please-config.json` all reference `apps/api` where they used to assume the repo root.
