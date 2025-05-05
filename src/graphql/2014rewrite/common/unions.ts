import { createUnionType } from 'type-graphql'
import { Equipment } from '@/models/2014/equipment'
import { MagicItem } from '@/models/2014/magicItem'

export const EquipmentOrMagicItem = createUnionType({
  name: 'EquipmentOrMagicItem',
  types: () => [Equipment, MagicItem] as const,
  resolveType: (value) => {
    if ('rarity' in value) {
      return MagicItem
    }
    return Equipment
  }
})
