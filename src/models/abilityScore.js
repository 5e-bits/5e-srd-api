const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AbilityScoreSkill = new Schema({
  _id: false,
  index: String,
  name: String,
  url: String,
});

const AbilityScore = new Schema({
  _id: {
    type: String,
    select: false,
  },
  desc: [String],
  full_name: String,
  index: String,
  name: String,
  skills: [AbilityScoreSkill],
  url: String,
});

module.exports = mongoose.model('AbilityScore', AbilityScore, 'ability-scores');
