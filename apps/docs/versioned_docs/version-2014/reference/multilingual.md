---
sidebar_position: 1
---

# Multilingual Support

The D&D 5e SRD API supports multilingual responses, allowing you to request translated content in supported languages. English is always the default and fallback — if a translation is incomplete or unavailable, fields fall back to English individually, so responses are always complete documents.

## Currently Supported Locales

| Code    | Language            |
| ------- | ------------------- |
| `en`    | English (default)   |
| `fr-FR` | French (France)     |
| `pt-BR` | Portuguese (Brazil) |

This table reflects locales available for the 2014 ruleset at the time of writing. The authoritative, always-current list is served by the API itself — query [`/api/2014/locales`](#list-all-supported-locales) to discover available locales at runtime.

## Requesting a Language

### Query Parameter (recommended)

Append `?lang={code}` to any resource request. This is the recommended approach because it is explicit and cache-friendly.

```
GET /api/2014/spells/acid-arrow?lang=fr-FR
```

### Accept-Language Header

The `Accept-Language` request header is also supported per [RFC 5646](https://www.rfc-editor.org/rfc/rfc5646). If both a `lang` query parameter and an `Accept-Language` header are present, the query parameter takes precedence.

```
Accept-Language: fr-FR
```

Language codes follow the [BCP 47](https://www.rfc-editor.org/rfc/rfc5646) standard (e.g. `fr-FR`, `pt-BR`).

## Response Behavior

- Translated fields are merged over the base English document on a **per-field basis**.
- Untranslated fields always retain their English value — responses are never partial.
- The `Content-Language` response header reflects the requested language when at least one field was translated, or `en` when no translation exists for that document.

## Translatable Fields

Only human-readable text fields are translated. Structural fields (indexes, URLs, numeric values, cross-references) always come from the English base document.

| Field                                      | Translatable |
| ------------------------------------------ | ------------ |
| `name`                                     | Yes          |
| `desc`                                     | Yes          |
| `higher_level`                             | Yes          |
| `equipment_category.name`                  | Yes          |
| `index`                                    | No           |
| `url`                                      | No           |
| Numeric values (HP, range, duration, etc.) | No           |
| API reference objects                      | No           |

## Discovering Supported Languages

:::note
`/api/{year}/languages` lists D&D in-world game languages (Common, Elvish, etc.). `/api/{year}/locales` is the endpoint for API translation support.
:::

### List all supported locales

```
GET /api/{year}/locales
```

Returns all languages that have at least some translated content for the given ruleset year.

```json
{
  "count": 2,
  "results": [
    { "lang": "fr-FR", "url": "/api/2014/locales/fr-FR" },
    { "lang": "pt-BR", "url": "/api/2014/locales/pt-BR" }
  ]
}
```

### Get a specific locale

```
GET /api/{year}/locales/{lang}
```

Returns `404` if no translations exist for the requested language.

```json
{
  "lang": "fr-FR",
  "url": "/api/2014/locales/fr-FR"
}
```

## GraphQL

The optional `lang` argument is available on entity queries:

```graphql
query {
  spell(index: "acid-arrow", lang: "fr-FR") {
    name
    desc
  }
}
```

Translation resolution is identical to REST — translated fields are merged before the resolver returns, with English as the per-field fallback.

## Contributing Translations

Translations are entirely community-driven. No database access or special tooling is required.

1. Fork the [5e-database](https://github.com/5e-bits/5e-database) repository
2. Create or edit a file at `src/{year}/{lang}/5e-SRD-{Collection}.json`
3. Include only the translatable fields for each entry — non-translatable fields are sourced from the English base automatically
4. Open a PR — CI validates your translation against the English source

**Example — French spell translation entry:**

```json
[
  {
    "index": "acid-arrow",
    "name": "Flèche acide",
    "desc": [
      "Une flèche verte scintillante jaillit vers une cible à portée ..."
    ]
  }
]
```

## Best Practices

- Start with high-traffic resources (spells, monsters, equipment)
- Keep terminology consistent with existing translations
- Translate complete fields only; omit fields you are not ready to translate
- Validate JSON and run local tests before opening a PR
