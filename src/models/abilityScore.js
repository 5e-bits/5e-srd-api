const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AbilityScoreSkillSchema = new Schema({
  index: String,
  name: String,
  url: String
});

const AbilityScoreSchema = new Schema({
  _id: {
    type: String,
    select: false
  },
  desc: [String],
  full_name: String,
  index: String,
  name: String,
  skills: [AbilityScoreSkillSchema],
  url: String
});

module.exports = mongoose.model('AbilityScore', AbilityScoreSchema, 'ability-scores');
