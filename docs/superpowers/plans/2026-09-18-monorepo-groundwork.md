# Monorepo Groundwork Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add pnpm-workspace package patterns and placeholder docs so the repo is monorepo-ready, with zero changes to how the API builds, tests, or deploys.

**Architecture:** Two additive changes: (1) declare `apps/*` and `packages/*` as workspace member patterns in `pnpm-workspace.yaml`, (2) add short READMEs in those two new directories explaining the convention. No existing file moves, no CI changes — this PR is safe to merge on its own.

**Tech Stack:** pnpm workspaces (existing pnpm 12.4.2 setup, no new tooling).

**Spec:** [docs/superpowers/specs/2026-09-18-monorepo-prep-design.md](../specs/2026-09-18-monorepo-prep-design.md) — implements the "PR1 — Groundwork" section.

## Global Constraints

- No Turborepo/Nx — plain pnpm workspaces only (per spec's Tooling decision).
- Layout convention: `apps/` for deployables, `packages/` for everything else (per spec's Layout convention).
- This PR must not touch `src/`, CI workflows, Dockerfile, docker-compose, or release-please — those change in the follow-up PR2 (move-api plan).
- Work happens directly on the current branch (`claude/monorepo-preparation-bc928e`), which already branched from `main` at commit `8cd9ac1`. No new branch needed for this PR.

---

### Task 1: Declare workspace package patterns

**Files:**
- Modify: `pnpm-workspace.yaml`

**Interfaces:**
- Produces: a `pnpm-workspace.yaml` with a `packages:` key listing `apps/*` and `packages/*` — later tasks (and the move-api plan) rely on this key existing so newly created `apps/api`, `apps/docs`, `packages/5e-database` are auto-discovered as workspace members.

- [ ] **Step 1: Read the current file**

Current contents of `pnpm-workspace.yaml`:
```yaml
allowBuilds:
  '@apollo/protobufjs': true
  mongodb-memory-server: true
  unrs-resolver: true

publicHoistPattern:
  - '*types*'
```

- [ ] **Step 2: Add the `packages` key**

Edit `pnpm-workspace.yaml` to:
```yaml
packages:
  - 'apps/*'
  - 'packages/*'

allowBuilds:
  '@apollo/protobufjs': true
  mongodb-memory-server: true
  unrs-resolver: true

publicHoistPattern:
  - '*types*'
```

- [ ] **Step 3: Verify pnpm still resolves cleanly**

Run: `pnpm install --frozen-lockfile`

Expected: succeeds with no errors and no lockfile changes (`git status` shows only `pnpm-workspace.yaml` modified — `pnpm-lock.yaml` untouched). No packages match `apps/*` or `packages/*` yet, which is expected; pnpm treats an empty glob match as a no-op, not an error.

- [ ] **Step 4: Run the existing test suite to confirm nothing broke**

Run: `pnpm run lint && pnpm run test:unit`

Expected: both pass exactly as they did before this change (this step touches no app code, so this is a regression check, not new coverage).

- [ ] **Step 5: Commit**

```bash
git add pnpm-workspace.yaml
git commit -m "chore: declare pnpm workspace package patterns"
```

---

### Task 2: Add `apps/` and `packages/` placeholder READMEs

**Files:**
- Create: `apps/README.md`
- Create: `packages/README.md`

**Interfaces:**
- Consumes: nothing from Task 1.
- Produces: two directories that exist in the repo tree (git doesn't track empty directories, so these READMEs are what makes `apps/` and `packages/` show up at all) — the move-api plan's Task 1 relies on `apps/` already existing to `git mv` into.

- [ ] **Step 1: Create `apps/README.md`**

```markdown
# apps/

Deployable applications in this monorepo.

- `apps/api` — the D&D 5e SRD REST/GraphQL API (this repo's original
  root-level app, moved here in a follow-up PR).
- `apps/docs` — docs site, merged in from `5e-bits/docs` via `git subtree`
  (future work, not part of this PR).
```

- [ ] **Step 2: Create `packages/README.md`**

```markdown
# packages/

Non-deployable packages: shared libraries and standalone tooling/data
packages that don't run as a service.

- `packages/5e-database` — data + seed/refresh scripts, merged in from
  `5e-bits/5e-database` via `git subtree` (future work, not part of this
  PR). Not a running service and not imported as a code dependency by
  `apps/api` today (consumed as a prebuilt Docker image instead), so it
  lives here rather than under `apps/`.
```

- [ ] **Step 3: Verify nothing else changed**

Run: `git status`

Expected: only `apps/README.md` and `packages/README.md` listed as new files (plus Task 1's already-committed `pnpm-workspace.yaml` change in history).

Run: `pnpm run lint && pnpm run test:unit`

Expected: both pass (same regression check as Task 1 — adding READMEs can't affect lint/test, this just confirms the working tree is still healthy).

- [ ] **Step 4: Commit**

```bash
git add apps/README.md packages/README.md
git commit -m "docs: add apps/ and packages/ directory READMEs"
```

---

## Definition of Done

- `pnpm-workspace.yaml` has a `packages:` key matching `apps/*` and `packages/*`.
- `apps/README.md` and `packages/README.md` exist and explain the convention.
- `pnpm install --frozen-lockfile`, `pnpm run lint`, and `pnpm run test:unit` all pass, unchanged from before this PR.
- No files under `src/`, `.github/workflows/`, `Dockerfile`, `docker-compose.yml`, or `release-please-config.json` were touched.
