import AlignmentModel from '../../models/alignment';
import EquipmentCategoryModel from '../../models/equipmentCategory';
import EquipmentModel from '../../models/equipment';
import LanguageModel from '../../models/language';
import ProficiencyModel from '../../models/proficiency';

const Background = {
  starting_equipment: async background => {
    const starting_equipment = background.starting_equipment;
    const equipment = await EquipmentModel.find({
      index: { $in: starting_equipment.map(se => se.equipment.index) },
    }).lean();

    return starting_equipment.map(se => ({
      ...se,
      equipment: equipment.find(e => e.index === se.equipment.index),
    }));
  },
  starting_proficiencies: async background =>
    await ProficiencyModel.find({
      index: { $in: background.starting_proficiencies.map(sp => sp.index) },
    }).lean(),
  language_options: async background => ({
    ...background.language_options,
    from: {
      option_set_type: 'options_array',
      options: (await LanguageModel.find().lean()).map(language => ({
        option_type: 'reference',
        item: language,
      })),
    },
  }),
  starting_equipment_options: async background =>
    background.starting_equipment_options.map(async option => ({
      ...option,
      from: {
        ...option.from,
        equipment_category: await EquipmentCategoryModel.findOne({
          index: option.from.equipment_category.index,
        }).lean(),
      },
    })),
  ideals: async background => ({
    ...background.ideals,
    from: {
      ...background.ideals.from,
      options: background.ideals.from.options.map(async option => ({
        ...option,
        alignments: await AlignmentModel.find({
          index: { $in: option.alignments.map(a => a.index) },
        }).lean(),
      })),
    },
  }),
};

export default Background;
