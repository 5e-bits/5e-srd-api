const AbilityScore = require('../../models/abilityScore');

const SkillResolver = {
  ability_score: async parent => await AbilityScore.findOne({ index: parent.ability_score.index }),
};

module.exports = SkillResolver;
