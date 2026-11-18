# 5e-database

![Build Status](https://github.com/5e-bits/5e-database/workflows/5e%20Database%20CI/badge.svg?branch=main)
[![Discord](https://img.shields.io/discord/656547667601653787)](https://discord.gg/TQuYTv7)

Holds the database for the D&D 5th Edition API at http://dnd5eapi.co/

Talk to us [on Discord!](https://discord.gg/TQuYTv7)

## How to run

### With Docker

You should be able to build locally and then run the local Docker image. This can be done one of two ways:

1. If you just need an image and you aren't running an M1:

```bash
docker run ghcr.io/5e-bits/5e-database:latest
```

2. If you're running an M1 or you want to test changes that you've made to the Database:

```bash
docker build -t 5e-database .
docker run -i -t 5e-database:latest
```

### Without Docker

First you need to make sure you have [MongoDB installed locally.](https://docs.mongodb.com/manual/installation/)

You can load this data locally by running:

```bash
MONGODB_URI=mongodb://localhost/5e-database pnpm run db:refresh
```

## Translations

English is the source of truth and lives in `src/{year}/en/`. Translations are community-driven and need nothing but a text editor and a fork — no database access.

To add one, create `src/{year}/{lang}/5e-SRD-{Collection}.json`, where `{lang}` is a [BCP 47](https://www.rfc-editor.org/rfc/rfc5646) language tag (e.g. `de`, `fr-FR`, `pt-BR`):

```
src/2014/de/5e-SRD-Spells.json
src/2024/pt-BR/5e-SRD-Conditions.json
```

Each file is a JSON array. Every entry needs its `index` (identical to the English entry) plus **only the text fields you are translating**:

```json
[
  {
    "index": "acid-arrow",
    "name": "Säurepfeil",
    "desc": ["Ein glitzernder grüner Pfeil schießt auf ein Ziel..."]
  }
]
```

Don't translate or include `url`, numeric values, or API reference objects. Partial translations are fine: the API falls back to English per field for anything you leave out.

Run `pnpm test` before opening a PR. It fails if a translation references an `index` or field that isn't in the English source, repeats an `index`, or produces an invalid document once merged with the English entry. CI runs the same checks.

See [CONTRIBUTING.md](CONTRIBUTING.md#contributing-translations) for the full guide.

## API Issues

If you see anything wrong with the API and not the data, please open an issue or PR over [here](https://github.com/5e-bits/5e-srd-api).

## Contributing

* Fork this repository
* Create a new branch for your work
* Push up any changes to your branch, and open a pull request. Don't feel it needs to be perfect — incomplete work is totally fine. We'd love to help get it ready for merging.
* We use Semantic Release so here are the PR naming convetions:

| Commit message                                                                                                                                                                             | Release type                                                                                             |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------- |
| fix(pencil): stop graphite breaking when too much pressure applied                                                                                                                         | Patch Fix Release                                                                                        |
| feat(pencil): add 'graphiteWidth' option                                                                                                                                                   | Minor Feature Release                                                                                    |
| perf(pencil): remove graphiteWidth option<br><br>BREAKING CHANGE: The graphiteWidth option has been removed.<br>The default graphite width of 10mm is always used for performance reasons. | Major Breaking Release<br><br>(Note that the BREAKING CHANGE: token must be in the footer of the commit) |

## Code of Conduct

The Code of Conduct can be found [here.](https://github.com/5e-bits/5e-database/wiki/Code-of-Conduct)

## License

This project is licensed under the terms of the MIT license. The underlying material
is released using the [Open Gaming License Version 1.0a](https://www.wizards.com/default.asp?x=d20/oglfaq/20040123f)

## Contributors

<a href="https://github.com/5e-bits/5e-database/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=5e-bits/5e-database" />
</a>
