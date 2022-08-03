import AbilityScoreModel from '../../models/abilityScore/index.js';

const SkillResolver = {
  ability_score: async skill =>
    await AbilityScoreModel.findOne({ index: skill.ability_score.index }).lean(),
};

export default SkillResolver;
