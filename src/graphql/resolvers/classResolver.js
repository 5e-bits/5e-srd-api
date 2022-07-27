import AbilityScoreModel from '../../models/abilityScore/index.js';
import EquipmentCategoryModel from '../../models/equipmentCategory/index.js';
import EquipmentModel from '../../models/equipment/index.js';
import LevelModel from '../../models/level/index.js';
import ProficiencyModel from '../../models/proficiency/index.js';
import SubclassModel from '../../models/subclass/index.js';
import { resolveSpells } from './common.js';

const resolveEquipmentOption = async option => {
  if (option.option_type === 'counted_reference') {
    return {
      ...option,
      of: await EquipmentModel.findOne({ index: option.of.index }).lean(),
    };
  }

  if (option.option_type === 'choice') {
    return {
      ...option,
      choice: {
        ...option.choice,
        from: {
          ...option.choice.from,
          equipment_category: await EquipmentCategoryModel.findOne({
            index: option.choice.from.equipment_category.index,
          }).lean(),
        },
      },
    };
  }

  return {
    ...option,
    items: option.items.map(async item => await resolveEquipmentOption(item)),
  };
};

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
  spells: async (klass, args) =>
    resolveSpells(args, [{ classes: { $elemMatch: { index: klass.index } } }]),
  starting_equipment: async klass => {
    const starting_equipment = klass.starting_equipment;
    const equipment = await EquipmentModel.find({
      index: { $in: starting_equipment.map(se => se.equipment.index) },
    }).lean();

    return starting_equipment.map(se => ({
      ...se,
      equipment: equipment.find(e => e.index === se.equipment.index),
    }));
  },
  class_levels: async klass => await LevelModel.find({ 'class.index': klass.index }).lean(),
  subclasses: async klass =>
    await SubclassModel.find({ index: { $in: klass.subclasses.map(s => s.index) } }).lean(),
  multi_classing: async klass => {
    const multiclassingToReturn = {};
    const { multi_classing } = klass;

    multiclassingToReturn.proficiencies = await ProficiencyModel.find({
      index: { $in: multi_classing.proficiencies.map(prof => prof.index) },
    }).lean();

    if (multi_classing.prerequisites) {
      multiclassingToReturn.prerequisites = multi_classing.prerequisites.map(
        async prerequisite => ({
          ...prerequisite,
          ability_score: await AbilityScoreModel.findOne({
            index: prerequisite.ability_score.index,
          }).lean(),
        })
      );
    }

    if (multi_classing.prerequisite_options) {
      multiclassingToReturn.prerequisite_options = {
        ...multi_classing.prerequisite_options,
        from: {
          ...multi_classing.prerequisite_options.from,
          options: multi_classing.prerequisite_options.from.options.map(async option => ({
            ...option,
            ability_score: await AbilityScoreModel.findOne({
              index: option.ability_score.index,
            }).lean(),
          })),
        },
      };
    }

    if (multi_classing.proficiency_choices) {
      multiclassingToReturn.proficiency_choices = multi_classing.proficiency_choices.map(
        async choice => ({
          ...choice,
          from: {
            ...choice.from,
            options: choice.from.options.map(async option => ({
              ...option,
              item: await ProficiencyModel.findOne({ index: option.item.index }).lean(),
            })),
          },
        })
      );
    }

    return multiclassingToReturn;
  },
  proficiency_choices: async klass =>
    klass.proficiency_choices.map(async choice => ({
      ...choice,
      from: {
        ...choice.from,
        options: choice.from.options.map(async option =>
          option.option_type === 'reference'
            ? {
                ...option,
                item: await ProficiencyModel.findOne({ index: option.item.index }).lean(),
              }
            : {
                ...option,
                choice: {
                  ...option.choice,
                  from: {
                    ...option.choice.from,
                    options: option.choice.from.options.map(async o => ({
                      ...o,
                      item: await ProficiencyModel.findOne({ index: o.item.index }).lean(),
                    })),
                  },
                },
              }
        ),
      },
    })),
  starting_equipment_options: async klass =>
    klass.starting_equipment_options.map(async se_option => {
      const optionToReturn = { ...se_option };
      const from = se_option.from;

      if (from.option_set_type === 'equipment_category') {
        optionToReturn.from = {
          ...from,
          equipment_category: await EquipmentCategoryModel.findOne({
            index: from.equipment_category.index,
          }).lean(),
        };
      } else {
        optionToReturn.from = {
          ...from,
          options: from.options.map(async option => await resolveEquipmentOption(option)),
        };
      }

      return optionToReturn;
    }),
};

export default Class;
