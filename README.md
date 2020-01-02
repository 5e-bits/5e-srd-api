# 5e-srd-api
REST API to access D&amp;D 5th Edition SRD database

First, install dependencies by running
```
npm install
```

Run app locally (for testing purposes) using
```
heroku local
```

Make HTTP requests by using the root address:
`http://localhost:3000/api/`

You should get a response with the available endpoints for the root:
```
{
    "races": "http://dnd5eapi.co/api/races/",
    "subraces": "http://dnd5eapi.co/api/subraces/",
    "classes": "http://dnd5eapi.co/api/classes/",
    "subclasses": "http://dnd5eapi.co/api/subclasses/",
    "languages": "http://dnd5eapi.co/api/languages/",
    "spellcasting": "http://dnd5eapi.co/api/spellcasting/",
    "spells": "http://dnd5eapi.co/api/spells/",
    "monsters": "http://dnd5eapi.co/api/monsters/",
    "features": "http://dnd5eapi.co/api/features/",
    "tables": "http://dnd5eapi.co/api/tables/",
    "equipment": "http://dnd5eapi.co/api/equipment/",
    "proficiencies": "http://dnd5eapi.co/api/proficiencies/",
    "startingequipment": "http://dnd5eapi.co/api/startingequipment/"
}
```

# Data Issues
If you see anything wrong with the data itself, please open an issue or PR over [here.](https://github.com/bagelbits/5e-database)

# Contributing
 * Fork this repository
 * Create a new branch for your work
 * Push up any changes to your branch, and open a pull request. Don't feel it needs to be perfect — incomplete work is totally fine. We'd love to help get it ready for merging.
