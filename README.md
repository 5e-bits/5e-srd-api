# 5e-srd-api

![Build Status](https://github.com/bagelbits/5e-srd-api/workflows/5e%20SRD%20API%20CI/badge.svg?branch=main)
[![Heroku](https://heroku-badge.herokuapp.com/?app=dnd-5e-srd-api)](https://heroku-badge.herokuapp.com/?app=dnd-5e-srd-api)
[![Discord](https://img.shields.io/discord/656547667601653787)](https://discord.gg/TQuYTv7)

REST API to access [D&amp;D 5th Edition SRD API](https://www.dnd5eapi.co/)

Talk to us [on Discord!](https://discord.gg/TQuYTv7)

## How to Run

You can make sure you have the latest version of the database by running:

```shell
docker-compose pull
```

Then run it with docker-compose:

```shell
docker-compose up --build
```

Make API requests by using the root address:
`http://localhost:3000/api/`

You should get a response with the available endpoints for the root:

```json
{
  "ability-scores": "/api/ability-scores",
  "classes": "/api/classes",
  "conditions": "/api/conditions",
  "damage-types": "/api/damage-types",
  "equipment-categories": "/api/equipment-categories",
  "equipment": "/api/equipment",
  "features": "/api/features",
  "languages": "/api/languages",
  "magic-schools": "/api/magic-schools",
  "monsters": "/api/monsters",
  "proficiencies": "/api/proficiencies",
  "races": "/api/races",
  "skills": "/api/skills",
  "spells": "/api/spells",
  "starting-equipment": "/api/starting-equipment",
  "subclasses": "/api/subclasses",
  "subraces": "/api/subraces",
  "traits": "/api/traits",
  "weapon-properties": "/api/weapon-properties"
}
```

## Using a local image of 5e Database

If you are working on a feature which requires changes to both this repo, *and* the 5e-database repo, it is useful to know how to connect the former to the latter for testing purposes. A simple process for doing so is as follows:

1) In the file `docker-compose.yml`, you can replace the line `image: bagelbits/5e-database` with `build: [relativePathToDatabaseRepo]`. Make sure not to commit this change, as it is intended for local testing only.

3) Run your branch of 5e-srd-api using the method outlined in the above section of this readme file. So long as there are no transient errors, the API should build successfully, and your changes to both repos should be noticeable.

## Data Issues

If you see anything wrong with the data itself, please open an issue or PR over [here.](https://github.com/bagelbits/5e-database)

## Running Tests

### Unit Tests
You can run unit tests locally by using the command: `npm run test:unit`

### Integration Tests
Integration tests need to be ran in the API docker container for them to function properly.
In order to run integration tests locally you can use the command: `npm run test:integration:local`

## Contributing

- Fork this repository
- Create a new branch for your work
- Push up any changes to your branch, and open a pull request. Don't feel it needs to be perfect — incomplete work is totally fine. We'd love to help get it ready for merging.
