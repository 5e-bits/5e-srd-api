# 5e-srd-api

[![Build Status](https://travis-ci.com/bagelbits/5e-srd-api.svg?branch=master)](https://travis-ci.com/bagelbits/5e-srd-api)
[![Heroku](https://heroku-badge.herokuapp.com/?app=dnd-5e-srd-api)](https://heroku-badge.herokuapp.com/?app=dnd-5e-srd-api)

REST API to access [D&amp;D 5th Edition SRD API](http://www.dnd5eapi.co/)

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
  "spellcasting": "/api/spellcasting",
  "spells": "/api/spells",
  "startingequipment": "/api/startingequipment",
  "subclasses": "/api/subclasses",
  "subraces": "/api/subraces",
  "traits": "/api/traits",
  "weapon-properties": "/api/weapon-properties"
}
```

## Data Issues

If you see anything wrong with the data itself, please open an issue or PR over [here.](https://github.com/bagelbits/5e-database)

## Contributing

- Fork this repository
- Create a new branch for your work
- Push up any changes to your branch, and open a pull request. Don't feel it needs to be perfect — incomplete work is totally fine. We'd love to help get it ready for merging.
