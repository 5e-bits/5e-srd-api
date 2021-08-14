const AbilityScore = require('../../models/abilityScore');
const Skill = require('../../models/skill');
const Alignment = require('../../models/alignment');

const Query = {
  async abilityScore() {
    return await AbilityScore.findOne();
  },
  async abilityScores() {
    return await AbilityScore.find();
  },
  async alignment() {
    return await Alignment.findOne();
  },
  async alignments() {
    return await Alignment.find();
  },
  async skill() {
    return await Skill.findOne();
  },
  async skills() {
    return await Skill.find();
  },
};

module.exports = Query;
