const Skill = require('../../models/skill');
const { getMongoSortDirection } = require('./common');

const AbilityScoreResolver = {
  skills: async (abilityScore, args) => {
    const search = { index: { $in: abilityScore.skills.map(s => s.index) } };

    const sort = {};
    if (args.order_direction) {
      sort.name = getMongoSortDirection(args.order_direction);
    }

    return await Skill.find(search)
      .sort(sort)
      .lean();
  },
};

module.exports = AbilityScoreResolver;
