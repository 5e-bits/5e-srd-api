const AbilityScore = require('../../models/abilityScore');
const Skill = require('../../models/skill');

const Query = {
  async abilityScore(parent, { index }) {
    return await AbilityScore.findOne({ index });
  },
  async abilityScores() {
    return await AbilityScore.find();
  },
  async skill(parent, { index }) {
    return await Skill.findOne({ index });
  },
  async skills() {
    return await Skill.find();
  },
};

module.exports = Query;
