const Equipment = require('../../models/equipment');
const Proficiency = require('../../models/proficiency');

const Background = {
  starting_equipment: async background => {
    const starting_equipment = background.starting_equipment;
    const equipment = await Equipment.find({
      index: { $in: starting_equipment.map(se => se.equipment.index) },
    }).lean();

    return starting_equipment.map(se => ({
      ...se,
      item: equipment.find(e => e.index === se.equipment.index),
    }));
  },
  starting_proficiencies: async background =>
    await Proficiency.find({
      index: { $in: background.starting_proficiencies.map(sp => sp.index) },
    }).lean(),
};

module.exports = Background;
