import AbilityScoreModel from '@/models/2014/abilityScore';
import { Skill } from '@/models/2014/skill';

const SkillResolver = {
  ability_score: async (skill: Skill) =>
    await AbilityScoreModel.findOne({ index: skill.ability_score.index }).lean(),
};

export default SkillResolver;
