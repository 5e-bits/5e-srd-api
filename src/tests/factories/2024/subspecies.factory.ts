import { faker } from '@faker-js/faker'
import { Factory } from 'fishery'

import { Subspecies2024, SubspeciesTrait } from '@/models/2024/subspecies'

import { apiReferenceFactory, createIndex, createUrl } from './common.factory'

const subspeciesTraitFactory = Factory.define<SubspeciesTrait>(({ sequence }) => {
  const name = `Subspecies Trait ${sequence} - ${faker.lorem.words(2)}`
  const index = createIndex(name)

  return {
    index,
    name,
    url: createUrl('traits', index),
    level: faker.helpers.arrayElement([1, 3, 5, 7])
  }
})

export const subspeciesFactory = Factory.define<Subspecies2024>(({ sequence }) => {
  const name = `Subspecies ${sequence} - ${faker.lorem.words(2)}`
  const index = createIndex(name)
  const speciesIndex = `species-${faker.lorem.word()}`

  return {
    index,
    name,
    url: createUrl('subspecies', index),
    species: apiReferenceFactory.build({
      index: speciesIndex,
      name: faker.lorem.words(2),
      url: createUrl('species', speciesIndex)
    }),
    traits: subspeciesTraitFactory.buildList(faker.number.int({ min: 1, max: 3 })),
    damage_type: undefined,
    updated_at: faker.date.recent().toISOString()
  }
})
