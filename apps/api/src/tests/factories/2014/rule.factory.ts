import { faker } from '@faker-js/faker'
import { Factory } from 'fishery'

import { Rule } from '@/models/2014/rule'

import { apiReferenceFactory } from './common.factory' // Import common factory

export const ruleFactory = Factory.define<Rule>(({ sequence }) => {
  const name = `Rule ${sequence} - ${faker.lorem.words(2)}`
  const index = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

  return {
    index: index,
    name: name,
    desc: faker.lorem.paragraph(),
    // Build a list of subsection references
    subsections: apiReferenceFactory.buildList(faker.number.int({ min: 0, max: 3 })),
    url: `/api/rules/${index}`,
    updated_at: faker.date.recent().toISOString()
  }
})
