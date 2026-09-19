import { faker } from '@faker-js/faker'
import { Factory } from 'fishery'

import { WeaponMasteryProperty2024 } from '@/models/2024/weaponMasteryProperty'

export const weaponMasteryPropertyFactory = Factory.define<WeaponMasteryProperty2024>(() => {
  const name = faker.lorem.words()
  const index = name.toLowerCase().replace(/\s+/g, '-')

  return {
    index,
    name,
    description: faker.lorem.paragraph(),
    url: `/api/weapon-mastery-properties/${index}`,
    updated_at: faker.date.recent().toISOString()
  }
})
