const Skill = require('../../models/skill');

const AbilityScoreResolver = {
  skills: async parent => {
    const search = { index: { $in: parent.skills.map(s => s.index) } };
    return await Skill.find(search);
  },
};

module.exports = AbilityScoreResolver;
