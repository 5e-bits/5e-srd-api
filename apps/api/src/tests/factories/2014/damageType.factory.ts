import { faker } from '@faker-js/faker'
import { Factory } from 'fishery'

import { DamageType } from '@/models/2014/damageType'

export const damageTypeFactory = Factory.define<DamageType>(({ sequence }) => {
  const name = `Damage Type ${sequence} - ${faker.lorem.word()}`
  const index = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

  return {
    index: index,
    name: name,
    desc: [faker.lorem.paragraph()],
    url: `/api/damage-types/${index}`,
    updated_at: faker.date.recent().toISOString()
  }
})
