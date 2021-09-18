const ClassModel = require('../../models/class');
const FeatureModel = require('../../models/feature');
const SubclassModel = require('../../models/subclass');

const Feature = {
  class: async feature => await ClassModel.findOne({ index: feature.class.index }).lean(),
  subclass: async feature =>
    feature.subclass ? await SubclassModel.findOne({ index: feature.subclass.index }).lean() : null,
  parent: async feature =>
    feature.parent ? await FeatureModel.findOne({ index: feature.parent.index }).lean() : null,
};

module.exports = Feature;
