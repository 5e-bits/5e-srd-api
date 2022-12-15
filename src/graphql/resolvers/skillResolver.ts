import AbilityScoreModel from '../../models/abilityScore/index.js';
import { Skill } from '../../models/skill/types';

const SkillResolver = {
  ability_score: async (skill: Skill) =>
    await AbilityScoreModel.findOne({ index: skill.ability_score.index }).lean(),
};

export default SkillResolver;
