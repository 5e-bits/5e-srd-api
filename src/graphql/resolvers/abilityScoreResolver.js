import SkillModel from '../../models/skill';
import { getMongoSortDirection } from './common';

const AbilityScoreResolver = {
  skills: async (abilityScore, args) => {
    const search = { index: { $in: abilityScore.skills.map(s => s.index) } };

    const sort = {};
    if (args.order_direction) {
      sort.name = getMongoSortDirection(args.order_direction);
    }

    return await SkillModel.find(search)
      .sort(sort)
      .lean();
  },
};

export default AbilityScoreResolver;
