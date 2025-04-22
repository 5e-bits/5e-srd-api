import { Factory } from 'fishery'
import { faker } from '@faker-js/faker'
import { Proficiency, Reference } from '@/models/2014/proficiency'
import { apiReferenceFactory } from './common.factory'

// Sub-factory for the nested Reference type
const referenceFactory = Factory.define<Reference>(({ sequence }) => {
  const name = `Ref ${sequence} - ${faker.lorem.word()}`
  const index = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
  return {
    index: index,
    name: name,
    type: faker.helpers.arrayElement(['skills', 'saving-throws', 'armor', 'weapons', 'tools']),
    url: `/api/prof-ref/${index}`
  }
})

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
    reference: referenceFactory.build(),
    url: `/api/proficiencies/${index}`,
    updated_at: faker.date.recent().toISOString(),
    classes: apiReferenceFactory.buildList(faker.number.int({ min: 0, max: 2 })),
    races: apiReferenceFactory.buildList(faker.number.int({ min: 0, max: 1 }))
  }
})
