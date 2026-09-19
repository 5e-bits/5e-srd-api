---
sidebar_position: 3
---

# GraphQL

This API supports [GraphQL](https://graphql.org/). The GraphQL URL for this API
is `https://www.dnd5eapi.co/graphql/2014`. Most of your questions regarding the GraphQL schema can be answered by querying the endpoint with the Apollo sandbox explorer.

## Example Queries

Here is a list of example queries you can run in the sandbox explorer to get started trying out the GraphQL functionality of the API.

### Get a list of ability scores

```graphql
query {
  abilityScores {
    name
    desc
    skills {
      name
    }
  }
}
```
