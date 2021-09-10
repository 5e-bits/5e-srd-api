const ClassModel = require('../../models/class');
const FeatureModel = require('../../models/feature');

const Feature = {
  class: async feature => await ClassModel.findOne({ index: feature.class.index }).lean(),
  parent: async feature =>
    feature.parent ? await FeatureModel.findOne({ index: feature.parent.index }).lean() : null,
};

module.exports = Feature;
