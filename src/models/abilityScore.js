const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { APIReference } = require('./common');

const AbilityScore = new Schema({
  _id: {
    type: String,
    select: false,
    index: false,
  },
  desc: {
    type: [String],
    index: true,
  },
  full_name: {
    type: String,
    index: true,
  },
  index: {
    type: String,
    index: true,
  },
  name: {
    type: String,
    index: true,
  },
  skills: [APIReference],
  url: {
    type: String,
    index: true,
  },
});

module.exports = mongoose.model('AbilityScore', AbilityScore, 'ability-scores');
