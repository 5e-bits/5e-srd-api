import { faker } from '@faker-js/faker'
import { Factory } from 'fishery'

import { Proficiency } from '@/models/2014/proficiency'

import { apiReferenceFactory } from './common.factory'

// Main Proficiency factory
export const proficiencyFactory = Factory.define<Proficiency>(({ sequence }) => {
  const name = `Proficiency ${sequence} - ${faker.lorem.words(2)}`
  const index = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
  const type = faker.helpers.arrayElement([
    'saving-throws',
    'skills',
    'armor',
    'weapons',
    'tools',
    'languages'
  ])

  return {
    index: index,
    name: name,
    type: type,
    reference: apiReferenceFactory.build(),
    url: `/api/proficiencies/${index}`,
    updated_at: faker.date.recent().toISOString(),
    classes: apiReferenceFactory.buildList(faker.number.int({ min: 0, max: 2 })),
    races: apiReferenceFactory.buildList(faker.number.int({ min: 0, max: 1 }))
  }
})
