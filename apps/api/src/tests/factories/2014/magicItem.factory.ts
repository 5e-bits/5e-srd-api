import { faker } from '@faker-js/faker'
import { Factory } from 'fishery'

import { apiReferenceFactory, createIndex, createUrl } from './common.factory'

import type { MagicItem, Rarity } from '@/models/2014/magicItem'

// --- Rarity Factory ---
const rarityFactory = Factory.define<Rarity>(() => ({
  name: faker.helpers.arrayElement(['Common', 'Uncommon', 'Rare', 'Very Rare', 'Legendary'])
}))

// --- MagicItem Factory ---
export const magicItemFactory = Factory.define<Omit<MagicItem, '_id' | 'collectionName'>>(
  ({ sequence, params }) => {
    const name = params.name ?? `Magic Item ${sequence}`
    const index = params.index ?? createIndex(name)

    // Build dependencies first to ensure complete objects
    const builtEquipmentCategory = apiReferenceFactory.build(params.equipment_category)
    const builtRarity = rarityFactory.build(params.rarity)

    return {
      index,
      name,
      desc: params.desc ?? [faker.lorem.paragraph()],
      equipment_category: {
        index: builtEquipmentCategory.index,
        name: builtEquipmentCategory.name,
        url: builtEquipmentCategory.url
      },
      rarity: {
        name: builtRarity.name
      },
      variants: params.variants ?? [],
      variant: params.variant ?? false,
      url: params.url ?? createUrl('magic-items', index),
      image: params.image ?? `/images/magic-items/${index}.png`,
      updated_at: params.updated_at ?? faker.date.past().toISOString()
    }
  }
)
