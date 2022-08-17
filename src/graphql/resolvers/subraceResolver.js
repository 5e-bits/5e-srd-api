import AbilityScoreModel from '../../models/abilityScore/index.js';
import LanguageModel from '../../models/language/index.js';
import ProficiencyModel from '../../models/proficiency/index.js';
import RaceModel from '../../models/race/index.js';
import TraitModel from '../../models/trait/index.js';
import { coalesceFilters, resolveChoice, resolveNameFilter } from './common.js';

const Subrace = {
  ability_bonuses: async subrace => {
    const abilityBonuses = subrace.ability_bonuses;
    const abilityScores = await AbilityScoreModel.find({
      index: { $in: abilityBonuses.map(ab => ab.ability_score.index) },
    }).lean();

    return abilityBonuses.map(ab => ({
      ...ab,
      ability_score: abilityScores.find(as => as.index === ab.ability_score.index),
    }));
  },
  race: async subrace => await RaceModel.findOne({ index: subrace.race.index }).lean(),
  racial_traits: async (subrace, args) => {
    const filters = [
      {
        index: { $in: subrace.racial_traits.map(t => t.index) },
      },
    ];

    if (args.name) {
      const filter = resolveNameFilter(args.name);
      filters.push(filter);
    }

    return await TraitModel.find(coalesceFilters(filters)).lean();
  },
  starting_proficiencies: async (subrace, args) => {
    const filters = [
      {
        index: { $in: subrace.starting_proficiencies.map(p => p.index) },
      },
    ];

    if (args.name) {
      const filter = resolveNameFilter(args.name);
      filters.push(filter);
    }

    return await ProficiencyModel.find(coalesceFilters(filters)).lean();
  },
  language_options: async subrace => {
    if (!subrace.language_options) {
      return null;
    }

    return resolveChoice(subrace.language_options, {
      options: subrace.language_options.from.options.map(async option => ({
        ...option,
        item: await LanguageModel.findOne({ index: option.item.index }).lean(),
      })),
    });
  },
};

export default Subrace;
