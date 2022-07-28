import { levelObjectToArray, resolveChoice, resolveDc, resolveUsage } from './common.js';

import DamageTypeModel from '../../models/damageType/index.js';
import ProficiencyModel from '../../models/proficiency/index.js';
import RaceModel from '../../models/race/index.js';
import SpellModel from '../../models/spell/index.js';
import SubraceModel from '../../models/subrace/index.js';
import TraitModel from '../../models/trait/index.js';

const Trait = {
  proficiencies: async trait =>
    await ProficiencyModel.find({ index: { $in: trait.proficiencies.map(p => p.index) } }).lean(),
  parent: async trait =>
    trait.parent ? await TraitModel.findOne({ index: trait.parent.index }).lean() : null,
  subraces: async trait =>
    await SubraceModel.find({ index: { $in: trait.subraces.map(s => s.index) } }).lean(),
  races: async trait =>
    await RaceModel.find({ index: { $in: trait.races.map(r => r.index) } }).lean(),
  proficiency_choices: async trait => {
    if (trait.proficiency_choices) {
      const { proficiency_choices } = trait;
      return resolveChoice(proficiency_choices, {
        options: proficiency_choices.from.options.map(async option => ({
          ...option,
          item: await ProficiencyModel.findOne({ index: option.item.index }).lean(),
        })),
      });
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
          damage_type: await DamageTypeModel.findOne({ index: damage.damage_type.index }).lean(),
        })),
        usage: resolveUsage(trait_specific.breath_weapon.usage),
      };
    }

    if (trait_specific.damage_type) {
      traitSpecificToReturn.damage_type = await DamageTypeModel.findOne({
        index: trait_specific.damage_type.index,
      }).lean();
    }

    if (trait_specific.spell_options) {
      traitSpecificToReturn.spell_options = resolveChoice(trait_specific.spell_options, {
        options: trait_specific.spell_options.from.options.map(async option => ({
          ...option,
          item: await SpellModel.findOne({ index: option.item.index }),
        })),
      });
    }

    if (trait_specific.subtrait_options) {
      traitSpecificToReturn.subtrait_options = resolveChoice(trait_specific.subtrait_options, {
        options: trait_specific.subtrait_options.from.options.map(async option => ({
          ...option,
          item: await TraitModel.findOne({ index: option.item.index }).lean(),
        })),
      });
    }

    return traitSpecificToReturn;
  },
};

export default Trait;
