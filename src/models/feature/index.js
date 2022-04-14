const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { APIReference } = require('../common');

const Choice = new Schema({
  _id: false,
  choose: { type: Number, index: true },
  from: [APIReference],
  type: { type: String, index: true },
});

const Prerequisite = new Schema({
  _id: false,
  level: { type: Number, index: true },
  type: { type: String, index: true },
});

const FeatureSpecific = new Schema({
  _id: false,
  subfeature_options: Choice,
  expertise_options: Choice,
});

const Feature = new Schema({
  _id: { type: String, select: false },
  choice: Choice,
  class: APIReference,
  desc: { type: [String], index: true },
  parent: APIReference,
  index: { type: String, index: true },
  level: { type: Number, index: true },
  name: { type: String, index: true },
  prerequisites: [Prerequisite],
  reference: { type: String, index: true },
  subclass: APIReference,
  feature_specific: FeatureSpecific,
  url: { type: String, index: true },
});

module.exports = mongoose.model('Feature', Feature, 'features');
