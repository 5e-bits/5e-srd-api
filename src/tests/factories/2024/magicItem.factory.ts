import { faker } from '@faker-js/faker'
import { Factory } from 'fishery'

import { MagicItem2024, Rarity2024 } from '@/models/2024/magicItem'

import { apiReferenceFactory, createIndex, createUrl } from './common.factory'

const RARITY_NAMES = ['Common', 'Uncommon', 'Rare', 'Very Rare', 'Legendary'] as const

export const rarity2024Factory = Factory.define<Rarity2024>(() => ({
  name: faker.helpers.arrayElement(RARITY_NAMES)
}))

export const magicItemFactory = Factory.define<MagicItem2024>(({ sequence, params }) => {
  const name = params.name ?? `Magic Item ${sequence}`
  const index = params.index ?? createIndex(name)

  return {
    index,
    name,
    desc: params.desc ?? faker.lorem.paragraph(),
    image: params.image ?? `/images/magic-items/${index}.png`,
    equipment_category: apiReferenceFactory.build(
      params.equipment_category ?? { url: createUrl('equipment-categories', 'wondrous-items') }
    ),
    attunement: params.attunement ?? false,
    variant: params.variant ?? false,
    variants: params.variants ?? [],
    rarity: rarity2024Factory.build(params.rarity),
    url: params.url ?? createUrl('magic-items', index),
    updated_at: params.updated_at ?? faker.date.recent().toISOString()
  }
})
