const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { NamedAPIResource } = require('./common');

const AbilityScore = new Schema({
  _id: {
    type: String,
    select: false,
  },
  desc: [String],
  full_name: String,
  index: String,
  name: String,
  skills: [NamedAPIResource],
  url: String,
});

module.exports = mongoose.model('AbilityScore', AbilityScore, 'ability-scores');
