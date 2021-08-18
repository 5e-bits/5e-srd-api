const Equipment = require('../../models/equipment');
const { gearFieldResolvers } = require('./common');

const Pack = {
  ...gearFieldResolvers,
  contents: async pack =>
    pack.contents.map(async c => ({
      quantity: c.quantity,
      item: await Equipment.findOne({ index: c.item.index }).lean(),
    })),
};

module.exports = Pack;
