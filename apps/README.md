# apps/

Deployable applications in this monorepo.

- `apps/api` — the D&D 5e SRD REST/GraphQL API (this repo's original
  root-level app, moved here in a follow-up PR).
- `apps/docs` — docs site, merged in from `5e-bits/docs` via `git subtree`
  (future work, not part of this PR).
- `apps/infrastructure` — AWS CDK app for the dnd5eapi.co S3/CloudFront/
  Route 53 resources, merged in from `5e-bits/infrastructure` via
  `git subtree`. Deployed manually with `pnpm cdk`; no CI workflow yet.
