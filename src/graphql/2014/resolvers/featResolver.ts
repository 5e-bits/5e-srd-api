import AbilityScoreModel from '@/models/2014/abilityScore/index.js';

import { Feat } from '@/models/2014/feat/types.js';

const FeatResolver = {
  prerequisites: async (feat: Feat) => {
    const prerequisites = feat.prerequisites;
    const abilityScores = await AbilityScoreModel.find({
      index: { $in: prerequisites.map((p) => p.ability_score.index) },
    }).lean();

    return prerequisites.map(async (p) => ({
      ...p,
      ability_score: abilityScores.find((as) => as.index === p.ability_score.index),
    }));
  },
};

export default FeatResolver;
