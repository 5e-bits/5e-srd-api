const AbilityScoreModel = require('../../models/abilityScore');
const EquipmentModel = require('../../models/equipment');
const ProficiencyModel = require('../../models/proficiency');
const SpellModel = require('../../models/spell');

const Class = {
  proficiencies: async klass =>
    await ProficiencyModel.find({ index: { $in: klass.proficiencies.map(p => p.index) } }).lean(),
  saving_throws: async klass =>
    await AbilityScoreModel.find({
      index: { $in: klass.saving_throws.map(st => st.index) },
    }).lean(),
  spellcasting: async klass =>
    klass.spellcasting
      ? {
          ...klass.spellcasting,
          spellcasting_ability: await AbilityScoreModel.findOne({
            index: klass.spellcasting.spellcasting_ability.index,
          }).lean(),
        }
      : null,
  spells: async klass =>
    SpellModel.find({ classes: { $elemMatch: { index: klass.index } } }).lean(),
  starting_equipment: async klass => {
    const starting_equipment = klass.starting_equipment;
    const equipment = await EquipmentModel.find({
      index: { $in: starting_equipment.map(se => se.equipment.index) },
    }).lean();

    return starting_equipment.map(se => ({
      ...se,
      item: equipment.find(e => e.index === se.equipment.index),
    }));
  },
};

module.exports = Class;
