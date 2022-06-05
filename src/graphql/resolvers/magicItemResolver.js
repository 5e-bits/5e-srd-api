const { equipmentBaseFieldResolvers } = require('./common');

const MagicItem = {
  ...equipmentBaseFieldResolvers,
  rarity: async magicItem => magicItem.rarity.name.toUpperCase().replace(' ', '_'),
};

module.exports = MagicItem;
