const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { APIReference, Choice } = require('../common');

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
