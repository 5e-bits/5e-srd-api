const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const FeatureChoiceFrom = new Schema({
  index: String,
  name: String,
  url: String
});

const FeatureChoice = new Schema({
  choose: Number,
  from: [FeatureChoiceFrom],
  type: String
});

const FeatureClass = new Schema({
  index: String,
  name: String,
  url: String
});

const FeaturePrerequisite = new Schema({
  level: Number,
  type: String
});

const FeatureSubclass = new Schema({
  index: String,
  name: String,
  url: String
});

const Feature = new Schema({
  _id: {
    type: String,
    select: false
  },
  choice: FeatureChoice,
  class: FeatureClass,
  desc: [String],
  group: String,
  index: String,
  level: Number,
  name: String,
  prerequisites: [FeaturePrerequisite],
  reference: String,
  subclass: FeatureSubclass,
  url: String
});

module.exports = mongoose.model('Feature', Feature, 'features');
