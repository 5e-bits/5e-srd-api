import AlignmentModel from '../../models/alignment/index.js';
import EquipmentCategoryModel from '../../models/equipmentCategory/index.js';
import EquipmentModel from '../../models/equipment/index.js';
import LanguageModel from '../../models/language/index.js';
import ProficiencyModel from '../../models/proficiency/index.js';
import {
  coalesceFilters,
  resolveChoice,
  resolveContainsStringFilter,
  QueryParams,
} from './common.js';

import { Background } from '../../models/background/types';

const Background = {
  starting_equipment: async (background: Background, args: QueryParams) => {
    const starting_equipment = background.starting_equipment;
    const filters: any[] = [
      {
        index: { $in: starting_equipment.map(se => se.equipment.index) },
      },
    ];

    if (args.name) {
      filters.push(resolveContainsStringFilter(args.name));
    }

    const equipment = await EquipmentModel.find(coalesceFilters(filters)).lean();

    return starting_equipment.map(se => ({
      ...se,
      equipment: equipment.find(e => e.index === se.equipment.index),
    }));
  },
  starting_proficiencies: async (background: Background, args: QueryParams) => {
    const filters: any[] = [
      {
        index: { $in: background.starting_proficiencies.map(sp => sp.index) },
      },
    ];

    if (args.name) {
      filters.push(resolveContainsStringFilter(args.name));
    }

    return await ProficiencyModel.find(coalesceFilters(filters)).lean();
  },
  language_options: async (background: Background) =>
    resolveChoice(
      background.language_options,
      {
        option_set_type: 'options_array',
        options: (await LanguageModel.find().lean()).map(language => ({
          option_type: 'reference',
          item: language,
        })),
      },
      true
    ),
  starting_equipment_options: async (background: Background) =>
    background.starting_equipment_options.map(async option => {
      if ('equipment_category' in option.from) {
        return resolveChoice(option, {
          equipment_category: await EquipmentCategoryModel.findOne({
            index: option.from.equipment_category.index,
          }).lean(),
        });
      }
    }),
  ideals: async (background: Background) => {
    if ('options' in background.ideals.from) {
      const options = background.ideals.from.options.map(async option => {
        if ('alignments' in option) {
          return {
            ...option,
            alignments: await AlignmentModel.find({
              index: { $in: option.alignments.map(a => a.index) },
            }).lean(),
          };
        }
      });
      return resolveChoice(background.ideals, {
        options,
      });
    }
  },
};

export default Background;
