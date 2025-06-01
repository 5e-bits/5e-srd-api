import { faker } from '@faker-js/faker'
import { Factory } from 'fishery'

import { Condition } from '@/models/2014/condition'

export const conditionFactory = Factory.define<Condition>(({ sequence }) => {
  const name = `Condition ${sequence} - ${faker.lorem.words(2)}`
  const index = name.toLowerCase().replace(/\s+/g, '-')

  return {
    index: index,
    name: name,
    desc: [faker.lorem.paragraph(), faker.lorem.paragraph()],
    url: `/api/conditions/${index}`,
    updated_at: faker.date.recent().toISOString()
  }
})
