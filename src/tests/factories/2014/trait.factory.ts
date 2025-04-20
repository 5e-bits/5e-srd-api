import { Factory } from 'fishery'
import { faker } from '@faker-js/faker'
import { Trait, TraitPrerequisite, TraitSpecific } from '@/models/2014/trait'
import { apiReferenceFactory, choiceFactory } from './common.factory'

// Basic placeholder for TraitSpecific - tests needing details should build manually
const traitSpecificFactory = Factory.define<TraitSpecific>(() => ({}))

// Basic placeholder for TraitPrerequisite - tests needing details should build manually
const traitPrerequisiteFactory = Factory.define<TraitPrerequisite>(() => ({
  index: faker.lorem.slug(),
  name: faker.lorem.words(3),
  type: 'trait', // Default type
  url: `/api/traits/${faker.lorem.slug()}`
}))

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
    proficiencies: []
    // language_options: undefined, // Or choiceFactory.build()
    // proficiency_choices: undefined, // Or choiceFactory.build()
    // parent: undefined, // Or traitPrerequisiteFactory.buildList(1)
    // trait_specific: undefined // Or traitSpecificFactory.build()
  }
})
