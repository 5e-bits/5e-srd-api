import { faker } from '@faker-js/faker'
import { Factory } from 'fishery'

import { Species2024 } from '@/models/2024/species'

import { apiReferenceFactory, createIndex, createUrl } from './common.factory'

export const speciesFactory = Factory.define<Species2024>(({ sequence }) => {
  const name = `Species ${sequence} - ${faker.lorem.words(2)}`
  const index = createIndex(name)

  return {
    index,
    name,
    url: createUrl('species', index),
    type: faker.helpers.arrayElement(['Humanoid', 'Construct', 'Fey']),
    size: faker.helpers.arrayElement(['Small', 'Medium']),
    size_options: undefined,
    speed: faker.helpers.arrayElement([25, 30, 35]),
    traits: apiReferenceFactory.buildList(faker.number.int({ min: 0, max: 4 }), {}, { transient: { resourceType: 'traits' } }),
    subspecies: apiReferenceFactory.buildList(faker.number.int({ min: 0, max: 3 }), {}, { transient: { resourceType: 'subspecies' } }),
    updated_at: faker.date.recent().toISOString()
  }
})
