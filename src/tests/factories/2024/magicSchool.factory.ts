import { faker } from '@faker-js/faker'
import { Factory } from 'fishery'

import { MagicSchool2024 } from '@/models/2024/magicSchool'

export const magicSchoolFactory = Factory.define<MagicSchool2024>(() => {
  const name = faker.lorem.words()
  const index = name.toLowerCase().replace(/\s+/g, '-')

  return {
    index,
    name,
    description: faker.lorem.paragraph(),
    url: `/api/magic-schools/${index}`,
    updated_at: faker.date.recent().toISOString()
  }
})
