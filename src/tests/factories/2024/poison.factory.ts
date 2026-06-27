import { faker } from '@faker-js/faker'
import { Factory } from 'fishery'

import { Poison2024 } from '@/models/2024/poison'

const POISON_TYPES = ['contact', 'ingested', 'inhaled', 'injury'] as const

export const poisonFactory = Factory.define<Poison2024>(({ sequence }) => {
  const name = `Poison ${sequence} - ${faker.lorem.words(2)}`
  const index = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

  return {
    index,
    name,
    cost: faker.number.int({ min: 50, max: 2000 }),
    type: faker.helpers.arrayElement(POISON_TYPES),
    description: faker.lorem.paragraph(),
    url: `/api/2024/poisons/${index}`,
    updated_at: faker.date.recent().toISOString()
  }
})
