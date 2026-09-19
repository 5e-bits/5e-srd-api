import { faker } from '@faker-js/faker'
import { Factory } from 'fishery'

import { Skill } from '@/models/2014/skill'

import { apiReferenceFactory } from './common.factory' // Import common factory

export const skillFactory = Factory.define<Skill>(({ sequence }) => {
  const name = `Skill ${sequence} - ${faker.lorem.words(2)}`
  const index = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

  return {
    index: index,
    name: name,
    desc: [faker.lorem.paragraph()],
    // Build a default ability score using the common factory
    ability_score: apiReferenceFactory.build({
      index: faker.helpers.arrayElement(['str', 'dex', 'con', 'int', 'wis', 'cha']),
      name: faker.helpers.arrayElement(['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA']),
      url: faker.internet.url()
    }),
    url: `/api/skills/${index}`,
    updated_at: faker.date.recent().toISOString()
  }
})
