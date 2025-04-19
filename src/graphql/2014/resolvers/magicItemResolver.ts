import { equipmentBaseFieldResolvers } from './common'
import { MagicItem } from '@/models/2014/magicItem'

const MagicItemResolver = {
  ...equipmentBaseFieldResolvers,
  rarity: async (magicItem: MagicItem) => magicItem.rarity.name.toUpperCase().replace(/\s+/g, '_')
}

export default MagicItemResolver
