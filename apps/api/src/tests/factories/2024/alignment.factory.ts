import { faker } from '@faker-js/faker'
import { Factory } from 'fishery'

import { Alignment2024 } from '@/models/2024/alignment'

export const alignmentFactory = Factory.define<Alignment2024>(() => {
  const name = faker.lorem.words()
  const index = name.toLowerCase().replace(/\s+/g, '-')

  return {
    index,
    name,
    abbreviation: name.substring(0, 2).toUpperCase(),
    description: faker.lorem.paragraph(),
    url: `/api/alignments/${index}`,
    updated_at: faker.date.recent().toISOString()
  }
})
