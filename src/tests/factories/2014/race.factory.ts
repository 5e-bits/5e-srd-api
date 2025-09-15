import { faker } from '@faker-js/faker'
import { Factory } from 'fishery'

import { apiReferenceFactory, choiceFactory } from './common.factory'

import type { Race, RaceAbilityBonus } from '@/models/2014/race'

// Factory for the nested RaceAbilityBonus
const raceAbilityBonusFactory = Factory.define<RaceAbilityBonus>(({ associations }) => ({
  ability_score: associations.ability_score ?? apiReferenceFactory.build(),
  bonus: faker.number.int({ min: 1, max: 2 })
}))

// Factory for Race
export const raceFactory = Factory.define<Race>(({ sequence, associations, transientParams }) => {
  const name = transientParams?.name ?? `Race ${sequence}`
  const index = name.toLowerCase().replace(/ /g, '-')

  return {
    index,
    name,
    speed: faker.number.int({ min: 25, max: 35 }),
    ability_bonuses: raceAbilityBonusFactory.buildList(faker.number.int({ min: 1, max: 3 })),
    ability_bonus_options:
      associations.ability_bonus_options ??
      (faker.datatype.boolean() ? choiceFactory.build() : undefined),
    alignment: faker.lorem.paragraph(),
    age: faker.lorem.paragraph(),
    size: faker.helpers.arrayElement(['Small', 'Medium', 'Large']),
    size_description: faker.lorem.paragraph(),
    languages:
      associations.languages ??
      apiReferenceFactory.buildList(
        faker.number.int({ min: 1, max: 3 }),
        {},
        { transient: { resourceType: 'languages' } }
      ),
    language_options: associations.language_options ?? choiceFactory.build(), // Required
    language_desc: faker.lorem.paragraph(),
    traits:
      associations.traits ??
      apiReferenceFactory.buildList(
        faker.number.int({ min: 0, max: 4 }),
        {},
        { transient: { resourceType: 'traits' } }
      ),
    subraces:
      associations.subraces ??
      apiReferenceFactory.buildList(
        faker.number.int({ min: 0, max: 2 }),
        {},
        { transient: { resourceType: 'subraces' } }
      ),
    url: `/api/races/${index}`,
    updated_at: faker.date.recent().toISOString()
  }
})
