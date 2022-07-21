const ProficiencyModel = require('../../models/proficiency');
const RaceModel = require('../../models/race');
const Subrace = require('../../models/subrace');

import { levelObjectToArray, resolveDc, resolveUsage } from './common';

import DamageType from '../../models/damageType';
import Spell from '../../models/spell';
import TraitModel from '../../models/trait';

const Trait = {
  proficiencies: async trait =>
    await ProficiencyModel.find({ index: { $in: trait.proficiencies.map(p => p.index) } }).lean(),
  parent: async trait =>
    trait.parent ? await TraitModel.findOne({ index: trait.parent.index }).lean() : null,
  subraces: async trait =>
    await Subrace.find({ index: { $in: trait.subraces.map(s => s.index) } }).lean(),
  races: async trait =>
    await RaceModel.find({ index: { $in: trait.races.map(r => r.index) } }).lean(),
  proficiency_choices: async trait => {
    if (trait.proficiency_choices) {
      const { proficiency_choices } = trait;
      return {
        ...proficiency_choices,
        from: {
          ...proficiency_choices.from,
          options: proficiency_choices.from.options.map(async option => ({
            ...option,
            item: await ProficiencyModel.findOne({ index: option.item.index }).lean(),
          })),
        },
      };
    } else {
      return null;
    }
  },
  trait_specific: async trait => {
    const { trait_specific } = trait;
    if (!trait_specific) {
      return null;
    }

    const traitSpecificToReturn = {};

    if (trait_specific.breath_weapon) {
      traitSpecificToReturn.breath_weapon = {
        ...trait_specific.breath_weapon,
        dc: resolveDc(trait_specific.breath_weapon.dc),
        damage: trait_specific.breath_weapon.damage.map(async damage => ({
          damage_at_character_level: levelObjectToArray(damage.damage_at_character_level, 'damage'),
          damage_type: await DamageType.findOne({ index: damage.damage_type.index }).lean(),
        })),
        usage: resolveUsage(trait_specific.breath_weapon.usage),
      };
    }

    if (trait_specific.damage_type) {
      traitSpecificToReturn.damage_type = await DamageType.findOne({
        index: trait_specific.damage_type.index,
      }).lean();
    }

    if (trait_specific.spell_options) {
      traitSpecificToReturn.spell_options = {
        ...trait_specific.spell_options,
        from: {
          ...trait_specific.spell_options.from,
          options: trait_specific.spell_options.from.options.map(async option => ({
            ...option,
            item: await Spell.findOne({ index: option.item.index }),
          })),
        },
      };
    }

    if (trait_specific.subtrait_options) {
      traitSpecificToReturn.subtrait_options = {
        ...trait_specific.subtrait_options,
        from: {
          ...trait_specific.subtrait_options.from,
          options: trait_specific.subtrait_options.from.options.map(async option => ({
            ...option,
            item: await TraitModel.findOne({ index: option.item.index }).lean(),
          })),
        },
      };
    }

    return traitSpecificToReturn;
  },
};

module.exports = Trait;