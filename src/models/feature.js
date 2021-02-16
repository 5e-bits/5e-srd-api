const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { APIReference } = require('./common');

const Choice = new Schema({
  _id: false,
  choose: Number,
  from: [APIReference],
  type: String,
});

const Prerequisite = new Schema({
  _id: false,
  level: Number,
  type: String,
});

const Feature = new Schema({
  _id: {
    type: String,
    select: false,
  },
  choice: Choice,
  class: APIReference,
  desc: [String],
  group: String,
  index: String,
  level: Number,
  name: String,
  prerequisites: [Prerequisite],
  reference: String,
  subclass: APIReference,
  url: String,
});

module.exports = mongoose.model('Feature', Feature, 'features');
