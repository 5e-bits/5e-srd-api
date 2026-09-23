# 5e-bits monorepo

[![CI](https://img.shields.io/github/actions/workflow/status/5e-bits/5e-srd-api/ci.yml?style=flat&logo=github&logoColor=white)](https://github.com/5e-bits/5e-srd-api/actions/workflows/ci.yml)
[![Discord](https://img.shields.io/discord/656547667601653787?style=flat&logo=discord&logoColor=white)](https://discord.gg/TQuYTv7)

Home for the D&D 5e SRD API at [dnd5eapi.co](https://www.dnd5eapi.co/), plus
its docs site, infrastructure, and database.

## Layout

- [`apps/api`](apps/api) — the REST/GraphQL API ([README](apps/api/README.md))
- [`apps/docs`](apps/docs) — the Docusaurus docs site at
  [docs.dnd5eapi.co](https://docs.dnd5eapi.co) ([README](apps/docs/README.md))
- [`apps/infrastructure`](apps/infrastructure) — AWS CDK stack for the
  dnd5eapi.co S3/CloudFront/Route 53 resources ([README](apps/infrastructure/README.md);
  merged in from [5e-bits/infrastructure](https://github.com/5e-bits/infrastructure))
- [`packages/5e-database`](packages/5e-database) — seed data + scripts
  ([README](packages/5e-database/README.md); merged in from
  [5e-bits/5e-database](https://github.com/5e-bits/5e-database))

See [apps/README.md](apps/README.md) and [packages/README.md](packages/README.md)
for the directory conventions.

## Getting started

Requires Node 24 and [pnpm](https://pnpm.io) (`corepack enable` picks up the
pinned version).

```shell
pnpm install
```

Each app has its own run instructions; to start the API and database locally,
see [apps/api/README.md](apps/api/README.md#how-to-run).

## Contributing

- Fork this repository
- Create a new branch for your work
- Push up any changes to your branch, and open a pull request. Don't feel it needs to be perfect — incomplete work is totally fine. We'd love to help get it ready for merging.

## Code of Conduct

The Code of Conduct for this repo can be found [here.](https://github.com/5e-bits/5e-srd-api/wiki#code-of-conduct)

## Contributors

<a href="https://github.com/5e-bits/5e-srd-api/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=5e-bits/5e-srd-api" />
</a>

Talk to us [on Discord!](https://discord.gg/TQuYTv7)
