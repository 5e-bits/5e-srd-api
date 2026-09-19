---
sidebar_position: 1
---

# Introduction

Welcome to the D&D 5e SRD API, the Dungeons & Dragons 5th Edition API.

This documentation will help you familiarize yourself with the resources available and how to consume them with HTTP requests. Read through the getting started [tutorial](/docs/tutorials/) before you dive in.

## Base URL

All API requests are made to the following base URL:

```
https://www.dnd5eapi.co/api
```

## Authentication

This is a completely open API. **No authentication is required to query and get data.** This also means that we've limited what you can do to just `GET`-ing the data.

## Rate Limits

There is a limit of 10,000 requests per second per IP. This is subject to change if something more practical needs to be enforced.

## Multilingual Support

API responses are available in multiple languages. Append `?lang={code}` to any resource request to receive translated content (e.g. `?lang=fr-FR` for French). English is always the default and fallback — untranslated fields are returned in English automatically.

See the [Multilingual Support](./reference/multilingual) reference for the full list of supported languages, response behavior, and how to contribute a translation.

## GraphQL

This API also supports [GraphQL](https://graphql.org/). The GraphQL endpoint is:

```
https://www.dnd5eapi.co/graphql
```

See the [GraphQL tutorial](/docs/tutorials/beginner/graphql) for examples and how to use the Apollo sandbox explorer.

## Community

Come hang out with us [on Discord](https://discord.gg/TQuYTv7). We're friendly and would love to hear what you make with the API.

## Contributing

This API is built from two repositories:

- [5e-database](https://github.com/5e-bits/5e-database) — the data
- [5e-srd-api](https://github.com/5e-bits/5e-srd-api) — the API implementation

This is an evolving API and fresh ideas are always welcome. You can open an issue in either repo, open a PR for changes, or discuss with other users on Discord.

If you find a mistake in the data, feel free to [let us know](https://discord.gg/TQuYTv7).
