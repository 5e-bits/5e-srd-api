import { faker } from '@faker-js/faker'
import { Factory } from 'fishery'

import { DamageType2024 } from '@/models/2024/damageType'

export const damageTypeFactory = Factory.define<DamageType2024>(() => {
  const name = faker.lorem.words()
  const index = name.toLowerCase().replace(/\s+/g, '-')

  return {
    index,
    name,
    description: faker.lorem.paragraph(),
    url: `/api/damage-types/${index}`,
    updated_at: faker.date.recent().toISOString()
  }
})
