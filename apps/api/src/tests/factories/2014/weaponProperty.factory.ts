import { faker } from '@faker-js/faker'
import { Factory } from 'fishery'

import type { WeaponProperty } from '@/models/2014/weaponProperty'

export const weaponPropertyFactory = Factory.define<WeaponProperty>(
  ({ sequence, transientParams }) => {
    const name = transientParams?.name ?? `Weapon Property ${sequence}`
    const index = name.toLowerCase().replace(/\s+/g, '-')

    return {
      index,
      name,
      desc: [faker.lorem.paragraph()], // desc is string[]
      url: `/api/weapon-properties/${index}`,
      updated_at: faker.date.recent().toISOString()
    }
  }
)
