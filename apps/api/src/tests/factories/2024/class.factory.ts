import { faker } from '@faker-js/faker'
import { Factory } from 'fishery'

import {
  Class2024,
  MultiClassing2024,
  MultiClassingPrereq2024,
  PrimaryAbility2024,
  Spellcasting2024,
  SpellcastingInfo2024
} from '@/models/2024/class'
import { APIReference } from '@/models/common/apiReference'

const apiReferenceFactory = Factory.define<APIReference>(() => ({
  index: faker.lorem.slug(),
  name: faker.lorem.words(2),
  url: `/api/2024/${faker.lorem.slug()}`
}))

const spellcastingInfoFactory = Factory.define<SpellcastingInfo2024>(() => ({
  name: faker.lorem.words(3),
  desc: [faker.lorem.sentence()]
}))

export const spellcastingFactory = Factory.define<Spellcasting2024>(() => ({
  level: faker.number.int({ min: 1, max: 20 }),
  spellcasting_ability: apiReferenceFactory.build(),
  info: spellcastingInfoFactory.buildList(2)
}))

export const multiClassingPrereqFactory = Factory.define<MultiClassingPrereq2024>(() => ({
  ability_score: apiReferenceFactory.build(),
  minimum_score: faker.number.int({ min: 13, max: 15 })
}))

export const multiClassingFactory = Factory.define<MultiClassing2024>(() => ({
  prerequisites: multiClassingPrereqFactory.buildList(1),
  proficiencies: apiReferenceFactory.buildList(1)
}))

export const primaryAbilityFactory = Factory.define<PrimaryAbility2024>(() => ({
  desc: faker.lorem.sentence()
}))

export const classFactory = Factory.define<Class2024>(({ sequence }) => {
  const name = `Class ${sequence} - ${faker.lorem.words(2)}`
  const index = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

  return {
    index,
    name,
    primary_ability: primaryAbilityFactory.build(),
    hit_die: faker.helpers.arrayElement([6, 8, 10, 12]),
    class_levels: `/api/2024/classes/${index}/levels`,
    proficiency_choices: [],
    starting_equipment_options: [],
    url: `/api/2024/classes/${index}`,
    updated_at: faker.date.recent().toISOString()
  }
})
