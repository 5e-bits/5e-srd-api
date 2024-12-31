import AbilityScoreModel from '../../../models/2014/abilityScore/index.js';
import LanguageModel from '../../../models/2014/language/index.js';
import ProficiencyModel from '../../../models/2014/proficiency/index.js';
import RaceModel from '../../../models/2014/race/index.js';
import TraitModel from '../../../models/2014/trait/index.js';
import {
  coalesceFilters,
  resolveChoice,
  resolveContainsStringFilter,
  QueryParams,
} from './common.js';

import { Subrace } from '../../../models/2014/subrace/types.js';

const Subrace = {
  ability_bonuses: async (subrace: Subrace) => {
    const abilityBonuses = subrace.ability_bonuses;
    const abilityScores = await AbilityScoreModel.find({
      index: { $in: abilityBonuses.map((ab) => ab.ability_score.index) },
    }).lean();

    return abilityBonuses.map((ab) => ({
      ...ab,
      ability_score: abilityScores.find((as) => as.index === ab.ability_score.index),
    }));
  },
  race: async (subrace: Subrace) => await RaceModel.findOne({ index: subrace.race.index }).lean(),
  racial_traits: async (subrace: Subrace, args: QueryParams) => {
    const filters: any[] = [
      {
        index: { $in: subrace.racial_traits.map((t) => t.index) },
      },
    ];

    if (args.name) {
      filters.push(resolveContainsStringFilter(args.name));
    }

    return await TraitModel.find(coalesceFilters(filters)).lean();
  },
  starting_proficiencies: async (subrace: Subrace, args: QueryParams) => {
    const filters: any[] = [
      {
        index: { $in: subrace.starting_proficiencies?.map((p) => p.index) },
      },
    ];

    if (args.name) {
      filters.push(resolveContainsStringFilter(args.name));
    }

    return await ProficiencyModel.find(coalesceFilters(filters)).lean();
  },
  language_options: async (subrace: Subrace) => {
    if (!subrace.language_options) {
      return null;
    }

    if ('options' in subrace.language_options.from) {
      const options = subrace.language_options.from.options.map(async (option) => {
        if ('item' in option) {
          return await LanguageModel.findOne({ index: option.item.index }).lean();
        }
      });
      return resolveChoice(subrace.language_options, {
        options,
      });
    }
  },
};

export default Subrace;
