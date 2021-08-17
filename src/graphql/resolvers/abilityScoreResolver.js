const Skill = require('../../models/skill');

const AbilityScoreResolver = {
  skills: async abilityScore => {
    const search = { index: { $in: abilityScore.skills.map(s => s.index) } };
    return await Skill.find(search).lean();
  },
};

module.exports = AbilityScoreResolver;
