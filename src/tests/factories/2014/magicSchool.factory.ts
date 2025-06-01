import { faker } from '@faker-js/faker'
import { Factory } from 'fishery'

import { MagicSchool } from '@/models/2014/magicSchool'

export const magicSchoolFactory = Factory.define<MagicSchool>(({ sequence }) => {
  const name = `Magic School ${sequence} - ${faker.lorem.words(1)}`
  const index = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

  return {
    index: index,
    name: name,
    desc: faker.lorem.paragraph(),
    url: `/api/magic-schools/${index}`,
    updated_at: faker.date.recent().toISOString()
  }
})
