import { faker } from '@faker-js/faker'
import { Factory } from 'fishery'

import { Alignment } from '@/models/2014/alignment'

export const alignmentFactory = Factory.define<Alignment>(({ sequence, params }) => {
  const name = params.name ?? `Alignment ${sequence}`
  const index = params.index ?? name.toLowerCase().replace(/\s+/g, '-')

  return {
    index,
    name,
    abbreviation: params.abbreviation ?? name.substring(0, 2).toUpperCase(), // Simple default
    desc: params.desc ?? faker.lorem.sentence(),
    url: params.url ?? `/api/alignments/${index}`,
    updated_at: params.updated_at ?? faker.date.recent().toISOString(),
    ...params // Ensure overrides from params are applied
  }
})
