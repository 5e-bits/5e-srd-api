# 5e-srd-api

[![GitHub Actions Workflow Status](https://img.shields.io/github/actions/workflow/status/5e-bits/5e-srd-api/ci.yml?style=flat&logo=github&logoColor=white)](https://github.com/5e-bits/5e-srd-api/actions/workflows/ci.yml)
[![Discord](https://img.shields.io/discord/656547667601653787?style=flat&logo=discord&logoColor=white)](https://discord.gg/TQuYTv7)
![Uptime](https://img.shields.io/endpoint?url=https%3A%2F%2Fraw.githubusercontent.com%2F5e-bits%2Fdnd-uptime%2Fmain%2Fapi%2Fwebsite%2Fresponse-time.json)
![Uptime](https://img.shields.io/endpoint?url=https%3A%2F%2Fraw.githubusercontent.com%2F5e-bits%2Fdnd-uptime%2Fmain%2Fapi%2Fwebsite%2Fuptime.json)

REST API to access [D&D 5th Edition SRD API](https://www.dnd5eapi.co/)

Talk to us [on Discord!](https://discord.gg/TQuYTv7)

## How to Run

Make sure you have the latest version of the database:

```shell
docker compose pull
```

Then run it with docker-compose:

```shell
docker compose up --build
```

### M1/M2/M3 Macs

The command above pulls the latest image of the database from ghcr.io, which only targets the amd64 platform. If you are running on a different platform (like a Mac with Apple Silicon), you will need to build the image yourself from [`packages/5e-database`](../../packages/5e-database). In `docker-compose.yml`, uncomment the `build` block under the `db` service (and comment out `image: ghcr.io/5e-bits/5e-database:latest`).

## Making API Requests

Make API requests by using the root address:
`http://localhost:3000/api/2014`

You should get a response with the available endpoints for the root:

```json
{
  "ability-scores": "/api/2014/ability-scores",
  "classes": "/api/2014/classes",
  "conditions": "/api/2014/conditions",
  "damage-types": "/api/2014/damage-types",
  "equipment-categories": "/api/2014/equipment-categories",
  "equipment": "/api/2014/equipment",
  "features": "/api/2014/features",
  "languages": "/api/2014/languages",
  "magic-schools": "/api/2014/magic-schools",
  "monsters": "/api/2014/monsters",
  "proficiencies": "/api/2014/proficiencies",
  "races": "/api/2014/races",
  "skills": "/api/2014/skills",
  "spells": "/api/2014/spells",
  "subclasses": "/api/2014/subclasses",
  "subraces": "/api/2014/subraces",
  "traits": "/api/2014/traits",
  "weapon-properties": "/api/2014/weapon-properties"
}
```

### Versioning

The API is versioned by release years of the SRD. Currently only `/api/2014` is available. The next version will be `/api/2024`.

## Working with image resources from s3

Monster images live in the public `dnd-5e-api-images` bucket under the `/monsters` folder. The API needs no AWS credentials for them: `/api/images/<path>` (also available as `/api/2014/images/<path>`) fetches `https://dnd-5e-api-images.s3.<region>.amazonaws.com/<path>` and returns it. The region comes from `AWS_REGION`.

Request an image by navigating to its URL in a browser, or via HTTP request:

```shell
curl http://localhost:3000/api/images/monsters/aboleth.png --output downloaded-aboleth.png
```

## Data Issues

If you see anything wrong with the data itself, please open an issue or PR against [`packages/5e-database`](../../packages/5e-database).

## Running Tests

### Unit Tests

You can run unit tests locally by using the command: `pnpm run test:unit`

### Integration Tests

Integration tests need to be ran in the API docker container for them to function properly.
In order to run integration tests locally you can use the command: `pnpm run test:integration:local`

## Documentation

Public facing API documentation lives [here.](https://docs.dnd5eapi.co)

The source for that site is [`apps/docs`](../docs) in this monorepo. It uses
[Docusaurus](https://docusaurus.io/) to generate the site from a bundled OpenAPI spec.

More details on working with the OpenAPI spec can be found in the [`src/swagger`](src/swagger/) directory's [README](src/swagger/README.md). The most up-to-date bundled OpenAPI specs themselves are included in [the latest release](https://github.com/5e-bits/5e-srd-api/releases/latest) in both [JSON](https://github.com/5e-bits/5e-srd-api/releases/latest/download/openapi.json) and [YAML](https://github.com/5e-bits/5e-srd-api/releases/latest/download/openapi.yml) formats, which can be used to generate your own documentation, clients, etc.

A [Postman collection](https://github.com/5e-bits/5e-srd-api/releases/latest/download/collection.postman.json) can also be found in the latest release. This can be imported into [the Postman HTTP client](https://www.postman.com/) to execute test requests against production & local deployments of the API.
