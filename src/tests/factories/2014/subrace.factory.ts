import { Factory } from 'fishery'
import { faker } from '@faker-js/faker'
import type { Subrace, SubraceAbilityBonus } from '@/models/2014/subrace'
import { apiReferenceFactory, choiceFactory } from './common.factory'

// Factory for the nested SubraceAbilityBonus
const subraceAbilityBonusFactory = Factory.define<SubraceAbilityBonus>(({ associations }) => ({
  ability_score: associations.ability_score ?? apiReferenceFactory.build(),
  bonus: faker.number.int({ min: 1, max: 2 })
}))

// Factory for Subrace
export const subraceFactory = Factory.define<Subrace>(
  ({ sequence, associations, transientParams }) => {
    const name = transientParams?.name ?? `Subrace ${sequence}`
    const index = name.toLowerCase().replace(/ /g, '-')

    return {
      index: index,
      name: name,
      race:
        associations.race ??
        apiReferenceFactory.build({}, { transient: { resourceType: 'races' } }),
      desc: faker.lorem.paragraph(),
      ability_bonuses: subraceAbilityBonusFactory.buildList(faker.number.int({ min: 1, max: 2 })),
      starting_proficiencies:
        associations.starting_proficiencies ??
        apiReferenceFactory.buildList(
          faker.number.int({ min: 0, max: 3 }),
          {},
          { transient: { resourceType: 'proficiencies' } }
        ),
      languages:
        associations.languages ??
        apiReferenceFactory.buildList(
          faker.number.int({ min: 0, max: 1 }),
          {},
          { transient: { resourceType: 'languages' } }
        ),
      language_options:
        associations.language_options ??
        (faker.datatype.boolean() ? choiceFactory.build() : undefined),
      racial_traits:
        associations.racial_traits ??
        apiReferenceFactory.buildList(
          faker.number.int({ min: 0, max: 3 }),
          {},
          { transient: { resourceType: 'traits' } }
        ),
      url: `/api/subraces/${index}`,
      updated_at: faker.date.recent().toISOString()
    }
  }
)
