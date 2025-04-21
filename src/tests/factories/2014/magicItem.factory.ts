import { Factory } from 'fishery'
import { faker } from '@faker-js/faker'
import type { MagicItem, Rarity } from '@/models/2014/magicItem'
import { apiReferenceFactory } from './common.factory'

// Helper function (can be moved to common if used elsewhere)
const createIndex = (name: string): string =>
  name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
const createUrl = (resource: string, index: string): string => `/api/${resource}/${index}` // Helper for URL

// --- Rarity Factory ---
const rarityFactory = Factory.define<Rarity>(() => ({
  name: faker.helpers.arrayElement(['Common', 'Uncommon', 'Rare', 'Very Rare', 'Legendary'])
}))

// --- MagicItem Factory ---
export const magicItemFactory = Factory.define<Omit<MagicItem, '_id' | 'collectionName'>>(
  ({ sequence, params }) => {
    const name =
      params.name ??
      `${faker.commerce.productAdjective()} ${faker.commerce.productMaterial()} Item ${sequence}`
    const index = params.index ?? createIndex(name)

    // Build dependencies first to ensure complete objects
    const builtEquipmentCategory = apiReferenceFactory.build(params.equipment_category)
    const builtRarity = rarityFactory.build(params.rarity)

    return {
      index,
      name,
      desc: params.desc ?? [faker.lorem.paragraph(), faker.lorem.paragraph()],
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
