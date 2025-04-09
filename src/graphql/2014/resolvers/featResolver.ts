import AbilityScoreModel from '@/models/2014/abilityScore';

import { Feat, Prerequisite } from '@/models/2014/feat';

const FeatResolver = {
  prerequisites: async (feat: Feat) => {
    const prerequisites = feat.prerequisites;
    const abilityScores = await AbilityScoreModel.find({
      index: { $in: prerequisites.map((p: Prerequisite) => p.ability_score.index) },
    }).lean();

    return prerequisites.map(async (p: Prerequisite) => ({
      ability_score: abilityScores.find((as) => as.index === p.ability_score.index),
      minimum_score: p.minimum_score,
    }));
  },
};

export default FeatResolver;
