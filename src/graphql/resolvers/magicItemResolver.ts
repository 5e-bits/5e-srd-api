import { equipmentBaseFieldResolvers } from './common.js';
import { MagicItem } from '../../models/2014/magicItem/types.js';

const MagicItem = {
  ...equipmentBaseFieldResolvers,
  rarity: async (magicItem: MagicItem) => magicItem.rarity.name.toUpperCase().replace(/\s+/g, '_'),
};

export default MagicItem;
