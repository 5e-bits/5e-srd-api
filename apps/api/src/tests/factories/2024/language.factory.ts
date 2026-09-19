import { faker } from '@faker-js/faker'
import { Factory } from 'fishery'

import { Language2024 } from '@/models/2024/language'

export const languageFactory = Factory.define<Language2024>(() => {
  const name = faker.lorem.words()
  const index = name.toLowerCase().replace(/\s+/g, '-')

  return {
    index,
    name,
    is_rare: faker.datatype.boolean(),
    note: faker.lorem.sentence(),
    url: `/api/languages/${index}`,
    updated_at: faker.date.recent().toISOString()
  }
})
