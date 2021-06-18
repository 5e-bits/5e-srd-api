const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { APIReference } = require('./common');

const Choice = {
  choose: { type: Number, index: true },
  from: [APIReference],
  type: { type: String, index: true },
};

const Prerequisite = {
  level: { type: Number, index: true },
  type: { type: String, index: true },
};

const Feature = new Schema({
  _id: { type: String, select: false },
  choice: Choice,
  class: APIReference,
  desc: { type: [String], index: true },
  group: { type: String, index: true },
  index: { type: String, index: true },
  level: { type: Number, index: true },
  name: { type: String, index: true },
  prerequisites: [Prerequisite],
  reference: { type: String, index: true },
  subclass: APIReference,
  url: { type: String, index: true },
});

module.exports = mongoose.model('Feature', Feature, 'features');
