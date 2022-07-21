const Equipment = require('../../models/equipment');
const Proficiency = require('../../models/proficiency');

import Alignment from '../../models/alignment';
import EquipmentCategory from '../../models/equipmentCategory';
import Language from '../../models/language';

const Background = {
  starting_equipment: async background => {
    const starting_equipment = background.starting_equipment;
    const equipment = await Equipment.find({
      index: { $in: starting_equipment.map(se => se.equipment.index) },
    }).lean();

    return starting_equipment.map(se => ({
      ...se,
      equipment: equipment.find(e => e.index === se.equipment.index),
    }));
  },
  starting_proficiencies: async background =>
    await Proficiency.find({
      index: { $in: background.starting_proficiencies.map(sp => sp.index) },
    }).lean(),
  language_options: async background => ({
    ...background.language_options,
    from: {
      option_set_type: 'options_array',
      options: (await Language.find().lean()).map(language => ({
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
        equipment_category: await EquipmentCategory.findOne({
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
        alignments: await Alignment.find({
          index: { $in: option.alignments.map(a => a.index) },
        }).lean(),
      })),
    },
  }),
};

module.exports = Background;
