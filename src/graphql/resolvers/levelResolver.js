const Class = require('../../models/class');
const Feature = require('../../models/feature');

const Level = {
  class: async level => await Class.findOne({ index: level.class.index }).lean(),
  features: async level =>
    await Feature.find({ index: { $in: level.features.map(f => f.index) } }).lean(),
};

module.exports = Level;
