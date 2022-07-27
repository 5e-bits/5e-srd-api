import { equipmentBaseFieldResolvers } from './common.js';

const MagicItem = {
  ...equipmentBaseFieldResolvers,
  rarity: async magicItem => magicItem.rarity.name.toUpperCase().replace(' ', '_'),
};

export default MagicItem;
