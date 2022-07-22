import { equipmentBaseFieldResolvers } from './common';

const MagicItem = {
  ...equipmentBaseFieldResolvers,
  rarity: async magicItem => magicItem.rarity.name.toUpperCase().replace(' ', '_'),
};

export default MagicItem;
