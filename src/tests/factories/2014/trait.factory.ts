import { faker } from '@faker-js/faker'
import { Factory } from 'fishery'

import { Trait } from '@/models/2014/trait'

import { apiReferenceFactory, choiceFactory } from './common.factory'

export const traitFactory = Factory.define<Trait>(({ sequence }) => {
  const name = `Trait ${sequence} - ${faker.lorem.words(2)}`
  const index = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

  return {
    index: index,
    name: name,
    desc: [faker.lorem.paragraph()],
    races: [apiReferenceFactory.build()], // Default with one race
    subraces: [apiReferenceFactory.build()], // Default with one subrace
    url: `/api/traits/${index}`,
    updated_at: faker.date.recent().toISOString(),

    // Optional fields defaulted for basic structure
    // Tests needing specific values should override or build manually
    languages: [],
    proficiencies: [],
    language_options: choiceFactory.build(),
    proficiency_choices: choiceFactory.build(),
    parent: apiReferenceFactory.build(),
    trait_specific: undefined
  }
})
