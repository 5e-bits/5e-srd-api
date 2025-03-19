import AbilityScoreModel from '@/models/2014/abilityScore/index.js';
import LanguageModel from '@/models/2014/language/index.js';
import ProficiencyModel from '@/models/2014/proficiency/index.js';
import SubraceModel from '@/models/2014/subrace/index.js';
import TraitModel from '@/models/2014/trait/index.js';
import {
  coalesceFilters,
  resolveChoice,
  resolveContainsStringFilter,
  QueryParams,
} from './common.js';

import { Race } from '@/models/2014/race/types.js';

const Race = {
  ability_bonuses: async (race: Race) => {
    const abilityBonuses = race.ability_bonuses;
    const abilityScores = await AbilityScoreModel.find({
      index: { $in: abilityBonuses.map((ab) => ab.ability_score.index) },
    }).lean();

    return abilityBonuses.map((ab) => ({
      ...ab,
      ability_score: abilityScores.find((as) => as.index === ab.ability_score.index),
    }));
  },
  languages: async (race: Race, args: QueryParams) => {
    const filters: any[] = [{ index: { $in: race.languages.map((l) => l.index) } }];

    if (args.name) {
      filters.push(resolveContainsStringFilter(args.name));
    }

    return await LanguageModel.find(coalesceFilters(filters)).lean();
  },
  size: (race: Race) => race.size.toUpperCase(),
  starting_proficiencies: async (race: Race, args: QueryParams) => {
    const filters: any[] = [
      {
        index: { $in: race.starting_proficiencies?.map((p) => p.index) },
      },
    ];

    if (args.name) {
      filters.push(resolveContainsStringFilter(args.name));
    }

    return await ProficiencyModel.find(coalesceFilters(filters)).lean();
  },
  subraces: async (race: Race, args: QueryParams) => {
    const filters: any[] = [{ index: { $in: race.subraces?.map((s) => s.index) } }];

    if (args.name) {
      filters.push(resolveContainsStringFilter(args.name));
    }

    return await SubraceModel.find(coalesceFilters(filters)).lean();
  },
  traits: async (race: Race, args: QueryParams) => {
    const filters: any[] = [{ index: { $in: race.traits?.map((t) => t.index) } }];

    if (args.name) {
      filters.push(resolveContainsStringFilter(args.name));
    }

    return await TraitModel.find(coalesceFilters(filters)).lean();
  },
  ability_bonus_options: async (race: Race) => {
    if (!race.ability_bonus_options) {
      return null;
    }

    if ('options' in race.ability_bonus_options.from) {
      const options = race.ability_bonus_options.from.options.map(async (option) => {
        if ('ability_score' in option) {
          return {
            ...option,
            ability_score: await AbilityScoreModel.findOne({ index: option.ability_score.index }),
          };
        }
      });

      return resolveChoice(race.ability_bonus_options, {
        options,
      });
    }
  },
  language_options: async (race: Race) => {
    if (!race.language_options) {
      return null;
    }

    if ('options' in race.language_options.from) {
      const options = race.language_options.from.options.map(async (option) => {
        if ('item' in option) {
          return {
            ...option,
            item: await LanguageModel.findOne({ index: option.item.index }).lean(),
          };
        }
      });
      return resolveChoice(race.language_options, {
        options,
      });
    }
  },
  starting_proficiency_options: async (race: Race) => {
    if (!race.starting_proficiency_options) {
      return null;
    }

    if ('options' in race.starting_proficiency_options.from) {
      const options = race.starting_proficiency_options.from.options.map(async (option) => {
        if ('item' in option) {
          return {
            ...option,
            item: await ProficiencyModel.findOne({ index: option.item.index }).lean(),
          };
        }
      });
      return resolveChoice(race.starting_proficiency_options, {
        options,
      });
    }
  },
};

export default Race;
