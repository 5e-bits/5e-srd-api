import { faker } from '@faker-js/faker'
import { Factory } from 'fishery'

import { Language } from '@/models/2014/language'

const languageTypes = ['Standard', 'Exotic']
const scripts = ['Common', 'Elvish', 'Dwarvish', 'Infernal', 'Draconic', 'Celestial']

export const languageFactory = Factory.define<Language>(({ sequence }) => {
  const name = `Language ${sequence} - ${faker.lorem.word()}`
  const index = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')

  return {
    index: index,
    name: name,
    desc: faker.lorem.sentence(),
    script: faker.helpers.arrayElement(scripts),
    type: faker.helpers.arrayElement(languageTypes),
    typical_speakers: [faker.person.jobTitle(), faker.person.jobTitle()],
    url: `/api/languages/${index}`,
    updated_at: faker.date.recent().toISOString()
  }
})
