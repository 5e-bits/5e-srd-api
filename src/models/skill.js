const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SkillAbilityScore = new Schema({
  index: String,
  name: String,
  url: String,
});

const Skill = new Schema({
  _id: {
    type: String,
    select: false,
  },
  ability_score: SkillAbilityScore,
  desc: [String],
  index: String,
  name: String,
  url: String,
});

module.exports = mongoose.model('Skill', Skill, 'skills');
