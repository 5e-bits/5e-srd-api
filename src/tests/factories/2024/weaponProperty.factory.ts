import { faker } from '@faker-js/faker'
import { Factory } from 'fishery'

import { WeaponProperty2024 } from '@/models/2024/weaponProperty'

export const weaponPropertyFactory = Factory.define<WeaponProperty2024>(() => {
  const name = faker.lorem.words()
  const index = name.toLowerCase().replace(/\s+/g, '-')

  return {
    index,
    name,
    description: faker.lorem.paragraph(),
    url: `/api/weapon-properties/${index}`,
    updated_at: faker.date.recent().toISOString()
  }
})
