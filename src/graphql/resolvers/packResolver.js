const Equipment = require('../../models/equipment');
const { gearFieldResolvers } = require('./common');

const Pack = {
  ...gearFieldResolvers,
  contents: async pack => {
    const contents = pack.contents;
    const equipment = await Equipment.find({
      index: { $in: contents.map(c => c.item.index) },
    }).lean();

    return contents.map(c => ({
      ...c,
      item: equipment.find(e => e.index === c.item.index),
    }));
  },
};

module.exports = Pack;
