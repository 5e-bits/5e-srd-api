const AbilityScore = require('../../models/abilityScore');

const SkillResolver = {
  ability_score: async skill =>
    await AbilityScore.findOne({ index: skill.ability_score.index }).lean(),
};

module.exports = SkillResolver;
