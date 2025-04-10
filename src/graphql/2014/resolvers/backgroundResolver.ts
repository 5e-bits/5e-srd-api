import AlignmentModel from '@/models/2014/alignment';
import EquipmentCategoryModel from '@/models/2014/equipmentCategory';
import EquipmentModel from '@/models/2014/equipment';
import LanguageModel from '@/models/2014/language';
import ProficiencyModel from '@/models/2014/proficiency';
import { coalesceFilters, resolveChoice, resolveContainsStringFilter, QueryParams } from './common';

import { Background, EquipmentRef } from '@/models/2014/background';
import {
  APIReference,
  EquipmentCategoryOptionSet,
  OptionsArrayOptionSet,
} from '@/models/2014/common';
import { Choice, Option } from '@/models/2014/common';

const BackgroundResolver = {
  starting_equipment: async (background: Background, args: QueryParams) => {
    const starting_equipment = background.starting_equipment;
    const filters: any[] = [
      {
        index: { $in: starting_equipment.map((se: EquipmentRef) => se.equipment.index) },
      },
    ];

    if (args.name) {
      filters.push(resolveContainsStringFilter(args.name));
    }

    const equipment = await EquipmentModel.find(coalesceFilters(filters)).lean();

    return starting_equipment.map((se: EquipmentRef) => ({
      ...se,
      equipment: equipment.find((e: APIReference) => e.index === se.equipment.index),
    }));
  },
  starting_proficiencies: async (background: Background, args: QueryParams) => {
    const filters: any[] = [
      {
        index: { $in: background.starting_proficiencies.map((sp: APIReference) => sp.index) },
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
        options: (await LanguageModel.find().lean()).map((language: APIReference) => ({
          option_type: 'reference',
          item: language,
        })),
      },
      true
    ),
  starting_equipment_options: async (background: Background) =>
    background.starting_equipment_options.map(async (option: Choice) => {
      if ('equipment_category' in option.from) {
        return resolveChoice(option, {
          equipment_category: await EquipmentCategoryModel.findOne({
            index: (option.from as EquipmentCategoryOptionSet).equipment_category.index,
          }).lean(),
        });
      }
    }),
  ideals: async (background: Background) => {
    if ('options' in background.ideals.from) {
      const options = (background.ideals.from as OptionsArrayOptionSet).options.map(
        async (option: Option) => {
          if ('alignments' in option) {
            return {
              ...option,
              alignments: await AlignmentModel.find({
                index: {
                  $in: (option.alignments as APIReference[]).map((a: APIReference) => a.index),
                },
              }).lean(),
            };
          }
        }
      );
      return resolveChoice(background.ideals, {
        options,
      });
    }
  },
};

export default BackgroundResolver;
