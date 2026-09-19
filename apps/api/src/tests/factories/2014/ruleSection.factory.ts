import { faker } from '@faker-js/faker'
import { Factory } from 'fishery'

import { RuleSection } from '@/models/2014/ruleSection'

export const ruleSectionFactory = Factory.define<RuleSection>(({ sequence }) => {
  const name = `Rule Section ${sequence} - ${faker.lorem.words(3)}`
  const index = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

  return {
    index: index,
    name: name,
    desc: faker.lorem.paragraph(), // Single string
    url: `/api/rule-sections/${index}`,
    updated_at: faker.date.recent().toISOString()
  }
})
