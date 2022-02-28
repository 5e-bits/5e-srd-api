import * as mongoose from 'mongoose';
import { APIReference } from './common';

const Choice = {
  choose: { type: Number, index: true },
  from: [APIReference],
  type: { type: String, index: true },
};

const Prerequisite = {
  level: { type: Number, index: true },
  type: { type: String, index: true },
};

const FeatureSpecific = {
  subfeature_options: Choice,
  expertise_options: Choice,
};

const Feature = new mongoose.Schema({
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
