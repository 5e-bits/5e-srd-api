import AlignmentModel from '../../models/alignment/index.js';
import EquipmentCategoryModel from '../../models/equipmentCategory/index.js';
import EquipmentModel from '../../models/equipment/index.js';
import LanguageModel from '../../models/language/index.js';
import ProficiencyModel from '../../models/proficiency/index.js';
import { coalesceFilters, resolveChoice, resolveNameFilter } from './common.js';

const Background = {
  starting_equipment: async (background, args) => {
    const starting_equipment = background.starting_equipment;
    const filters = [
      {
        index: { $in: starting_equipment.map(se => se.equipment.index) },
      },
    ];

    if (args.name) {
      const filter = resolveNameFilter(args.name);
      filters.push(filter);
    }

    const equipment = await EquipmentModel.find(coalesceFilters(filters)).lean();

    return starting_equipment.map(se => ({
      ...se,
      equipment: equipment.find(e => e.index === se.equipment.index),
    }));
  },
  starting_proficiencies: async (background, args) => {
    const filters = [
      {
        index: { $in: background.starting_proficiencies.map(sp => sp.index) },
      },
    ];

    if (args.name) {
      const filter = resolveNameFilter(args.name);
      filters.push(filter);
    }

    return await ProficiencyModel.find(coalesceFilters(filters)).lean();
  },
  language_options: async background =>
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
  starting_equipment_options: async background =>
    background.starting_equipment_options.map(async option =>
      resolveChoice(option, {
        equipment_category: await EquipmentCategoryModel.findOne({
          index: option.from.equipment_category.index,
        }).lean(),
      })
    ),
  ideals: async background =>
    resolveChoice(background.ideals, {
      options: background.ideals.from.options.map(async option => ({
        ...option,
        alignments: await AlignmentModel.find({
          index: { $in: option.alignments.map(a => a.index) },
        }).lean(),
      })),
    }),
};

export default Background;
