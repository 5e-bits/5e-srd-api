import { faker } from '@faker-js/faker'
import { Factory } from 'fishery'

import { Condition2024 } from '@/models/2024/condition'

export const conditionFactory = Factory.define<Condition2024>(() => {
  const name = faker.lorem.words()
  const index = name.toLowerCase().replace(/\s+/g, '-')

  return {
    index,
    name,
    description: faker.lorem.paragraph(),
    url: `/api/conditions/${index}`,
    updated_at: faker.date.recent().toISOString()
  }
})
