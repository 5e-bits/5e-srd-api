import { equipmentBaseFieldResolvers } from './common.js';

const MagicItem = {
  ...equipmentBaseFieldResolvers,
  rarity: async magicItem => magicItem.rarity.name.toUpperCase().replace(/\s+/g, '_'),
};

export default MagicItem;
