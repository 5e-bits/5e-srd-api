# packages/

Non-deployable packages: shared libraries and standalone tooling/data
packages that don't run as a service.

- [`packages/5e-database`](5e-database) — data + seed/refresh scripts,
  merged in from `5e-bits/5e-database` via `git subtree`. Not a running
  service and not imported as a code dependency by `apps/api` today
  (consumed as a prebuilt Docker image instead), so it lives here rather
  than under `apps/`.
