const Class = require('../../models/class');
const Feature = require('../../models/feature');
const Subclass = require('../../models/subclass');
const { getMongoSortDirection } = require('./common');

const Level = {
  class: async level => await Class.findOne({ index: level.class.index }).lean(),
  subclass: async level =>
    level.subclass ? await Subclass.findOne({ index: level.subclass.index }).lean() : null,
  features: async (level, args) => {
    const sort = {};
    if (args.order_direction) {
      sort.name = getMongoSortDirection(args.order_direction);
    }

    return await Feature.find({ index: { $in: level.features.map(f => f.index) } })
      .sort(sort)
      .lean();
  },
};

module.exports = Level;
