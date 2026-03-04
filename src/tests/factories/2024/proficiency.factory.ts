import { faker } from '@faker-js/faker'
import { Factory } from 'fishery'

import { Proficiency2024 } from '@/models/2024/proficiency'

import { apiReferenceFactory } from './common.factory'

export const proficiencyFactory = Factory.define<Proficiency2024>(({ sequence }) => {
  const name = `Proficiency ${sequence} - ${faker.lorem.words(2)}`
  const index = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

  return {
    index,
    name,
    type: faker.helpers.arrayElement(['Skills', 'Tools']),
    backgrounds: [],
    classes: [],
    reference: apiReferenceFactory.build(),
    url: `/api/2024/proficiencies/${index}`,
    updated_at: faker.date.recent().toISOString()
  }
})
