import { faker } from '@faker-js/faker'
import { Factory } from 'fishery'

import { Trait2024 } from '@/models/2024/trait'

import { apiReferenceFactory, createIndex, createUrl } from './common.factory'

export const traitFactory = Factory.define<Trait2024>(({ sequence }) => {
  const name = `Trait ${sequence} - ${faker.lorem.words(2)}`
  const index = createIndex(name)

  return {
    index,
    name,
    url: createUrl('traits', index),
    description: faker.lorem.paragraph(),
    species: [apiReferenceFactory.build({}, { transient: { resourceType: 'species' } })],
    subspecies: [],
    proficiency_choices: undefined,
    speed: undefined,
    updated_at: faker.date.recent().toISOString()
  }
})
